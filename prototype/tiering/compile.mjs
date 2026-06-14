// Contained prototype compiler + ACCEPTANCE-CONTRACT CI gate for three-dialect tiering.
// Uses the project's own mjml (5.3.0 stable). Does NOT touch scripts/build-pack.ts or any source.
// Run: node prototype/tiering/compile.mjs   (exits non-zero if ANY tier fails ANY assertion)
//
// Compiles on the TRUSTED build path (ignoreIncludes:false + filePath) so the Enterprise shared
// head resolves at build time, exactly as the production pack pipeline would.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mjmlModule = require("mjml");
// mjml 5.x stable exports a direct function (no .default); keep the fallback for safety.
const mjml2html = typeof mjmlModule === "function" ? mjmlModule : mjmlModule.default;

const here = path.dirname(fileURLToPath(import.meta.url));

const TIERS = [
  { id: "starter", src: "starter/welcome-email.mjml" },
  { id: "pro", src: "pro/welcome-email.mjml" },
  { id: "enterprise", src: "enterprise/welcome-email.mjml" },
];

async function compileOne({ id, src }) {
  const srcPath = path.join(here, src);
  const source = readFileSync(srcPath, "utf8");
  const result = await mjml2html(source, {
    validationLevel: "soft",
    keepComments: true,
    minify: false,
    // Trusted first-party build path: resolve <mj-include> (Enterprise shared head).
    ignoreIncludes: false,
    filePath: srcPath,
  });
  const outPath = path.join(here, "compiled", `${id}.html`);
  writeFileSync(outPath, result.html, "utf8");
  const errs = Array.isArray(result.errors) ? result.errors : [];
  console.log(
    `[${id}] compiled -> ${path.relative(here, outPath)}  (mjml errors: ${errs.length}, html bytes: ${result.html.length})`,
  );
  for (const e of errs) {
    console.log(`   ! ${e.formattedMessage || e.message || JSON.stringify(e)}`);
  }
  return { html: result.html, mjmlErrors: errs.length };
}

// ---- Acceptance contract: every assertion runs against EVERY tier ----
// Each check returns true on PASS. The gate fails if any check on any tier is false.
const ASSERTIONS = [
  {
    label: "(a) brand font tokens INLINE on text <div> (Manrope+Inter), no Ubuntu default",
    check: (html) => {
      const inlineDivFont =
        /<div[^>]*style="[^"]*font-family:\s*[^"]*Manrope[^"]*"/i.test(html) &&
        /<div[^>]*style="[^"]*font-family:\s*[^"]*Inter[^"]*"/i.test(html);
      const noUbuntu = !/Ubuntu/i.test(html);
      return inlineDivFont && noUbuntu;
    },
  },
  {
    label: "(b) dark-mode block sets background-color override on .dm-keep-cta",
    check: (html) =>
      /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td\s*\{[^}]*background-color\s*:/i.test(
        html,
      ),
  },
  {
    label: "(c) @media (max-width:480px) responsive breakpoint present",
    check: (html) => /@media[^{]*max-width\s*:\s*480px/i.test(html),
  },
  {
    label: "(d) dm-keep-cta attached to BOTH button TDs",
    check: (html) => {
      // Count the table cells carrying the CTA class (mjml emits class="...dm-keep-cta..." on the button td).
      const matches = html.match(/class="[^"]*\bdm-keep-cta\b[^"]*"/gi) || [];
      return matches.length >= 2;
    },
  },
  {
    label: "(e) <meta name=color-scheme> + gstatic font preconnect present",
    check: (html) =>
      /<meta[^>]*name="color-scheme"[^>]*content="[^"]*dark/i.test(html) &&
      /<link[^>]*rel="preconnect"[^>]*href="https:\/\/fonts\.gstatic\.com/i.test(html),
  },
  {
    label: "(f) NO fonts.googleapis.com Ubuntu @import/link",
    check: (html) => !/fonts\.googleapis\.com\/css[^"']*Ubuntu/i.test(html),
  },
  {
    label: "(g) NO templatehedgehog.com leak (the .co.uk production domain is allowed)",
    check: (html) => {
      // Reject the legacy .com domain in any form; tolerate the live .co.uk domain.
      const withoutCoUk = html.replace(/templatehedgehog\.co\.uk/gi, "");
      return !/templatehedgehog\.com/i.test(withoutCoUk);
    },
  },
];

async function main() {
  const compiled = {};
  for (const tier of TIERS) {
    compiled[tier.id] = await compileOne(tier);
  }

  console.log("\n==== TIERING ACCEPTANCE CONTRACT (all assertions x all tiers) ====");
  let failures = 0;

  for (const tier of TIERS) {
    const { html, mjmlErrors } = compiled[tier.id];
    console.log(`\n-- ${tier.id.toUpperCase()} --`);
    if (mjmlErrors > 0) {
      failures += 1;
      console.log(`  [FAIL] tier produced ${mjmlErrors} mjml compile error(s)`);
    }
    for (const a of ASSERTIONS) {
      let pass = false;
      try {
        pass = a.check(html);
      } catch (err) {
        pass = false;
        console.log(`  [ERROR] assertion threw: ${err.message}`);
      }
      if (!pass) failures += 1;
      console.log(`  [${pass ? "PASS" : "FAIL"}] ${a.label}`);
    }
  }

  console.log(
    `\n==== RESULT: ${failures === 0 ? "ALL THREE TIERS GREEN" : `${failures} FAILURE(S)`} ====`,
  );
  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("GATE FAILED (compile/exception):", e);
  process.exit(1);
});
