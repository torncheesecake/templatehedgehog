import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

type ReadyLayoutAddonRecord = {
  slug: string;
  title: string;
  description: string;
  sourceFolder: string;
  sourceFile: string;
  previewImageUrl: string | null;
  mjmlPath: string;
  sourceBlocks: string[];
  packComponentSlugs: string[];
};

const PROJECT_ROOT = process.cwd();
const DEFAULT_MARKETING_ROOT = path.join(
  PROJECT_ROOT,
  "private",
  "marketing-email-templates",
);
const MARKETING_ROOT =
  process.env.MARKETING_EMAIL_TEMPLATES_ROOT
  ?? DEFAULT_MARKETING_ROOT;

const OUTPUT_MJML_DIR = path.join(PROJECT_ROOT, "private", "layout-addons", "mjml");
const OUTPUT_PREVIEW_DIR = path.join(PROJECT_ROOT, "public", "layout-addons-previews");
const OUTPUT_DATA_DIR = path.join(PROJECT_ROOT, "src", "data", "layout-addons");
const OUTPUT_DATA_FILE = path.join(OUTPUT_DATA_DIR, "generated.ts");
const OUTPUT_INDEX_FILE = path.join(OUTPUT_DATA_DIR, "index.ts");

const EXCLUDED_FOLDERS = new Set([".claude", ".vscode", "_archive-dyson", "Logos"]);

const IMAGE_FILE_REGEX = /\.(png|jpe?g|webp|gif)$/i;
const LOREM_TEXT_SAMPLES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lacus sed mauris tristique aliquet.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
];

const BRAND_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bERP Experts Europe\b/gi, "Your Brand"],
  [/\bERP Experts\b/gi, "Your Brand"],
  [/\bDyson\b/gi, "Your Brand"],
  [/\bNetSuite\b/gi, "Your Product"],
  [/\bOracle\b/gi, "Your Platform"],
  [/\bAlgorIQ\b/gi, "Your Brand"],
  [/\bERP\b/gi, "Your Business"],
];

const URL_PLACEHOLDER = "https://example.com";
const IMAGE_PLACEHOLDER = "https://placehold.co/1200x600/png?text=Template+Image";
const PACK_COMPONENT_SLUGS = [
  "header-brand-row",
  "hero-overlay-modern",
  "hero-image-left",
  "dual-image-feature-grid",
  "quad-image-showcase",
  "logo-grid-trust-strip",
  "accent-cta-button",
  "single-image-left",
  "testimonial-quote",
  "footer-contact-compliance",
] as const;

const HEADER_INCLUDE_BASENAMES = new Set([
  "header.mjml",
  "header-black-e3.mjml",
  "header-e3-center.mjml",
  "header-blue-e3.mjml",
  "header-black.mjml",
  "header-superlight.mjml",
  "header-logoright.mjml",
  "header-nologo.mjml",
  "header-nologo-black.mjml",
]);

const FOOTER_INCLUDE_BASENAMES = new Set([
  "footer.mjml",
  "footer-new-22.mjml",
  "new-footer-22.mjml",
  "footer-24-white.mjml",
  "footer-social.mjml",
  "footer-black.mjml",
  "footer-onboarding.mjml",
  "footer-german.mjml",
  "footer-white-au.mjml",
  "footer-nostores.mjml",
  "megafooter-4-col-dark.mjml",
]);

const IGNORED_INCLUDE_BASENAMES = new Set([
  "styles.mjml",
  "styles_jp.mjml",
  "custom_styles.mjml",
  "styles_dyson.mjml.mjml",
  "styles-repairsummary.mjml",
  "styles-sap.mjml",
]);

function getBasenameFromIncludePath(includePath: string): string {
  const sanitisedPath = includePath.split("?")[0];
  const lastSlashIndex = Math.max(
    sanitisedPath.lastIndexOf("/"),
    sanitisedPath.lastIndexOf("\\"),
  );

  return lastSlashIndex >= 0
    ? sanitisedPath.slice(lastSlashIndex + 1).toLowerCase()
    : sanitisedPath.toLowerCase();
}

function extractIncludeBasenames(source: string): string[] {
  const seen = new Set<string>();
  const includeRegex = /<mj-include\s+[^>]*path=["']([^"']+)["'][^>]*\/?>/gi;
  let match = includeRegex.exec(source);

  while (match) {
    const basename = getBasenameFromIncludePath(match[1]);
    if (!IGNORED_INCLUDE_BASENAMES.has(basename)) {
      seen.add(basename);
    }
    match = includeRegex.exec(source);
  }

  return [...seen];
}

function normaliseCommentBlockName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/\*+/g, "")
    .replace(/\.+/g, ".")
    .trim();
}

function extractCommentBlockNames(source: string): string[] {
  const seen = new Set<string>();
  const commentRegex = /#-START-#\s*([^<\n\r-][^<\n\r]*?)(?:\s*-->|$)/gi;
  let match = commentRegex.exec(source);

  while (match) {
    const name = normaliseCommentBlockName(match[1]);
    if (name.length > 0) {
      seen.add(name);
    }
    match = commentRegex.exec(source);
  }

  return [...seen];
}

function detectPackComponentSlugs(
  source: string,
  includeBasenames: string[],
  commentBlockNames: string[],
): string[] {
  const lowerSource = source.toLowerCase();
  const buttonCount = (lowerSource.match(/<mj-button\b/g) ?? []).length;
  const firstImageIndex = lowerSource.indexOf("<mj-image");
  const nearTopHasImage = firstImageIndex >= 0 && firstImageIndex < 2200;

  const matched = new Set<string>();
  const includeSet = new Set(includeBasenames);
  const lowerCommentNames = commentBlockNames.map((name) => name.toLowerCase());

  const hasAnyCommentMatch = (pattern: RegExp): boolean =>
    lowerCommentNames.some((name) => pattern.test(name));

  for (const basename of includeSet) {
    if (HEADER_INCLUDE_BASENAMES.has(basename)) {
      matched.add("header-brand-row");
    }
    if (FOOTER_INCLUDE_BASENAMES.has(basename)) {
      matched.add("footer-contact-compliance");
    }

    if (basename === "hero-overlay-modern.mjml") {
      matched.add("hero-overlay-modern");
    }
    if (basename === "hero-centred.mjml") {
      matched.add("hero-overlay-modern");
    }
    if (
      basename === "hero-image-left.mjml"
      || basename === "hero-image-right.mjml"
      || basename === "hero-centered-text-left.mjml"
    ) {
      matched.add("hero-image-left");
    }
    if (basename === "text-left.mjml") {
      matched.add("hero-image-left");
    }
    if (basename === "dual-image.mjml") {
      matched.add("dual-image-feature-grid");
    }
    if (basename === "quad-image.mjml") {
      matched.add("quad-image-showcase");
    }
    if (basename === "text-centred.mjml") {
      matched.add("quad-image-showcase");
    }
    if (basename === "logo-grid.mjml") {
      matched.add("logo-grid-trust-strip");
    }
    if (basename === "single-image-right.mjml") {
      matched.add("logo-grid-trust-strip");
    }
    if (
      basename === "accent-cta.mjml"
      || basename === "primary-cta.mjml"
      || basename === "dual-cta.mjml"
    ) {
      matched.add("accent-cta-button");
    }
    if (
      basename === "single-image-left.mjml"
      || basename === "alert-box.mjml"
    ) {
      matched.add("single-image-left");
    }
    if (basename === "testimonial.mjml") {
      matched.add("testimonial-quote");
    }
  }

  if (hasAnyCommentMatch(/header/)) {
    matched.add("header-brand-row");
  }
  if (hasAnyCommentMatch(/footer|megafooter/)) {
    matched.add("footer-contact-compliance");
  }
  if (hasAnyCommentMatch(/hero overlay/)) {
    matched.add("hero-overlay-modern");
  }
  if (
    hasAnyCommentMatch(
      /hero image left|hero image right|single image left|single image right|edge image left|edge image right|text left/,
    )
  ) {
    matched.add("hero-image-left");
  }
  if (hasAnyCommentMatch(/dual image/)) {
    matched.add("dual-image-feature-grid");
  }
  if (hasAnyCommentMatch(/quad image/)) {
    matched.add("quad-image-showcase");
  }
  if (hasAnyCommentMatch(/logo grid/)) {
    matched.add("logo-grid-trust-strip");
  }
  if (hasAnyCommentMatch(/single image right/)) {
    matched.add("logo-grid-trust-strip");
  }
  if (hasAnyCommentMatch(/text centred|text centered/)) {
    matched.add("quad-image-showcase");
  }
  if (hasAnyCommentMatch(/primary call to action|centred cta|left aligned cta/)) {
    matched.add("accent-cta-button");
  }
  if (hasAnyCommentMatch(/single image left|notice alert box/)) {
    matched.add("single-image-left");
  }
  if (hasAnyCommentMatch(/testimonial|review centred|review image/)) {
    matched.add("testimonial-quote");
  }

  // Conservative structural fallbacks for older templates that are fully inlined.
  if (!matched.has("hero-overlay-modern") && /<mj-hero\b/i.test(source)) {
    matched.add("hero-overlay-modern");
  }

  if (
    !matched.has("hero-image-left")
    && /<mj-section[^>]*direction=["']rtl["'][^>]*>/i.test(source)
    && /<mj-button\b/i.test(source)
  ) {
    matched.add("hero-image-left");
  }

  if (
    !matched.has("dual-image-feature-grid")
    && /<mj-section[\s\S]{0,1800}<mj-column[^>]*>[\s\S]{0,700}<mj-image[\s\S]{0,700}<mj-text[\s\S]{0,1500}<mj-column[^>]*>[\s\S]{0,700}<mj-image[\s\S]{0,700}<mj-text/i.test(source)
  ) {
    matched.add("dual-image-feature-grid");
  }

  if (
    !matched.has("quad-image-showcase")
    && (source.match(/<mj-column[^>]*width=["']25%["'][^>]*>/gi) ?? []).length >= 4
    && (source.match(/<mj-image\b/gi) ?? []).length >= 4
  ) {
    matched.add("quad-image-showcase");
  }

  if (
    !matched.has("logo-grid-trust-strip")
    && (source.match(/<mj-column[^>]*width=["']50%["'][^>]*>\s*<mj-image/gi) ?? []).length >= 2
  ) {
    matched.add("logo-grid-trust-strip");
  }

  if (
    !matched.has("header-brand-row")
    && nearTopHasImage
  ) {
    matched.add("header-brand-row");
  }

  if (
    !matched.has("footer-contact-compliance")
    && (
      /<mj-social\b/i.test(source)
      || /unsubscribe|all rights reserved|contact us on|telephone:/i.test(source)
    )
  ) {
    matched.add("footer-contact-compliance");
  }

  if (
    !matched.has("accent-cta-button")
    && buttonCount >= 1
  ) {
    matched.add("accent-cta-button");
  }

  if (
    !matched.has("single-image-left")
    && /service disruption|important notice|account alert|critical update/i.test(source)
  ) {
    matched.add("single-image-left");
  }

  return PACK_COMPONENT_SLUGS.filter((slug) => matched.has(slug));
}

function slugify(value: string): string {
  const normalised = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalised || "layout-addon";
}

function titleCaseFromFolder(folderName: string): string {
  return folderName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function hashContent(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function withUniqueSlug(baseSlug: string, seen: Set<string>): string {
  if (!seen.has(baseSlug)) {
    seen.add(baseSlug);
    return baseSlug;
  }

  let suffix = 2;
  while (seen.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  const uniqueSlug = `${baseSlug}-${suffix}`;
  seen.add(uniqueSlug);
  return uniqueSlug;
}

function replaceMjTextContent(source: string): string {
  let sampleIndex = 0;

  return source.replace(
    /<mj-text\b([^>]*)>[\s\S]*?<\/mj-text>/gi,
    (_fullMatch, attributes: string) => {
      const nextText = LOREM_TEXT_SAMPLES[sampleIndex % LOREM_TEXT_SAMPLES.length];
      sampleIndex += 1;
      return `<mj-text${attributes}>${nextText}</mj-text>`;
    },
  );
}

function sanitiseMjml(source: string): string {
  let output = source;

  for (const [pattern, replacement] of BRAND_REPLACEMENTS) {
    output = output.replace(pattern, replacement);
  }

  output = output.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "hello@yourbrand.com",
  );

  output = output.replace(/\+?\d[\d()\s.-]{7,}\d/g, "+44 0000 000000");
  output = output.replace(/https?:\/\/[^\s"'<>)]+/gi, URL_PLACEHOLDER);

  output = output.replace(
    /(src|background-url)=(["'])(?!https?:\/\/|data:|{{)([^"']+\.(?:png|jpe?g|webp|gif|svg))\2/gi,
    (_fullMatch, attribute: string, quote: string) =>
      `${attribute}=${quote}${IMAGE_PLACEHOLDER}${quote}`,
  );

  output = output.replace(
    /<mj-button\b([^>]*)>[\s\S]*?<\/mj-button>/gi,
    "<mj-button$1>Call to action</mj-button>",
  );

  output = replaceMjTextContent(output);

  return output.endsWith("\n") ? output : `${output}\n`;
}

async function getTopLevelCandidateFolders(rootDir: string): Promise<string[]> {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !EXCLUDED_FOLDERS.has(name))
    .sort((left, right) => left.localeCompare(right));
}

async function listMjmlFilesInFolder(folderPath: string): Promise<string[]> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mjml"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function pickPrimaryMjmlFile(fileNames: string[]): string {
  const exactIndex = fileNames.find((name) => name.toLowerCase() === "index.mjml");
  if (exactIndex) {
    return exactIndex;
  }

  if (fileNames.length === 1) {
    return fileNames[0];
  }

  const indexedVariant = fileNames.find((name) =>
    name.toLowerCase().startsWith("index"),
  );

  return indexedVariant ?? fileNames[0];
}

async function pickPreviewImageFile(folderPath: string): Promise<string | null> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && IMAGE_FILE_REGEX.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    return null;
  }

  const desktopPreview = files.find((name) =>
    /^index-desktop\.(png|jpe?g|webp|gif)$/i.test(name),
  );

  if (desktopPreview) {
    return desktopPreview;
  }

  const genericIndex = files.find((name) => /^index\./i.test(name));
  return genericIndex ?? files[0];
}

async function ensureOutputDirectories(): Promise<void> {
  await fs.mkdir(OUTPUT_MJML_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_PREVIEW_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DATA_DIR, { recursive: true });
}

async function writeDataModule(
  records: ReadyLayoutAddonRecord[],
  sourceFolderCount: number,
  processedTemplateCount: number,
  skippedDuplicateCount: number,
): Promise<void> {
  const moduleContent = `/* Auto-generated by scripts/build-layout-addons.ts. Do not edit manually. */

export type ReadyLayoutAddon = {
  slug: string;
  title: string;
  description: string;
  sourceFolder: string;
  sourceFile: string;
  previewImageUrl: string | null;
  mjmlPath: string;
  sourceBlocks: string[];
  packComponentSlugs: string[];
};

export const READY_LAYOUT_ADDON_SOURCE_FOLDER_COUNT = ${sourceFolderCount};
export const READY_LAYOUT_ADDON_SOURCE_TEMPLATE_COUNT = ${processedTemplateCount};
export const READY_LAYOUT_ADDON_DUPLICATE_TEMPLATE_COUNT = ${skippedDuplicateCount};

export const readyLayoutAddons = ${JSON.stringify(records, null, 2)} as const satisfies readonly ReadyLayoutAddon[];

export const READY_LAYOUT_ADDON_COUNT = readyLayoutAddons.length;

function assertNoDuplicateReadyLayoutSlugs(addons: readonly ReadyLayoutAddon[]): void {
  const seen = new Set<string>();

  for (const addon of addons) {
    if (seen.has(addon.slug)) {
      throw new Error(\`[layout-addons] Duplicate slug found: "\${addon.slug}".\`);
    }
    seen.add(addon.slug);
  }
}

const KNOWN_PACK_COMPONENT_SLUGS = ${JSON.stringify(PACK_COMPONENT_SLUGS)} as const;

function assertKnownPackComponentSlugs(addons: readonly ReadyLayoutAddon[]): void {
  const known = new Set<string>(KNOWN_PACK_COMPONENT_SLUGS);

  for (const addon of addons) {
    for (const componentSlug of addon.packComponentSlugs) {
      if (!known.has(componentSlug)) {
        throw new Error(
          \`[layout-addons] Unknown pack component slug "\${componentSlug}" in "\${addon.slug}".\`,
        );
      }
    }
  }
}

function assertSourceBlocksShape(addons: readonly ReadyLayoutAddon[]): void {
  for (const addon of addons) {
    if (!Array.isArray(addon.sourceBlocks)) {
      throw new Error(
        \`[layout-addons] sourceBlocks must be an array for "\${addon.slug}".\`,
      );
    }
  }
}

assertNoDuplicateReadyLayoutSlugs(readyLayoutAddons);
assertKnownPackComponentSlugs(readyLayoutAddons);
assertSourceBlocksShape(readyLayoutAddons);
`;

  await fs.writeFile(OUTPUT_DATA_FILE, moduleContent, "utf8");
  await fs.writeFile(
    OUTPUT_INDEX_FILE,
    "export * from \"./generated\";\n",
    "utf8",
  );
}

async function cleanOutputDirectories(): Promise<void> {
  await fs.rm(OUTPUT_MJML_DIR, { recursive: true, force: true });
  await fs.rm(OUTPUT_PREVIEW_DIR, { recursive: true, force: true });
}

async function assertMarketingRootExists(): Promise<void> {
  try {
    const stat = await fs.stat(MARKETING_ROOT);
    if (!stat.isDirectory()) {
      throw new Error("Configured source is not a directory.");
    }
  } catch {
    throw new Error(
      [
        `[layout-addons] Source directory not found at "${MARKETING_ROOT}".`,
        "Set MARKETING_EMAIL_TEMPLATES_ROOT to your MJML source folder",
        `or place source files under "${DEFAULT_MARKETING_ROOT}".`,
      ].join(" "),
    );
  }
}

async function buildReadyLayoutAddons(): Promise<void> {
  await assertMarketingRootExists();
  const folderNames = await getTopLevelCandidateFolders(MARKETING_ROOT);
  await cleanOutputDirectories();
  await ensureOutputDirectories();

  const seenSanitisedHashes = new Set<string>();
  const seenSlugs = new Set<string>();
  const records: ReadyLayoutAddonRecord[] = [];

  let processedTemplateCount = 0;
  let skippedDuplicateCount = 0;

  for (const folderName of folderNames) {
    const folderPath = path.join(MARKETING_ROOT, folderName);
    const mjmlFiles = await listMjmlFilesInFolder(folderPath);
    if (mjmlFiles.length === 0) {
      continue;
    }

    const primaryMjmlFile = pickPrimaryMjmlFile(mjmlFiles);
    const sourceFilePath = path.join(folderPath, primaryMjmlFile);
    const sourceMjml = await fs.readFile(sourceFilePath, "utf8");
    const sanitisedMjml = sanitiseMjml(sourceMjml);
    const sanitisedHash = hashContent(sanitisedMjml);
    const includeBasenames = extractIncludeBasenames(sourceMjml);
    const commentBlockNames = extractCommentBlockNames(sourceMjml);
    const sourceBlocks = [...includeBasenames, ...commentBlockNames];
    const packComponentSlugs = detectPackComponentSlugs(
      sourceMjml,
      includeBasenames,
      commentBlockNames,
    );

    processedTemplateCount += 1;

    if (seenSanitisedHashes.has(sanitisedHash)) {
      skippedDuplicateCount += 1;
      continue;
    }
    seenSanitisedHashes.add(sanitisedHash);

    const slug = withUniqueSlug(slugify(folderName), seenSlugs);
    const title = titleCaseFromFolder(folderName);
    const outputMjmlPath = path.join(OUTPUT_MJML_DIR, `${slug}.mjml`);
    await fs.writeFile(outputMjmlPath, sanitisedMjml, "utf8");

    const previewFile = await pickPreviewImageFile(folderPath);
    let previewImageUrl: string | null = null;
    if (previewFile) {
      const extension = path.extname(previewFile).toLowerCase();
      const destinationFileName = `${slug}${extension}`;
      const sourcePreviewPath = path.join(folderPath, previewFile);
      const destinationPreviewPath = path.join(OUTPUT_PREVIEW_DIR, destinationFileName);
      await fs.copyFile(sourcePreviewPath, destinationPreviewPath);
      previewImageUrl = `/layout-addons-previews/${destinationFileName}`;
    }

    records.push({
      slug,
      title,
      description:
        "Debranded ready-to-send MJML layout template. Swap copy, imagery, links, and brand tokens.",
      sourceFolder: folderName,
      sourceFile: primaryMjmlFile,
      previewImageUrl,
      mjmlPath: `/private/layout-addons/mjml/${slug}.mjml`,
      sourceBlocks,
      packComponentSlugs,
    });
  }

  await writeDataModule(
    records,
    folderNames.length,
    processedTemplateCount,
    skippedDuplicateCount,
  );

  process.stdout.write(
    `Prepared ${records.length} ready layout add-on template(s) from ${processedTemplateCount} source template(s) across ${folderNames.length} folders. Skipped ${skippedDuplicateCount} duplicate template(s) by sanitised content.\n`,
  );
}

buildReadyLayoutAddons().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown layout add-on build failure";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
