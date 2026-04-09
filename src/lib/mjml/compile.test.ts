import assert from "node:assert/strict";
import test from "node:test";
import { compileMjml } from "./compile";

const VALID_MJML = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello world</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

test("compileMjml compiles valid trusted MJML", async () => {
  const html = await compileMjml(VALID_MJML, { trusted: true });
  assert.match(html, /Hello world/);
  assert.match(html, /<html/i);
});

test("compileMjml rejects empty source", async () => {
  await assert.rejects(
    async () => compileMjml("  ", { trusted: true }),
    /empty/i,
  );
});

test("compileMjml applies untrusted safety checks", async () => {
  await assert.rejects(
    async () =>
      compileMjml("<mjml><mj-body><mj-include path=\"./secret.mjml\" /></mj-body></mjml>", {
        trusted: false,
      }),
    /mj-include/i,
  );
});

