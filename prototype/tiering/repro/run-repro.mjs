// Minimal reproduction script: tests each claim about mj-include behavior
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
    filePath: srcPath,  // Critical: required for mj-include path resolution
  });
  const errs = Array.isArray(result.errors) ? result.errors : [];
  const outFile = filename.replace(".mjml", ".html");
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
  console.log("=== MINIMAL REPRO: mj-include claims on mjml 5.0.0-beta.2 ===\n");

  // Compile both variants
  const includeHtml = await compile("include-test.mjml", "INCLUDE (problematic content in included head)");
  const inlineHtml  = await compile("inline-test.mjml",  "INLINE  (same content in main file)");

  // ---- CLAIM 1: mj-style selectors tree-shaken in included head ----
  console.log("\n--- CLAIM 1: mj-style in included head --- tree-shaking of @media/attribute selectors");
  console.log("INCLUDE:");
  const inc_darkMedia    = check(includeHtml, "@media (prefers-color-scheme: dark) rule",    /@media[^{]*prefers-color-scheme\s*:\s*dark/i);
  const inc_dmKeepCtaTd  = check(includeHtml, ".dm-keep-cta td inside @media dark",           /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td/i);
  const inc_dataOgsc     = check(includeHtml, "[data-ogsc] .dm-keep-cta td selector",         /\[data-ogsc\]\s*\.dm-keep-cta\s+td/i);
  const inc_maxWidth     = check(includeHtml, "@media (max-width:480px) ios-fix rule",         /@media[^{]*max-width\s*:\s*480px[\s\S]*?\.ios-fix/i);

  console.log("INLINE:");
  const inl_darkMedia    = check(inlineHtml,  "@media (prefers-color-scheme: dark) rule",    /@media[^{]*prefers-color-scheme\s*:\s*dark/i);
  const inl_dmKeepCtaTd  = check(inlineHtml,  ".dm-keep-cta td inside @media dark",           /@media[^{]*prefers-color-scheme\s*:\s*dark[\s\S]*?\.dm-keep-cta\s+td/i);
  const inl_dataOgsc     = check(inlineHtml,  "[data-ogsc] .dm-keep-cta td selector",         /\[data-ogsc\]\s*\.dm-keep-cta\s+td/i);
  const inl_maxWidth     = check(inlineHtml,  "@media (max-width:480px) ios-fix rule",         /@media[^{]*max-width\s*:\s*480px[\s\S]*?\.ios-fix/i);

  // ---- CLAIM 2: mj-raw dropped in included head ----
  console.log("\n--- CLAIM 2: mj-raw in included head --- dropped entirely");
  console.log("INCLUDE:");
  const inc_colorScheme  = check(includeHtml, "<meta name=\"color-scheme\"> present",          /name="color-scheme"/i);
  const inc_fontLink     = check(includeHtml, "<link rel=\"preconnect\"> present",              /rel="preconnect"/i);

  console.log("INLINE:");
  const inl_colorScheme  = check(inlineHtml,  "<meta name=\"color-scheme\"> present",          /name="color-scheme"/i);
  const inl_fontLink     = check(inlineHtml,  "<link rel=\"preconnect\"> present",              /rel="preconnect"/i);

  // ---- CLAIM 3: mj-attributes dropped in included head ----
  console.log("\n--- CLAIM 3: mj-attributes in included head --- tokens never apply");
  console.log("INCLUDE:");
  // If mj-attributes applied, mj-text default should use font-size:18px and color:#ff0000
  const inc_fontSize18   = check(includeHtml, "font-size:18px from mj-attributes default",    /font-size\s*:\s*18px/i);
  const inc_colorRed     = check(includeHtml, "color:#ff0000 from mj-attributes default",     /#ff0000/i);
  // If mj-class "repro-token" applied, element should get font-weight:800 and color:#00cc00
  const inc_weightToken  = check(includeHtml, "repro-token class applied (font-weight:800)",   /font-weight\s*:\s*800/i);
  const inc_colorGreen   = check(includeHtml, "repro-token color #00cc00 applied",            /#00cc00/i);

  console.log("INLINE:");
  const inl_fontSize18   = check(inlineHtml,  "font-size:18px from mj-attributes default",    /font-size\s*:\s*18px/i);
  const inl_colorRed     = check(inlineHtml,  "color:#ff0000 from mj-attributes default",     /#ff0000/i);
  const inl_weightToken  = check(inlineHtml,  "repro-token class applied (font-weight:800)",   /font-weight\s*:\s*800/i);
  const inl_colorGreen   = check(inlineHtml,  "repro-token color #00cc00 applied",            /#00cc00/i);

  // ---- Summary ----
  console.log("\n=== SUMMARY ===");
  console.log("Claim 1 (mj-style tree-shaking in include):");
  console.log(`  @media dark rule:     include=${inc_darkMedia   ? "KEPT" : "DROPPED"} | inline=${inl_darkMedia   ? "KEPT" : "DROPPED"}`);
  console.log(`  .dm-keep-cta td dark: include=${inc_dmKeepCtaTd ? "KEPT" : "DROPPED"} | inline=${inl_dmKeepCtaTd ? "KEPT" : "DROPPED"}`);
  console.log(`  [data-ogsc] selector: include=${inc_dataOgsc    ? "KEPT" : "DROPPED"} | inline=${inl_dataOgsc    ? "KEPT" : "DROPPED"}`);
  console.log(`  @media max-width:     include=${inc_maxWidth    ? "KEPT" : "DROPPED"} | inline=${inl_maxWidth    ? "KEPT" : "DROPPED"}`);

  console.log("Claim 2 (mj-raw dropped in include):");
  console.log(`  color-scheme meta:    include=${inc_colorScheme ? "PRESENT" : "ABSENT"} | inline=${inl_colorScheme ? "PRESENT" : "ABSENT"}`);
  console.log(`  font preconnect link: include=${inc_fontLink    ? "PRESENT" : "ABSENT"} | inline=${inl_fontLink    ? "PRESENT" : "ABSENT"}`);

  console.log("Claim 3 (mj-attributes dropped in include):");
  console.log(`  font-size:18px:       include=${inc_fontSize18  ? "APPLIED" : "NOT APPLIED"} | inline=${inl_fontSize18  ? "APPLIED" : "NOT APPLIED"}`);
  console.log(`  color:#ff0000:        include=${inc_colorRed    ? "APPLIED" : "NOT APPLIED"} | inline=${inl_colorRed    ? "APPLIED" : "NOT APPLIED"}`);
  console.log(`  repro-token weight:   include=${inc_weightToken ? "APPLIED" : "NOT APPLIED"} | inline=${inl_weightToken ? "APPLIED" : "NOT APPLIED"}`);
  console.log(`  repro-token color:    include=${inc_colorGreen  ? "APPLIED" : "NOT APPLIED"} | inline=${inl_colorGreen  ? "APPLIED" : "NOT APPLIED"}`);
}

main().catch(e => { console.error("REPRO FAILED:", e); process.exit(1); });
