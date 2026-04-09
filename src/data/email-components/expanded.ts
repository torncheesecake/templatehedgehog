import { loadMjmlLibraryFragment, wrapMjmlFragment } from "@/data/mjml-library";
import type { EmailCompatibility, EmailComponent } from "@/data/email-components";

function standardCompatibility(outlookNote: string, yahooNote?: string): EmailCompatibility[] {
  return [
    {
      client: "Gmail (Web + Mobile)",
      status: "tested",
      notes: "Core structure, spacing, and CTA rendering hold up in Gmail web and mobile views.",
    },
    {
      client: "Outlook Desktop (Windows)",
      status: "partial",
      notes: outlookNote,
    },
    {
      client: "Apple Mail (macOS + iOS)",
      status: "tested",
    },
    {
      client: "Yahoo Mail",
      status: yahooNote ? "partial" : "tested",
      notes: yahooNote,
    },
  ];
}

type ComponentConfig = Omit<EmailComponent, "mjmlSource">;

function makeComponent(config: ComponentConfig): EmailComponent {
  return {
    ...config,
    mjmlSource: wrapMjmlFragment(loadMjmlLibraryFragment(config.sourceFile)),
  };
}

export const expandedEmailComponents: EmailComponent[] = [
  makeComponent({
    slug: "accent-cta-highlight",
    title: "Accent CTA",
    category: "Buttons",
    description: "Large single CTA block for closing announcement, newsletter, and lifecycle sections.",
    tags: ["cta", "button", "highlight", "marketing"],
    sourceFile: "accent-cta.mjml",
    previewImageUrl: "/email-shots-v3/primary-cta-component.png",
    compatibility: standardCompatibility("Rounded corners may flatten slightly in older Outlook builds."),
    usageGuidance: [
      "Use when one final action should close the section cleanly.",
      "Keep CTA copy short so mobile buttons stay visually balanced.",
    ],
    accessibilityNotes: [
      "Use action-led button text that still makes sense out of visual context.",
      "Check colour contrast if you swap the blue fill for a branded accent.",
    ],
  }),
  makeComponent({
    slug: "dual-cta-actions",
    title: "Dual CTA",
    category: "Buttons",
    description: "Two side-by-side call-to-action buttons for comparison or primary and secondary actions.",
    tags: ["cta", "buttons", "comparison", "split"],
    sourceFile: "dual-cta.mjml",
    previewImageUrl: "/email-shots-v3/pricing-table.png",
    compatibility: standardCompatibility("Outlook can compress side-by-side button spacing in narrow panes."),
    usageGuidance: [
      "Use when readers need a clear primary action and a lower-friction secondary path.",
      "Avoid adding more than two options or the decision hierarchy weakens quickly.",
    ],
    accessibilityNotes: [
      "Make the difference between the two actions explicit in the button labels.",
      "Keep button order logical so stacked mobile layouts still read clearly.",
    ],
  }),
  makeComponent({
    slug: "alert-notice-banner",
    title: "Alert Banner",
    category: "Transactional Components",
    description: "Compact alert callout for account notices, operational updates, and support messages.",
    tags: ["alert", "notice", "transactional", "status"],
    sourceFile: "alert-box.mjml",
    previewImageUrl: "/email-shots-v3/announcement-banner.png",
    compatibility: standardCompatibility("Border accent and icon alignment can vary slightly in legacy Outlook rendering."),
    usageGuidance: [
      "Use near the top of an email when the update is urgent or operationally important.",
      "Keep the copy concise so the banner feels like a signal, not another body paragraph.",
    ],
    accessibilityNotes: [
      "Do not rely on colour alone to communicate urgency or severity.",
      "Ensure the headline describes the alert clearly for screen-reader users.",
    ],
  }),
  makeComponent({
    slug: "hero-image-left-split",
    title: "Hero Image Left",
    category: "Heroes",
    description: "Split hero with image on the left and message stack on the right.",
    tags: ["hero", "split", "image-left", "marketing"],
    sourceFile: "hero-image-left.mjml",
    previewImageUrl: "/email-shots-v3/newsletter-editorial.png",
    compatibility: standardCompatibility("Split hero columns can stack earlier in Outlook desktop panes."),
    usageGuidance: [
      "Use when the image should lead the section but the copy still needs equal weight.",
      "Review the mobile stack order if the image carries essential context.",
    ],
    accessibilityNotes: [
      "Use meaningful alt text for the lead image because it appears first in the reading order.",
      "Keep the headline and CTA understandable even if the image fails to load.",
    ],
  }),
  makeComponent({
    slug: "hero-banner-overlay",
    title: "Hero Overlay Banner",
    category: "Heroes",
    description: "Full-width overlay hero for launches, announcements, and bold campaign intros.",
    tags: ["hero", "overlay", "launch", "campaign"],
    sourceFile: "hero-overlay-modern.mjml",
    previewImageUrl: "/email-shots-v3/announcement-banner.png",
    compatibility: standardCompatibility("Background-image treatment can flatten or simplify in Outlook desktop."),
    usageGuidance: [
      "Use when one statement and one action should dominate the first screenful of the email.",
      "Keep supporting copy short so the image still feels spacious on mobile.",
    ],
    accessibilityNotes: [
      "Maintain strong text contrast against the image background.",
      "Do not hide core meaning inside the background image itself.",
    ],
  }),
  makeComponent({
    slug: "logo-grid-trust-wall",
    title: "Logo Grid",
    category: "Content Blocks",
    description: "Trust strip of partner or customer logos for proof and credibility sections.",
    tags: ["logos", "trust", "proof", "brand"],
    sourceFile: "logo-grid.mjml",
    previewImageUrl: "/email-shots-v3/newsletter-editorial.png",
    compatibility: standardCompatibility("Multiple logo columns can tighten slightly in Outlook desktop."),
    usageGuidance: [
      "Use between a hero and CTA when you need a lightweight proof layer.",
      "Normalise logo sizes before export so the strip stays consistent.",
    ],
    accessibilityNotes: [
      "Use alt text that distinguishes each logo if the marks communicate meaning.",
      "Do not let low-contrast greyscale treatments make the logos unreadable.",
    ],
  }),
  makeComponent({
    slug: "quad-image-grid",
    title: "Quad Image Grid",
    category: "Product Sections",
    description: "Four-up card grid for products, resources, or editorial picks.",
    tags: ["grid", "four-up", "cards", "catalogue"],
    sourceFile: "quad-image.mjml",
    previewImageUrl: "/email-shots-v3/product-grid-4up.png",
    compatibility: standardCompatibility("Four columns often collapse aggressively in Outlook and smaller panes."),
    usageGuidance: [
      "Use for dense product or content selections where breadth matters more than depth.",
      "Keep copy very short or the four-up layout becomes hard to scan on mobile.",
    ],
    accessibilityNotes: [
      "Make each card label distinct so assistive technology users can tell items apart.",
      "Check mobile stacking order to ensure the most important card appears first.",
    ],
  }),
  makeComponent({
    slug: "dual-text-columns",
    title: "Dual Text Columns",
    category: "Content Blocks",
    description: "Two-column editorial or feature-copy block for balanced reading sections.",
    tags: ["text", "columns", "editorial", "content"],
    sourceFile: "dual-text.mjml",
    previewImageUrl: "/email-shots-v3/text-centred-component.png",
    compatibility: standardCompatibility("Two-column copy can stack early in Outlook desktop views."),
    usageGuidance: [
      "Use when two ideas need equal space without adding more imagery.",
      "Keep both columns roughly similar in length so the section feels balanced.",
    ],
    accessibilityNotes: [
      "Avoid long centred or tightly packed copy blocks that are hard to scan.",
      "Use clear subheadings so each column has an obvious purpose.",
    ],
  }),
  makeComponent({
    slug: "single-image-centred-feature",
    title: "Single Image Centred",
    category: "Content Blocks",
    description: "Single centred image with short supporting copy and linked follow-up text.",
    tags: ["image", "centred", "feature", "content"],
    sourceFile: "single-image-centred.mjml",
    previewImageUrl: "/email-shots-v3/hero-launch.png",
    compatibility: standardCompatibility("Large centred images may crop differently in some Outlook panes."),
    usageGuidance: [
      "Use when one image should do most of the visual work and the copy simply frames it.",
      "Keep the link treatment short so it reads as a clear follow-up action.",
    ],
    accessibilityNotes: [
      "Use alt text that adds context beyond the surrounding paragraph.",
      "Do not place essential CTA wording only in the linked image.",
    ],
  }),
  makeComponent({
    slug: "hero-image-right-split",
    title: "Hero Image Right",
    category: "Heroes",
    description: "Split hero with message stack on the left and image support on the right.",
    tags: ["hero", "split", "image-right", "marketing"],
    sourceFile: "hero-image-right.mjml",
    previewImageUrl: "/email-shots-v3/single-image-right-component.png",
    compatibility: standardCompatibility("Outlook desktop can adjust the split ratio and stack earlier than webmail."),
    usageGuidance: [
      "Use when copy should lead but a strong supporting image still matters.",
      "Check the mobile stacking order before using it in narrow transactional templates.",
    ],
    accessibilityNotes: [
      "The lead copy should still work if the image does not load.",
      "Keep CTA text descriptive rather than generic.",
    ],
  }),
  makeComponent({
    slug: "triple-image-showcase",
    title: "Triple Image Showcase",
    category: "Product Sections",
    description: "Three-up image block for product, content, or feature showcases.",
    tags: ["grid", "three-up", "showcase", "cards"],
    sourceFile: "triple-image.mjml",
    previewImageUrl: "/email-shots-v3/product-grid-2up.png",
    compatibility: standardCompatibility("Three-column layouts can become visually tight in Outlook desktop."),
    usageGuidance: [
      "Use when three equal options need a clean comparison layout.",
      "Keep headlines short so the row survives mobile stacking without visual clutter.",
    ],
    accessibilityNotes: [
      "Differentiate each card clearly in text, not just imagery.",
      "Ensure image alt text does not simply repeat the headline below it.",
    ],
  }),
  makeComponent({
    slug: "webinar-event-card",
    title: "Webinar Event Card",
    category: "Newsletter Layouts",
    description: "Event sign-up block for newsletters, launches, and webinar promotion sends.",
    tags: ["event", "webinar", "newsletter", "registration"],
    sourceFile: "event-webinar.mjml",
    previewImageUrl: "/email-shots-v3/newsletter-editorial.png",
    compatibility: standardCompatibility("Emoji and date-line wrapping can vary between Outlook and webmail clients."),
    usageGuidance: [
      "Use inside newsletters or campaign sends when one event needs a self-contained registration block.",
      "Swap out the date line and CTA target before export so stale event details do not linger.",
    ],
    accessibilityNotes: [
      "Keep the event title and date readable without relying on the image.",
      "Make the CTA label reflect the actual registration action.",
    ],
  }),
  makeComponent({
    slug: "header-centred-brand",
    title: "Header Centred",
    category: "Headers",
    description: "Simple centred brand header for newsletters and editorial sends.",
    tags: ["header", "logo", "centred", "brand"],
    sourceFile: "header-e3-center.mjml",
    previewImageUrl: "/email-shots-v3/header-component.png",
    compatibility: standardCompatibility("Centred logo rows are generally stable, with minor spacing shifts in Outlook."),
    usageGuidance: [
      "Use when the brand mark should sit alone without utility links or navigation.",
      "Keep logo dimensions conservative so the header stays compact on mobile.",
    ],
    accessibilityNotes: [
      "Make sure the logo alt text identifies the sender clearly.",
      "Do not rely on image-only branding if the send needs stronger origin context.",
    ],
  }),
  makeComponent({
    slug: "password-reset-card",
    title: "Password Reset Card",
    category: "Transactional Components",
    description: "Focused password reset prompt for account recovery and sign-in flows.",
    tags: ["password", "reset", "transactional", "security"],
    sourceFile: "password-reset-card.mjml",
    previewImageUrl: "/email-shots-v3/account-security.png",
    compatibility: standardCompatibility("Button spacing and centred copy remain stable, though Outlook may tighten vertical rhythm."),
    usageGuidance: [
      "Use as the primary block in password reset and credential recovery emails.",
      "Keep the CTA path singular so the user is not distracted during a security task.",
    ],
    accessibilityNotes: [
      "Make the reset action explicit and avoid vague CTA wording.",
      "Ensure the explanatory copy still makes sense if the button is announced separately.",
    ],
  }),
  makeComponent({
    slug: "order-confirmation-summary",
    title: "Order Confirmation Summary",
    category: "Transactional Components",
    description: "Order summary module with headline, confirmation message, and compact line summary.",
    tags: ["order", "confirmation", "transactional", "summary"],
    sourceFile: "order-confirmation-summary.mjml",
    previewImageUrl: "/email-shots-v3/order-shipped.png",
    compatibility: standardCompatibility("Table-like rows remain readable, though Outlook can tighten cell padding."),
    usageGuidance: [
      "Use at the top of order confirmation or service confirmation emails.",
      "Keep line summary content short so key reference numbers remain scannable.",
    ],
    accessibilityNotes: [
      "Ensure line-item labels are meaningful when read aloud in sequence.",
      "Do not encode order status using colour alone.",
    ],
  }),
  makeComponent({
    slug: "receipt-line-items-table",
    title: "Receipt Line Items",
    category: "Transactional Components",
    description: "Receipt table for payments, invoices, and transaction summaries.",
    tags: ["receipt", "invoice", "table", "transactional"],
    sourceFile: "receipt-line-items.mjml",
    previewImageUrl: "/email-shots-v3/transactional-receipt.png",
    compatibility: standardCompatibility("Receipt tables stay readable, though Outlook may compress row spacing."),
    usageGuidance: [
      "Use when finance-related emails need clear itemised totals.",
      "Keep label wording consistent so the receipt is easy to reconcile quickly.",
    ],
    accessibilityNotes: [
      "Maintain a clear table structure so labels and amounts stay associated.",
      "Use strong visual and textual hierarchy for the total row.",
    ],
  }),
  makeComponent({
    slug: "shipping-notification-tracker",
    title: "Shipping Notification Tracker",
    category: "Transactional Components",
    description: "Step-based shipment tracker for delivery updates and status emails.",
    tags: ["shipping", "delivery", "tracker", "transactional"],
    sourceFile: "shipping-notification-tracker.mjml",
    previewImageUrl: "/email-shots-v3/order-shipped.png",
    compatibility: standardCompatibility("Multi-column status steps can feel tighter in Outlook desktop."),
    usageGuidance: [
      "Use for shipment, fulfilment, or service milestone updates.",
      "Keep each step label short so the sequence remains easy to scan on mobile.",
    ],
    accessibilityNotes: [
      "Make the current step understandable without relying on colour or position alone.",
      "Use simple step labels that remain clear when announced linearly.",
    ],
  }),
  makeComponent({
    slug: "account-verification-cta",
    title: "Account Verification CTA",
    category: "Transactional Components",
    description: "Account verification block for sign-up flows and email validation messages.",
    tags: ["verification", "account", "transactional", "signup"],
    sourceFile: "account-verification-cta.mjml",
    previewImageUrl: "/email-shots-v3/account-security.png",
    compatibility: standardCompatibility("Single CTA cards are stable, with minor button spacing changes in Outlook."),
    usageGuidance: [
      "Use after sign-up or email change flows where confirmation must be immediate.",
      "Do not add competing links that dilute the verification path.",
    ],
    accessibilityNotes: [
      "The action should be explicit about what is being verified.",
      "Keep the explanatory copy short enough for quick scanning in assistive technology.",
    ],
  }),
  makeComponent({
    slug: "newsletter-editor-note",
    title: "Newsletter Editor Note",
    category: "Newsletter Layouts",
    description: "Short editorial intro block for newsletters and digest-style sends.",
    tags: ["newsletter", "editorial", "intro", "content"],
    sourceFile: "newsletter-editor-note.mjml",
    previewImageUrl: "/email-shots-v3/newsletter-editorial.png",
    compatibility: standardCompatibility("Single-column editorial copy is very stable across major clients."),
    usageGuidance: [
      "Use near the top of digest emails to set context before the main articles or sections.",
      "Keep the note personal and short so it reads like framing, not another article.",
    ],
    accessibilityNotes: [
      "Avoid overly long paragraphs in editorial intros.",
      "Use a clear heading so the note is distinguishable from the articles that follow.",
    ],
  }),
  makeComponent({
    slug: "lifecycle-trial-expiry-alert",
    title: "Trial Expiry Alert",
    category: "Transactional Components",
    description: "Lifecycle alert card for upcoming renewals, trial cut-offs, and upgrade nudges.",
    tags: ["trial", "expiry", "lifecycle", "alert"],
    sourceFile: "lifecycle-trial-expiry-alert.mjml",
    previewImageUrl: "/email-shots-v3/announcement-banner.png",
    compatibility: standardCompatibility("Alert styling is stable, though Outlook can simplify the border treatment."),
    usageGuidance: [
      "Use when a lifecycle deadline needs to be explicit and actionable.",
      "Keep the message time-bound so the urgency feels credible rather than vague.",
    ],
    accessibilityNotes: [
      "Do not signal urgency using colour alone.",
      "Make the timing and required action explicit in text.",
    ],
  }),
  makeComponent({
    slug: "lifecycle-usage-summary",
    title: "Usage Summary Strip",
    category: "Content Blocks",
    description: "Compact metrics strip for activation, retention, and weekly product update emails.",
    tags: ["usage", "metrics", "lifecycle", "summary"],
    sourceFile: "lifecycle-usage-summary.mjml",
    previewImageUrl: "/email-shots-v3/pricing-table.png",
    compatibility: standardCompatibility("Simple metric columns are stable, with predictable Outlook stacking behaviour."),
    usageGuidance: [
      "Use when activity or adoption metrics strengthen the surrounding lifecycle message.",
      "Keep the number of metrics low so each value remains legible on mobile.",
    ],
    accessibilityNotes: [
      "Provide labels that explain what each number represents.",
      "Do not rely on visual grouping alone to explain which metric is most important.",
    ],
  }),
];
