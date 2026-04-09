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

const LEGACY_REPLACEMENTS: ReplacementEntry[] = [
  {
    search: "https://templatehedgehog.com/preferences",
    replaceWith: TEMPLATE_CONFIG.urls.preferences,
  },
  {
    search: "http://templatehedgehog.com/preferences",
    replaceWith: TEMPLATE_CONFIG.urls.preferences,
  },
  {
    search: "https://templatehedgehog.com",
    replaceWith: TEMPLATE_CONFIG.siteUrl,
  },
  {
    search: "http://templatehedgehog.com",
    replaceWith: TEMPLATE_CONFIG.siteUrl,
  },
  {
    search: "support@templatehedgehog.com",
    replaceWith: TEMPLATE_CONFIG.supportEmail,
  },
  {
    search: "hello@templatehedgehog.com",
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
    search: "templatehedgehog.com/preferences",
    replaceWith: `${TEMPLATE_CONFIG.domain}/preferences`,
  },
  {
    search: "templatehedgehog.com",
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
  {
    search: "Hedgehog Core",
    replaceWith: TEMPLATE_CONFIG.productName,
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
