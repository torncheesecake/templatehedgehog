// Repro 2: test whether wrapping the include file in <mjml> fixes the behavior
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mjmlModule = require("mjml");
const mjml2html = mjmlModule.default || mjmlModule;

const here = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(here, "output"), { recursive: true });

async function compile(filename, label) {
  const srcPath = path.join(here, filename);
  const source = readFileSync(srcPath, "utf8");
  const result = await mjml2html(source, {
    validationLevel: "soft",
    keepComments: true,
    minify: false,
    filePath: srcPath,
  });
  const errs = Array.isArray(result.errors) ? result.errors : [];
  const outFile = filename.replace(".mjml", ".html").replace("/", "-");
  const outPath = path.join(here, "output", path.basename(outFile));
  writeFileSync(outPath, result.html, "utf8");
  console.log(`\n[${label}] compiled (errors: ${errs.length}, bytes: ${result.html.length})`);
  if (errs.length) {
    for (const e of errs) console.log(`  ! ${e.formattedMessage || e.message || JSON.stringify(e)}`);
  }
  return result.html;
}

function check(html, label, pattern) {
  const found = pattern.test(html);
  console.log(`  [${found ? "FOUND" : "MISSING"}] ${label}`);
  return found;
}

async function main() {
  console.log("=== REPRO 2: Does <mjml> wrapper in included file fix the issues? ===\n");

  const wrappedHtml = await compile("include-wrapped-test.mjml", "WRAPPED (include has <mjml> wrapper)");

  console.log("\n--- Claim 1: mj-style @media/attribute selectors ---");
  check(wrappedHtml, "@media prefers-color-scheme dark",       /@media[^{]*prefers-color-scheme\s*:\s*dark/i);
  check(wrappedHtml, ".dm-keep-cta td inside @media dark",     /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td/i);
  check(wrappedHtml, "[data-ogsc] .dm-keep-cta td",            /\[data-ogsc\]\s*\.dm-keep-cta\s+td/i);
  check(wrappedHtml, "@media max-width:480px ios-fix",          /@media[^{]*max-width\s*:\s*480px[\s\S]*?\.ios-fix/i);

  console.log("\n--- Claim 2: mj-raw ---");
  check(wrappedHtml, "<meta name=\"color-scheme\"> present",   /name="color-scheme"/i);
  check(wrappedHtml, "<link rel=\"preconnect\"> present",      /rel="preconnect"/i);

  console.log("\n--- Claim 3: mj-attributes ---");
  check(wrappedHtml, "font-size:18px in inline style",          /style="[^"]*font-size\s*:\s*18px/i);
  check(wrappedHtml, "color:#ff0000 in inline style",           /style="[^"]*color\s*:\s*#ff0000/i);
  check(wrappedHtml, "font-weight:800 in inline style (token)", /style="[^"]*font-weight\s*:\s*800/i);
  check(wrappedHtml, "color:#00cc00 in inline style (token)",   /style="[^"]*color\s*:\s*#00cc00/i);
}

main().catch(e => { console.error("FAILED:", e); process.exit(1); });
