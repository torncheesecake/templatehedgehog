import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { __resetDownloadTokenStateForTests, createDownloadToken } from "@/lib/downloadToken";
import { GET } from "./route";

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

test("GET /api/downloads/[token] redirects to /api/download for a valid token", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "route-test-secret",
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_routevalid123");

      const request = new NextRequest("http://localhost:3000/api/downloads/placeholder");
      const response = await GET(request, { params: Promise.resolve({ token }) });

      assert.equal(response.status, 303);
      const location = response.headers.get("location");
      assert.ok(location);
      assert.match(location ?? "", /\/api\/download\?session_id=cs_test_routevalid123$/);
    },
  );
});

test("GET /api/downloads/[token] rejects reused token", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "route-test-secret",
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const token = createDownloadToken("cs_test_reuse123");
      const request = new NextRequest("http://localhost:3000/api/downloads/placeholder");

      const first = await GET(request, { params: Promise.resolve({ token }) });
      assert.equal(first.status, 303);

      const second = await GET(request, { params: Promise.resolve({ token }) });
      assert.equal(second.status, 409);
    },
  );
});

test("GET /api/downloads/[token] returns 400 for an empty token", async () => {
  await withPatchedEnv(
    {
      DOWNLOAD_TOKEN_SECRET: "route-test-secret",
    },
    async () => {
      __resetDownloadTokenStateForTests();
      const request = new NextRequest("http://localhost:3000/api/downloads/placeholder");
      const response = await GET(request, { params: Promise.resolve({ token: "" }) });

      assert.equal(response.status, 400);
    },
  );
});

