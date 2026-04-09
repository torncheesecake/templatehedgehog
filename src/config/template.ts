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
const DEFAULT_PRODUCT_NAME = "Hedgehog Core";
const DEFAULT_DOMAIN = "example.com";
const DEFAULT_SUPPORT_EMAIL = "support@example.com";
const DEFAULT_CONTACT_EMAIL = "hello@example.com";
const DEFAULT_COMPANY_LEGAL_NAME = "Your Company Ltd";
const DEFAULT_COMPANY_ADDRESS = "123 Example Street, London, SW1A 1AA";

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

export const TEMPLATE_CONFIG = {
  brandName,
  brandNameCompact: brandName.replace(/\s+/g, ""),
  productName,
  supportEmail,
  contactEmail,
  companyLegalName,
  companyAddress,
  domain,
  siteUrl,
  urls: {
    home: siteUrl,
    docs: `${siteUrl}/docs`,
    support: `${siteUrl}/support`,
    pricing: `${siteUrl}/pricing`,
    privacy: `${siteUrl}/privacy`,
    preferences: `${siteUrl}/preferences`,
  },
} as const;

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
