import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeUntrustedMjml } from "./safety";

test("assertSafeUntrustedMjml rejects mj-include", () => {
  assert.throws(
    () => assertSafeUntrustedMjml("<mjml><mj-body><mj-include path=\"./secret.mjml\" /></mj-body></mjml>"),
    /mj-include/i,
  );
});

test("assertSafeUntrustedMjml rejects file URLs", () => {
  assert.throws(
    () => assertSafeUntrustedMjml("<mjml><mj-body><mj-text>file://etc/passwd</mj-text></mj-body></mjml>"),
    /file:\/\//i,
  );
});

test("assertSafeUntrustedMjml rejects remote mj-font href", () => {
  assert.throws(
    () =>
      assertSafeUntrustedMjml(
        "<mjml><mj-head><mj-font name=\"Inter\" href=\"https://example.com/font.woff\" /></mj-head></mjml>",
      ),
    /remote font/i,
  );
});

test("assertSafeUntrustedMjml accepts plain trusted-looking markup", () => {
  assert.doesNotThrow(() =>
    assertSafeUntrustedMjml("<mjml><mj-body><mj-section><mj-text>Hello</mj-text></mj-section></mj-body></mjml>"),
  );
});

