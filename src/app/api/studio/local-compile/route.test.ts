import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "./route";

function buildRequest(body: unknown, url = "http://localhost:3000/api/studio/local-compile"): Request {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: new URL(url).host,
    },
    body: JSON.stringify(body),
  });
}

test("POST /api/studio/local-compile compiles valid local MJML", async () => {
  const response = await POST(
    buildRequest({
      mjml: "<mjml><mj-body><mj-section><mj-column><mj-text>Hello Studio</mj-text></mj-column></mj-section></mj-body></mjml>",
    }),
  );

  assert.equal(response.status, 200);
  const payload = await response.json() as { html?: string };
  assert.match(payload.html ?? "", /Hello Studio/);
});

test("POST /api/studio/local-compile rejects non-loopback hosts", async () => {
  const response = await POST(
    buildRequest(
      { mjml: "<mjml><mj-body><mj-text>Hello</mj-text></mj-body></mjml>" },
      "https://templatehedgehog.co.uk/api/studio/local-compile",
    ),
  );

  assert.equal(response.status, 403);
});

test("POST /api/studio/local-compile keeps untrusted MJML safety checks", async () => {
  const response = await POST(
    buildRequest({
      mjml: "<mjml><mj-body><mj-include path=\"./secret.mjml\" /></mj-body></mjml>",
    }),
  );

  assert.equal(response.status, 400);
  const payload = await response.json() as { error?: string };
  assert.match(payload.error ?? "", /mj-include/i);
});

test("POST /api/studio/local-compile returns readable errors for invalid MJML", async () => {
  const response = await POST(
    buildRequest({
      mjml: "not mjml",
    }),
  );

  assert.equal(response.status, 400);
  const payload = await response.json() as { error?: string };
  assert.ok(payload.error);
  assert.match(payload.error ?? "", /mjml|mj-text|failed|Error/i);
});
