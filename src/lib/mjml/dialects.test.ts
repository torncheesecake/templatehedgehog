import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  toDialect,
  buildEnterpriseSharedHead,
  ENTERPRISE_SHARED_HEAD_FILENAME,
  type PackTier,
} from "./dialects";
import { compileMjml } from "./compile";

// A small but representative assembled document mirroring the catalogue shape:
// a shared <mj-head> with element defaults + mj-class tokens, then a body using mj-class.
const SOURCE = `<!-- Purpose: test fixture -->
<mjml>
  <mj-head>
    <mj-preview>TemplateHedgehog reusable email block</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Manrope', 'Inter', Arial, sans-serif" />
      <mj-text padding="0 0 12px 0" font-size="16px" line-height="28px" color="#1a1a1a" />
      <mj-class name="h2" font-size="36px" line-height="40px" font-weight="800" />
      <mj-class name="label" font-family="'Inter', Arial, sans-serif" font-size="12px" font-weight="700" text-transform="uppercase" letter-spacing="0.12em" />
      <mj-class name="text-muted" color="#4a5568" />
      <mj-class name="thblue" color="#2f67ef" />
      <mj-class name="whitebg" background-color="#ffffff" />
      <mj-class name="thbluebg" background-color="#2f67ef" />
      <mj-class name="white" color="#ffffff" />
      <mj-class name="body" font-family="'Inter', Arial, sans-serif" font-size="17px" line-height="28px" />
      <mj-class name="bold" font-weight="700" />
    </mj-attributes>
    <mj-style>
      @media (prefers-color-scheme: dark) { .dm-keep-cta td { background-color: #2f67ef !important; } }
    </mj-style>
  </mj-head>
  <mj-body background-color="#f3f4f6">
    <mj-wrapper mj-class="whitebg">
      <mj-section padding="44px 35px 28px 35px">
        <mj-column width="520px">
          <mj-text mj-class="label thblue" align="center">Welcome</mj-text>
          <mj-text mj-class="h2 text-primary" align="center">Welcome to the product</mj-text>
          <mj-text mj-class="body text-muted" align="center">Your workspace is ready.</mj-text>
          <mj-button mj-class="thbluebg white body bold" css-class="dm-keep-cta" align="center" href="https://example.com">Start setup</mj-button>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`;

async function compileTier(tier: PackTier, source: string): Promise<string> {
  const out = toDialect(tier, source);
  if (tier !== "enterprise") {
    return compileMjml(out, { trusted: true });
  }
  // Enterprise references ./head.mjml — write both into a temp dir and compile on the trusted path.
  const dir = mkdtempSync(path.join(tmpdir(), "dialect-test-"));
  const mainPath = path.join(dir, "main.mjml");
  writeFileSync(mainPath, out, "utf8");
  writeFileSync(path.join(dir, ENTERPRISE_SHARED_HEAD_FILENAME), buildEnterpriseSharedHead(), "utf8");
  return compileMjml(out, { trusted: true, filePath: mainPath });
}

test("toDialect throws on an unknown tier", () => {
  assert.throws(() => toDialect("gold" as PackTier, SOURCE), /Unknown tier/i);
});

test("STARTER resolves mj-class tokens to inline attributes and drops the token block", () => {
  const out = toDialect("starter", SOURCE);
  // mj-class is removed from the body
  assert.ok(!/mj-class=/.test(out), "no mj-class should remain in starter body");
  // the shared <mj-attributes> token block is dropped
  assert.ok(!/<mj-attributes>/.test(out), "starter must not ship the shared mj-attributes block");
  // h2 token resolved inline on the headline
  assert.match(out, /font-size="36px"[^>]*line-height="40px"[^>]*font-weight="800"/);
  // colour token resolved inline
  assert.match(out, /color="#2f67ef"/);
  // minimal guardrail style retained
  assert.match(out, /@media[^{]*max-width\s*:\s*480px/i);
  assert.match(out, /prefers-color-scheme\s*:\s*dark/i);
});

test("STARTER keeps css-class (dm-keep-cta) while removing mj-class", () => {
  const out = toDialect("starter", SOURCE);
  assert.match(out, /css-class="dm-keep-cta"/);
});

test("PRO inlines brand tokens AND ships a self-contained <mj-style> stylesheet, no include", () => {
  const out = toDialect("pro", SOURCE);
  assert.ok(!/<mj-include/.test(out), "pro must not use an external include");
  // helper classes present in the stylesheet (the fuller Pro stylesheet)
  assert.match(out, /\.center\s*\{/);
  // inline brand tokens still applied (the constant)
  assert.match(out, /font-size="36px"/);
  assert.match(out, /font-family="'Inter', Arial, sans-serif"/);
});

test("ENTERPRISE emits an <mj-include> for the shared head as a direct child of <mjml>", () => {
  const out = toDialect("enterprise", SOURCE);
  assert.match(out, /<mj-include path="\.\/head\.mjml" \/>/);
  // include is a direct child of <mjml>, before <mj-head>
  const includeIdx = out.indexOf("<mj-include");
  const headIdx = out.indexOf("<mj-head>");
  assert.ok(includeIdx < headIdx, "include must precede the document <mj-head>");
  // tokens are still inlined (the constant) and mj-attributes block kept in the doc head
  assert.match(out, /font-size="36px"/);
  assert.match(out, /<mj-attributes>/);
});

test("ENTERPRISE shared head carries the guardrail + helper <mj-style>", () => {
  const head = buildEnterpriseSharedHead();
  assert.match(head, /<mj-head>/);
  assert.match(head, /prefers-color-scheme\s*:\s*dark/i);
  assert.match(head, /max-width\s*:\s*480px/i);
  assert.match(head, /\.center\s*\{/);
});

test("the inline-token CONSTANT holds: every tier inlines brand fonts and reject Ubuntu", () => {
  for (const tier of ["starter", "pro", "enterprise"] as PackTier[]) {
    const out = toDialect(tier, SOURCE);
    assert.match(out, /font-family="'Manrope', 'Inter', Arial, sans-serif"|font-family="'Inter', Arial, sans-serif"/, `${tier} must inline brand fonts`);
    assert.ok(!/Ubuntu/i.test(out), `${tier} source must not contain Ubuntu`);
  }
});

test("COMPILED Starter output retains guardrails, inline fonts, no Ubuntu", async () => {
  const html = await compileTier("starter", SOURCE);
  assert.match(html, /@media[^{]*max-width\s*:\s*480px/i);
  assert.match(html, /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td\s*\{[^}]*background-color/i);
  assert.match(html, /<div[^>]*style="[^"]*font-family:[^"]*Manrope/i);
  assert.ok(!/Ubuntu/i.test(html), "no Ubuntu default in compiled Starter");
});

test("COMPILED Pro output retains guardrails, inline fonts, no Ubuntu", async () => {
  const html = await compileTier("pro", SOURCE);
  assert.match(html, /@media[^{]*max-width\s*:\s*480px/i);
  assert.match(html, /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td\s*\{[^}]*background-color/i);
  assert.match(html, /<div[^>]*style="[^"]*font-family:[^"]*Manrope/i);
  assert.ok(!/Ubuntu/i.test(html), "no Ubuntu default in compiled Pro");
});

test("COMPILED Enterprise output (include resolved on trusted path) retains guardrails, inline fonts, no Ubuntu", async () => {
  const html = await compileTier("enterprise", SOURCE);
  assert.match(html, /@media[^{]*max-width\s*:\s*480px/i);
  assert.match(html, /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td\s*\{[^}]*background-color/i);
  assert.match(html, /<div[^>]*style="[^"]*font-family:[^"]*Manrope/i);
  assert.ok(!/Ubuntu/i.test(html), "no Ubuntu default in compiled Enterprise");
});

test("dm-keep-cta survives onto the compiled button in every tier", async () => {
  for (const tier of ["starter", "pro", "enterprise"] as PackTier[]) {
    const html = await compileTier(tier, SOURCE);
    assert.match(html, /class="[^"]*dm-keep-cta/i, `${tier} must attach dm-keep-cta to the button`);
  }
});
