import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import {
  buildSharedKey,
  getRedisClient,
  SharedRedisNotConfiguredError,
} from "@/lib/shared/redis";

const TOKEN_TTL_SECONDS_DEFAULT = 15 * 60;
const TOKEN_PARTS_SEPARATOR = ".";
const MAX_TOKEN_LENGTH = 2048;
const STRIPE_SESSION_ID_PATTERN = /^cs_(live|test)_[A-Za-z0-9]+$/;

type DownloadTokenPayload = {
  sid: string;
  exp: number;
  nonce: string;
};

interface DownloadReplayStore {
  consumeNonce(nonce: string, expiresAtUnixSeconds: number): Promise<"accepted" | "reused">;
  clear?(): void;
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getTokenSecret(): string | null {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET?.trim();
  return secret ? secret : null;
}

function signPayload(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function safeSignatureMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parsePayload(encodedPayload: string): DownloadTokenPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as DownloadTokenPayload;

    if (
      typeof parsed.sid !== "string"
      || typeof parsed.exp !== "number"
      || typeof parsed.nonce !== "string"
    ) {
      return null;
    }

    if (!STRIPE_SESSION_ID_PATTERN.test(parsed.sid)) {
      return null;
    }

    if (!Number.isFinite(parsed.exp) || parsed.exp <= 0) {
      return null;
    }

    if (!parsed.nonce || parsed.nonce.length > 120) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

class InMemoryReplayStore implements DownloadReplayStore {
  private readonly usedNonces = new Map<string, number>();

  async consumeNonce(
    nonce: string,
    expiresAtUnixSeconds: number,
  ): Promise<"accepted" | "reused"> {
    const nowUnixSeconds = Math.floor(Date.now() / 1000);
    for (const [storedNonce, expiry] of this.usedNonces.entries()) {
      if (expiry <= nowUnixSeconds) {
        this.usedNonces.delete(storedNonce);
      }
    }

    if (this.usedNonces.has(nonce)) {
      return "reused";
    }

    this.usedNonces.set(nonce, expiresAtUnixSeconds);
    return "accepted";
  }

  clear(): void {
    this.usedNonces.clear();
  }
}

class RedisReplayStore implements DownloadReplayStore {
  async consumeNonce(
    nonce: string,
    expiresAtUnixSeconds: number,
  ): Promise<"accepted" | "reused"> {
    const redis = getRedisClient();
    const nowUnixSeconds = Math.floor(Date.now() / 1000);
    const ttlSeconds = Math.max(1, expiresAtUnixSeconds - nowUnixSeconds);
    const nonceKey = buildSharedKey("download-token", "nonce", nonce);

    const setResult = await redis.set(
      nonceKey,
      "1",
      "EX",
      ttlSeconds,
      "NX",
    );
    return setResult === "OK" ? "accepted" : "reused";
  }
}

const memoryReplayStore = new InMemoryReplayStore();
const redisReplayStore = new RedisReplayStore();
let replayStoreOverride: DownloadReplayStore | null = null;

function getReplayStoreMode(): "memory" | "redis" {
  if (process.env.NODE_ENV === "production") {
    return "redis";
  }

  const raw = process.env.DOWNLOAD_TOKEN_REPLAY_STORE?.trim().toLowerCase();
  if (raw === "memory" || raw === "redis") {
    return raw;
  }
  return "memory";
}

function getReplayStore(): DownloadReplayStore {
  if (replayStoreOverride) {
    return replayStoreOverride;
  }

  if (getReplayStoreMode() === "memory") {
    return memoryReplayStore;
  }

  return redisReplayStore;
}

export function createDownloadToken(
  sessionId: string,
  options: { ttlSeconds?: number } = {},
): string {
  const secret = getTokenSecret();
  if (!secret) {
    throw new Error("DOWNLOAD_TOKEN_SECRET is required to create download tokens.");
  }

  if (!STRIPE_SESSION_ID_PATTERN.test(sessionId)) {
    throw new Error("Cannot create a download token for an invalid session id.");
  }

  const ttlSeconds =
    typeof options.ttlSeconds === "number" && options.ttlSeconds > 0
      ? Math.floor(options.ttlSeconds)
      : TOKEN_TTL_SECONDS_DEFAULT;

  const payload: DownloadTokenPayload = {
    sid: sessionId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: randomUUID(),
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}${TOKEN_PARTS_SEPARATOR}${signature}`;
}

export type DownloadTokenConsumeResult =
  | { ok: true; sessionId: string }
  | { ok: false; status: number; message: string };

export async function consumeDownloadToken(
  token: string,
): Promise<DownloadTokenConsumeResult> {
  const secret = getTokenSecret();
  if (!secret) {
    return {
      ok: false,
      status: 503,
      message: "Download token verification is not configured.",
    };
  }

  const trimmed = token.trim();
  if (!trimmed || trimmed.length > MAX_TOKEN_LENGTH) {
    return { ok: false, status: 400, message: "Invalid download token." };
  }

  const parts = trimmed.split(TOKEN_PARTS_SEPARATOR);
  if (parts.length !== 2) {
    return { ok: false, status: 400, message: "Invalid download token." };
  }

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = signPayload(encodedPayload, secret);
  if (!safeSignatureMatch(providedSignature, expectedSignature)) {
    return { ok: false, status: 403, message: "Download token signature is invalid." };
  }

  const payload = parsePayload(encodedPayload);
  if (!payload) {
    return { ok: false, status: 400, message: "Invalid download token payload." };
  }

  const nowUnixSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowUnixSeconds) {
    return { ok: false, status: 410, message: "Download token has expired." };
  }

  let nonceResult: "accepted" | "reused";
  try {
    nonceResult = await getReplayStore().consumeNonce(payload.nonce, payload.exp);
  } catch (error) {
    if (error instanceof SharedRedisNotConfiguredError) {
      return {
        ok: false,
        status: 503,
        message: "Download replay protection storage is not configured.",
      };
    }

    return {
      ok: false,
      status: 503,
      message: "Download replay protection is currently unavailable.",
    };
  }

  if (nonceResult === "reused") {
    return { ok: false, status: 409, message: "Download token has already been used." };
  }

  return { ok: true, sessionId: payload.sid };
}

export function __resetDownloadTokenStateForTests(): void {
  replayStoreOverride = null;
  memoryReplayStore.clear();
}

export function __setDownloadReplayStoreForTests(
  replayStore: DownloadReplayStore | null,
): void {
  replayStoreOverride = replayStore;
}
