import { readFileSync } from "node:fs";
import path from "node:path";
import { TEMPLATE_CONFIG } from "@/config/template";
import { applyTemplateTokens } from "@/lib/templateTokens";

const libraryRoot = path.join(
  process.cwd(),
  "src",
  "data",
  "email-components",
  "library",
);

function getLibraryFilePath(fileName: string): string {
  return path.join(libraryRoot, fileName);
}

export function loadMjmlLibraryFragment(fileName: string): string {
  const filePath = getLibraryFilePath(fileName);

  try {
    const content = readFileSync(filePath, "utf8").trim();
    if (!content) {
      throw new Error("file is empty");
    }
    return applyTemplateTokens(content);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[mjml-library] Failed to load fragment "${fileName}" from ${filePath}: ${detail}`,
    );
  }
}

const DEFAULT_PREVIEW_TEXT = `${TEMPLATE_CONFIG.brandNameCompact} — replace this line with a one-sentence inbox summary`;

/**
 * CANONICAL design-token registry — single source of truth.
 *
 * `getMjmlHead` below renders these into the shared <mj-head>, and the tier dialect
 * transform (src/lib/mjml/dialects.ts) reads the SAME maps to resolve mj-class /
 * mj-all tokens into concrete inline attributes. Keep all brand styling here so a
 * restyle is one edit that flows to every template and every tier.
 */

/** Brand font stack applied as the mj-all default (and used as the inline constant). */
export const MJML_BASE_FONT_FAMILY = "'Manrope', 'Inter', Arial, sans-serif";

/** Per-element defaults declared via <mj-all> / per-tag attributes in the shared head. */
export const MJML_ELEMENT_DEFAULTS: Record<string, Record<string, string>> = {
  "mj-all": { "font-family": MJML_BASE_FONT_FAMILY },
  "mj-body": { width: "640px", "background-color": "#f3f4f6" },
  "mj-wrapper": { padding: "0", "full-width": "full-width" },
  "mj-section": { padding: "28px 34px" },
  "mj-column": { padding: "0" },
  "mj-image": { padding: "0 0 14px 0" },
  "mj-text": {
    padding: "0 0 12px 0",
    "font-size": "16px",
    "line-height": "28px",
    color: "#1a1a1a",
  },
  "mj-button": {
    padding: "0",
    "font-size": "16px",
    "font-weight": "700",
    "border-radius": "999px",
    "inner-padding": "14px 30px",
  },
};

/** Named mj-class tokens (the design system) resolved to concrete attributes. */
export const MJML_CLASS_TOKENS: Record<string, Record<string, string>> = {
  h1: { "font-size": "42px", "line-height": "46px", "font-weight": "800" },
  h2: { "font-size": "36px", "line-height": "40px", "font-weight": "800" },
  h3: { "font-size": "30px", "line-height": "34px", "font-weight": "800" },
  h4: { "font-size": "26px", "line-height": "30px", "font-weight": "800" },
  h5: { "font-size": "22px", "line-height": "26px", "font-weight": "800" },
  h6: { "font-size": "20px", "line-height": "24px", "font-weight": "800" },
  "h1-display": { "font-size": "56px", "line-height": "60px", "font-weight": "800" },
  body: {
    "font-family": "'Inter', Arial, sans-serif",
    "font-size": "17px",
    "line-height": "28px",
  },
  small: {
    "font-family": "'Inter', Arial, sans-serif",
    "font-size": "14px",
    "line-height": "23px",
  },
  label: {
    "font-family": "'Inter', Arial, sans-serif",
    "font-size": "12px",
    "font-weight": "700",
    "text-transform": "uppercase",
    "letter-spacing": "0.12em",
  },
  bold: { "font-weight": "700" },
  extrabold: { "font-weight": "800" },
  white: { color: "#ffffff" },
  light: { color: "#94a3b8" },
  medium: { color: "#4a5568" },
  dark: { color: "#1a1a1a" },
  "text-primary": { color: "#1a1a1a" },
  "text-muted": { color: "#4a5568" },
  thblue: { color: "#2f67ef" },
  whitebg: { "background-color": "#ffffff" },
  superlightbg: { "background-color": "#f8fafc" },
  thbluebg: { "background-color": "#2f67ef" },
  blackbg: { "background-color": "#0f172a" },
  darkbg: { "background-color": "#102447" },
  rocketbluebg: { "background-color": "#183b7a" },
  e3bluebg: { "background-color": "#183b7a" },
  transbg: { "background-color": "transparent" },
  badge: {
    "font-family": "'Inter', Arial, sans-serif",
    "font-size": "12px",
    "line-height": "16px",
    "font-weight": "700",
    "letter-spacing": "0.12em",
    "text-transform": "uppercase",
  },
  button: { "font-weight": "700" },
};

/**
 * Delivery-critical CSS that must survive in EVERY tier. Kept inline (never relied on
 * an include merge). Carries the responsive breakpoint and the dark-mode CTA guard.
 */
export const MJML_GUARDRAIL_STYLE = `      /* Used via css-class="ios-fix": keeps grouped columns (e.g. app-store
         badges, multi-column support rows) side by side on iOS Mail, which can
         otherwise drop the inline width and wrap them. */
      @media only screen and (max-width:480px) {
        .ios-fix { display: inline-block !important; }
      }
      /* Dark-mode guard. The color-scheme meta opts the email into the client's
         own dark handling; this keeps the primary CTA from being inverted to an
         unreadable state in clients that force-darken (Outlook.com uses
         [data-ogsc]; Apple Mail / iOS use prefers-color-scheme). */
      @media (prefers-color-scheme: dark) {
        .dm-keep-cta td { background-color: #2f67ef !important; }
        .dm-keep-cta a { color: #ffffff !important; }
      }
      [data-ogsc] .dm-keep-cta td { background-color: #2f67ef !important; }
      [data-ogsc] .dm-keep-cta a { color: #ffffff !important; }`;

/**
 * De-duplicatable, NON delivery-critical helper classes. These are the only rules the
 * Enterprise tier externalises into the shared head.mjml include.
 */
export const MJML_HELPER_STYLE = `      .border-top-light { border-top: 1px solid rgba(26, 26, 26, 0.1) !important; }
      .border-bottom-light { border-bottom: 1px solid rgba(26, 26, 26, 0.1) !important; }
      /* Used via css-class="center" to centre text blocks. */
      .center { text-align: center !important; }
      .center div { text-align: center !important; }`;

/** Shared <mj-raw> meta + brand webfont links. Kept inline in every tier. */
export const MJML_RAW_HEAD = `    <mj-raw>
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </mj-raw>`;

function renderClassTokens(): string {
  return Object.entries(MJML_CLASS_TOKENS)
    .map(([name, attrs]) => {
      const rendered = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `      <mj-class name="${name}" ${rendered} />`;
    })
    .join("\n");
}

function renderElementDefaults(): string {
  const order = [
    "mj-all",
    "mj-body",
    "mj-wrapper",
    "mj-section",
    "mj-column",
    "mj-image",
    "mj-text",
    "mj-button",
  ];
  return order
    .map((tag) => {
      const attrs = MJML_ELEMENT_DEFAULTS[tag];
      const rendered = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `      <${tag} ${rendered} />`;
    })
    .join("\n");
}

/** The shared <mj-attributes> block (element defaults + mj-class tokens). */
export function renderSharedAttributes(): string {
  return `<mj-attributes>
${renderElementDefaults()}

${renderClassTokens()}
    </mj-attributes>`;
}

function getMjmlHead(extraStyleBlocks: string[], previewText: string): string {
  return `<mj-head>
    <mj-preview>${previewText}</mj-preview>
    ${renderSharedAttributes()}
    <mj-style>
${MJML_HELPER_STYLE}
${MJML_GUARDRAIL_STYLE}
    </mj-style>
    ${extraStyleBlocks.join("\n")}
${MJML_RAW_HEAD}
  </mj-head>`;
}

function sanitiseMjmlFragment(fragment: string): {
  body: string;
  styleBlocks: string[];
} {
  let cleaned = fragment
    .replace(/<mj-include[^>]*\/>/gi, "")
    .replace(/<mjml[^>]*>/gi, "")
    .replace(/<\/mjml>/gi, "")
    .replace(/<mj-body[^>]*>/gi, "")
    .replace(/<\/mj-body>/gi, "")
    .replace(/<mj-head>[\s\S]*?<\/mj-head>/gi, "")
    .trim();

  const styleBlocks = cleaned.match(/<mj-style[\s\S]*?<\/mj-style>/gi) ?? [];
  cleaned = cleaned.replace(/<mj-style[\s\S]*?<\/mj-style>/gi, "").trim();

  return { body: cleaned, styleBlocks };
}

export function wrapMjmlFragment(fragment: string, previewText: string = DEFAULT_PREVIEW_TEXT): string {
  const { body, styleBlocks } = sanitiseMjmlFragment(fragment);

  const wrapped = `<mjml>
  ${getMjmlHead(styleBlocks, previewText)}
  <mj-body background-color="#f3f4f6">
${body}
  </mj-body>
</mjml>`;

  return applyTemplateTokens(wrapped);
}

export function buildMjmlFromLibraryFiles(fileNames: string[], previewText?: string): string {
  const fragments = fileNames.map((fileName) => loadMjmlLibraryFragment(fileName));
  return wrapMjmlFragment(fragments.join("\n\n"), previewText);
}
