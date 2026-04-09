import path from "node:path";
import { emailComponents } from "@/data/email-components";
import { emailLayouts, emailLayoutSystems } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";
import { TEMPLATE_CONFIG } from "@/config/template";

export const MJML_PACK_PRODUCT_ID = "mjml-components-pack";
export const MJML_PACK_NAME = TEMPLATE_CONFIG.productName;
function toPackSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export const MJML_PACK_FILENAME = `${toPackSlug(TEMPLATE_CONFIG.brandName)}-pack.zip`;
export const MJML_PACK_PRIVATE_DIR = "private/downloads";
export const MJML_PACK_PRIVATE_RELATIVE_PATH = `${MJML_PACK_PRIVATE_DIR}/${MJML_PACK_FILENAME}`;
export const DEFAULT_MJML_PACK_PRICE_PENCE = 7900;
export const COMPONENT_COUNT = emailComponents.length;
export const LAYOUT_COUNT = emailLayouts.length;
export const WORKFLOW_COUNT = emailWorkflows.length;
export const LAYOUT_SYSTEM_COUNT = emailLayoutSystems.length;

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
  "Compiled HTML beside every component, layout, and workflow for QA and ESP handoff",
  "Docs, configuration, and source files for safer customisation inside a team workflow",
  "Release metadata and changelog support so teams can track what changed",
] as const;

export const MJML_PACK_LICENSE_POINTS = [
  "Commercial use for your own business projects",
  "Use in client delivery work under one purchaser seat",
  "Redistribution or resale of the raw pack is not permitted",
] as const;

export function getMjmlPackPricePence(): number {
  const raw = process.env.STRIPE_PACK_PRICE_PENCE;
  if (!raw) {
    return DEFAULT_MJML_PACK_PRICE_PENCE;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_MJML_PACK_PRICE_PENCE;
  }

  return parsed;
}

export function formatGbpFromPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function getMjmlPackAbsolutePath(rootDir: string = process.cwd()): string {
  return path.join(rootDir, MJML_PACK_PRIVATE_RELATIVE_PATH);
}

export const MJML_PACK_ABSOLUTE_PATH = getMjmlPackAbsolutePath();
