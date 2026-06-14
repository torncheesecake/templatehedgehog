// Contained prototype compiler for the three-dialect tiering de-risking gate.
// Uses the project's own mjml (5.0.0-beta.2). Does NOT touch scripts/build-pack.ts or any source.
// Run: node prototype/tiering/compile.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mjmlModule = require("mjml");
const mjml2html = mjmlModule.default || mjmlModule;

const here = path.dirname(fileURLToPath(import.meta.url));

const dialects = [
  { id: "starter", src: "starter/welcome-email.mjml" },
  { id: "pro", src: "pro/welcome-email.mjml" },
  { id: "enterprise", src: "enterprise/welcome-email.mjml" },
];

async function compileOne({ id, src }) {
  const srcPath = path.join(here, src);
  const source = readFileSync(srcPath, "utf8");
  // filePath lets mjml resolve <mj-include> relative to the source file (Enterprise dialect).
  const result = await mjml2html(source, {
    validationLevel: "soft",
    keepComments: true,
    minify: false,
    filePath: srcPath,
  });
  const outPath = path.join(here, "compiled", `${id}.html`);
  writeFileSync(outPath, result.html, "utf8");
  const errs = Array.isArray(result.errors) ? result.errors : [];
  console.log(
    `[${id}] compiled -> ${path.relative(here, outPath)}  (errors: ${errs.length}, html bytes: ${result.html.length})`,
  );
  if (errs.length) {
    for (const e of errs) {
      console.log(`   ! ${e.formattedMessage || e.message || JSON.stringify(e)}`);
    }
  }
  return result.html;
}

async function main() {
  const htmlById = {};
  for (const d of dialects) {
    htmlById[d.id] = await compileOne(d);
  }

  // ---- Acceptance test: Starter output must retain BOTH guardrails ----
  console.log("\n==== STARTER GUARDRAIL ACCEPTANCE TEST ====");
  const starter = htmlById.starter;

  const checks = [
    {
      label: "mobile breakpoint @media (max-width:480px)",
      re: /@media[^{]*max-width\s*:\s*480px/i,
    },
    {
      label: ".dm-keep-cta dark-mode guard (prefers-color-scheme)",
      re: /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta/i,
    },
    {
      label: ".dm-keep-cta data-ogsc (Outlook.com) guard",
      re: /\[data-ogsc\]\s*\.dm-keep-cta/i,
    },
    {
      label: "dm-keep-cta class is actually attached to a compiled element",
      re: /class="[^"]*dm-keep-cta/i,
    },
    {
      label: "Starter is NOT pure-inline (a <style> block survived)",
      re: /<style[\s>]/i,
    },
  ];

  let allPass = true;
  for (const c of checks) {
    const pass = c.re.test(starter);
    allPass = allPass && pass;
    console.log(`  [${pass ? "PASS" : "FAIL"}] ${c.label}`);
  }

  console.log(`\nSTARTER ACCEPTANCE: ${allPass ? "PASS" : "FAIL"}`);
  if (!allPass) process.exitCode = 1;
}

main().catch((e) => {
  console.error("COMPILE FAILED:", e);
  process.exit(1);
});
