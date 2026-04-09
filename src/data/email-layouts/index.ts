import { getEmailComponentBySlug } from "@/data/email-components";
import { buildMjmlFromLibraryFiles } from "@/data/mjml-library";

export type LayoutComponentBlock = {
  componentSlug: string;
  notes: string;
};

export type LayoutSection = {
  title: string;
  description: string;
};

export type EmailLayoutSystemSlug =
  | "campaigns"
  | "saas-lifecycle"
  | "transactional"
  | "newsletter";

export type EmailLayoutSystem = {
  slug: EmailLayoutSystemSlug;
  title: string;
  description: string;
};

export type EmailLayoutRecipe = {
  slug: string;
  title: string;
  system: EmailLayoutSystemSlug;
  description: string;
  previewImageUrl: string;
  notes: string[];
  layoutSections: LayoutSection[];
  componentBlocks: LayoutComponentBlock[];
  mjmlSource: string;
};

type LayoutDefinition = Omit<EmailLayoutRecipe, "mjmlSource"> & {
  sourceFiles: string[];
};

const layoutSystems: EmailLayoutSystem[] = [
  {
    slug: "campaigns",
    title: "Campaigns",
    description: "Short promotional and conversion-oriented emails built from the same reusable block system.",
  },
  {
    slug: "saas-lifecycle",
    title: "SaaS lifecycle",
    description: "Welcome, onboarding, activation, retention, and upgrade flows for product teams.",
  },
  {
    slug: "transactional",
    title: "Transactional",
    description: "Operational emails such as receipts, shipping updates, password resets, and security alerts.",
  },
  {
    slug: "newsletter",
    title: "Newsletter",
    description: "Editorial, digest, and announcement sends assembled from repeatable content blocks.",
  },
];

export const emailLayoutSystems = layoutSystems;

function createLayout(definition: LayoutDefinition): EmailLayoutRecipe {
  return {
    slug: definition.slug,
    title: definition.title,
    system: definition.system,
    description: definition.description,
    previewImageUrl: definition.previewImageUrl,
    notes: definition.notes,
    layoutSections: definition.layoutSections,
    componentBlocks: definition.componentBlocks,
    mjmlSource: buildMjmlFromLibraryFiles(definition.sourceFiles),
  };
}

function getEmailLayoutPreviewImageUrl(slug: string): string {
  return `/email-shots-v3/layouts/${slug}.png`;
}

export const emailLayouts: EmailLayoutRecipe[] = [
  createLayout({
    slug: "product-launch-campaign",
    title: "Product Launch Campaign",
    system: "campaigns",
    description:
      "Launch-focused email stack composed from a brand header, campaign hero, feature grid, and compliance footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("product-launch-campaign"),
    notes: [
      "Good base for a single announcement email with one clear CTA.",
      "Keeps the structure shallow so the hero and feature pair stay above the fold in larger clients.",
      "Useful reference when you need a compact marketing email rather than a full newsletter.",
    ],
    layoutSections: [
      {
        title: "Brand header",
        description: "Establishes sender identity before campaign copy begins.",
      },
      {
        title: "Hero opener",
        description: "Carries the headline, support copy, and primary campaign action.",
      },
      {
        title: "Feature pair",
        description: "Shows two supporting cards for offers, modules, or launch highlights.",
      },
      {
        title: "Compliance close",
        description: "Finishes with support and footer controls.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Anchors the email with consistent sender branding.",
      },
      {
        componentSlug: "hero-overlay-modern",
        notes: "Handles the launch headline and primary CTA.",
      },
      {
        componentSlug: "dual-image-feature-grid",
        notes: "Adds two supporting product or feature highlights.",
      },
      {
        componentSlug: "footer-contact-compliance",
        notes: "Closes the send with legal and support-safe footer content.",
      },
    ],
    sourceFiles: ["header.mjml", "hero-centred.mjml", "dual-image.mjml", "footer.mjml"],
  }),
  createLayout({
    slug: "onboarding-activation-flow",
    title: "Onboarding Activation Flow",
    system: "saas-lifecycle",
    description:
      "Early lifecycle email that combines a welcome-style hero, trust strip, and support footer for activation messaging.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("onboarding-activation-flow"),
    notes: [
      "Designed for first-week product onboarding and account activation nudges.",
      "Keeps trust, next-step guidance, and support routes in one short stack.",
      "Useful when you want a softer welcome flow than a hard transactional email.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Introduces the product and sender cleanly.",
      },
      {
        title: "Welcome hero",
        description: "Frames the initial value proposition and first action.",
      },
      {
        title: "Trust strip",
        description: "Adds credibility before the close.",
      },
      {
        title: "Support footer",
        description: "Keeps preference and help routes visible.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Creates immediate sender recognition.",
      },
      {
        componentSlug: "welcome-email-hero",
        notes: "Leads with product value and the first action.",
      },
      {
        componentSlug: "logo-grid-trust-wall",
        notes: "Provides a social proof moment mid-email.",
      },
      {
        componentSlug: "footer-onboarding-legal",
        notes: "Keeps onboarding support and compliance language together.",
      },
    ],
    sourceFiles: ["header.mjml", "welcome-email-hero.mjml", "logo-grid.mjml", "footer-onboarding.mjml"],
  }),
  createLayout({
    slug: "retention-alert-sequence",
    title: "Retention Alert Sequence",
    system: "saas-lifecycle",
    description:
      "Lifecycle reminder layout pairing a split image block with a focused CTA and footer support close.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("retention-alert-sequence"),
    notes: [
      "Useful for renewals, account reminders, and account health nudges.",
      "Balances urgency with a clear action path rather than turning into a warning-only send.",
      "Works as a reference for short retention or reactivation emails.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Sets brand context before the alert copy starts.",
      },
      {
        title: "Split content block",
        description: "Pairs a support image with concise reminder copy.",
      },
      {
        title: "Primary CTA",
        description: "Pushes the reader to the next required action.",
      },
      {
        title: "Support footer",
        description: "Adds contact and compliance guidance.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Maintains sender continuity with the rest of the lifecycle system.",
      },
      {
        componentSlug: "single-image-left",
        notes: "Carries the reminder copy in a more human, less severe layout.",
      },
      {
        componentSlug: "accent-cta-button",
        notes: "Gives the reminder one strong action target.",
      },
      {
        componentSlug: "footer-contact-compliance",
        notes: "Provides support routes and close-out compliance copy.",
      },
    ],
    sourceFiles: ["header.mjml", "single-image-left.mjml", "accent-cta.mjml", "footer.mjml"],
  }),
  createLayout({
    slug: "product-showcase-digest",
    title: "Product Showcase Digest",
    system: "newsletter",
    description:
      "Digest-style product email using a multi-card showcase, testimonial support, and a compliance footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("product-showcase-digest"),
    notes: [
      "Good fit for monthly releases, product highlights, or category roundups.",
      "Adds one trust element before the footer so the email does not read like a bare grid.",
      "Useful reference for denser marketing sends that still need breathing room.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Sets recognition for recurring digest sends.",
      },
      {
        title: "Showcase grid",
        description: "Presents four featured items in one section.",
      },
      {
        title: "Testimonial",
        description: "Adds proof before the close.",
      },
      {
        title: "Footer",
        description: "Maintains preference and support controls.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Keeps recurring campaigns visually anchored.",
      },
      {
        componentSlug: "quad-image-showcase",
        notes: "Handles the main density of products or featured content.",
      },
      {
        componentSlug: "testimonial-quote",
        notes: "Adds a short proof moment before the footer.",
      },
      {
        componentSlug: "footer-contact-compliance",
        notes: "Finishes with support and compliance-safe footer content.",
      },
    ],
    sourceFiles: ["header.mjml", "quad-image.mjml", "testimonial.mjml", "footer.mjml"],
  }),
  createLayout({
    slug: "trust-and-conversion-brief",
    title: "Trust And Conversion Brief",
    system: "campaigns",
    description:
      "Short conversion email built from trust logos, proof content, and one focused CTA block.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("trust-and-conversion-brief"),
    notes: [
      "Designed for quick B2B conversion nudges and short product pitches.",
      "Useful when you want credibility and action without building a longer marketing email.",
      "Works well as a compact sales or consultation follow-up.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Clarifies sender and brand before the trust content.",
      },
      {
        title: "Trust strip",
        description: "Shows recognisable logos or badges early in the message.",
      },
      {
        title: "Proof plus CTA",
        description: "Pairs proof content with a single conversion action.",
      },
      {
        title: "Footer",
        description: "Closes the message with compliance-safe footer content.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Introduces the sender and brand cleanly.",
      },
      {
        componentSlug: "logo-grid-trust-strip",
        notes: "Supplies a compact trust wall without taking over the email.",
      },
      {
        componentSlug: "testimonial-quote",
        notes: "Adds proof before the CTA lands.",
      },
      {
        componentSlug: "accent-cta-button",
        notes: "Keeps the close direct and conversion-oriented.",
      },
      {
        componentSlug: "footer-contact-compliance",
        notes: "Provides a familiar, compliant close.",
      },
    ],
    sourceFiles: ["header.mjml", "logo-grid.mjml", "testimonial.mjml", "accent-cta.mjml", "footer.mjml"],
  }),
  createLayout({
    slug: "saas-welcome-system",
    title: "SaaS Welcome System",
    system: "saas-lifecycle",
    description:
      "Welcome email recipe for SaaS products, combining an onboarding hero, step card, app-download route, and onboarding footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("saas-welcome-system"),
    notes: [
      "Built for first-touch welcome and activation emails.",
      "Uses the public component system exactly as a product team would combine it in a real workflow.",
      "Good starting point when you want one working welcome email rather than assembling blocks from scratch.",
    ],
    layoutSections: [
      {
        title: "Brand header",
        description: "Introduces the sender and sets a familiar frame.",
      },
      {
        title: "Welcome hero",
        description: "Frames the promise of the product and the first action.",
      },
      {
        title: "Onboarding step",
        description: "Explains the first concrete setup step for the user.",
      },
      {
        title: "App follow-through",
        description: "Keeps the product close to hand on mobile and desktop.",
      },
      {
        title: "Onboarding footer",
        description: "Carries lifecycle-specific support and preference copy.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Creates immediate sender recognition.",
      },
      {
        componentSlug: "welcome-email-hero",
        notes: "Leads with the welcome message and product promise.",
      },
      {
        componentSlug: "onboarding-step-card",
        notes: "Turns onboarding into one explicit next step.",
      },
      {
        componentSlug: "app-download-strip",
        notes: "Keeps the product accessible after the first login or setup step.",
      },
      {
        componentSlug: "footer-onboarding-legal",
        notes: "Finishes with lifecycle-appropriate support language.",
      },
    ],
    sourceFiles: [
      "header.mjml",
      "welcome-email-hero.mjml",
      "onboarding-step-card.mjml",
      "app-download-superlight.mjml",
      "footer-onboarding.mjml",
    ],
  }),
  createLayout({
    slug: "onboarding-step-system",
    title: "Onboarding Step System",
    system: "saas-lifecycle",
    description:
      "Practical onboarding follow-up email built from a task card, support links, and one clear dual-action close.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("onboarding-step-system"),
    notes: [
      "Designed for step-two or step-three activation emails.",
      "Keeps the structure short enough to remain instructional rather than promotional.",
      "Useful when users need help resources and a next action in the same send.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Keeps the email visually consistent with the welcome flow.",
      },
      {
        title: "Step card",
        description: "Explains the current onboarding milestone.",
      },
      {
        title: "Support resources",
        description: "Offers help routes without interrupting the primary task.",
      },
      {
        title: "Dual CTA",
        description: "Lets teams offer continue and support actions together.",
      },
      {
        title: "Footer",
        description: "Adds lifecycle-specific legal and preference copy.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Maintains sender continuity across the onboarding system.",
      },
      {
        componentSlug: "onboarding-step-card",
        notes: "Carries the single step the user should complete next.",
      },
      {
        componentSlug: "support-links-light",
        notes: "Surfaces help routes for users who need extra support.",
      },
      {
        componentSlug: "dual-cta-actions",
        notes: "Pairs the main task with a fallback support action.",
      },
      {
        componentSlug: "footer-onboarding-legal",
        notes: "Preserves the lifecycle footer language.",
      },
    ],
    sourceFiles: [
      "header.mjml",
      "onboarding-step-card.mjml",
      "support-superlight.mjml",
      "dual-cta.mjml",
      "footer-onboarding.mjml",
    ],
  }),
  createLayout({
    slug: "feature-announcement-system",
    title: "Feature Announcement System",
    system: "saas-lifecycle",
    description:
      "Product update email combining a feature split hero, usage proof, CTA reinforcement, and app-safe footer content.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("feature-announcement-system"),
    notes: [
      "Built for feature releases, roadmap launches, and product-change announcements.",
      "Balances narrative explanation with measurable proof and one clear CTA.",
      "Useful when a product team needs a reusable update-email pattern.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Creates a cleaner product-led entry point.",
      },
      {
        title: "Feature split",
        description: "Explains the product update with space for supporting imagery.",
      },
      {
        title: "Statistics block",
        description: "Adds proof or product usage signals.",
      },
      {
        title: "CTA reinforcement",
        description: "Provides a clear route to try or review the feature.",
      },
      {
        title: "App-aware footer",
        description: "Supports digital product and platform messaging.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Sets a product-led frame for the update.",
      },
      {
        componentSlug: "feature-announcement-split",
        notes: "Handles the main product-change story.",
      },
      {
        componentSlug: "statistics-trio",
        notes: "Adds credibility with product metrics or adoption proof.",
      },
      {
        componentSlug: "accent-cta-button",
        notes: "Gives the announcement a single next step.",
      },
      {
        componentSlug: "footer-app-legal",
        notes: "Closes with platform-safe legal copy.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "feature-announcement-split.mjml",
      "engineering-stats-3-col.mjml",
      "accent-cta.mjml",
      "footer-social.mjml",
    ],
  }),
  createLayout({
    slug: "trial-ending-reminder-system",
    title: "Trial Ending Reminder System",
    system: "saas-lifecycle",
    description:
      "Trial-ending lifecycle email using an alert block, usage summary, benefits reinforcement, and support-aware close.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("trial-ending-reminder-system"),
    notes: [
      "Designed for trial ending, plan expiry, or renewal nudges.",
      "Keeps urgency readable without turning the email into a wall of warning text.",
      "Useful when teams want an upgrade path plus reminder context in one send.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Introduces the lifecycle reminder cleanly.",
      },
      {
        title: "Expiry alert",
        description: "Explains what is changing and when.",
      },
      {
        title: "Usage summary",
        description: "Reminds the user what they have been doing in the product.",
      },
      {
        title: "Benefits list",
        description: "Reinforces why staying on the paid plan matters.",
      },
      {
        title: "Onboarding footer",
        description: "Keeps support and preference handling simple.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Keeps the lifecycle message recognisable.",
      },
      {
        componentSlug: "lifecycle-trial-expiry-alert",
        notes: "Carries the timing and urgency message.",
      },
      {
        componentSlug: "lifecycle-usage-summary",
        notes: "Adds context before the upgrade ask.",
      },
      {
        componentSlug: "direct-benefits-list-dark",
        notes: "Summarises the reasons to keep access or upgrade.",
      },
      {
        componentSlug: "footer-onboarding-legal",
        notes: "Closes with support-safe lifecycle copy.",
      },
    ],
    sourceFiles: [
      "header.mjml",
      "lifecycle-trial-expiry-alert.mjml",
      "lifecycle-usage-summary.mjml",
      "buy-direct-left-dark.mjml",
      "footer-onboarding.mjml",
    ],
  }),
  createLayout({
    slug: "upgrade-confirmation-system",
    title: "Upgrade Confirmation System",
    system: "saas-lifecycle",
    description:
      "Upgrade confirmation email that confirms the plan change, reinforces product value, and keeps the app close to hand.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("upgrade-confirmation-system"),
    notes: [
      "Designed for paid-plan confirmations and post-upgrade reassurance.",
      "Pairs transactional confirmation with a short product follow-through section.",
      "Useful when product teams want an upgrade email that feels complete rather than purely operational.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Keeps the email product-led rather than purely invoice-like.",
      },
      {
        title: "Upgrade confirmation card",
        description: "Confirms the plan or product change.",
      },
      {
        title: "Product follow-through",
        description: "Points users back into the product after the change.",
      },
      {
        title: "App footer",
        description: "Supports platform and product legal copy.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Creates a cleaner product-led frame.",
      },
      {
        componentSlug: "upgrade-confirmation-card",
        notes: "Carries the main confirmation state.",
      },
      {
        componentSlug: "app-download-strip",
        notes: "Keeps the next product action visible after confirmation.",
      },
      {
        componentSlug: "footer-app-legal",
        notes: "Closes with platform-safe legal language.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "upgrade-confirmation-card.mjml",
      "app-download-superlight.mjml",
      "footer-social.mjml",
    ],
  }),
  createLayout({
    slug: "order-confirmation-system",
    title: "Order Confirmation System",
    system: "transactional",
    description:
      "Order confirmation email combining a transaction summary, a small cross-sell row, and a legal close.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("order-confirmation-system"),
    notes: [
      "Built for ecommerce and post-purchase operational sends.",
      "Uses a small product row so the email stays transactional first, commercial second.",
      "Useful when teams want a practical starting point for order-confirmation delivery.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Introduces the transaction in a stable, neutral frame.",
      },
      {
        title: "Order summary",
        description: "Confirms what was purchased and the state of the order.",
      },
      {
        title: "Related products",
        description: "Adds a modest follow-on recommendation block.",
      },
      {
        title: "Transactional footer",
        description: "Provides policy and preference controls.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Keeps the transaction header neutral and stable.",
      },
      {
        componentSlug: "order-confirmation-summary",
        notes: "Carries the primary order information.",
      },
      {
        componentSlug: "related-products-row",
        notes: "Adds a restrained recommendation layer after the core transaction content.",
      },
      {
        componentSlug: "footer-privacy-light",
        notes: "Closes with a lighter regulatory footer.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "order-confirmation-summary.mjml",
      "related-products-row.mjml",
      "footer-nostores.mjml",
    ],
  }),
  createLayout({
    slug: "receipt-system",
    title: "Receipt System",
    system: "transactional",
    description:
      "Receipt email layout with line items, invoice summary, and a concise compliance-safe footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("receipt-system"),
    notes: [
      "Designed for receipts, payment records, and invoice-issued notifications.",
      "Keeps the email operational and scannable for finance workflows.",
      "Useful when teams need a reliable transactional baseline rather than a styled marketing send.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Sets a clean transactional frame.",
      },
      {
        title: "Receipt line items",
        description: "Shows the detailed items and totals clearly.",
      },
      {
        title: "Invoice summary",
        description: "Highlights invoice or payment state in a compact card.",
      },
      {
        title: "Transactional footer",
        description: "Closes with sender and preference information.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Keeps transactional emails visually consistent.",
      },
      {
        componentSlug: "receipt-line-items-table",
        notes: "Carries the main receipt detail.",
      },
      {
        componentSlug: "invoice-summary-card",
        notes: "Summarises invoice status or payment context.",
      },
      {
        componentSlug: "footer-privacy-light",
        notes: "Finishes the send with a lean footer.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "receipt-line-items.mjml",
      "invoice-summary-card.mjml",
      "footer-nostores.mjml",
    ],
  }),
  createLayout({
    slug: "shipping-notification-system",
    title: "Shipping Notification System",
    system: "transactional",
    description:
      "Shipping update email combining tracking context, support links, and a clean legal footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("shipping-notification-system"),
    notes: [
      "Built for dispatch and in-transit operational messages.",
      "Pairs the main status card with practical support routes instead of more promotional content.",
      "Useful as a base for fulfilment, delivery, and order-status messaging.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Keeps the email calm and operational.",
      },
      {
        title: "Tracking update",
        description: "Shows the current shipment state and next milestone.",
      },
      {
        title: "Support links",
        description: "Offers clear routes for delivery or order questions.",
      },
      {
        title: "Transactional footer",
        description: "Closes with policy and sender information.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Keeps the delivery message neutral and consistent.",
      },
      {
        componentSlug: "shipping-notification-tracker",
        notes: "Carries the current shipping state and timeline.",
      },
      {
        componentSlug: "support-links-light",
        notes: "Adds quick help routes if the shipment needs attention.",
      },
      {
        componentSlug: "footer-privacy-light",
        notes: "Provides the expected transactional close.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "shipping-notification-tracker.mjml",
      "support-superlight.mjml",
      "footer-nostores.mjml",
    ],
  }),
  createLayout({
    slug: "password-reset-system",
    title: "Password Reset System",
    system: "transactional",
    description:
      "Password reset email with the reset card, a privacy note, and a lean transactional footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("password-reset-system"),
    notes: [
      "Designed for authentication and account recovery flows.",
      "Keeps the stack compact so the recovery action is easy to find on mobile.",
      "Useful when product teams want a dependable auth-email starting point.",
    ],
    layoutSections: [
      {
        title: "Header",
        description: "Introduces the sender without distracting from the reset action.",
      },
      {
        title: "Reset card",
        description: "Carries the main recovery copy and action.",
      },
      {
        title: "Privacy note",
        description: "Adds a small clarification block for account safety.",
      },
      {
        title: "Transactional footer",
        description: "Provides the legal and preference close.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-brand-row",
        notes: "Sets the sender identity before the reset content begins.",
      },
      {
        componentSlug: "password-reset-card",
        notes: "Handles the primary account-recovery action.",
      },
      {
        componentSlug: "privacy-note-icon-left",
        notes: "Adds a short supporting security or privacy clarification.",
      },
      {
        componentSlug: "footer-privacy-light",
        notes: "Keeps the footer lean and operational.",
      },
    ],
    sourceFiles: [
      "header.mjml",
      "password-reset-card.mjml",
      "single-icon-left-superlight.mjml",
      "footer-nostores.mjml",
    ],
  }),
  createLayout({
    slug: "security-alert-system",
    title: "Security Alert System",
    system: "transactional",
    description:
      "Security alert email with a high-signal alert card, direct support route, and a darker operational footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("security-alert-system"),
    notes: [
      "Designed for security notifications and account-risk messages.",
      "Uses a darker frame so the alert feels distinct from general lifecycle emails.",
      "Useful when teams need a serious but still readable operational design pattern.",
    ],
    layoutSections: [
      {
        title: "Dark header",
        description: "Signals that the message is operationally important.",
      },
      {
        title: "Security alert",
        description: "Explains the event and what the user should do next.",
      },
      {
        title: "Telephone support",
        description: "Provides a direct support route for urgent help.",
      },
      {
        title: "Dark footer",
        description: "Closes the alert with a visually consistent legal footer.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-dark-brand",
        notes: "Creates a more urgent visual frame than a standard marketing header.",
      },
      {
        componentSlug: "security-alert-card",
        notes: "Carries the core alert content.",
      },
      {
        componentSlug: "telephone-support-highlight",
        notes: "Adds a direct human support path for critical moments.",
      },
      {
        componentSlug: "footer-minimal-dark",
        notes: "Keeps the close visually aligned with the alert framing.",
      },
    ],
    sourceFiles: [
      "header-black-e3.mjml",
      "security-alert-card.mjml",
      "telephone-support-dark.mjml",
      "footer-black.mjml",
    ],
  }),
  createLayout({
    slug: "editorial-newsletter-system",
    title: "Editorial Newsletter System",
    system: "newsletter",
    description:
      "Editorial newsletter recipe combining an editor note, a lead feature, a roundup grid, and a lighter social footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("editorial-newsletter-system"),
    notes: [
      "Built for editorial sends where a human intro leads into the main story and supporting articles.",
      "Keeps the structure modular so editors can swap sections without rewriting the whole email.",
      "Useful when marketing teams need a repeatable editorial template rather than a one-off campaign.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Provides a clean recurring newsletter frame.",
      },
      {
        title: "Editor note",
        description: "Adds a personal opening before the body content.",
      },
      {
        title: "Lead feature",
        description: "Highlights the main story or announcement.",
      },
      {
        title: "Roundup grid",
        description: "Adds supporting stories lower in the email.",
      },
      {
        title: "Newsletter footer",
        description: "Closes with subscription-safe footer content.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Creates a calm, repeatable newsletter top row.",
      },
      {
        componentSlug: "newsletter-editor-note",
        notes: "Introduces the issue in a more human voice.",
      },
      {
        componentSlug: "editorial-newsletter-feature",
        notes: "Handles the lead story or feature.",
      },
      {
        componentSlug: "blog-roundup-grid",
        notes: "Provides the supporting content grid.",
      },
      {
        componentSlug: "footer-social-light",
        notes: "Adds the lighter footer variant suited to recurring content sends.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "newsletter-editor-note.mjml",
      "editorial-newsletter-feature.mjml",
      "blog-roundup-grid.mjml",
      "footer-24-white.mjml",
    ],
  }),
  createLayout({
    slug: "weekly-digest-system",
    title: "Weekly Digest System",
    system: "newsletter",
    description:
      "Weekly digest layout combining a stacked list, multi-article grid, and newsletter footer for recurring editorial sends.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("weekly-digest-system"),
    notes: [
      "Designed for weekly product digests, company updates, and editorial newsletters.",
      "Combines stacked scanning with one denser content section lower in the email.",
      "Useful when teams need a digest template that can stretch or shrink issue by issue.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Sets a repeatable digest frame.",
      },
      {
        title: "Digest list",
        description: "Carries the main top-level story list.",
      },
      {
        title: "Article grid",
        description: "Adds secondary coverage or content picks.",
      },
      {
        title: "Newsletter footer",
        description: "Closes with lighter recurring-send footer content.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Keeps recurring issues visually consistent.",
      },
      {
        componentSlug: "weekly-digest-list",
        notes: "Carries the main editorial rundown.",
      },
      {
        componentSlug: "multi-article-newsletter-grid",
        notes: "Adds a denser lower-content block.",
      },
      {
        componentSlug: "footer-social-light",
        notes: "Finishes with newsletter-safe footer controls.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "weekly-digest-list.mjml",
      "multi-article-newsletter-grid.mjml",
      "footer-24-white.mjml",
    ],
  }),
  createLayout({
    slug: "announcement-newsletter-system",
    title: "Announcement Newsletter System",
    system: "newsletter",
    description:
      "Announcement-led newsletter using a product update digest, event card, CTA reinforcement, and recurring footer.",
    previewImageUrl: getEmailLayoutPreviewImageUrl("announcement-newsletter-system"),
    notes: [
      "Built for launch notes, event pushes, or monthly product announcements.",
      "Starts with a denser announcement module and then gives the reader one next action.",
      "Useful when editorial teams need a more event-driven alternative to a classic digest.",
    ],
    layoutSections: [
      {
        title: "Centred header",
        description: "Creates a repeatable newsletter identity.",
      },
      {
        title: "Announcement block",
        description: "Frames the update or product announcement.",
      },
      {
        title: "Event or follow-up card",
        description: "Adds a secondary supporting action or date-based detail.",
      },
      {
        title: "CTA section",
        description: "Provides a single next action before the footer.",
      },
      {
        title: "Newsletter footer",
        description: "Closes with the recurring-send footer variant.",
      },
    ],
    componentBlocks: [
      {
        componentSlug: "header-centred-brand",
        notes: "Introduces the announcement in a calm editorial frame.",
      },
      {
        componentSlug: "product-update-digest",
        notes: "Handles the main update story and supporting copy.",
      },
      {
        componentSlug: "webinar-event-card",
        notes: "Adds a secondary event or follow-up block.",
      },
      {
        componentSlug: "accent-cta-highlight",
        notes: "Keeps the announcement pointed at one action.",
      },
      {
        componentSlug: "footer-social-light",
        notes: "Finishes with newsletter-safe footer controls.",
      },
    ],
    sourceFiles: [
      "header-e3-center.mjml",
      "product-update-digest.mjml",
      "event-webinar.mjml",
      "accent-cta.mjml",
      "footer-24-white.mjml",
    ],
  }),
];

function assertNoDuplicateLayoutSlugs(layouts: EmailLayoutRecipe[]): void {
  const seen = new Set<string>();

  for (const layout of layouts) {
    if (seen.has(layout.slug)) {
      throw new Error(
        `[email-layouts] Duplicate slug found: "${layout.slug}". Slugs must be unique.`,
      );
    }
    seen.add(layout.slug);
  }
}

function assertKnownComponentBlocks(layouts: EmailLayoutRecipe[]): void {
  for (const layout of layouts) {
    for (const block of layout.componentBlocks) {
      if (!getEmailComponentBySlug(block.componentSlug)) {
        throw new Error(
          `[email-layouts] Layout "${layout.slug}" references unknown component slug "${block.componentSlug}".`,
        );
      }
    }
  }
}

function assertKnownLayoutSystems(layouts: EmailLayoutRecipe[]): void {
  const knownSystems = new Set(layoutSystems.map((system) => system.slug));

  for (const layout of layouts) {
    if (!knownSystems.has(layout.system)) {
      throw new Error(
        `[email-layouts] Layout "${layout.slug}" references unknown system "${layout.system}".`,
      );
    }
  }
}

assertNoDuplicateLayoutSlugs(emailLayouts);
assertKnownComponentBlocks(emailLayouts);
assertKnownLayoutSystems(emailLayouts);

const emailLayoutBySlug = new Map(emailLayouts.map((layout) => [layout.slug, layout]));
const emailLayoutSystemBySlug = new Map(layoutSystems.map((system) => [system.slug, system]));

export function getEmailLayoutBySlug(slug: string): EmailLayoutRecipe | undefined {
  return emailLayoutBySlug.get(slug);
}

export function getEmailLayoutSystemBySlug(
  slug: EmailLayoutSystemSlug,
): EmailLayoutSystem | undefined {
  return emailLayoutSystemBySlug.get(slug);
}

export function getEmailLayoutsBySystem(system: EmailLayoutSystemSlug): EmailLayoutRecipe[] {
  return emailLayouts.filter((layout) => layout.system === system);
}
