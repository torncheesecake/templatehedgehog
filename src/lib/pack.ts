import path from "node:path";
import { emailComponents } from "@/data/email-components";
import { emailLayouts, emailLayoutSystems } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";
import { getPricingTierById, TEMPLATE_CONFIG } from "@/config/template";

export const MJML_PACK_PRODUCT_ID = "template_hedgehog_pro";
export const MJML_PACK_NAME = TEMPLATE_CONFIG.productName;
export type DownloadPackId = "starter" | "pro" | "enterprise";
function toPackSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export const MJML_PACK_PRIVATE_DIR = "private/downloads";
export function getMjmlPackFilename(packId: DownloadPackId = "pro"): string {
  const suffix = packId === "pro" ? "pack" : `${packId}-pack`;
  return `${toPackSlug(TEMPLATE_CONFIG.brandName)}-${suffix}.zip`;
}

export function getMjmlPackRelativePath(packId: DownloadPackId = "pro"): string {
  return `${MJML_PACK_PRIVATE_DIR}/${getMjmlPackFilename(packId)}`;
}

export const MJML_PACK_FILENAME = getMjmlPackFilename("pro");
export const MJML_PACK_PRIVATE_RELATIVE_PATH = getMjmlPackRelativePath("pro");
export const DEFAULT_MJML_PACK_PRICE_PENCE = getPricingTierById("pro").priceGbp * 100;
export const COMPONENT_COUNT = emailComponents.length;
export const LAYOUT_COUNT = emailLayouts.length;
export const WORKFLOW_COUNT = emailWorkflows.length;
export const LAYOUT_SYSTEM_COUNT = emailLayoutSystems.length;

export const STARTER_LAYOUT_SLUGS = [
  "saas-welcome-system",
  "password-reset-system",
  "order-confirmation-system",
] as const;

/**
 * The curated layout add-on slugs shipped in the Enterprise pack. Each one has been
 * hand-cleaned (no placeholder copy, no example.com assets) and passes the same compile +
 * robustness gate as the core set. Single source of truth: consumed by scripts/build-pack.ts
 * (to bundle them), scripts/build-layout-addons.ts (to PROTECT them from being clobbered),
 * and scripts/verify-packs.ts (to assert their integrity in the built pack).
 */
export const CURATED_ADDON_SLUGS = [
  "charityemail",
  "whatisyournetscore-mini",
  "whatisyournetscore-mini-v2",
  "aftercare-feb-22-1",
  "christmas",
  "erp-hero",
  "erp-hero-left",
  "service-disruption-1406",
  "e3leads24-3-1",
  "the-hidden-costs-of-relyiong-on-spreadsheets",
  "algoriq",
  "fireworks",
  "magic",
  "poor-netsuite-0624",
  "train",
  "visuallinkedin24",
] as const;

const starterLayoutSlugSet = new Set<string>(STARTER_LAYOUT_SLUGS);
const starterLayouts = emailLayouts.filter((layout) => starterLayoutSlugSet.has(layout.slug));
const starterComponentSlugs = new Set(
  starterLayouts.flatMap((layout) => layout.componentBlocks.map((block) => block.componentSlug)),
);

export const STARTER_COMPONENT_COUNT = starterComponentSlugs.size;
export const STARTER_LAYOUT_COUNT = starterLayouts.length;
export const STARTER_WORKFLOW_COUNT = emailWorkflows.filter((workflow) =>
  starterLayoutSlugSet.has(workflow.linkedLayoutSlug),
).length;

export const MJML_PACK_PROJECT_STRUCTURE = [
  "components/",
  "layouts/",
  "workflows/",
  "docs/",
  "mjml.config",
  "README.md",
] as const;

export const MJML_PACK_INCLUDED = [
  `${COMPONENT_COUNT} production-ready MJML components organised in a reusable project structure`,
  `${LAYOUT_COUNT} full email layouts across ${LAYOUT_SYSTEM_COUNT} named systems for common production flows`,
  `${WORKFLOW_COUNT} workflow references that map trigger, structure, and handoff requirements`,
  "Compiled HTML beside every component, layout, and example for QA and ESP handoff",
  "Docs, configuration, and source files for safer customisation inside a team workflow",
  "Release metadata and changelog support so teams can track what changed",
] as const;

export const MJML_PACK_LICENSE_POINTS = [
  "Use is governed by the purchased Core, Pro, or Team tier",
  "Keep purchased source files inside your organisation or approved delivery workflow",
  "Redistribution or resale of the source archive is not permitted",
] as const;

export function getMjmlPackPricePence(): number {
  return DEFAULT_MJML_PACK_PRICE_PENCE;
}

export function formatGbpFromPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function getMjmlPackAbsolutePath(
  rootDir: string = process.cwd(),
  packId: DownloadPackId = "pro",
): string {
  return path.join(rootDir, getMjmlPackRelativePath(packId));
}

export const MJML_PACK_ABSOLUTE_PATH = getMjmlPackAbsolutePath();
