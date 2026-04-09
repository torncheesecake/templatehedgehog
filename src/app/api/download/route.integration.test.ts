import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { GET, HEAD } from "./route";
import { __resetDownloadTestHooks, __setDownloadTestHooks } from "@/lib/download";

type EnvPatch = Record<string, string | undefined>;

async function withPatchedEnv<T>(
  patch: EnvPatch,
  run: () => Promise<T>,
): Promise<T> {
  const previous: EnvPatch = {};

  for (const [key, value] of Object.entries(patch)) {
    previous[key] = process.env[key];
    if (typeof value === "string") {
      process.env[key] = value;
    } else {
      delete process.env[key];
    }
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (typeof value === "string") {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
  }
}

const providerEnv: EnvPatch = {
  NODE_ENV: "production",
  DOWNLOAD_STORAGE_MODE: "provider",
  DOWNLOAD_PROVIDER: "s3",
  DOWNLOAD_PROVIDER_BUCKET: "template-downloads",
  DOWNLOAD_PROVIDER_REGION: "eu-west-2",
  DOWNLOAD_PROVIDER_ACCESS_KEY_ID: "test-access-key",
  DOWNLOAD_PROVIDER_SECRET_ACCESS_KEY: "test-secret-key",
};

test("HEAD /api/download returns 200 when provider head succeeds", async () => {
  await withPatchedEnv(providerEnv, async () => {
    __setDownloadTestHooks({
      validateDownloadSession: async (sessionId) => ({
        ok: true,
        sessionId,
      }),
      createS3Client: () => ({
        send: async (command) => {
          if (command.constructor.name === "HeadObjectCommand") {
            return {
              ContentLength: 1234,
              ContentType: "application/zip",
            };
          }
          throw new Error(`Unexpected command: ${command.constructor.name}`);
        },
      }),
    });

    try {
      const request = new NextRequest(
        "http://localhost:3000/api/download?session_id=cs_test_valid123",
      );
      const response = await HEAD(request);

      assert.equal(response.status, 200);
      assert.equal(response.headers.get("Content-Type"), "application/zip");
      assert.match(
        response.headers.get("Content-Disposition") ?? "",
        /attachment/i,
      );
    } finally {
      __resetDownloadTestHooks();
    }
  });
});

test("GET /api/download returns 200 with attachment headers", async () => {
  await withPatchedEnv(providerEnv, async () => {
    __setDownloadTestHooks({
      validateDownloadSession: async (sessionId) => ({
        ok: true,
        sessionId,
      }),
      createS3Client: () => ({
        send: async (command) => {
          if (command.constructor.name === "GetObjectCommand") {
            return {
              ContentLength: 5,
              ContentType: "application/zip",
              Body: new ReadableStream<Uint8Array>({
                start(controller) {
                  controller.enqueue(new TextEncoder().encode("dummy"));
                  controller.close();
                },
              }),
            };
          }
          throw new Error(`Unexpected command: ${command.constructor.name}`);
        },
      }),
    });

    try {
      const request = new NextRequest(
        "http://localhost:3000/api/download?session_id=cs_test_valid456",
      );
      const response = await GET(request);

      assert.equal(response.status, 200);
      assert.match(
        response.headers.get("Content-Disposition") ?? "",
        /attachment/i,
      );
      assert.equal(response.headers.get("Content-Type"), "application/zip");
    } finally {
      __resetDownloadTestHooks();
    }
  });
});

test("GET /api/download returns 400 when session_id is missing", async () => {
  __resetDownloadTestHooks();
  const request = new NextRequest("http://localhost:3000/api/download");
  const response = await GET(request);

  assert.equal(response.status, 400);
});

test("GET /api/download returns 503 when provider env vars are missing", async () => {
  await withPatchedEnv(
    {
      NODE_ENV: "production",
      DOWNLOAD_STORAGE_MODE: "provider",
      DOWNLOAD_PROVIDER: "s3",
      DOWNLOAD_PROVIDER_BUCKET: undefined,
      DOWNLOAD_PROVIDER_REGION: undefined,
      DOWNLOAD_PROVIDER_ACCESS_KEY_ID: undefined,
      DOWNLOAD_PROVIDER_SECRET_ACCESS_KEY: undefined,
      AWS_ACCESS_KEY_ID: undefined,
      AWS_SECRET_ACCESS_KEY: undefined,
    },
    async () => {
      __setDownloadTestHooks({
        validateDownloadSession: async (sessionId) => ({
          ok: true,
          sessionId,
        }),
      });

      try {
        const request = new NextRequest(
          "http://localhost:3000/api/download?session_id=cs_test_valid789",
        );
        const response = await GET(request);

        assert.equal(response.status, 503);
      } finally {
        __resetDownloadTestHooks();
      }
    },
  );
});
