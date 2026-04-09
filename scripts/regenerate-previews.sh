#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required to regenerate previews." >&2
  exit 1
fi

TMP_DIR="$ROOT_DIR/.tmp/preview-render"
HTML_DIR="$TMP_DIR/html"
MANIFEST_PATH="$TMP_DIR/manifest.json"
mkdir -p "$HTML_DIR/components" "$HTML_DIR/layouts" "$ROOT_DIR/public/email-shots-v3/layouts"
mkdir -p "$HTML_DIR/brand"
cp "$ROOT_DIR/public/brand/hedgehog-mark-email.png" "$HTML_DIR/brand/hedgehog-mark-email.png"
PREVIEW_SERVER_PORT="${PREVIEW_SERVER_PORT:-4173}"
PREVIEW_SERVER_URL="http://127.0.0.1:${PREVIEW_SERVER_PORT}"

npx tsx -e '
import { promises as fs } from "node:fs";
import path from "node:path";
import { emailComponents } from "./src/data/email-components";
import { compiledComponentsBySlug } from "./src/data/email-components/compiled";
import { emailLayouts } from "./src/data/email-layouts";
import { compiledLayoutHtmlBySlug } from "./src/data/email-layouts/compiled";

const manifestPath = path.join(process.cwd(), ".tmp", "preview-render", "manifest.json");
const requestedSlugs = new Set(
  (process.env.PREVIEW_SLUGS ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean),
);

function getComponentStageHeight(category: string): number {
  if (category === "Headers" || category === "Buttons") {
    return 280;
  }

  if (category === "Content Blocks" || category === "Transactional Components") {
    return 520;
  }

  if (category === "Heroes" || category === "Product Sections" || category === "Newsletter Layouts") {
    return 760;
  }

  return 680;
}

const components = emailComponents
  .filter((component) => requestedSlugs.size === 0 || requestedSlugs.has(component.slug))
  .map((component) => ({
  kind: "component",
  slug: component.slug,
  outputPath: path.join(process.cwd(), "public", component.previewImageUrl.replace(/^\//, "")),
  html: compiledComponentsBySlug[component.slug] ?? "",
  stageHeight: getComponentStageHeight(component.category),
}));

const layouts = emailLayouts
  .filter((layout) => requestedSlugs.size === 0 || requestedSlugs.has(layout.slug))
  .map((layout) => ({
  kind: "layout",
  slug: layout.slug,
  outputPath: path.join(process.cwd(), "public", layout.previewImageUrl.replace(/^\//, "")),
  html: compiledLayoutHtmlBySlug[layout.slug] ?? "",
  stageHeight: 1320,
}));

if (requestedSlugs.size > 0 && components.length === 0 && layouts.length === 0) {
  throw new Error(`[preview-regeneration] PREVIEW_SLUGS did not match any component or layout slug.`);
}

for (const entry of [...components, ...layouts]) {
  if (!entry.html) {
    throw new Error(`[preview-regeneration] Missing compiled HTML for ${entry.kind} ${entry.slug}.`);
  }
}

async function run() {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify({ components, layouts }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
'

node - <<'NODE'
const fs = require('node:fs');
const path = require('node:path');

const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.tmp/preview-render/manifest.json'), 'utf8'));
const all = [...manifest.components, ...manifest.layouts];

for (const entry of all) {
  const groupDir = entry.kind === 'component' ? 'components' : 'layouts';
  const htmlPath = path.join(process.cwd(), '.tmp/preview-render/html', groupDir, `${entry.slug}.html`);

  const wrapper = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${entry.slug} preview</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #eaf1fb;
        font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif;
        color: #1b2b43;
        display: flex;
        justify-content: center;
        padding: 24px;
      }
      .stage {
        width: 1120px;
        border: 1px solid rgba(57, 91, 146, 0.2);
        background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(239,246,255,0.9));
        border-radius: 18px;
        box-shadow: 0 24px 44px rgba(13, 34, 79, 0.14);
        padding: 18px;
      }
      .label {
        margin: 0 0 12px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #5b7396;
      }
      .frame {
        border: 1px solid rgba(87, 123, 186, 0.2);
        border-radius: 12px;
        overflow: hidden;
        background: #f8fbff;
        height: ${entry.stageHeight}px;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
        background: #fff;
      }
    </style>
  </head>
  <body>
    <main class="stage">
      <p class="label">Rendered email preview</p>
      <section class="frame">
        <iframe id="preview" loading="eager"></iframe>
      </section>
    </main>
    <script>
      const iframe = document.getElementById("preview");
      iframe.addEventListener(\"load\", () => {\n        document.body.dataset.ready = \"1\";\n      }, { once: true });\n      iframe.srcdoc = ${JSON.stringify(entry.html)};
    </script>
  </body>
</html>`;

  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
  fs.writeFileSync(htmlPath, wrapper, 'utf8');
}
NODE

npx tsx -e '
import { promises as fs } from "node:fs";
import path from "node:path";

type Entry = { kind: "component" | "layout"; slug: string; outputPath: string };

async function run() {
  const root = process.cwd();
  const manifestRaw = await fs.readFile(path.join(root, ".tmp", "preview-render", "manifest.json"), "utf8");
  const manifest = JSON.parse(manifestRaw) as { components: Entry[]; layouts: Entry[] };
  const lines = [...manifest.components, ...manifest.layouts]
    .map((entry) => `${entry.kind}|${entry.slug}|${entry.outputPath}`)
    .join("\n");
  await fs.writeFile(path.join(root, ".tmp", "preview-render", "capture-list.txt"), `${lines}\n`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
'

"$PWCLI" -s previewregen open about:blank >/dev/null
python3 -m http.server "$PREVIEW_SERVER_PORT" --bind 127.0.0.1 --directory "$HTML_DIR" >/dev/null 2>&1 &
SERVER_PID=$!
cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT
sleep 0.4

capture_file() {
  local input_file="$1"
  local output_file="$2"
  local viewport_width="$3"
  local viewport_height="$4"

  mkdir -p "$(dirname "$output_file")"

  "$PWCLI" -s previewregen resize "$viewport_width" "$viewport_height" >/dev/null
  "$PWCLI" -s previewregen goto "$input_file" >/dev/null
  "$PWCLI" -s previewregen run-code "await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 12000 }); await page.waitForTimeout(320);" >/dev/null
  "$PWCLI" -s previewregen screenshot >/dev/null

  local newest_path
  newest_path=$(ls -t "$ROOT_DIR/.playwright-cli"/page-*.png 2>/dev/null | head -n 1 || true)

  if [[ -z "$newest_path" || ! -f "$newest_path" ]]; then
    echo "Failed to capture screenshot for $input_file" >&2
    exit 1
  fi

  cp "$newest_path" "$output_file"
}

while IFS='|' read -r kind slug output_path; do
  [[ -z "$kind" ]] && continue
  html_file="$PREVIEW_SERVER_URL/${kind}s/${slug}.html"
  if [[ "$kind" == "component" ]]; then
    capture_file "$html_file" "$output_path" 1168 680
  else
    capture_file "$html_file" "$output_path" 1168 1420
  fi
done < "$TMP_DIR/capture-list.txt"

echo "Regenerated component and layout preview images."
