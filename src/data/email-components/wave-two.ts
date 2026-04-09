import { loadMjmlLibraryFragment, wrapMjmlFragment } from "@/data/mjml-library";
import type { EmailCompatibility, EmailComponent } from "@/data/email-components";

function standardCompatibility(outlookNote: string, yahooNote?: string): EmailCompatibility[] {
  return [
    {
      client: "Gmail (Web + Mobile)",
      status: "tested",
      notes: "Core spacing, stack order, and CTA rendering hold up in Gmail web and mobile views.",
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

export const waveTwoEmailComponents: EmailComponent[] = [
  makeComponent({
    slug: "invoice-summary-card",
    title: "Invoice Summary Card",
    category: "Transactional Components",
    description: "Compact invoice summary for billing notices, finance reminders, and accounts receivable workflows.",
    tags: ["invoice", "billing", "finance", "transactional"],
    sourceFile: "invoice-summary-card.mjml",
    previewImageUrl: "/email-shots-v3/invoice-summary-card.png",
    compatibility: standardCompatibility(
      "MJML tables stay reliable, though Outlook can compress right-aligned amount spacing.",
    ),
    usageGuidance: [
      "Use near the top of invoice emails when the recipient needs amount, due date, and reference details immediately.",
      "Pair it with a payment CTA or receipt table rather than burying the summary deep in longer finance copy.",
    ],
    accessibilityNotes: [
      "Keep invoice labels explicit so screen readers announce amounts and due dates in a meaningful order.",
      "Use clear text hierarchy for the total row instead of relying on colour or borders alone.",
    ],
  }),
  makeComponent({
    slug: "support-ticket-confirmation",
    title: "Support Ticket Confirmation",
    category: "Transactional Components",
    description: "Confirmation block for support acknowledgements with ticket reference and expected response timing.",
    tags: ["support", "ticket", "confirmation", "transactional"],
    sourceFile: "support-ticket-confirmation.mjml",
    previewImageUrl: "/email-shots-v3/support-ticket-confirmation.png",
    compatibility: standardCompatibility(
      "Two-column metadata rows remain readable, though Outlook can tighten spacing between support fields.",
    ),
    usageGuidance: [
      "Use immediately after contact or support form submission so the user receives a clear ticket reference.",
      "Keep the response target realistic and short enough to scan beside the ticket identifier.",
    ],
    accessibilityNotes: [
      "Ensure ticket identifiers and response timing are labelled clearly when read aloud in sequence.",
      "Do not rely on proximity alone to connect the ticket number with its label.",
    ],
  }),
  makeComponent({
    slug: "security-alert-card",
    title: "Security Alert Card",
    category: "Transactional Components",
    description: "Operational security alert for unfamiliar sign-ins, device changes, and account activity warnings.",
    tags: ["security", "alert", "account", "transactional"],
    sourceFile: "security-alert-card.mjml",
    previewImageUrl: "/email-shots-v3/security-alert-card.png",
    compatibility: standardCompatibility(
      "Border accents are stable, but Outlook can tighten spacing around metadata lines and CTA buttons.",
    ),
    usageGuidance: [
      "Use for account protection flows where the user may need to verify or revoke a suspicious action quickly.",
      "Keep the event details factual and compact so the alert reads like an operational notice rather than marketing copy.",
    ],
    accessibilityNotes: [
      "State the alert reason in text so the message remains understandable without coloured callouts.",
      "Make the follow-up action descriptive, especially if the CTA sends the user to a security review flow.",
    ],
  }),
  makeComponent({
    slug: "order-status-update",
    title: "Order Status Update",
    category: "Transactional Components",
    description: "Three-step fulfilment tracker for shipping progress, service milestones, and order-state updates.",
    tags: ["order", "status", "shipping", "transactional"],
    sourceFile: "order-status-update.mjml",
    previewImageUrl: "/email-shots-v3/order-status-update.png",
    compatibility: standardCompatibility(
      "Step columns can compress in Outlook desktop, so short labels are important for reliable layout.",
    ),
    usageGuidance: [
      "Use when the recipient needs a quick operational update without reading a long order summary.",
      "Keep status labels short and sequential so the tracker still reads clearly after mobile stacking.",
    ],
    accessibilityNotes: [
      "Make each milestone understandable in linear reading order because some clients will stack the columns.",
      "Do not use colour alone to show which step is complete or pending.",
    ],
  }),
  makeComponent({
    slug: "invoice-due-reminder",
    title: "Invoice Due Reminder",
    category: "Transactional Components",
    description: "Reminder banner for upcoming invoice deadlines and payment collection nudges.",
    tags: ["invoice", "reminder", "billing", "payment"],
    sourceFile: "invoice-due-reminder.mjml",
    previewImageUrl: "/email-shots-v3/invoice-due-reminder.png",
    compatibility: standardCompatibility(
      "Warning-style panels render reliably, though Outlook can simplify accent borders and internal spacing.",
    ),
    usageGuidance: [
      "Use in finance workflows where timing matters more than a full invoice breakdown.",
      "Add the exact amount due and deadline in the body copy so the reminder remains actionable at a glance.",
    ],
    accessibilityNotes: [
      "Make the due date and amount explicit in text instead of leaving them implied by visual emphasis.",
      "Ensure the reminder still reads clearly if the warning colour treatment is not perceived.",
    ],
  }),
  makeComponent({
    slug: "payment-failed-notice",
    title: "Payment Failed Notice",
    category: "Transactional Components",
    description: "Billing failure alert for renewal problems, subscription retries, and card-update flows.",
    tags: ["payment", "billing", "failed", "subscription"],
    sourceFile: "payment-failed-notice.mjml",
    previewImageUrl: "/email-shots-v3/payment-failed-notice.png",
    compatibility: standardCompatibility(
      "Alert panels are stable, though Outlook can tighten the button rhythm beneath warning copy.",
    ),
    usageGuidance: [
      "Use when the next step is operationally urgent and the user needs to update billing details quickly.",
      "Keep the copy focused on the failure state and resolution path rather than bundling in promotional messaging.",
    ],
    accessibilityNotes: [
      "Describe the billing problem explicitly so the message does not rely on warning colours or tone alone.",
      "Use a CTA label that explains the fix, such as updating the payment method or reviewing billing settings.",
    ],
  }),
  makeComponent({
    slug: "upgrade-confirmation-card",
    title: "Upgrade Confirmation Card",
    category: "Transactional Components",
    description: "Confirmation module for successful plan upgrades, tier changes, and billing-plan transitions.",
    tags: ["upgrade", "plan", "billing", "confirmation"],
    sourceFile: "upgrade-confirmation-card.mjml",
    previewImageUrl: "/email-shots-v3/upgrade-confirmation-card.png",
    compatibility: standardCompatibility(
      "Two-column plan metadata remains stable, though Outlook can reduce white space between fields.",
    ),
    usageGuidance: [
      "Use after pricing or checkout flows when the user expects immediate confirmation of the new plan state.",
      "Keep the active date and plan name visible without requiring the recipient to scan a longer billing email.",
    ],
    accessibilityNotes: [
      "Label the new plan and start date clearly so the confirmation remains understandable in assistive technology.",
      "Avoid vague confirmation copy that does not explain what changed in the account.",
    ],
  }),
  makeComponent({
    slug: "welcome-email-hero",
    title: "Welcome Email Hero",
    category: "Heroes",
    description: "Simple onboarding hero for first-run welcome emails and sign-up activation sequences.",
    tags: ["welcome", "onboarding", "hero", "saas"],
    sourceFile: "welcome-email-hero.mjml",
    previewImageUrl: "/email-shots-v3/welcome-email-hero.png",
    compatibility: standardCompatibility(
      "Single-column hero cards are robust, though Outlook can tighten spacing around the primary CTA.",
    ),
    usageGuidance: [
      "Use at the top of welcome emails where the first action should be obvious and low-friction.",
      "Follow it with setup or onboarding guidance rather than another large hero to keep the flow focused.",
    ],
    accessibilityNotes: [
      "Ensure the headline makes sense without the CTA, because assistive technology may announce them separately.",
      "Keep the CTA action-led and specific to the onboarding step you want the user to complete.",
    ],
  }),
  makeComponent({
    slug: "onboarding-step-card",
    title: "Onboarding Step Card",
    category: "Content Blocks",
    description: "Step-based onboarding prompt for setup sequences, activation nudges, and product adoption emails.",
    tags: ["onboarding", "setup", "activation", "saas"],
    sourceFile: "onboarding-step-card.mjml",
    previewImageUrl: "/email-shots-v3/onboarding-step-card.png",
    compatibility: standardCompatibility(
      "Simple step cards are reliable, though Outlook can reduce the padding around left-aligned CTA buttons.",
    ),
    usageGuidance: [
      "Use mid-flow when the user has already started onboarding and needs the next action spelled out clearly.",
      "Update the step counter and button label together so the message stays aligned with the actual setup journey.",
    ],
    accessibilityNotes: [
      "Include the step number in text so progress is understandable without visual layout context.",
      "Make the CTA destination explicit so keyboard and screen-reader users know what happens next.",
    ],
  }),
  makeComponent({
    slug: "feature-announcement-split",
    title: "Feature Announcement Split",
    category: "Heroes",
    description: "Split announcement block for new features, product launches, and release highlights.",
    tags: ["feature", "announcement", "hero", "release"],
    sourceFile: "feature-announcement-split.mjml",
    previewImageUrl: "/email-shots-v3/feature-announcement-split.png",
    compatibility: standardCompatibility(
      "Image-and-copy split layouts remain dependable, though Outlook can stack the columns earlier than webmail.",
    ),
    usageGuidance: [
      "Use when the new feature needs both a visual cue and a clear explanatory message in the first screenful.",
      "Keep the copy focused on one release theme so the split layout stays purposeful rather than crowded.",
    ],
    accessibilityNotes: [
      "The announcement should still make sense if the supporting image does not load.",
      "Use alt text that adds context rather than repeating the headline verbatim.",
    ],
  }),
  makeComponent({
    slug: "trial-started-checklist",
    title: "Trial Started Checklist",
    category: "Content Blocks",
    description: "Checklist block for trial-started flows that need a simple first-run activation sequence.",
    tags: ["trial", "checklist", "activation", "saas"],
    sourceFile: "trial-started-checklist.mjml",
    previewImageUrl: "/email-shots-v3/trial-started-checklist.png",
    compatibility: standardCompatibility(
      "Checklist text renders reliably, though Outlook can trim some of the vertical separation between items.",
    ),
    usageGuidance: [
      "Use immediately after a trial starts when three or fewer actions can materially improve activation.",
      "Keep each task short and concrete so the list still scans quickly on mobile clients.",
    ],
    accessibilityNotes: [
      "Number or label each action in text because stacked layouts may reduce the visual sense of sequence.",
      "Avoid using checklist styling alone to imply priority or completion state.",
    ],
  }),
  makeComponent({
    slug: "reactivation-offer-banner",
    title: "Reactivation Offer Banner",
    category: "Content Blocks",
    description: "Return-to-product banner for churn win-back, dormant accounts, and reactivation campaigns.",
    tags: ["reactivation", "retention", "winback", "saas"],
    sourceFile: "reactivation-offer-banner.mjml",
    previewImageUrl: "/email-shots-v3/reactivation-offer-banner.png",
    compatibility: standardCompatibility(
      "Single-panel offer banners are stable, though Outlook may make the vertical rhythm feel slightly tighter.",
    ),
    usageGuidance: [
      "Use for lightweight win-back emails where the value proposition and return path should be obvious immediately.",
      "Pair it with one concise supporting reason to return rather than a dense feature list.",
    ],
    accessibilityNotes: [
      "Make the offer or reactivation outcome explicit in text instead of relying on the banner treatment alone.",
      "Ensure the CTA tells the user what returning will let them do next.",
    ],
  }),
  makeComponent({
    slug: "product-update-digest",
    title: "Product Update Digest",
    category: "Newsletter Layouts",
    description: "Multi-point product update block for monthly release notes, changelog emails, and roadmap recaps.",
    tags: ["product updates", "digest", "newsletter", "release notes"],
    sourceFile: "product-update-digest.mjml",
    previewImageUrl: "/email-shots-v3/product-update-digest.png",
    compatibility: standardCompatibility(
      "Three-column summaries can compress in Outlook desktop, so short labels and concise copy are important.",
    ),
    usageGuidance: [
      "Use when multiple updates need equal visual weight without becoming a full editorial newsletter.",
      "Keep each update label brief so the digest still works once the columns stack on smaller clients.",
    ],
    accessibilityNotes: [
      "Write each update label so it makes sense independently when announced in sequence.",
      "Do not rely on the numbered layout alone to communicate which update matters most.",
    ],
  }),
  makeComponent({
    slug: "weekly-digest-list",
    title: "Weekly Digest List",
    category: "Newsletter Layouts",
    description: "Compact digest list for weekly summaries, curated links, and editorial update sends.",
    tags: ["weekly digest", "newsletter", "editorial", "links"],
    sourceFile: "weekly-digest-list.mjml",
    previewImageUrl: "/email-shots-v3/weekly-digest-list.png",
    compatibility: standardCompatibility(
      "Single-column text digests are highly stable across clients, including Outlook desktop.",
    ),
    usageGuidance: [
      "Use when the email needs to summarise several small updates without heavy imagery or card treatment.",
      "Keep headlines punchy and summaries short so the list feels curated rather than overwhelming.",
    ],
    accessibilityNotes: [
      "Make each digest item self-contained so readers can skim or navigate individual entries easily.",
      "Use clear heading structure to separate the digest label from the list items beneath it.",
    ],
  }),
  makeComponent({
    slug: "blog-roundup-grid",
    title: "Blog Roundup Grid",
    category: "Newsletter Layouts",
    description: "Three-article roundup grid for editorial newsletters, content marketing sends, and reading lists.",
    tags: ["blog roundup", "newsletter", "articles", "grid"],
    sourceFile: "blog-roundup-grid.mjml",
    previewImageUrl: "/email-shots-v3/blog-roundup-grid.png",
    compatibility: standardCompatibility(
      "Three-column article grids work well, though Outlook can tighten captions and stack the cards sooner.",
      "Yahoo Mail may add extra vertical spacing around image-heavy cards, so summaries should stay compact.",
    ),
    usageGuidance: [
      "Use when three editorial stories deserve equal weight inside one digest email.",
      "Keep summaries short so the grid remains scan-friendly even when it collapses to a single column on mobile.",
    ],
    accessibilityNotes: [
      "Give each article card distinct alt text and headings so the stories are distinguishable without the images.",
      "Avoid repeating generic link text for every article because assistive technology users need clearer destinations.",
    ],
  }),
  makeComponent({
    slug: "editorial-newsletter-feature",
    title: "Editorial Newsletter Feature",
    category: "Newsletter Layouts",
    description: "Lead-story feature block for newsletter intros, editorial campaigns, and long-form content sends.",
    tags: ["editorial", "feature", "newsletter", "lead story"],
    sourceFile: "editorial-newsletter-feature.mjml",
    previewImageUrl: "/email-shots-v3/editorial-newsletter-feature.png",
    compatibility: standardCompatibility(
      "Split editorial layouts are stable, though Outlook can stack the image column earlier than Apple Mail or Gmail.",
    ),
    usageGuidance: [
      "Use as the main feature story near the top of a newsletter before smaller follow-on article sections.",
      "Make sure the lead story headline and CTA work independently so the module still performs when images are blocked.",
    ],
    accessibilityNotes: [
      "Use meaningful alt text for the editorial image because it frames the lead story visually.",
      "Keep the CTA descriptive so it is obvious which article or destination the reader will open.",
    ],
  }),
  makeComponent({
    slug: "multi-article-newsletter-grid",
    title: "Multi-Article Newsletter Grid",
    category: "Newsletter Layouts",
    description: "Two-by-two article grid for heavier editorial newsletters, curated reading, and content roundups.",
    tags: ["newsletter", "articles", "grid", "editorial"],
    sourceFile: "multi-article-newsletter-grid.mjml",
    previewImageUrl: "/email-shots-v3/multi-article-newsletter-grid.png",
    compatibility: standardCompatibility(
      "Four-card grids can feel dense in Outlook desktop, so image ratios and copy length need tighter control.",
      "Yahoo Mail can add inconsistent card spacing, so keep the article summaries concise and visually balanced.",
    ),
    usageGuidance: [
      "Use when the email needs to offer multiple article choices without turning into a plain text list.",
      "Limit card copy to one short summary line so the grid survives mobile stacking without becoming too long.",
    ],
    accessibilityNotes: [
      "Ensure each article card has a distinct heading because assistive technology users may navigate them individually.",
      "Do not rely on image position alone to imply editorial priority across the four cards.",
    ],
  }),
  makeComponent({
    slug: "product-highlight-feature",
    title: "Product Highlight Feature",
    category: "Product Sections",
    description: "Split product feature block for spotlight offers, new arrivals, and campaign hero products.",
    tags: ["product", "highlight", "ecommerce", "feature"],
    sourceFile: "product-highlight-feature.mjml",
    previewImageUrl: "/email-shots-v3/product-highlight-feature.png",
    compatibility: standardCompatibility(
      "Product feature splits are dependable, though Outlook can alter the image-to-copy ratio in tighter panes.",
    ),
    usageGuidance: [
      "Use when one product deserves more narrative space than a standard grid card can provide.",
      "Keep the supporting copy short so the image and CTA remain the dominant cues in the module.",
    ],
    accessibilityNotes: [
      "Make the product name and CTA meaningful without forcing the recipient to interpret the image.",
      "Use alt text that distinguishes the featured item rather than repeating generic promotional wording.",
    ],
  }),
  makeComponent({
    slug: "related-products-row",
    title: "Related Products Row",
    category: "Product Sections",
    description: "Cross-sell row for adjacent products, accessories, and browse-follow-up recommendations.",
    tags: ["related products", "cross-sell", "ecommerce", "products"],
    sourceFile: "related-products-row.mjml",
    previewImageUrl: "/email-shots-v3/related-products-row.png",
    compatibility: standardCompatibility(
      "Three-up product rows are stable, though Outlook can compress price spacing and stack the cards sooner.",
    ),
    usageGuidance: [
      "Use beneath a hero product or order summary when adjacent items should feel like a lightweight secondary action.",
      "Keep pricing and product names short so the row remains compact and easy to compare on mobile.",
    ],
    accessibilityNotes: [
      "Ensure each product card has a clear text name and price, not just an image with implied meaning.",
      "Avoid making every product link read the same in assistive technology by varying the accessible context.",
    ],
  }),
  makeComponent({
    slug: "abandoned-cart-reminder",
    title: "Abandoned Cart Reminder",
    category: "Product Sections",
    description: "Cart recovery block for browse abandonment, incomplete checkout, and return-to-cart campaigns.",
    tags: ["abandoned cart", "cart recovery", "ecommerce", "retention"],
    sourceFile: "abandoned-cart-reminder.mjml",
    previewImageUrl: "/email-shots-v3/abandoned-cart-reminder.png",
    compatibility: standardCompatibility(
      "Split recovery cards work well, though Outlook can stack the image earlier than webmail clients.",
    ),
    usageGuidance: [
      "Use when one recovery message and one return-to-cart action should dominate the email above the fold.",
      "Pair it with a related-products row or discount banner only if the core recovery CTA remains the clearest action.",
    ],
    accessibilityNotes: [
      "The reminder should still make sense if the product image does not load or is announced separately.",
      "Use a CTA label that clearly signals a return-to-cart action rather than a vague shop-now prompt.",
    ],
  }),
  makeComponent({
    slug: "discount-promotion-banner",
    title: "Discount Promotion Banner",
    category: "Product Sections",
    description: "High-contrast promo banner for discount pushes, limited offers, and short-term campaign incentives.",
    tags: ["discount", "promotion", "offer", "ecommerce"],
    sourceFile: "discount-promotion-banner.mjml",
    previewImageUrl: "/email-shots-v3/discount-promotion-banner.png",
    compatibility: standardCompatibility(
      "High-contrast banner layouts are stable, though Outlook can slightly alter button padding and text rhythm.",
    ),
    usageGuidance: [
      "Use as a campaign interruption block when the discount itself is the message rather than supporting detail.",
      "Keep the copy concise so the banner stays punchy and does not become another long content section.",
    ],
    accessibilityNotes: [
      "Check contrast carefully because dark promotional panels can become unreadable if colours are changed casually.",
      "Make the offer terms clear in text rather than implying them through styling alone.",
    ],
  }),
];
