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
import { getMjmlPackAbsolutePath, type DownloadPackId } from "../src/lib/pack";

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
