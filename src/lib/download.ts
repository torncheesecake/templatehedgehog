import { createReadStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
  type S3ServiceException,
} from "@aws-sdk/client-s3";
import {
  MJML_PACK_FILENAME,
  MJML_PACK_PRODUCT_ID,
  getMjmlPackAbsolutePath,
  getMjmlPackPricePence,
} from "@/lib/pack";
import { getStripeServerClient, isStripeConfigured } from "@/lib/stripe-server";

export type DownloadStorageMode = "filesystem" | "provider";
type DownloadRequestMethod = "GET" | "HEAD";

export type DownloadValidationResult =
  | { ok: true; sessionId: string }
  | { ok: false; status: number; message: string };

export type DownloadDeliveryResult =
  | {
      ok: true;
      filename: string;
      contentType: string;
      contentLength: number;
      stream?: ReadableStream<Uint8Array>;
    }
  | { ok: false; status: number; message: string };

type DownloadObjectHead = {
  contentLength: number;
  contentType: string;
};

type DownloadObjectBody = DownloadObjectHead & {
  stream: ReadableStream<Uint8Array>;
};

interface DownloadObjectProvider {
  headObject(key: string): Promise<DownloadObjectHead>;
  getObject(key: string): Promise<DownloadObjectBody>;
}

type ProviderResolutionResult =
  | { ok: true; provider: DownloadObjectProvider; objectKey: string }
  | { ok: false; status: number; message: string };

type S3ProviderConfig = {
  region: string;
  bucket: string;
  endpoint?: string;
  forcePathStyle: boolean;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
};

type S3ClientLike = {
  send: S3Client["send"];
};

type DownloadTestHooks = {
  validateDownloadSession?: (
    sessionIdRaw: string,
  ) => Promise<DownloadValidationResult>;
  createS3Client?: (config: S3ProviderConfig) => S3ClientLike;
};

const STRIPE_SESSION_ID_PATTERN = /^cs_(live|test)_[A-Za-z0-9]+$/;
const localPackPath = getMjmlPackAbsolutePath(process.cwd());
const DOWNLOAD_DEFAULT_CONTENT_TYPE = "application/zip";
let downloadTestHooks: DownloadTestHooks = {};

const defaultCreateS3Client = (config: S3ProviderConfig): S3ClientLike =>
  new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: config.credentials,
  });

export function __setDownloadTestHooks(hooks: DownloadTestHooks): void {
  downloadTestHooks = hooks;
}

export function __resetDownloadTestHooks(): void {
  downloadTestHooks = {};
}

function getDownloadStorageMode(): DownloadStorageMode {
  const raw = (process.env.DOWNLOAD_STORAGE_MODE ?? "filesystem").toLowerCase();
  if (raw === "provider") {
    return "provider";
  }
  return "filesystem";
}

function isLikelyStripeSessionId(sessionId: string): boolean {
  return STRIPE_SESSION_ID_PATTERN.test(sessionId);
}

function getEnvValue(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function getFirstEnvValue(names: string[]): string | null {
  for (const name of names) {
    const value = getEnvValue(name);
    if (value) {
      return value;
    }
  }
  return null;
}

function parseBoolean(raw: string | null, fallback: boolean): boolean {
  if (!raw) return fallback;
  if (raw === "1" || raw.toLowerCase() === "true") return true;
  if (raw === "0" || raw.toLowerCase() === "false") return false;
  return fallback;
}

function getProviderObjectKey(filename: string): string {
  const prefix =
    getFirstEnvValue(["DOWNLOAD_PROVIDER_PREFIX", "DOWNLOAD_S3_PREFIX"]) ?? "";
  const normalisedPrefix = prefix.replace(/^\/+|\/+$/g, "");
  return normalisedPrefix ? `${normalisedPrefix}/${filename}` : filename;
}

function buildS3ProviderConfig(): {
  ok: true;
  config: S3ProviderConfig;
} | {
  ok: false;
  status: number;
  message: string;
} {
  const bucket = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_BUCKET",
    "DOWNLOAD_S3_BUCKET",
  ]);
  const region = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_REGION",
    "DOWNLOAD_S3_REGION",
  ]);
  const accessKeyId = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_ACCESS_KEY_ID",
    "DOWNLOAD_S3_ACCESS_KEY_ID",
    "AWS_ACCESS_KEY_ID",
  ]);
  const secretAccessKey = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_SECRET_ACCESS_KEY",
    "DOWNLOAD_S3_SECRET_ACCESS_KEY",
    "AWS_SECRET_ACCESS_KEY",
  ]);

  if (!bucket || !region) {
    return {
      ok: false,
      status: 503,
      message:
        "Provider download storage is not configured. Set bucket and region env vars.",
    };
  }

  if (!accessKeyId || !secretAccessKey) {
    return {
      ok: false,
      status: 503,
      message:
        "Provider download storage credentials are missing. Set access key and secret key env vars.",
    };
  }

  const endpoint = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_ENDPOINT",
    "DOWNLOAD_S3_ENDPOINT",
  ]) ?? undefined;
  const forcePathStyle = parseBoolean(
    getFirstEnvValue([
      "DOWNLOAD_PROVIDER_FORCE_PATH_STYLE",
      "DOWNLOAD_S3_FORCE_PATH_STYLE",
    ]),
    false,
  );
  const sessionToken = getFirstEnvValue([
    "DOWNLOAD_PROVIDER_SESSION_TOKEN",
    "DOWNLOAD_S3_SESSION_TOKEN",
    "AWS_SESSION_TOKEN",
  ]) ?? undefined;

  return {
    ok: true,
    config: {
      region,
      bucket,
      endpoint,
      forcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    },
  };
}

function toWebReadableStream(body: unknown): ReadableStream<Uint8Array> | null {
  if (body instanceof ReadableStream) {
    return body as ReadableStream<Uint8Array>;
  }

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "transformToWebStream" in body &&
    typeof (body as { transformToWebStream?: unknown }).transformToWebStream ===
      "function"
  ) {
    return (body as { transformToWebStream: () => ReadableStream<Uint8Array> }).transformToWebStream();
  }

  return null;
}

function isObjectNotFoundError(error: unknown): boolean {
  const code = (error as { name?: string; Code?: string })?.name
    ?? (error as { name?: string; Code?: string })?.Code;
  return code === "NotFound" || code === "NoSuchKey" || code === "404";
}

class S3DownloadProvider implements DownloadObjectProvider {
  private readonly client: S3ClientLike;
  private readonly bucket: string;

  constructor(config: S3ProviderConfig) {
    this.bucket = config.bucket;
    this.client = (downloadTestHooks.createS3Client ?? defaultCreateS3Client)(
      config,
    );
  }

  async headObject(key: string): Promise<DownloadObjectHead> {
    const response = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    const contentLength = response.ContentLength ?? 0;
    return {
      contentLength,
      contentType: response.ContentType ?? DOWNLOAD_DEFAULT_CONTENT_TYPE,
    };
  }

  async getObject(key: string): Promise<DownloadObjectBody> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    const stream = toWebReadableStream(response.Body);
    if (!stream) {
      throw new Error("Provider returned an unreadable object stream.");
    }

    return {
      stream,
      contentLength: response.ContentLength ?? 0,
      contentType: response.ContentType ?? DOWNLOAD_DEFAULT_CONTENT_TYPE,
    };
  }
}

function resolveProviderFromEnv(filename: string): ProviderResolutionResult {
  const providerType = (process.env.DOWNLOAD_PROVIDER ?? "s3").toLowerCase();
  if (providerType !== "s3") {
    return {
      ok: false,
      status: 503,
      message: `Unsupported download provider "${providerType}".`,
    };
  }

  const config = buildS3ProviderConfig();
  if (!config.ok) {
    return config;
  }

  return {
    ok: true,
    provider: new S3DownloadProvider(config.config),
    objectKey: getProviderObjectKey(filename),
  };
}

async function resolveFilesystemDelivery(
  method: DownloadRequestMethod,
): Promise<DownloadDeliveryResult> {
  try {
    const stat = await fs.stat(localPackPath);
    if (!stat.isFile()) {
      return {
        ok: false,
        status: 404,
        message: "Download file is unavailable.",
      };
    }

    if (method === "HEAD") {
      return {
        ok: true,
        filename: MJML_PACK_FILENAME,
        contentType: DOWNLOAD_DEFAULT_CONTENT_TYPE,
        contentLength: stat.size,
      };
    }

    const stream = Readable.toWeb(
      createReadStream(localPackPath),
    ) as ReadableStream<Uint8Array>;
    return {
      ok: true,
      filename: MJML_PACK_FILENAME,
      contentType: DOWNLOAD_DEFAULT_CONTENT_TYPE,
      contentLength: stat.size,
      stream,
    };
  } catch {
    return {
      ok: false,
      status: 404,
      message: "Download file is unavailable.",
    };
  }
}

async function resolveProviderDelivery(
  method: DownloadRequestMethod,
): Promise<DownloadDeliveryResult> {
  const providerResolution = resolveProviderFromEnv(MJML_PACK_FILENAME);
  if (!providerResolution.ok) {
    return providerResolution;
  }

  const { provider, objectKey } = providerResolution;

  try {
    if (method === "HEAD") {
      const metadata = await provider.headObject(objectKey);
      return {
        ok: true,
        filename: MJML_PACK_FILENAME,
        contentType: metadata.contentType,
        contentLength: metadata.contentLength,
      };
    }

    const object = await provider.getObject(objectKey);
    return {
      ok: true,
      filename: MJML_PACK_FILENAME,
      contentType: object.contentType,
      contentLength: object.contentLength,
      stream: object.stream,
    };
  } catch (error) {
    if (isObjectNotFoundError(error)) {
      return {
        ok: false,
        status: 404,
        message: "Download file is unavailable.",
      };
    }

    const providerError = error as S3ServiceException;
    const providerMessage =
      providerError?.message?.trim() || "Provider download delivery failed.";

    return {
      ok: false,
      status: 503,
      message: providerMessage,
    };
  }
}

export async function resolveDownloadDelivery(
  method: DownloadRequestMethod,
): Promise<DownloadDeliveryResult> {
  const mode = getDownloadStorageMode();

  if (process.env.NODE_ENV === "production" && mode !== "provider") {
    return {
      ok: false,
      status: 503,
      message:
        "Filesystem download delivery is disabled in production. Use provider mode.",
    };
  }

  if (mode === "provider") {
    return resolveProviderDelivery(method);
  }

  return resolveFilesystemDelivery(method);
}

export async function validateDownloadSession(
  sessionIdRaw: string | null,
): Promise<DownloadValidationResult> {
  const sessionId = (sessionIdRaw ?? "").trim();
  if (!sessionId) {
    return { ok: false, status: 400, message: "session_id is required." };
  }

  // Fast reject malformed IDs before calling Stripe.
  if (!isLikelyStripeSessionId(sessionId)) {
    return { ok: false, status: 400, message: "Invalid session_id format." };
  }

  if (downloadTestHooks.validateDownloadSession) {
    return downloadTestHooks.validateDownloadSession(sessionId);
  }

  if (!isStripeConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Stripe is not configured for download validation.",
    };
  }

  const stripe = getStripeServerClient();
  if (!stripe) {
    return {
      ok: false,
      status: 503,
      message: "Stripe is not configured for download validation.",
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const expectedAmount = getMjmlPackPricePence();

    if (session.mode !== "payment") {
      return { ok: false, status: 403, message: "Session is not a payment checkout." };
    }

    if (session.payment_status !== "paid") {
      return { ok: false, status: 402, message: "Payment has not been completed." };
    }

    if (session.metadata?.productId !== MJML_PACK_PRODUCT_ID) {
      return { ok: false, status: 403, message: "Session is not valid for this product." };
    }

    if (session.amount_total !== expectedAmount || session.currency !== "gbp") {
      return {
        ok: false,
        status: 403,
        message: "Payment amount does not match this download.",
      };
    }

    return { ok: true, sessionId: session.id };
  } catch {
    return { ok: false, status: 404, message: "Checkout session was not found." };
  }
}
