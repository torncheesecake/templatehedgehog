import assert from "node:assert/strict";
import test from "node:test";
import {
  __resetDownloadTokenStateForTests,
  __setDownloadReplayStoreForTests,
  consumeDownloadToken,
  createDownloadToken,
} from "./downloadToken";

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

test("createDownloadToken and consumeDownloadToken accept a valid single-use token once", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "test-secret",
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_tokenabc123");

      const firstConsume = await consumeDownloadToken(token);
      assert.equal(firstConsume.ok, true);
      if (firstConsume.ok) {
        assert.equal(firstConsume.sessionId, "cs_test_tokenabc123");
      }

      const secondConsume = await consumeDownloadToken(token);
      assert.equal(secondConsume.ok, false);
      if (!secondConsume.ok) {
        assert.equal(secondConsume.status, 409);
      }
    },
  );
});

test("consumeDownloadToken rejects expired tokens", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "test-secret",
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_expiring123", { ttlSeconds: 1 });

      const originalNow = Date.now;
      Date.now = () => originalNow() + 2_000;
      try {
        const result = await consumeDownloadToken(token);
        assert.equal(result.ok, false);
        if (!result.ok) {
          assert.equal(result.status, 410);
        }
      } finally {
        Date.now = originalNow;
      }
    },
  );
});

test("consumeDownloadToken returns 503 when DOWNLOAD_TOKEN_SECRET is missing", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: undefined,
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const result = await consumeDownloadToken("invalid-token");
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.status, 503);
      }
    },
  );
});

test("consumeDownloadToken returns 503 in production when replay store is misconfigured", async () => {
  await withPatchedEnv(
    {
      NODE_ENV: "production",
      DOWNLOAD_TOKEN_SECRET: "test-secret",
      DOWNLOAD_TOKEN_REPLAY_STORE: "redis",
      REDIS_URL: undefined,
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_prodmisconfig123");
      const result = await consumeDownloadToken(token);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.status, 503);
      }
    },
  );
});

test("consumeDownloadToken does not allow memory replay mode in production", async () => {
  await withPatchedEnv(
    {
      NODE_ENV: "production",
      DOWNLOAD_TOKEN_SECRET: "test-secret",
      DOWNLOAD_TOKEN_REPLAY_STORE: "memory",
      REDIS_URL: undefined,
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_prodmemorymode123");
      const result = await consumeDownloadToken(token);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.status, 503);
      }
    },
  );
});

test("consumeDownloadToken honours external replay store implementation", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "test-secret",
    },
    async () => {
      const seen = new Set<string>();
      __setDownloadReplayStoreForTests({
        async consumeNonce(nonce) {
          if (seen.has(nonce)) {
            return "reused";
          }
          seen.add(nonce);
          return "accepted";
        },
      });

      const token = createDownloadToken("cs_test_externalstore123");
      const first = await consumeDownloadToken(token);
      assert.equal(first.ok, true);

      const second = await consumeDownloadToken(token);
      assert.equal(second.ok, false);
      if (!second.ok) {
        assert.equal(second.status, 409);
      }

      __setDownloadReplayStoreForTests(null);
      __resetDownloadTokenStateForTests();
    },
  );
});
