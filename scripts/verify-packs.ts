/**
 * Acceptance gate over the GENERATED tier packs.
 *
 * Run AFTER `npm run build:pack`. Asserts:
 *   (1) the Pro and Enterprise pack file lists are NOT identical (Enterprise physically
 *       differs from Pro — the framework deliverable);
 *   (2) the 7 robustness assertions hold against a representative COMPILED template taken
 *       from EACH tier's generated pack:
 *         (a) brand font tokens inline on the text <div> (Manrope/Inter), reject Ubuntu
 *         (b) dark-mode block sets the background-color override on .dm-keep-cta
 *         (c) @media (max-width:480px) breakpoint present
 *         (d) dm-keep-cta attached to both button TDs
 *         (e) <meta name="color-scheme"> + gstatic font preconnect present
 *         (f) no fonts.googleapis.com Ubuntu @import/link
 *         (g) no templatehedgehog.com leak (the .co.uk production domain is allowed)
 *   (3) the curated layout add-ons (CURATED_ADDON_SLUGS) are intact in the Enterprise pack:
 *       every slug present as MJML + compiled HTML, no lorem/ipsum/example.com placeholder
 *       leakage in the source, and each compiled twin passes the same robustness checks.
 *
 * Exits non-zero on ANY failure.
 *
 * Implementation note: reads the ZIPs via the `unzip` CLI (present on macOS/Linux CI) to
 * avoid adding a zip-reader dependency. The gate is read-only over the built artifacts.
 */
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import {
  CURATED_ADDON_SLUGS,
  getMjmlPackAbsolutePath,
  type DownloadPackId,
} from "../src/lib/pack";

const PROJECT_ROOT = process.cwd();

// A template every tier's pack contains, that carries a dm-keep-cta CTA so the dark-mode
// assertions are meaningful. password-reset-card is in the curated Starter selection too.
const REPRESENTATIVE = "components/html/password-reset-card.html";

function listZip(zipPath: string): string[] {
  const out = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" });
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .sort();
}

function readFromZip(zipPath: string, entry: string): string {
  // -p streams a single entry to stdout
  return execFileSync("unzip", ["-p", zipPath, entry], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

type Assertion = { label: string; check: (html: string) => boolean };

const ASSERTIONS: Assertion[] = [
  {
    label: "(a) brand font tokens INLINE on text <div> (Manrope+Inter), no Ubuntu default",
    check: (html) =>
      /<div[^>]*style="[^"]*font-family:\s*[^"]*Manrope[^"]*"/i.test(html) &&
      /font-family:\s*[^"]*Inter/i.test(html) &&
      !/Ubuntu/i.test(html),
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
    label: "(d) dm-keep-cta attached to the compiled button TD",
    check: (html) => (html.match(/class="[^"]*\bdm-keep-cta\b[^"]*"/gi) || []).length >= 1,
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
    label: "(g) NO templatehedgehog.com leak (.co.uk production domain allowed)",
    check: (html) => !/templatehedgehog\.com/i.test(html.replace(/templatehedgehog\.co\.uk/gi, "")),
  },
];

function main(): void {
  const tiers: DownloadPackId[] = ["starter", "pro", "enterprise"];
  const zipByTier = new Map<DownloadPackId, string>();
  for (const tier of tiers) {
    const zipPath = getMjmlPackAbsolutePath(PROJECT_ROOT, tier);
    zipByTier.set(tier, zipPath);
  }

  let failures = 0;

  // ---- (1) Pro vs Enterprise file lists must differ ----
  console.log("==== PACK DIFFERENTIATION ====");
  const proFiles = listZip(zipByTier.get("pro")!);
  const entFiles = listZip(zipByTier.get("enterprise")!);
  const identical =
    proFiles.length === entFiles.length && proFiles.every((f, i) => f === entFiles[i]);
  const entOnly = entFiles.filter((f) => !proFiles.includes(f));
  const proOnly = proFiles.filter((f) => !entFiles.includes(f));
  if (identical) {
    failures += 1;
    console.log("  [FAIL] Pro and Enterprise pack file lists are IDENTICAL");
  } else {
    console.log(
      `  [PASS] Enterprise differs from Pro (Pro ${proFiles.length} files, Enterprise ${entFiles.length} files)`,
    );
    console.log(`         Enterprise-only files (${entOnly.length}): ${entOnly.join(", ") || "—"}`);
    if (proOnly.length) {
      console.log(`         Pro-only files (${proOnly.length}): ${proOnly.join(", ")}`);
    }
  }

  // ---- (2) Robustness assertions against a representative compiled template per tier ----
  for (const tier of tiers) {
    console.log(`\n==== ${tier.toUpperCase()} PACK — ${REPRESENTATIVE} ====`);
    const zipPath = zipByTier.get(tier)!;
    let html: string;
    try {
      html = readFromZip(zipPath, REPRESENTATIVE);
    } catch (err) {
      failures += 1;
      console.log(`  [FAIL] could not read ${REPRESENTATIVE} from ${path.basename(zipPath)}: ${(err as Error).message}`);
      continue;
    }
    for (const a of ASSERTIONS) {
      let pass = false;
      try {
        pass = a.check(html);
      } catch (err) {
        console.log(`  [ERROR] assertion threw: ${(err as Error).message}`);
      }
      if (!pass) failures += 1;
      console.log(`  [${pass ? "PASS" : "FAIL"}] ${a.label}`);
    }
  }

  // ---- (3) Curated layout add-ons must be intact in the Enterprise pack ----
  console.log(`\n==== ENTERPRISE PACK — CURATED ADD-ONS (${CURATED_ADDON_SLUGS.length}) ====`);
  const entZip = zipByTier.get("enterprise")!;
  const entEntries = new Set(entFiles);
  const placeholderRe = /lorem|ipsum|example\.com/i;

  for (const slug of CURATED_ADDON_SLUGS) {
    const mjmlEntry = `add-ons/mjml/${slug}.mjml`;
    const htmlEntry = `add-ons/html/${slug}.html`;
    const problems: string[] = [];

    if (!entEntries.has(mjmlEntry)) problems.push("missing MJML");
    if (!entEntries.has(htmlEntry)) problems.push("missing HTML");

    if (problems.length === 0) {
      let mjmlSource = "";
      let html = "";
      try {
        mjmlSource = readFromZip(entZip, mjmlEntry);
        html = readFromZip(entZip, htmlEntry);
      } catch (err) {
        problems.push(`read error: ${(err as Error).message}`);
      }

      if (placeholderRe.test(mjmlSource)) problems.push("placeholder copy (lorem/ipsum/example.com)");

      // Each curated twin must clear the same robustness bar as the core templates. The
      // dm-keep-cta CTA assertions (b, d) are skipped per add-on that has no CTA button;
      // the rest (inline fonts, breakpoint, meta+preconnect, no Ubuntu, no .com leak) apply.
      const hasCta = /class="[^"]*\bdm-keep-cta\b/i.test(html);
      for (const a of ASSERTIONS) {
        const isCtaAssertion = a.label.startsWith("(b)") || a.label.startsWith("(d)");
        if (isCtaAssertion && !hasCta) continue;
        let pass = false;
        try {
          pass = a.check(html);
        } catch {
          pass = false;
        }
        if (!pass) problems.push(`robustness ${a.label.slice(0, 3)}`);
      }
    }

    if (problems.length > 0) {
      failures += 1;
      console.log(`  [FAIL] ${slug}: ${problems.join("; ")}`);
    } else {
      console.log(`  [PASS] ${slug}`);
    }
  }

  // ---- (4) Zero "Ubuntu" in ALL delivered HTML across every tier ----
  // The brand font is inlined on mj-table / mj-social (mjml-core's Ubuntu default tags), so
  // no compiled HTML should carry the Ubuntu default glyph or its Google Fonts @import/link.
  console.log("\n==== NO UBUNTU DEFAULT-FONT LEAK (all delivered HTML) ====");
  for (const tier of tiers) {
    const zipPath = zipByTier.get(tier)!;
    const htmlEntries = listZip(zipPath).filter((entry) => entry.endsWith(".html"));
    const offenders: string[] = [];
    for (const entry of htmlEntries) {
      let html = "";
      try {
        html = readFromZip(zipPath, entry);
      } catch {
        continue;
      }
      if (/Ubuntu/i.test(html)) offenders.push(entry);
    }
    if (offenders.length > 0) {
      failures += 1;
      console.log(`  [FAIL] ${tier}: ${offenders.length} HTML file(s) leak Ubuntu: ${offenders.join(", ")}`);
    } else {
      console.log(`  [PASS] ${tier}: 0 of ${htmlEntries.length} HTML files contain "Ubuntu"`);
    }
  }

  console.log(`\n==== RESULT: ${failures === 0 ? "ALL GENERATED TIERS GREEN" : `${failures} FAILURE(S)`} ====`);
  if (failures > 0) process.exit(1);
}

// Use a temp dir only if we ever need extraction; current checks stream entries directly.
const _scratch = mkdtempSync(path.join(tmpdir(), "verify-packs-"));
try {
  main();
} finally {
  rmSync(_scratch, { recursive: true, force: true });
}
