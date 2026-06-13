import { createWriteStream, promises as fs } from "node:fs";
import { once } from "node:events";
import path from "node:path";
import archiver from "archiver";
import { getEmailLayoutBySlug } from "../src/data/email-layouts";
import { compiledLayoutHtmlBySlug } from "../src/data/email-layouts/compiled";
import { getEmailWorkflowBySlug } from "../src/data/workflows";
import { PACK_LAST_UPDATED, PACK_VERSION } from "../src/lib/versioning";

const PROJECT_ROOT = process.cwd();
const SAMPLE_ROOT = path.join(PROJECT_ROOT, "public", "resources", "template-hedgehog-sample-pack");
const ZIP_PATH = path.join(PROJECT_ROOT, "public", "resources", "template-hedgehog-sample-pack.zip");
const SAMPLE_LAYOUT_SLUG = "saas-welcome-system";
const SAMPLE_WORKFLOW_SLUG = "onboarding";

function renderReadme(): string {
  return [
    "# Template Hedgehog Sample Pack",
    "",
    "This is a public sample pack for inspection before purchase.",
    "",
    "It is not the paid Core, Pro, or Team archive. It shows the type of artefacts and folder structure a buyer can expect using one complete workflow sample:",
    "",
    "- editable MJML source",
    "- real compiled HTML output generated from the product layout",
    "- preview reference",
    "- QA and email-client testing notes",
    "- implementation guidance",
    "- workflow context",
    "- licence and update reference",
    "",
    `Paid archives include the tier-specific component, layout, workflow, documentation, update, and licence content described on the pricing page. Current public version: ${PACK_VERSION}. Last updated: ${PACK_LAST_UPDATED}.`,
    "",
    "## Sample Structure",
    "",
    "```text",
    "template-hedgehog-sample-pack/",
    "  components/",
    "  layouts/",
    "    sample-onboarding-system/",
    "      source.mjml",
    "      compiled.html",
    "      preview-reference.md",
    "      qa-notes.md",
    "      implementation-guide.md",
    "      testing-proof.md",
    "  workflows/",
    "    sample-onboarding-workflow.md",
    "  docs/",
    "    archive-structure.md",
    "    licence-reference.md",
    "```",
    "",
    "## Notes",
    "",
    "- Replace sample copy, links, sender details, and legal text before production use.",
    "- Run a test send in your ESP before using any email in a live campaign or lifecycle flow.",
    "- Review image hosting, merge variables, and unsubscribe requirements for your platform.",
    "- The paid archive keeps source, compiled output, workflow notes, and docs together so edits do not start from compiled HTML alone.",
  ].join("\n");
}

function renderComponentsReadme(layout: NonNullable<ReturnType<typeof getEmailLayoutBySlug>>): string {
  return [
    "# Components",
    "",
    "Paid archives include reusable MJML components with compiled HTML output.",
    "",
    "This sample layout is assembled from these production blocks:",
    "",
    ...layout.componentBlocks.map((block) => `- ${block.componentSlug}: ${block.notes}`),
    "",
    "Inspect the live component catalogue for rendered previews and individual source/output panels:",
    "",
    "https://templatehedgehog.co.uk/components",
  ].join("\n");
}

function renderWorkflowMarkdown(workflow: NonNullable<ReturnType<typeof getEmailWorkflowBySlug>>, layoutTitle: string): string {
  return [
    `# ${workflow.title}`,
    "",
    "This sample mirrors the workflow artefact style used across Template Hedgehog.",
    "",
    "## Intent",
    "",
    workflow.summary,
    "",
    "## Trigger",
    "",
    workflow.trigger,
    "",
    "## Goal",
    "",
    workflow.goal,
    "",
    "## Linked Layout",
    "",
    layoutTitle,
    "",
    "## Required Fields",
    "",
    "| Field | Purpose | Example |",
    "| --- | --- | --- |",
    ...workflow.requiredFields.map((field) =>
      `| \`${field.field}\` | ${field.description} | \`${field.example}\` |`
    ),
    "",
    "## Variants",
    "",
    ...workflow.variants.map((variant) => `- ${variant.title}: ${variant.description}`),
    "",
    "## Deliverables",
    "",
    "- Editable MJML source",
    "- Compiled HTML output",
    "- Preview reference",
    "- QA notes",
    "- Implementation guide",
    "- Workflow notes",
    "",
    "## QA Risks",
    "",
    ...workflow.qaRisks.map((risk) => `- ${risk}`),
    "",
    "## Handoff Steps",
    "",
    "1. Edit MJML source.",
    "2. Compile HTML.",
    "3. Replace merge variables.",
    "4. Run internal seed tests.",
    "5. Upload compiled HTML to the sending platform.",
  ].join("\n");
}

function renderQaNotes(): string {
  return [
    "# QA Notes",
    "",
    "Use these checks before moving a compiled email into production.",
    "",
    "## Structure",
    "",
    "- Confirm the MJML compiles without warnings.",
    "- Confirm the compiled HTML contains a viewport meta tag.",
    "- Confirm table structure does not overflow at 320px, 375px, and 600px preview widths.",
    "- Confirm CTA copy remains readable if border radius is flattened by Outlook.",
    "",
    "## Content",
    "",
    "- Test long first names and long CTA URLs.",
    "- Replace sample sender, legal, preference, and support copy.",
    "- Confirm merge variables match the ESP or campaign platform.",
    "",
    "## Rendering",
    "",
    "- Send internal seeds to Gmail, Outlook Desktop, and Apple Mail where possible.",
    "- Check dark-mode behaviour if the campaign is likely to be read in dark-mode clients.",
    "- Confirm blocked images do not remove the primary message or CTA.",
    "- Re-test after ESP upload because some editors rewrite HTML.",
    "",
    "## Handoff",
    "",
    "- Store final source and compiled output together.",
    "- Attach implementation notes to the handoff so future edits do not start from the compiled HTML alone.",
  ].join("\n");
}

function renderImplementationGuide(): string {
  return [
    "# Implementation Guide",
    "",
    "## 1. Edit Source",
    "",
    "Start from `source.mjml`. Replace sample content, merge variables, URLs, sender details, and legal copy.",
    "",
    "## 2. Compile Output",
    "",
    "Compile MJML to HTML using your preferred MJML build process. Keep `source.mjml` and `compiled.html` together so future edits do not happen only in compiled output.",
    "",
    "## 3. Map Variables",
    "",
    "Check all variables before send. The sample source uses:",
    "",
    "- `user.first_name` — set an ESP-side default (e.g. \"there\") for empty values",
    "- `account.verify_url` — primary activation destination",
    "- `app_store_url` / `play_store_url` — app-download links (replace placeholder badge images too)",
    "- `preferences_url` — manage-preferences / unsubscribe route",
    "- sender address and legal copy in the footer",
    "",
    "## 4. Run QA",
    "",
    "Use `qa-notes.md` before upload. At minimum, test mobile width, long copy, blocked images, and internal seed sends.",
    "",
    "## 5. Upload",
    "",
    "Import the compiled HTML into your ESP, CRM, campaign platform, or implementation workflow. Re-test after upload because some editors rewrite HTML.",
  ].join("\n");
}

function renderTestingProof(): string {
  return [
    "# Email-client Testing Proof",
    "",
    "Template Hedgehog does not claim to remove final platform testing. It gives you production-oriented artefacts and documented checks so testing starts from source, output, and known risks.",
    "",
    "## Included Checks",
    "",
    "- MJML source and compiled HTML are kept together.",
    "- Responsive widths to inspect: 320px, 375px, 600px.",
    "- Internal seed clients to test where available: Gmail, Outlook Desktop, Apple Mail.",
    "- Edge cases to check: long names, long URLs, blocked images, dark mode, rewritten ESP HTML.",
    "",
    "## Buyer Responsibility",
    "",
    "Run a seed send inside your own ESP or campaign platform before production. Platform editors can rewrite HTML after import, so final QA must happen after upload.",
  ].join("\n");
}

function renderPreviewReference(layout: NonNullable<ReturnType<typeof getEmailLayoutBySlug>>): string {
  return [
    "# Preview Reference",
    "",
    "Open the public rendered layout page before purchase:",
    "",
    `- /layouts/${layout.slug}`,
    `- ${layout.previewImageUrl}`,
    "",
    "The paid archive includes preview context and rendered public proof pages so buyers can compare source, compiled output, and layout structure before implementation.",
  ].join("\n");
}

function renderArchiveStructure(): string {
  return [
    "# Archive Structure",
    "",
    "Paid Template Hedgehog archives are organised to support source-to-handoff work.",
    "",
    "## Core Archive",
    "",
    "Core is a starter archive for three common systems:",
    "",
    "- SaaS welcome",
    "- password reset",
    "- order confirmation",
    "",
    "It includes a smaller set of components, layouts, workflows, MJML source, compiled HTML, and setup docs.",
    "",
    "## Pro Archive",
    "",
    "Pro is the full production archive:",
    "",
    "- complete component library",
    "- full layout set",
    "- full workflow set",
    "- editable source files",
    "- compiled HTML outputs",
    "- token examples",
    "- QA and implementation guidance",
    "- versioned update context",
    "",
    "## Team Archive",
    "",
    "Team uses the Pro archive and adds commercial reuse rights, white-label/internal deployment cover, priority support, and a longer update window.",
    "",
    "Team does not add more templates than Pro. It changes the rights, support, and operational use case.",
  ].join("\n");
}

function renderLicenceReference(): string {
  return [
    "# Licence Reference",
    "",
    "Use the pricing page as the source of truth for current commercial rights.",
    "",
    "| Tier | Best fit | Rights summary | Updates |",
    "| --- | --- | --- | --- |",
    "| Core | Small self-serve starting point | Use the Core files inside your own implementation. Do not redistribute or resell the archive. | Standard fixes for the purchased archive version. |",
    "| Pro | Recurring email production | Use the full Pro archive for your own organisation's production email work. Do not redistribute, resell, or white-label the source archive. | 6 months of versioned updates. |",
    "| Team | Client, white-label, or internal rollout | Pro archive plus commercial reuse rights, white-label/internal deployment, priority support, and operational cover. | 12 months of updates. |",
    "",
    "Ask support before buying if the archive will be reused across multiple clients, embedded in another product, or distributed outside your organisation.",
  ].join("\n");
}

async function writeFile(relativePath: string, content: string): Promise<void> {
  const absolutePath = path.join(SAMPLE_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, `${content.trim()}\n`, "utf8");
}

async function zipSamplePack(): Promise<void> {
  await fs.rm(ZIP_PATH, { force: true });
  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = createWriteStream(ZIP_PATH);
  archive.pipe(output);
  archive.directory(SAMPLE_ROOT, "template-hedgehog-sample-pack");
  await archive.finalize();
  await once(output, "close");
}

async function main() {
  const layout = getEmailLayoutBySlug(SAMPLE_LAYOUT_SLUG);
  const workflow = getEmailWorkflowBySlug(SAMPLE_WORKFLOW_SLUG);
  const compiledHtml = compiledLayoutHtmlBySlug[SAMPLE_LAYOUT_SLUG];

  if (!layout || !workflow || !compiledHtml) {
    throw new Error("[build-sample-pack] Sample layout, workflow, or compiled HTML is missing.");
  }

  await fs.rm(SAMPLE_ROOT, { recursive: true, force: true });
  await writeFile("README.md", renderReadme());
  await writeFile("components/README.md", renderComponentsReadme(layout));
  await writeFile("layouts/sample-onboarding-system/source.mjml", layout.mjmlSource);
  await writeFile("layouts/sample-onboarding-system/compiled.html", compiledHtml);
  await writeFile("layouts/sample-onboarding-system/preview-reference.md", renderPreviewReference(layout));
  await writeFile("layouts/sample-onboarding-system/qa-notes.md", renderQaNotes());
  await writeFile("layouts/sample-onboarding-system/implementation-guide.md", renderImplementationGuide());
  await writeFile("layouts/sample-onboarding-system/testing-proof.md", renderTestingProof());
  await writeFile("workflows/sample-onboarding-workflow.md", renderWorkflowMarkdown(workflow, layout.title));
  await writeFile("docs/archive-structure.md", renderArchiveStructure());
  await writeFile("docs/licence-reference.md", renderLicenceReference());
  await zipSamplePack();

  console.info(`Built public sample pack at ${ZIP_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
