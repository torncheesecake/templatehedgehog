import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
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

test("compileMjml (untrusted) rejects mj-include before it can reach the include resolver", async () => {
  // Even with a filePath that would otherwise resolve, the untrusted path must reject.
  await assert.rejects(
    async () =>
      compileMjml("<mjml><mj-head><mj-include path=\"./head.mjml\" /></mj-head><mj-body></mj-body></mjml>", {
        trusted: false,
        filePath: "/etc/whatever.mjml",
      }),
    /mj-include/i,
  );
});

test("compileMjml (trusted) resolves mj-include from the shared head at build time", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "mjml-include-trusted-"));
  const headPath = path.join(dir, "head.mjml");
  const mainPath = path.join(dir, "main.mjml");
  writeFileSync(
    headPath,
    "<mj-head><mj-style>.included-marker { color: #2f67ef; }</mj-style></mj-head>",
    "utf8",
  );
  // In mjml v5 a shared <mj-head> fragment is included as a direct child of <mjml>
  // (not nested inside another <mj-head>, which v5 validation rejects).
  const main = [
    "<mjml>",
    "  <mj-include path=\"./head.mjml\" />",
    "  <mj-body><mj-section><mj-column><mj-text css-class=\"included-marker\">Hi</mj-text></mj-column></mj-section></mj-body>",
    "</mjml>",
  ].join("\n");
  writeFileSync(mainPath, main, "utf8");

  const html = await compileMjml(main, { trusted: true, filePath: mainPath });
  // The included stylesheet rule must appear in the compiled output (include was resolved).
  assert.match(html, /included-marker/);
});

