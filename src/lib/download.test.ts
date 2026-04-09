import assert from "node:assert/strict";
import test from "node:test";
import { resolveDownloadDelivery } from "./download";

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

test("resolveDownloadDelivery rejects filesystem mode in production", async () => {
  await withPatchedEnv(
    {
      NODE_ENV: "production",
      DOWNLOAD_STORAGE_MODE: "filesystem",
    },
    async () => {
      const result = await resolveDownloadDelivery("HEAD");
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.status, 503);
        assert.match(result.message, /filesystem/i);
      }
    },
  );
});

test("resolveDownloadDelivery returns friendly provider env error", async () => {
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
      const result = await resolveDownloadDelivery("HEAD");
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.status, 503);
        assert.match(result.message, /configured|credentials/i);
      }
    },
  );
});
