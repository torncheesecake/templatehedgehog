/**
 * Template customisation boundary.
 *
 * To white-label this project for a new commercial template customer, change values here
 * or provide the matching env vars. Keep brand/domain/email values out of feature code.
 */
function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

const DEFAULT_BRAND_NAME = "Template Hedgehog";
const DEFAULT_PRODUCT_NAME = "Template Hedgehog Pro";
const DEFAULT_DOMAIN = "templatehedgehog.co.uk";
const DEFAULT_SUPPORT_EMAIL = "support@templatehedgehog.co.uk";
const DEFAULT_CONTACT_EMAIL = "hello@templatehedgehog.co.uk";
const DEFAULT_COMPANY_LEGAL_NAME = "Artifexa";
const DEFAULT_COMPANY_ADDRESS = "Artifexa, United Kingdom";
const DEFAULT_PRODUCT_OWNER_NAME = "Artifexa";
const DEFAULT_TAGLINE =
  "Production-ready email systems for teams shipping lifecycle and transactional email faster.";
const DEFAULT_ACCENT_PRIMARY = "#8191EC";
const DEFAULT_ACCENT_SECONDARY = "#4650B1";
const DEFAULT_HERO_TONE = "dark-premium";

const siteUrlFromEnv =
  readEnv("NEXT_PUBLIC_SITE_URL") ?? readEnv("NEXT_PUBLIC_APP_URL");
const domainFromEnv = readEnv("NEXT_PUBLIC_SITE_DOMAIN");
const siteUrl = stripTrailingSlash(
  siteUrlFromEnv ??
    `https://${domainFromEnv ?? DEFAULT_DOMAIN}`,
);
const domain =
  domainFromEnv ??
  (siteUrlFromEnv ? new URL(siteUrlFromEnv).hostname : DEFAULT_DOMAIN);
const brandName = readEnv("NEXT_PUBLIC_BRAND_NAME") ?? DEFAULT_BRAND_NAME;
const productName = readEnv("NEXT_PUBLIC_PRODUCT_NAME") ?? DEFAULT_PRODUCT_NAME;
const supportEmail = readEnv("NEXT_PUBLIC_SUPPORT_EMAIL") ?? DEFAULT_SUPPORT_EMAIL;
const contactEmail = readEnv("NEXT_PUBLIC_CONTACT_EMAIL") ?? DEFAULT_CONTACT_EMAIL;
const companyLegalName =
  readEnv("NEXT_PUBLIC_COMPANY_LEGAL_NAME") ?? DEFAULT_COMPANY_LEGAL_NAME;
const companyAddress =
  readEnv("NEXT_PUBLIC_COMPANY_ADDRESS") ?? DEFAULT_COMPANY_ADDRESS;
const productOwnerName =
  readEnv("NEXT_PUBLIC_PRODUCT_OWNER_NAME") ?? DEFAULT_PRODUCT_OWNER_NAME;
const productOwnerUrl = readEnv("NEXT_PUBLIC_PRODUCT_OWNER_URL");
const tagline = readEnv("NEXT_PUBLIC_TAGLINE") ?? DEFAULT_TAGLINE;
const accentPrimary =
  readEnv("NEXT_PUBLIC_ACCENT_PRIMARY") ?? DEFAULT_ACCENT_PRIMARY;
const accentSecondary =
  readEnv("NEXT_PUBLIC_ACCENT_SECONDARY") ?? DEFAULT_ACCENT_SECONDARY;
const heroTone = readEnv("NEXT_PUBLIC_HERO_TONE") ?? DEFAULT_HERO_TONE;

export type PricingTierId = "starter" | "pro" | "enterprise";

export interface PricingTierDefinition {
  id: PricingTierId;
  name: string;
  priceGbp: number;
  stripeLookupKey: string;
  position: string;
  description: string;
  ctaLabel: string;
  updatesWindow: string;
  includes: string[];
  highlighted?: boolean;
}

export const PRICING_TIERS: readonly PricingTierDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    priceGbp: 59,
    stripeLookupKey: "template_hedgehog_starter",
    position: "Get production-ready quickly",
    description:
      "A useful starter system for teams that need dependable onboarding and transactional email foundations.",
    ctaLabel: "Get Starter - £59",
    updatesWindow: "Standard updates included",
    includes: [
      "Curated starter system",
      "Onboarding and transactional essentials",
      "3 layouts",
      "MJML + compiled HTML",
      "Setup docs",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceGbp: 179,
    stripeLookupKey: "template_hedgehog_pro",
    position: "Complete production email system",
    description:
      "The primary production path for teams shipping lifecycle and transactional email systems every month.",
    ctaLabel: "Get Pro - £179",
    updatesWindow: "6 months of updates",
    includes: [
      "Full component library",
      "Layouts/workflows",
      "Lifecycle + transactional systems",
      "Token examples",
      "Advanced implementation guidance",
      "6 months updates",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceGbp: 349,
    stripeLookupKey: "template_hedgehog_enterprise",
    position: "Commercial deployment licence",
    description:
      "A commercial deployment licence for teams reusing the system across internal, client, or white-label delivery.",
    ctaLabel: "Get Enterprise - £349",
    updatesWindow: "12 months priority updates and support",
    includes: [
      "Commercial reuse rights",
      "White-label/internal deployment",
      "Reusable generation framework",
      "Priority support",
      "12 months updates",
    ],
  },
] as const;

export const PRIMARY_CTA_HREF = "/pricing";
export const PRIMARY_CTA_LABEL = PRICING_TIERS.find((tier) => tier.id === "pro")?.ctaLabel
  ?? "Get Pro - £179";

export const TEMPLATE_CONFIG = {
  brandName,
  brandNameCompact: brandName.replace(/\s+/g, ""),
  productName,
  tagline,
  supportEmail,
  contactEmail,
  companyLegalName,
  companyAddress,
  owner: {
    name: productOwnerName,
    url: productOwnerUrl,
  },
  domain,
  siteUrl,
  branding: {
    accentPrimary,
    accentSecondary,
    heroTone,
  },
  pricing: {
    currency: "GBP",
    primaryTierId: "pro" as PricingTierId,
    tiers: PRICING_TIERS,
    primaryCtaHref: PRIMARY_CTA_HREF,
    primaryCtaLabel: PRIMARY_CTA_LABEL,
  },
  urls: {
    home: siteUrl,
    docs: `${siteUrl}/docs`,
    support: `${siteUrl}/support`,
    pricing: `${siteUrl}/pricing`,
    privacy: `${siteUrl}/privacy`,
    preferences: `${siteUrl}/preferences`,
    openGraphImage: `${siteUrl}/opengraph-image`,
  },
} as const;

export function getPricingTierById(id: PricingTierId): PricingTierDefinition {
  const tier = PRICING_TIERS.find((entry) => entry.id === id);
  if (!tier) {
    throw new Error(`[template-config] Unknown pricing tier: ${id}`);
  }
  return tier;
}

export function buildAbsoluteUrl(pathname: string): string {
  const normalisedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${TEMPLATE_CONFIG.siteUrl}${normalisedPath}`;
}

export function createPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${TEMPLATE_CONFIG.brandName}`;
}

export const TEMPLATE_CUSTOMISATION_NOTES = {
  code: "Update src/config/template.ts and .env variables to rebrand this template.",
  content:
    "Update src/data/email-components/library, src/data/email-examples/library, and src/data/workflows for product-specific MJML content and workflow metadata.",
};
