import { TEMPLATE_CONFIG } from "@/config/template";

type ReplacementEntry = {
  search: string;
  replaceWith: string;
};

// Template customisation boundary:
// Raw MJML/example content may include legacy brand placeholders.
// This normalises those placeholders through the single template config module.
const TOKEN_REPLACEMENTS: ReplacementEntry[] = [
  { search: "{{brandName}}", replaceWith: TEMPLATE_CONFIG.brandName },
  { search: "{{brandNameCompact}}", replaceWith: TEMPLATE_CONFIG.brandNameCompact },
  { search: "{{productName}}", replaceWith: TEMPLATE_CONFIG.productName },
  { search: "{{domain}}", replaceWith: TEMPLATE_CONFIG.domain },
  { search: "{{siteUrl}}", replaceWith: TEMPLATE_CONFIG.siteUrl },
  { search: "{{supportEmail}}", replaceWith: TEMPLATE_CONFIG.supportEmail },
  { search: "{{contactEmail}}", replaceWith: TEMPLATE_CONFIG.contactEmail },
  { search: "{{companyLegalName}}", replaceWith: TEMPLATE_CONFIG.companyLegalName },
  { search: "{{companyAddress}}", replaceWith: TEMPLATE_CONFIG.companyAddress },
];

const LEGACY_DOMAIN = ["templatehedgehog", "com"].join(".");
const LEGACY_HTTPS_URL = `https://${LEGACY_DOMAIN}`;
const LEGACY_HTTP_URL = `http://${LEGACY_DOMAIN}`;
const LEGACY_SUPPORT_EMAIL = `support@${LEGACY_DOMAIN}`;
const LEGACY_CONTACT_EMAIL = `hello@${LEGACY_DOMAIN}`;

const LEGACY_REPLACEMENTS: ReplacementEntry[] = [
  {
    search: `${LEGACY_HTTPS_URL}/preferences`,
    replaceWith: TEMPLATE_CONFIG.urls.preferences,
  },
  {
    search: `${LEGACY_HTTP_URL}/preferences`,
    replaceWith: TEMPLATE_CONFIG.urls.preferences,
  },
  {
    search: LEGACY_HTTPS_URL,
    replaceWith: TEMPLATE_CONFIG.siteUrl,
  },
  {
    search: LEGACY_HTTP_URL,
    replaceWith: TEMPLATE_CONFIG.siteUrl,
  },
  {
    search: LEGACY_SUPPORT_EMAIL,
    replaceWith: TEMPLATE_CONFIG.supportEmail,
  },
  {
    search: LEGACY_CONTACT_EMAIL,
    replaceWith: TEMPLATE_CONFIG.contactEmail,
  },
  {
    search: "TemplateHedgehog Ltd.",
    replaceWith: `${TEMPLATE_CONFIG.companyLegalName}.`,
  },
  {
    search: "TemplateHedgehog Ltd",
    replaceWith: TEMPLATE_CONFIG.companyLegalName,
  },
  {
    search: `${LEGACY_DOMAIN}/preferences`,
    replaceWith: `${TEMPLATE_CONFIG.domain}/preferences`,
  },
  {
    search: LEGACY_DOMAIN,
    replaceWith: TEMPLATE_CONFIG.domain,
  },
  {
    search: "Template Hedgehog",
    replaceWith: TEMPLATE_CONFIG.brandName,
  },
  {
    search: "TemplateHedgehog",
    replaceWith: TEMPLATE_CONFIG.brandNameCompact,
  },
];

function applyReplacementSet(input: string, entries: ReplacementEntry[]): string {
  let output = input;
  for (const entry of entries) {
    output = output.split(entry.search).join(entry.replaceWith);
  }
  return output;
}

export function applyTemplateTokens(input: string): string {
  const withTokens = applyReplacementSet(input, TOKEN_REPLACEMENTS);
  return applyReplacementSet(withTokens, LEGACY_REPLACEMENTS);
}

export function applyTemplateTokensToRecord(
  entries: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, applyTemplateTokens(value)]),
  );
}
