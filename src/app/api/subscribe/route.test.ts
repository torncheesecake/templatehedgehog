import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { __resetWaitlistStoreForTests } from "@/lib/waitlist/store";

async function withPatchedEnv<T>(
  patch: Record<string, string | undefined>,
  run: () => Promise<T>,
): Promise<T> {
  const previous: Record<string, string | undefined> = {};

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

function buildRequest(body: { email?: string; source?: string }): NextRequest {
  return new NextRequest("http://localhost:3000/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

test("POST /api/subscribe stores a valid email", async () => {
  await withPatchedEnv({ WAITLIST_STORAGE_MODE: "memory" }, async () => {
    __resetWaitlistStoreForTests();

    const response = await POST(buildRequest({
      email: "buyer@example.com",
      source: "pricing_checklist",
    }));

    assert.equal(response.status, 201);
  });
});

test("POST /api/subscribe is idempotent for duplicate emails", async () => {
  await withPatchedEnv({ WAITLIST_STORAGE_MODE: "memory" }, async () => {
    __resetWaitlistStoreForTests();

    assert.equal((await POST(buildRequest({ email: "repeat@example.com" }))).status, 201);
    assert.equal((await POST(buildRequest({ email: "repeat@example.com" }))).status, 200);
  });
});

test("POST /api/subscribe rejects invalid email", async () => {
  await withPatchedEnv({ WAITLIST_STORAGE_MODE: "memory" }, async () => {
    __resetWaitlistStoreForTests();

    const response = await POST(buildRequest({ email: "invalid" }));
    assert.equal(response.status, 400);
  });
});

test("POST /api/subscribe works in production without redis using file storage", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "templatehedgehog-subscribe-"));

  await withPatchedEnv(
    {
      NODE_ENV: "production",
      WAITLIST_STORAGE_MODE: undefined,
      WAITLIST_FILE_PATH: path.join(tempDir, "waitlist.jsonl"),
      REDIS_URL: undefined,
    },
    async () => {
      try {
        __resetWaitlistStoreForTests();

        const response = await POST(buildRequest({
          email: "production@example.com",
          source: "pricing_checklist",
        }));

        assert.equal(response.status, 201);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    },
  );
});
