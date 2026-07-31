/**
 * Customer testimonials.
 *
 * This file ships EMPTY on purpose. The site must never display fabricated,
 * placeholder, or "coming soon" quotes. The testimonials section renders
 * nothing while this array is empty, so an honest page is the default.
 *
 * HOW TO ADD A REAL QUOTE
 * 1. Get explicit permission from the customer to publish their words,
 *    name, role, and company. Set `permissionConfirmed: true` only when
 *    that permission is on record.
 * 2. Quote them verbatim. Do not paraphrase into marketing language.
 * 3. Add an entry to the `testimonials` array below, for example:
 *
 *      {
 *        quote: "We shipped our onboarding sequence in an afternoon instead of a week.",
 *        name: "Jane Doe",
 *        role: "Lifecycle Lead",
 *        company: "Acme",
 *        permissionConfirmed: true,
 *      }
 *
 * 4. `name`, `role`, and `company` are optional so an anonymised but real
 *    quote can still be shown (for example, role and company only). Never
 *    invent a name to fill the field.
 *
 * FUTURE: AGGREGATE RATING SCHEMA
 * Once real, permission-confirmed quotes exist (ideally with star ratings
 * collected separately), this data can feed a schema.org AggregateRating /
 * Review block in src/lib/seo.ts. Do not emit rating schema while this
 * array is empty, because that would assert reviews that do not exist.
 */

export type Testimonial = {
  /** The customer's words, quoted verbatim. */
  quote: string;
  /** Customer name. Optional so an anonymised but real quote can be used. */
  name?: string;
  /** Job title or role, for example "Lifecycle Lead". */
  role?: string;
  /** Company or organisation name. */
  company?: string;
  /**
   * True only when the customer has explicitly agreed to publication of
   * this quote and attribution. Never set this true without that record.
   */
  permissionConfirmed?: boolean;
};

/**
 * Real, permission-confirmed testimonials only. Empty until then.
 */
export const testimonials: Testimonial[] = [];

/** True when at least one real testimonial is available to display. */
export const hasTestimonials = testimonials.length > 0;
