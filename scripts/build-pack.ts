import { createWriteStream, promises as fs } from "node:fs";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";
import archiver from "archiver";
import { type EmailComponent, emailComponents } from "../src/data/email-components";
import { type EmailExampleImplementation, emailExamples } from "../src/data/email-examples";
import {
  type EmailLayoutRecipe,
  type EmailLayoutSystem,
  emailLayouts,
  emailLayoutSystems,
} from "../src/data/email-layouts";
import { type EmailWorkflow, emailWorkflows } from "../src/data/workflows";
import {
  MJML_PACK_LICENSE_POINTS,
  MJML_PACK_PRIVATE_DIR,
  STARTER_LAYOUT_SLUGS,
  type DownloadPackId,
  MJML_PACK_PROJECT_STRUCTURE,
  getMjmlPackAbsolutePath,
  getMjmlPackFilename,
} from "../src/lib/pack";
import { CHANGELOG, PACK_LAST_UPDATED, PACK_VERSION } from "../src/lib/versioning";
import { TEMPLATE_CONFIG } from "../src/config/template";
import { compileMjml } from "../src/lib/mjml/compile";
import {
  buildEnterpriseSharedHead,
  ENTERPRISE_SHARED_HEAD_FILENAME,
  toDialect,
} from "../src/lib/mjml/dialects";
import {
  MJML_CLASS_TOKENS,
  MJML_ELEMENT_DEFAULTS,
} from "../src/data/mjml-library";
import { readyLayoutAddons } from "../src/data/layout-addons/generated";

type PackComponentMetadata = Omit<EmailComponent, "mjmlSource">;
type PackLayoutMetadata = Omit<EmailLayoutRecipe, "mjmlSource">;
type PackExampleMetadata = Omit<EmailExampleImplementation, "mjmlSource">;
type PackWorkflowMetadata = EmailWorkflow;
type PackContent = {
  components: EmailComponent[];
  layouts: EmailLayoutRecipe[];
  systems: EmailLayoutSystem[];
  examples: EmailExampleImplementation[];
  workflows: EmailWorkflow[];
};

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const PACK_IDS: readonly DownloadPackId[] = ["starter", "pro", "enterprise"];
const STARTER_LAYOUT_SLUG_SET = new Set<string>(STARTER_LAYOUT_SLUGS);

type VersionManifest = {
  tier: DownloadPackId;
  version: string;
  buildTimestamp: string;
  lastUpdated: string;
};

function getPackTier(packId: DownloadPackId) {
  const tier = TEMPLATE_CONFIG.pricing.tiers.find((entry) => entry.id === packId);
  if (!tier) {
    throw new Error(`[build-pack] Unknown pack tier: ${packId}`);
  }
  return tier;
}

function getPackDisplayName(packId: DownloadPackId): string {
  return `${TEMPLATE_CONFIG.brandName} ${getPackTier(packId).name}`;
}

function resolvePackContent(packId: DownloadPackId): PackContent {
  if (packId !== "starter") {
    return {
      components: emailComponents,
      layouts: emailLayouts,
      systems: emailLayoutSystems,
      examples: emailExamples,
      workflows: emailWorkflows,
    };
  }

  const layouts = emailLayouts.filter((layout) => STARTER_LAYOUT_SLUG_SET.has(layout.slug));
  if (layouts.length !== STARTER_LAYOUT_SLUGS.length) {
    const found = new Set(layouts.map((layout) => layout.slug));
    const missing = STARTER_LAYOUT_SLUGS.filter((slug) => !found.has(slug));
    throw new Error(`[build-pack] Starter layout selection is missing: ${missing.join(", ")}`);
  }

  const componentSlugSet = new Set(
    layouts.flatMap((layout) => layout.componentBlocks.map((block) => block.componentSlug)),
  );
  const systemSlugSet = new Set(layouts.map((layout) => layout.system));
  const layoutSlugSet = new Set(layouts.map((layout) => layout.slug));

  return {
    components: emailComponents.filter((component) => componentSlugSet.has(component.slug)),
    layouts,
    systems: emailLayoutSystems.filter((system) => systemSlugSet.has(system.slug)),
    examples: emailExamples.filter((example) => layoutSlugSet.has(example.layoutSlug)),
    workflows: emailWorkflows.filter((workflow) => layoutSlugSet.has(workflow.linkedLayoutSlug)),
  };
}

function toPackMetadata(component: EmailComponent): PackComponentMetadata {
  return {
    slug: component.slug,
    title: component.title,
    category: component.category,
    description: component.description,
    tags: component.tags,
    sourceFile: component.sourceFile,
    previewImageUrl: component.previewImageUrl,
    compatibility: component.compatibility,
    usageGuidance: component.usageGuidance,
    accessibilityNotes: component.accessibilityNotes,
  };
}

function toLayoutMetadata(layout: EmailLayoutRecipe): PackLayoutMetadata {
  return {
    slug: layout.slug,
    title: layout.title,
    system: layout.system,
    description: layout.description,
    previewImageUrl: layout.previewImageUrl,
    notes: layout.notes,
    layoutSections: layout.layoutSections,
    componentBlocks: layout.componentBlocks,
    sourceFiles: layout.sourceFiles,
  };
}

function toExampleMetadata(example: EmailExampleImplementation): PackExampleMetadata {
  return {
    slug: example.slug,
    title: example.title,
    description: example.description,
    system: example.system,
    layoutSlug: example.layoutSlug,
    componentSlugs: example.componentSlugs,
    sourceFile: example.sourceFile,
  };
}

function toWorkflowMetadata(workflow: EmailWorkflow): PackWorkflowMetadata {
  return workflow;
}

function buildReadme(
  packId: DownloadPackId,
  componentCount: number,
  layoutCount: number,
  exampleCount: number,
  systemCount: number,
  workflowCount: number,
  buildTimestamp: string,
): string {
  const tier = getPackTier(packId);
  const packDisplayName = getPackDisplayName(packId);

  return [
    `# ${packDisplayName}`,
    "",
    `${packDisplayName} is the downloadable MJML project that sits behind the ${TEMPLATE_CONFIG.brandName} production email system.`,
    "",
    `Tier: ${tier.name}`,
    `Position: ${tier.position}`,
    `Pack version: ${PACK_VERSION}`,
    `Build timestamp (UTC): ${buildTimestamp}`,
    `Last updated: ${PACK_LAST_UPDATED}`,
    "",
    "## What this archive is",
    "",
    `- ${componentCount} reusable MJML components organised in a working project structure`,
    `- ${layoutCount} full layouts grouped into ${systemCount} practical email systems`,
    `- ${exampleCount} example emails you can compile, customise, or hand to a teammate as a starting point`,
    `- ${workflowCount} workflow references that map triggers, data contracts, QA risks, and handoff steps`,
    "- Precompiled HTML beside the MJML so QA and ESP handoff stay simple",
    "- Docs and configuration for developers who need a clean starting point, not just a folder of loose files",
    "",
    "## Project structure",
    "",
    ...MJML_PACK_PROJECT_STRUCTURE.map((entry) => `- \`${entry}\``),
    "",
    "Inside those folders you will find:",
    "",
    "- `components/registry.json`, `components/mjml/`, `components/html/`, `components/previews/`",
    "- `layouts/registry.json`, `layouts/mjml/`, `layouts/html/`, `layouts/systems.json`",
    "- `examples/registry.json`, `examples/mjml/`, `examples/html/`",
    "- `workflows/registry.json`",
    "- `docs/getting-started.md`, `docs/customisation.md`, `docs/esp-handoff.md`, `docs/layout-systems.md`",
    "",
    "## Quick start",
    "",
    "1. Start in `examples/mjml/` if you need a working email immediately.",
    "2. Use `layouts/mjml/` when you want a full reusable structure without the extra example framing.",
    "3. Drop into `components/mjml/` for block-level edits.",
    "4. Compile any MJML file with `npx mjml path/to/file.mjml -o path/to/file.html`.",
    "5. Keep the compiled HTML in version control only when your review or ESP workflow requires it.",
    "6. Check `VERSION` or `version.json` before shipping an updated bundle into production.",
    "",
    "## Suggested workflow",
    "",
    "- Prototype with the public component reference pages.",
    "- Move into this bundle when you want the whole system locally.",
    "- Start from an example or layout, then swap blocks, copy, URLs, and imagery.",
    "- Compile MJML only after structural edits are complete.",
    "- Use the compiled HTML for QA, sign-off, and ESP delivery.",
    "",
    "## Notes",
    "",
    "- `mjml.config` is included as a project-level starter. If your tooling expects `.mjmlconfig`, copy or rename it.",
    "- Replace every placeholder asset, URL, and compliance line before production use.",
    "",
  ].join("\n");
}

function buildLicense(packId: DownloadPackId): string {
  const tier = getPackTier(packId);
  const tierSpecificPoints =
    packId === "enterprise"
      ? [
          "Commercial reuse rights are included for client, internal, and white-label deployment.",
          "The reusable generation framework can be adapted for operational delivery work.",
          "Priority support and 12 months of updates are included with this tier.",
        ]
      : packId === "pro"
        ? [
            "Use the complete production email system for your own business projects.",
            "Commercial reuse, white-label deployment, or client redistribution requires Enterprise.",
            "6 months of updates are included with this tier.",
          ]
        : [
            "Use the curated starter system for your own production email implementation.",
            "Upgrade to Pro for the full component, layout, workflow, and guidance archive.",
            "Commercial reuse, white-label deployment, or client redistribution requires Enterprise.",
          ];

  return [
    `${TEMPLATE_CONFIG.brandName} ${tier.name} Licence`,
    "",
    `${tier.position}. This pack is licensed under the paid purchase terms for the selected tier.`,
    "",
    ...tierSpecificPoints.map((line) => `- ${line}`),
    "",
    "General terms:",
    "",
    ...MJML_PACK_LICENSE_POINTS.map((line) => `- ${line}`),
    "",
    `All rights reserved by ${TEMPLATE_CONFIG.owner.name}. ${TEMPLATE_CONFIG.brandName} is a product of ${TEMPLATE_CONFIG.owner.name}.`,
    "",
  ].join("\n");
}

function buildChangelogMarkdown(): string {
  return [
    "# Changelog",
    "",
    ...CHANGELOG.flatMap((entry) => [
      `## ${entry.date} - ${entry.title}`,
      "",
      ...entry.bulletPoints.map((point) => `- ${point}`),
      "",
    ]),
  ].join("\n");
}

function buildGettingStartedDoc(packId: DownloadPackId): string {
  const packDisplayName = getPackDisplayName(packId);

  return [
    "# Getting Started",
    "",
    `Use ${packDisplayName} as a local MJML project rather than a loose archive of snippets.`,
    "",
    "## Install MJML",
    "",
    "Install MJML in the project where you want to work:",
    "",
    "```bash",
    "npm install mjml",
    "```",
    "",
    "If you prefer a global CLI for quick compiling:",
    "",
    "```bash",
    "npm install --global mjml",
    "```",
    "",
    "## Compile a component",
    "",
    "```bash",
    "npx mjml components/mjml/header-brand-row.mjml -o components/html/header-brand-row.html",
    "```",
    "",
    "## Compile a layout",
    "",
    "```bash",
    "npx mjml layouts/mjml/saas-welcome-system.mjml -o layouts/html/saas-welcome-system.html",
    "```",
    "",
    "## Compile an example",
    "",
    "```bash",
    "npx mjml examples/mjml/weekly-newsletter.mjml -o examples/html/weekly-newsletter.html",
    "```",
    "",
    "## Recommended starting points",
    "",
    "- Start from `examples/` when you need a finished email skeleton quickly.",
    "- Start from `layouts/` when you know the system you want but expect heavier customisation.",
    "- Start from `components/` when you only need to swap or assemble a few blocks.",
    "",
  ].join("\n");
}

function buildCustomisationDoc(): string {
  return [
    "# Customisation",
    "",
    "## Safe customisation rules",
    "",
    "- Edit MJML first, not compiled HTML, whenever you expect future changes.",
    "- Keep wrapper widths and section padding conservative unless you have tested Outlook carefully.",
    "- Replace placeholder image URLs with absolute HTTPS assets hosted somewhere stable.",
    "- Keep CTA text descriptive and keep legal footer copy aligned with your own compliance requirements.",
    "",
    "## Editing components",
    "",
    "Use components when you need to adjust one reusable block without changing the whole email structure. This is the safest way to build internal variants.",
    "",
    "## Editing layouts",
    "",
    "Use layouts when you want to preserve a proven block order but change copy, imagery, or destination URLs.",
    "",
    "## Editing examples",
    "",
    "Use examples when you need to hand a complete email to another developer, marketer, or QA reviewer as a starting point.",
    "",
    "## Avoid",
    "",
    "- Swapping in CSS features that are known to be weak in Outlook without re-testing.",
    "- Turning short lifecycle or transactional templates into long marketing emails without rethinking hierarchy.",
    "- Relying on images to carry critical meaning that should exist in text.",
    "",
  ].join("\n");
}

function buildEspHandoffDoc(): string {
  return [
    "# ESP Handoff",
    "",
    "## When to use compiled HTML",
    "",
    "Use the compiled HTML files when your ESP, QA workflow, or approvals process expects final markup rather than editable MJML.",
    "",
    "## Image hosting",
    "",
    "- Host images on stable HTTPS URLs before production send.",
    "- Avoid hotlinking unstable preview or staging assets.",
    "- Keep file sizes reasonable so the email loads cleanly in webmail and mobile clients.",
    "",
    "## QA checklist",
    "",
    "- Check Gmail web and mobile.",
    "- Check Outlook desktop for spacing, grouping, and button fallbacks.",
    "- Check Apple Mail for dark-mode side effects if you use darker sections.",
    "- Confirm footer links, support contacts, and unsubscribe or preference handling.",
    "",
    "## ESP notes",
    "",
    "- MJML already handles the heavy lifting of email-safe structure and inlined styles for the compiled output.",
    "- Keep the HTML untouched where possible once it has passed QA.",
    "- If your ESP rewrites links or injects tracking, re-test the final send rather than trusting the local preview alone.",
    "",
  ].join("\n");
}

function buildLayoutSystemsDoc(
  systems: EmailLayoutSystem[],
  layouts: EmailLayoutRecipe[],
  examples: EmailExampleImplementation[],
): string {
  return [
    "# Layout Systems",
    "",
    "These systems show how the component library turns into complete production email flows.",
    "",
    ...systems.flatMap((system) => {
      const systemLayouts = layouts.filter((layout) => layout.system === system.slug);
      const systemExamples = examples.filter((example) => example.system === system.slug);

      return [
        `## ${system.title}`,
        "",
        system.description,
        "",
        "### Included layouts",
        "",
        ...systemLayouts.map((layout) => `- ${layout.title} (layouts/mjml/${layout.slug}.mjml)`),
        "",
        ...(systemExamples.length > 0
          ? [
              "### Included examples",
              "",
              ...systemExamples.map(
                (example) => `- ${example.title} (examples/mjml/${example.slug}.mjml)`,
              ),
              "",
            ]
          : []),
      ];
    }),
  ].join("\n");
}

function buildMjmlConfig(): string {
  return `${JSON.stringify(
    {
      options: {
        validationLevel: "strict",
        minify: false,
        keepComments: true,
        beautify: true,
      },
      fonts: {
        Manrope:
          "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap",
        Inter:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      notes: [
        "Copy or rename this file to .mjmlconfig if your local toolchain expects the dotfile form.",
        "Replace project fonts if your design system requires locally hosted alternatives.",
      ],
    },
    null,
    2,
  )}\n`;
}

function getPreviewSourcePath(previewImageUrl: string): string {
  const trimmed = previewImageUrl.trim();
  const relativePath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return path.join(PUBLIC_DIR, relativePath);
}

function withTrailingNewline(value: string): string {
  return value.endsWith("\n") ? value : `${value}\n`;
}

/**
 * Transform an item's mjmlSource into the requested tier dialect, then compile it on the
 * TRUSTED build path to produce the HTML twin that ships beside it.
 *
 * For Enterprise, the dialect emits an `<mj-include path="./head.mjml" />`. We materialise
 * the transformed source and the shared head.mjml side by side in a temp dir so mjml can
 * resolve the include at build time (ignoreIncludes:false via compileMjml's trusted path).
 * The same head.mjml is written into each tier folder of the ZIP by addSharedHeadAssets.
 */
async function transformAndCompile(
  packId: DownloadPackId,
  slug: string,
  mjmlSource: string,
): Promise<{ dialectSource: string; compiledHtml: string }> {
  const dialectSource = toDialect(packId, mjmlSource);

  let compiledHtml: string;
  if (packId !== "enterprise") {
    compiledHtml = await compileMjml(dialectSource, { trusted: true });
  } else {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), `th-pack-${packId}-`));
    try {
      const mainPath = path.join(dir, `${slug}.mjml`);
      await fs.writeFile(mainPath, dialectSource, "utf8");
      await fs.writeFile(
        path.join(dir, ENTERPRISE_SHARED_HEAD_FILENAME),
        buildEnterpriseSharedHead(),
        "utf8",
      );
      compiledHtml = await compileMjml(dialectSource, { trusted: true, filePath: mainPath });
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  return { dialectSource, compiledHtml };
}

async function addComponentAssets(
  archive: archiver.Archiver,
  packId: DownloadPackId,
  component: EmailComponent,
): Promise<void> {
  if (!component.previewImageUrl.toLowerCase().endsWith(".png")) {
    throw new Error(`[build-pack] Preview for "${component.slug}" must be a PNG image.`);
  }

  const previewSourcePath = getPreviewSourcePath(component.previewImageUrl);
  await fs.access(previewSourcePath);

  const { dialectSource, compiledHtml } = await transformAndCompile(
    packId,
    component.slug,
    component.mjmlSource,
  );

  archive.append(withTrailingNewline(dialectSource), {
    name: `components/mjml/${component.slug}.mjml`,
  });
  archive.append(withTrailingNewline(compiledHtml), {
    name: `components/html/${component.slug}.html`,
  });
  archive.file(previewSourcePath, {
    name: `components/previews/${component.slug}.png`,
  });
}

async function addLayoutAssets(
  archive: archiver.Archiver,
  packId: DownloadPackId,
  layout: EmailLayoutRecipe,
): Promise<void> {
  const { dialectSource, compiledHtml } = await transformAndCompile(
    packId,
    layout.slug,
    layout.mjmlSource,
  );

  archive.append(withTrailingNewline(dialectSource), {
    name: `layouts/mjml/${layout.slug}.mjml`,
  });
  archive.append(withTrailingNewline(compiledHtml), {
    name: `layouts/html/${layout.slug}.html`,
  });
}

async function addExampleAssets(
  archive: archiver.Archiver,
  packId: DownloadPackId,
  example: EmailExampleImplementation,
): Promise<void> {
  const { dialectSource, compiledHtml } = await transformAndCompile(
    packId,
    example.slug,
    example.mjmlSource,
  );

  archive.append(withTrailingNewline(dialectSource), {
    name: `examples/mjml/${example.slug}.mjml`,
  });
  archive.append(withTrailingNewline(compiledHtml), {
    name: `examples/html/${example.slug}.html`,
  });
}

// ---------------------------------------------------------------------------
// Enterprise framework deliverable
// ---------------------------------------------------------------------------
// Enterprise's value is the FRAMEWORK: a single source of truth (shared head +
// design-token registry), an assembler that restyles the whole set from one place,
// and a curated layout add-on inclusion mechanism. The per-file <mj-include
// path="./head.mjml" /> emitted by the Enterprise dialect is satisfied by writing the
// shared head into each tier folder below.

const ENTERPRISE_TOKEN_REGISTRY = {
  description:
    "Canonical design-token registry. Edit these values (or the shared head.mjml) to restyle every Enterprise template at once. Mirrors src/data/mjml-library.ts in the product source.",
  fonts: {
    base: "'Manrope', 'Inter', Arial, sans-serif",
    body: "'Inter', Arial, sans-serif",
  },
  elementDefaults: MJML_ELEMENT_DEFAULTS,
  classTokens: MJML_CLASS_TOKENS,
} as const;

function buildEnterpriseAssemblerScript(): string {
  return `#!/usr/bin/env node
/**
 * Enterprise framework assembler.
 *
 * Compiles every MJML template in this pack to email-safe HTML in one pass, resolving the
 * shared head.mjml include on the trusted local path. Run from the pack root:
 *
 *   npm install mjml
 *   node framework/assemble.mjs
 *
 * Restyle the whole set from ONE place: edit framework/design-tokens.json (reference) and
 * the per-folder head.mjml, then re-run this script.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mjmlModule = require("mjml");
const mjml2html = typeof mjmlModule === "function" ? mjmlModule : mjmlModule.default;

const here = path.dirname(fileURLToPath(import.meta.url));
const packRoot = path.resolve(here, "..");

const folders = ["components", "layouts", "examples"];
let compiled = 0;
let failed = 0;

for (const folder of folders) {
  const mjmlDir = path.join(packRoot, folder, "mjml");
  const htmlDir = path.join(packRoot, folder, "html");
  if (!existsSync(mjmlDir)) continue;
  if (!existsSync(htmlDir)) mkdirSync(htmlDir, { recursive: true });

  for (const file of readdirSync(mjmlDir)) {
    if (!file.endsWith(".mjml") || file === "head.mjml") continue;
    const srcPath = path.join(mjmlDir, file);
    const source = readFileSync(srcPath, "utf8");
    const result = mjml2html(source, {
      validationLevel: "soft",
      keepComments: true,
      minify: false,
      ignoreIncludes: false,
      filePath: srcPath,
    });
    const out = result instanceof Promise ? await result : result;
    if (out.errors && out.errors.length) {
      failed += 1;
      console.error("[assemble] " + folder + "/" + file + ": " + out.errors.length + " error(s)");
      continue;
    }
    writeFileSync(path.join(htmlDir, file.replace(/\\.mjml$/, ".html")), out.html, "utf8");
    compiled += 1;
  }
}

console.log("Assembled " + compiled + " template(s)" + (failed ? ", " + failed + " failed" : ""));
if (failed) process.exit(1);
`;
}

function buildEnterpriseFrameworkReadme(): string {
  return [
    "# Enterprise Framework",
    "",
    "This pack is not just templates — it is a small framework for producing and restyling a",
    "whole email system from one source of truth.",
    "",
    "## What's in here",
    "",
    "- `components/mjml/head.mjml`, `layouts/mjml/head.mjml`, `examples/mjml/head.mjml` — the",
    "  SHARED head. Each template pulls it in with `<mj-include path=\"./head.mjml\" />`. Edit one",
    "  place to change the shared `<mj-style>` (responsive + dark-mode guard + helper classes).",
    "- `framework/design-tokens.json` — the canonical design-token registry (fonts, element",
    "  defaults, named class tokens). The same tokens are inlined onto every element in each",
    "  template, so rendering stays robust even where a client ignores `<style>`.",
    "- `framework/assemble.mjs` — recompiles every template to HTML in one pass, resolving the",
    "  shared head include locally.",
    "- `add-ons/manifest.json` — the curated layout add-on inclusion mechanism (see below).",
    "",
    "## Restyle everything from one place",
    "",
    "1. Edit the shared `head.mjml` (shared `<mj-style>`) and/or the brand colours/fonts in your",
    "   templates' inline tokens (see `framework/design-tokens.json` for the canonical values).",
    "2. Re-run the assembler:",
    "",
    "```bash",
    "npm install mjml",
    "node framework/assemble.mjs",
    "```",
    "",
    "3. The `*/html/` twins are regenerated, ready for QA and ESP handoff.",
    "",
    "## Why tokens are ALSO inlined per element",
    "",
    "Brand fonts/colours are written as inline attributes on every element (not only via the",
    "shared `<mj-style>`). That is deliberate: many clients drop `<style>`, so the inline tokens",
    "are what guarantee consistent rendering. The shared head/`<mj-style>` is additive — it",
    "carries the responsive breakpoint and the dark-mode CTA guard.",
    "",
    "## Curated layout add-ons",
    "",
    "`add-ons/manifest.json` lists the curated, production-checked layout add-ons bundled with",
    "this Enterprise pack. Add-on CONTENT is curated separately; a template only ships once it",
    "passes the same compile + robustness gate as the core set. When add-ons are present, their",
    "MJML lands in `add-ons/mjml/` with compiled twins in `add-ons/html/`.",
    "",
  ].join("\n");
}

/**
 * Curated layout add-on inclusion mechanism. The CONTENT is a separate follow-up: an add-on
 * only ships once it passes the same compile + robustness gate as the core set. Until then
 * the manifest is the mechanism, declaring zero curated add-ons (the raw private add-ons are
 * known to contain placeholder copy and are intentionally NOT shipped).
 */
const CURATED_ADDON_SLUGS: readonly string[] = [];

function buildAddonManifest(): string {
  const curated = readyLayoutAddons.filter((addon) =>
    CURATED_ADDON_SLUGS.includes(addon.slug),
  );
  const manifest = {
    description:
      "Curated layout add-ons bundled with the Enterprise pack. An add-on is listed here only after it passes the same compile + robustness gate as the core templates. Files live under add-ons/mjml and add-ons/html.",
    curatedCount: curated.length,
    availableForCurationCount: readyLayoutAddons.length,
    addOns: curated.map((addon) => ({
      slug: addon.slug,
      title: addon.title,
      description: addon.description,
      mjmlPath: `add-ons/mjml/${addon.slug}.mjml`,
      htmlPath: `add-ons/html/${addon.slug}.html`,
    })),
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function addEnterpriseFrameworkAssets(archive: archiver.Archiver): void {
  const sharedHead = buildEnterpriseSharedHead();
  // Place the shared head beside each tier's MJML so the relative `./head.mjml` include resolves.
  for (const folder of ["components", "layouts", "examples"]) {
    archive.append(withTrailingNewline(sharedHead), {
      name: `${folder}/mjml/${ENTERPRISE_SHARED_HEAD_FILENAME}`,
    });
  }

  archive.append(`${JSON.stringify(ENTERPRISE_TOKEN_REGISTRY, null, 2)}\n`, {
    name: "framework/design-tokens.json",
  });
  archive.append(buildEnterpriseAssemblerScript(), { name: "framework/assemble.mjs" });
  archive.append(buildEnterpriseFrameworkReadme(), { name: "framework/README.md" });

  // Curated layout add-on inclusion mechanism (content is a separate follow-up step).
  archive.append(buildAddonManifest(), { name: "add-ons/manifest.json" });
}

async function buildPack(packId: DownloadPackId): Promise<void> {
  await fs.mkdir(path.join(PROJECT_ROOT, MJML_PACK_PRIVATE_DIR), {
    recursive: true,
  });

  const outputPath = getMjmlPackAbsolutePath(PROJECT_ROOT, packId);
  const packContent = resolvePackContent(packId);
  const output = createWriteStream(outputPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  archive.on("warning", (error: Error & { code?: string }) => {
    if (error.code !== "ENOENT") {
      throw error;
    }
  });

  const archiveErrorPromise = once(archive, "error").then(([error]) => {
    throw error as Error;
  });
  const outputErrorPromise = once(output, "error").then(([error]) => {
    throw error as Error;
  });
  const outputClosePromise = once(output, "close");

  const componentsMetadata = packContent.components.map(toPackMetadata);
  const layoutsMetadata = packContent.layouts.map(toLayoutMetadata);
  const examplesMetadata = packContent.examples.map(toExampleMetadata);
  const workflowsMetadata = packContent.workflows.map(toWorkflowMetadata);
  const buildTimestamp = new Date().toISOString();
  const versionManifest: VersionManifest = {
    tier: packId,
    version: PACK_VERSION,
    buildTimestamp,
    lastUpdated: PACK_LAST_UPDATED,
  };

  archive.append(`${JSON.stringify(componentsMetadata, null, 2)}\n`, {
    name: "components/registry.json",
  });
  archive.append(`${JSON.stringify(layoutsMetadata, null, 2)}\n`, {
    name: "layouts/registry.json",
  });
  archive.append(`${JSON.stringify(packContent.systems, null, 2)}\n`, {
    name: "layouts/systems.json",
  });
  archive.append(`${JSON.stringify(examplesMetadata, null, 2)}\n`, {
    name: "examples/registry.json",
  });
  archive.append(`${JSON.stringify(workflowsMetadata, null, 2)}\n`, {
    name: "workflows/registry.json",
  });

  for (const component of packContent.components) {
    await addComponentAssets(archive, packId, component);
  }
  for (const layout of packContent.layouts) {
    await addLayoutAssets(archive, packId, layout);
  }
  for (const example of packContent.examples) {
    await addExampleAssets(archive, packId, example);
  }

  if (packId === "enterprise") {
    addEnterpriseFrameworkAssets(archive);
  }

  archive.append(`${JSON.stringify(versionManifest, null, 2)}\n`, {
    name: "version.json",
  });
  archive.append(`${PACK_VERSION}\n`, { name: "VERSION" });
  archive.append(buildChangelogMarkdown(), { name: "CHANGELOG.md" });
  archive.append(
    buildReadme(
      packId,
      packContent.components.length,
      packContent.layouts.length,
      packContent.examples.length,
      packContent.systems.length,
      packContent.workflows.length,
      buildTimestamp,
    ),
    { name: "README.md" },
  );
  archive.append(buildLicense(packId), { name: "LICENSE.txt" });
  archive.append(buildMjmlConfig(), { name: "mjml.config" });
  archive.append(buildGettingStartedDoc(packId), { name: "docs/getting-started.md" });
  archive.append(buildCustomisationDoc(), { name: "docs/customisation.md" });
  archive.append(buildEspHandoffDoc(), { name: "docs/esp-handoff.md" });
  archive.append(
    buildLayoutSystemsDoc(packContent.systems, packContent.layouts, packContent.examples),
    { name: "docs/layout-systems.md" },
  );

  await archive.finalize();

  await Promise.race([outputClosePromise, archiveErrorPromise, outputErrorPromise]);

  process.stdout.write(
    `Built ${getPackDisplayName(packId)} archive ${getMjmlPackFilename(packId)} at ${outputPath}\n`,
  );
}

async function buildAllPacks(): Promise<void> {
  for (const packId of PACK_IDS) {
    await buildPack(packId);
  }
}

buildAllPacks().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown build failure";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
