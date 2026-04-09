import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "./route";

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

function buildRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/mjml/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

test("POST /api/mjml/compile is disabled in production", async () => {
  await withPatchedEnv(
    { NODE_ENV: "production" },
    async () => {
      const response = await POST(
        buildRequest({ mjml: "<mjml><mj-body><mj-text>Hello</mj-text></mj-body></mjml>" }),
      );
      assert.equal(response.status, 403);
    },
  );
});

test("POST /api/mjml/compile rejects untrusted mj-include input", async () => {
  await withPatchedEnv(
    { NODE_ENV: "development" },
    async () => {
      const response = await POST(
        buildRequest({ mjml: "<mjml><mj-body><mj-include path=\"./secret.mjml\" /></mj-body></mjml>" }),
      );
      assert.equal(response.status, 400);

      const payload = await response.json() as { error?: string };
      assert.match(payload.error ?? "", /mj-include/i);
    },
  );
});

test("POST /api/mjml/compile returns compiled html for valid untrusted input", async () => {
  await withPatchedEnv(
    { NODE_ENV: "development" },
    async () => {
      const response = await POST(
        buildRequest({ mjml: "<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>" }),
      );
      assert.equal(response.status, 200);

      const payload = await response.json() as { html?: string };
      assert.equal(typeof payload.html, "string");
      assert.match(payload.html ?? "", /Hello/);
    },
  );
});
