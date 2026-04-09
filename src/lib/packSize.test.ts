import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";
import { MJML_PACK_ABSOLUTE_PATH } from "./pack";
import { getPackSizeInfo } from "./packSize";

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

test("getPackSizeInfo returns a plausible size in dev filesystem mode", async () => {
  let createdFixture = false;

  try {
    await fs.access(MJML_PACK_ABSOLUTE_PATH);
  } catch {
    await fs.mkdir(path.dirname(MJML_PACK_ABSOLUTE_PATH), { recursive: true });
    await fs.writeFile(MJML_PACK_ABSOLUTE_PATH, "dev-pack-size-fixture");
    createdFixture = true;
  }

  try {
    await withPatchedEnv(
      {
        NODE_ENV: "development",
        DOWNLOAD_STORAGE_MODE: "filesystem",
      },
      async () => {
        const sizeInfo = await getPackSizeInfo();
        assert.equal(sizeInfo.storageMode, "filesystem");
        assert.equal(sizeInfo.available, true);
        assert.equal(typeof sizeInfo.bytes, "number");
        assert(sizeInfo.bytes !== null && sizeInfo.bytes > 0);
        assert.notEqual(sizeInfo.formatted, "Unavailable");
      },
    );
  } finally {
    if (createdFixture) {
      await fs.rm(MJML_PACK_ABSOLUTE_PATH, { force: true });
    }
  }
});
