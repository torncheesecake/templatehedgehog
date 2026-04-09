import { createWriteStream, promises as fs } from "node:fs";
import { once } from "node:events";
import path from "node:path";
import archiver from "archiver";
import { type EmailComponent, emailComponents } from "../src/data/email-components";
import { compiledComponentsBySlug } from "../src/data/email-components/compiled";
import { type EmailExampleImplementation, emailExamples } from "../src/data/email-examples";
import { compiledExamplesBySlug } from "../src/data/email-examples/compiled";
import {
  type EmailLayoutRecipe,
  type EmailLayoutSystem,
  emailLayouts,
  emailLayoutSystems,
} from "../src/data/email-layouts";
import { compiledLayoutHtmlBySlug } from "../src/data/email-layouts/compiled";
import {
  MJML_PACK_LICENSE_POINTS,
  MJML_PACK_NAME,
  MJML_PACK_PRIVATE_DIR,
  MJML_PACK_PROJECT_STRUCTURE,
  getMjmlPackAbsolutePath,
} from "../src/lib/pack";
import { CHANGELOG, PACK_LAST_UPDATED, PACK_VERSION } from "../src/lib/versioning";
import { TEMPLATE_CONFIG } from "../src/config/template";

type PackComponentMetadata = Omit<EmailComponent, "mjmlSource">;
type PackLayoutMetadata = Omit<EmailLayoutRecipe, "mjmlSource">;
type PackExampleMetadata = Omit<EmailExampleImplementation, "mjmlSource">;

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const outputPath = getMjmlPackAbsolutePath(PROJECT_ROOT);

type VersionManifest = {
  version: string;
  buildTimestamp: string;
  lastUpdated: string;
};

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

function buildReadme(
  componentCount: number,
  layoutCount: number,
  exampleCount: number,
  systemCount: number,
  buildTimestamp: string,
): string {
  return [
    `# ${MJML_PACK_NAME}`,
    "",
    `${MJML_PACK_NAME} is the downloadable MJML project that sits behind the ${TEMPLATE_CONFIG.brandName} public reference library.`,
    "",
    `Pack version: ${PACK_VERSION}`,
    `Build timestamp (UTC): ${buildTimestamp}`,
    `Last updated: ${PACK_LAST_UPDATED}`,
    "",
    "## What this archive is",
    "",
    `- ${componentCount} reusable MJML components organised in a working project structure`,
    `- ${layoutCount} full layouts grouped into ${systemCount} practical email systems`,
    `- ${exampleCount} example emails you can compile, customise, or hand to a teammate as a starting point`,
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

function buildLicense(): string {
  return [
    `${TEMPLATE_CONFIG.brandName} Pack Licence`,
    "",
    "This pack is licensed for paid commercial use under the purchase terms.",
    "",
    ...MJML_PACK_LICENSE_POINTS.map((line) => `- ${line}`),
    "",
    `All rights reserved by ${TEMPLATE_CONFIG.brandName}.`,
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

function buildGettingStartedDoc(): string {
  return [
    "# Getting Started",
    "",
    `Use ${MJML_PACK_NAME} as a local MJML project rather than a loose archive of snippets.`,
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

async function addComponentAssets(
  archive: archiver.Archiver,
  component: EmailComponent,
): Promise<void> {
  const compiledHtml = compiledComponentsBySlug[component.slug];
  if (!compiledHtml) {
    throw new Error(
      `[build-pack] Missing compiled HTML for "${component.slug}". Run npm run build:components first.`,
    );
  }

  if (!component.previewImageUrl.toLowerCase().endsWith(".png")) {
    throw new Error(`[build-pack] Preview for "${component.slug}" must be a PNG image.`);
  }

  const previewSourcePath = getPreviewSourcePath(component.previewImageUrl);
  await fs.access(previewSourcePath);

  archive.append(
    component.mjmlSource.endsWith("\n") ? component.mjmlSource : `${component.mjmlSource}\n`,
    { name: `components/mjml/${component.slug}.mjml` },
  );

  archive.append(compiledHtml.endsWith("\n") ? compiledHtml : `${compiledHtml}\n`, {
    name: `components/html/${component.slug}.html`,
  });

  archive.file(previewSourcePath, {
    name: `components/previews/${component.slug}.png`,
  });
}

async function addLayoutAssets(
  archive: archiver.Archiver,
  layout: EmailLayoutRecipe,
): Promise<void> {
  const compiledHtml = compiledLayoutHtmlBySlug[layout.slug];
  if (!compiledHtml) {
    throw new Error(
      `[build-pack] Missing compiled layout HTML for "${layout.slug}". Run npm run build:layouts first.`,
    );
  }

  archive.append(layout.mjmlSource.endsWith("\n") ? layout.mjmlSource : `${layout.mjmlSource}\n`, {
    name: `layouts/mjml/${layout.slug}.mjml`,
  });

  archive.append(compiledHtml.endsWith("\n") ? compiledHtml : `${compiledHtml}\n`, {
    name: `layouts/html/${layout.slug}.html`,
  });
}

async function addExampleAssets(
  archive: archiver.Archiver,
  example: EmailExampleImplementation,
): Promise<void> {
  const compiledHtml = compiledExamplesBySlug[example.slug];
  if (!compiledHtml) {
    throw new Error(
      `[build-pack] Missing compiled example HTML for "${example.slug}". Run npm run build:examples first.`,
    );
  }

  archive.append(example.mjmlSource.endsWith("\n") ? example.mjmlSource : `${example.mjmlSource}\n`, {
    name: `examples/mjml/${example.slug}.mjml`,
  });

  archive.append(compiledHtml.endsWith("\n") ? compiledHtml : `${compiledHtml}\n`, {
    name: `examples/html/${example.slug}.html`,
  });
}

async function buildPack(): Promise<void> {
  await fs.mkdir(path.join(PROJECT_ROOT, MJML_PACK_PRIVATE_DIR), {
    recursive: true,
  });

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

  const componentsMetadata = emailComponents.map(toPackMetadata);
  const layoutsMetadata = emailLayouts.map(toLayoutMetadata);
  const examplesMetadata = emailExamples.map(toExampleMetadata);
  const buildTimestamp = new Date().toISOString();
  const versionManifest: VersionManifest = {
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
  archive.append(`${JSON.stringify(emailLayoutSystems, null, 2)}\n`, {
    name: "layouts/systems.json",
  });
  archive.append(`${JSON.stringify(examplesMetadata, null, 2)}\n`, {
    name: "examples/registry.json",
  });

  for (const component of emailComponents) {
    await addComponentAssets(archive, component);
  }
  for (const layout of emailLayouts) {
    await addLayoutAssets(archive, layout);
  }
  for (const example of emailExamples) {
    await addExampleAssets(archive, example);
  }

  archive.append(`${JSON.stringify(versionManifest, null, 2)}\n`, {
    name: "version.json",
  });
  archive.append(`${PACK_VERSION}\n`, { name: "VERSION" });
  archive.append(buildChangelogMarkdown(), { name: "CHANGELOG.md" });
  archive.append(
    buildReadme(
      emailComponents.length,
      emailLayouts.length,
      emailExamples.length,
      emailLayoutSystems.length,
      buildTimestamp,
    ),
    { name: "README.md" },
  );
  archive.append(buildLicense(), { name: "LICENSE.txt" });
  archive.append(buildMjmlConfig(), { name: "mjml.config" });
  archive.append(buildGettingStartedDoc(), { name: "docs/getting-started.md" });
  archive.append(buildCustomisationDoc(), { name: "docs/customisation.md" });
  archive.append(buildEspHandoffDoc(), { name: "docs/esp-handoff.md" });
  archive.append(
    buildLayoutSystemsDoc(emailLayoutSystems, emailLayouts, emailExamples),
    { name: "docs/layout-systems.md" },
  );

  await archive.finalize();

  await Promise.race([outputClosePromise, archiveErrorPromise, outputErrorPromise]);

  process.stdout.write(`Built ${MJML_PACK_NAME} archive at ${outputPath}\n`);
}

buildPack().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown build failure";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
