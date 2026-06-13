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

function getMjmlHead(extraStyleBlocks: string[], previewText: string): string {
  return `<mj-head>
    <mj-preview>${previewText}</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Manrope', 'Inter', Arial, sans-serif" />
      <mj-body width="640px" background-color="#f3f4f6" />
      <mj-wrapper padding="0" full-width="full-width" />
      <mj-section padding="28px 34px" />
      <mj-column padding="0" />
      <mj-image padding="0 0 14px 0" />
      <mj-text padding="0 0 12px 0" font-size="16px" line-height="28px" color="#1a1a1a" />
      <mj-button padding="0" font-size="16px" font-weight="700" border-radius="999px" inner-padding="14px 30px" />

      <mj-class name="h1" font-size="42px" line-height="46px" font-weight="800" />
      <mj-class name="h2" font-size="36px" line-height="40px" font-weight="800" />
      <mj-class name="h3" font-size="30px" line-height="34px" font-weight="800" />
      <mj-class name="h4" font-size="26px" line-height="30px" font-weight="800" />
      <mj-class name="h5" font-size="22px" line-height="26px" font-weight="800" />
      <mj-class name="h6" font-size="20px" line-height="24px" font-weight="800" />
      <mj-class name="h1-display" font-size="56px" line-height="60px" font-weight="800" />
      <mj-class name="body" font-family="'Inter', Arial, sans-serif" font-size="17px" line-height="28px" />
      <mj-class name="small" font-family="'Inter', Arial, sans-serif" font-size="14px" line-height="23px" />
      <mj-class name="label" font-family="'Inter', Arial, sans-serif" font-size="12px" font-weight="700" text-transform="uppercase" letter-spacing="0.12em" />
      <mj-class name="bold" font-weight="700" />
      <mj-class name="extrabold" font-weight="800" />
      <mj-class name="white" color="#ffffff" />
      <mj-class name="light" color="#94a3b8" />
      <mj-class name="medium" color="#4a5568" />
      <mj-class name="dark" color="#1a1a1a" />
      <mj-class name="text-primary" color="#1a1a1a" />
      <mj-class name="text-muted" color="#4a5568" />
      <mj-class name="thblue" color="#2f67ef" />
      <mj-class name="whitebg" background-color="#ffffff" />
      <mj-class name="superlightbg" background-color="#f8fafc" />
      <mj-class name="thbluebg" background-color="#2f67ef" />
      <mj-class name="blackbg" background-color="#0f172a" />
      <mj-class name="darkbg" background-color="#102447" />
      <mj-class name="rocketbluebg" background-color="#183b7a" />
      <mj-class name="e3bluebg" background-color="#183b7a" />
      <mj-class name="transbg" background-color="transparent" />
      <mj-class name="badge" font-family="'Inter', Arial, sans-serif" font-size="12px" line-height="16px" font-weight="700" letter-spacing="0.12em" text-transform="uppercase" />
      <mj-class name="button" font-weight="700" />
    </mj-attributes>
    <mj-style>
      .border-top-light { border-top: 1px solid rgba(26, 26, 26, 0.1) !important; }
      .border-bottom-light { border-bottom: 1px solid rgba(26, 26, 26, 0.1) !important; }
      /* Used via css-class="center" to centre text blocks. */
      .center { text-align: center !important; }
      .center div { text-align: center !important; }
      /* Used via css-class="ios-fix": keeps grouped columns (e.g. app-store
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
      [data-ogsc] .dm-keep-cta a { color: #ffffff !important; }
    </mj-style>
    ${extraStyleBlocks.join("\n")}
    <mj-raw>
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </mj-raw>
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
