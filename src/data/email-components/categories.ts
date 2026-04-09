export const EMAIL_COMPONENT_CATEGORIES = [
  "Buttons",
  "Headers",
  "Heroes",
  "Footers",
  "Content Blocks",
  "Product Sections",
  "Transactional Components",
  "Newsletter Layouts",
] as const;

export type EmailComponentCategory = (typeof EMAIL_COMPONENT_CATEGORIES)[number];

export type EmailComponentCategoryFilter =
  | "all"
  | "buttons"
  | "headers"
  | "heroes"
  | "footers"
  | "content-blocks"
  | "product-sections"
  | "transactional-components"
  | "newsletter-layouts";

export const EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS: Array<{
  id: EmailComponentCategoryFilter;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "buttons", label: "Buttons" },
  { id: "headers", label: "Headers" },
  { id: "heroes", label: "Heroes" },
  { id: "footers", label: "Footers" },
  { id: "content-blocks", label: "Content blocks" },
  { id: "product-sections", label: "Product sections" },
  { id: "transactional-components", label: "Transactional" },
  { id: "newsletter-layouts", label: "Newsletter layouts" },
] as const;

const FILTER_TO_CATEGORY: Record<
  Exclude<EmailComponentCategoryFilter, "all">,
  EmailComponentCategory
> = {
  buttons: "Buttons",
  headers: "Headers",
  heroes: "Heroes",
  footers: "Footers",
  "content-blocks": "Content Blocks",
  "product-sections": "Product Sections",
  "transactional-components": "Transactional Components",
  "newsletter-layouts": "Newsletter Layouts",
};

export function isEmailComponentCategory(
  value: string,
): value is EmailComponentCategory {
  return EMAIL_COMPONENT_CATEGORIES.includes(value as EmailComponentCategory);
}

export function normaliseEmailComponentCategoryFilter(
  raw: string | null,
): EmailComponentCategoryFilter {
  if (
    raw === "buttons"
    || raw === "headers"
    || raw === "heroes"
    || raw === "footers"
    || raw === "content-blocks"
    || raw === "product-sections"
    || raw === "transactional-components"
    || raw === "newsletter-layouts"
  ) {
    return raw;
  }

  return "all";
}

export function matchesEmailComponentCategoryFilter(
  category: EmailComponentCategory,
  filter: EmailComponentCategoryFilter,
): boolean {
  if (filter === "all") {
    return true;
  }

  return FILTER_TO_CATEGORY[filter] === category;
}
