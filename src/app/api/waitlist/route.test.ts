import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST, __resetWaitlistRouteStateForTests } from "./route";
import { __resetWaitlistStoreForTests } from "@/lib/waitlist/store";

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

function buildWaitlistRequest(
  body: { email?: string; source?: string },
  ip: string = "203.0.113.10",
): NextRequest {
  return new NextRequest("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

test("POST /api/waitlist returns 201 for a valid submission", async () => {
  await withPatchedEnv(
    {
      WAITLIST_STORAGE_MODE: "memory",
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      const request = buildWaitlistRequest({
        email: "new.user@example.com",
        source: "test-suite",
      });
      const response = await POST(request);

      assert.equal(response.status, 201);
    },
  );
});

test("POST /api/waitlist returns 200 for duplicate email", async () => {
  await withPatchedEnv(
    {
      WAITLIST_STORAGE_MODE: "memory",
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      const first = await POST(buildWaitlistRequest({ email: "repeat@example.com" }));
      assert.equal(first.status, 201);

      const second = await POST(buildWaitlistRequest({ email: "repeat@example.com" }));
      assert.equal(second.status, 200);
    },
  );
});

test("POST /api/waitlist returns 400 for invalid email", async () => {
  await withPatchedEnv(
    {
      WAITLIST_STORAGE_MODE: "memory",
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      const response = await POST(buildWaitlistRequest({ email: "not-an-email" }));
      assert.equal(response.status, 400);
    },
  );
});

test("POST /api/waitlist rate limits repeated requests from the same IP", async () => {
  await withPatchedEnv(
    {
      WAITLIST_STORAGE_MODE: "memory",
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const response = await POST(
          buildWaitlistRequest({ email: `user${attempt}@example.com` }, "198.51.100.42"),
        );
        assert.notEqual(response.status, 429);
      }

      const limited = await POST(
        buildWaitlistRequest({ email: "final@example.com" }, "198.51.100.42"),
      );
      assert.equal(limited.status, 429);
    },
  );
});

test("POST /api/waitlist returns 503 when redis mode is unconfigured", async () => {
  await withPatchedEnv(
    {
      WAITLIST_STORAGE_MODE: "redis",
      REDIS_URL: undefined,
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      const response = await POST(
        buildWaitlistRequest({ email: "redis-mode@example.com" }),
      );
      assert.equal(response.status, 503);
    },
  );
});

test("POST /api/waitlist enforces redis backing in production", async () => {
  await withPatchedEnv(
    {
      NODE_ENV: "production",
      WAITLIST_STORAGE_MODE: "memory",
      RATE_LIMIT_STORE_MODE: "memory",
      REDIS_URL: undefined,
    },
    async () => {
      __resetWaitlistStoreForTests();
      __resetWaitlistRouteStateForTests();

      const response = await POST(
        buildWaitlistRequest({ email: "prod-check@example.com" }),
      );
      assert.equal(response.status, 503);
    },
  );
});
