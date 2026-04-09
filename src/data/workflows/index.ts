import { getEmailComponentBySlug } from "@/data/email-components";
import {
  type EmailLayoutSystemSlug,
  getEmailLayoutBySlug,
} from "@/data/email-layouts";
import { getEmailExampleBySlug } from "@/data/email-examples";

export type WorkflowField = {
  field: string;
  description: string;
  example: string;
};

export type WorkflowVariant = {
  title: string;
  description: string;
};

export type WorkflowComponentStackItem = {
  order: number;
  componentSlug: string;
  componentTitle: string;
  notes: string;
};

export type EmailWorkflow = {
  slug: string;
  title: string;
  summary: string;
  trigger: string;
  goal: string;
  system: EmailLayoutSystemSlug;
  linkedLayoutSlug: string;
  linkedLayoutTitle: string;
  linkedLayoutDescription: string;
  previewImageUrl: string;
  sourceFile: string;
  componentStack: WorkflowComponentStackItem[];
  requiredFields: WorkflowField[];
  variants: WorkflowVariant[];
  qaRisks: string[];
  handoffSteps: string[];
  freeAccess: string[];
  coreAccess: string[];
  legacyExampleSlug: string;
  featuredRank: number | null;
};

type WorkflowDefinition = {
  slug: string;
  title: string;
  summary: string;
  trigger: string;
  goal: string;
  requiredFields: WorkflowField[];
  variants: WorkflowVariant[];
  qaRisks: string[];
  handoffSteps?: string[];
  freeAccess?: string[];
  coreAccess?: string[];
  legacyExampleSlug: string;
  featuredRank?: number;
};

const defaultHandoffSteps = [
  "Edit copy and block order in MJML, keeping utility and footer sections unchanged unless requirements demand it.",
  "Compile MJML to HTML and run client checks in Gmail, Outlook Desktop, and Apple Mail before handoff.",
  "Import compiled HTML into the ESP, map merge variables, and send an internal seed round for QA sign-off.",
] as const;

const defaultFreeAccess = [
  "Workflow overview and intent",
  "Linked layout and ordered component stack",
  "Data contract, variants, QA notes, and handoff checklist",
] as const;

const defaultCoreAccess = [
  "Full MJML source for this workflow",
  "Compiled HTML output ready for ESP upload",
  "Variant-ready workflow pack files",
  "Versioned workflow updates inside Hedgehog Core",
] as const;

const workflowDefinitions: WorkflowDefinition[] = [
  {
    slug: "onboarding",
    title: "Onboarding activation",
    summary:
      "Move new users from account creation to first product action without rewriting the same welcome flow.",
    trigger: "Sent after a user creates an account but before activation milestones are complete.",
    goal: "Drive first meaningful action and reduce first-week drop-off.",
    legacyExampleSlug: "welcome-email",
    featuredRank: 1,
    requiredFields: [
      {
        field: "user.first_name",
        description: "Recipient personalisation for the opening line.",
        example: "Amelia",
      },
      {
        field: "account.verify_url",
        description: "Primary activation destination.",
        example: "https://app.example.com/verify?token=abc123",
      },
      {
        field: "support.contact_url",
        description: "Fallback support route for blocked users.",
        example: "https://app.example.com/support",
      },
    ],
    variants: [
      {
        title: "No-activity reminder",
        description: "Follow-up send when activation has not happened within 48 hours.",
      },
      {
        title: "Partially complete profile",
        description: "Alternative copy when setup started but was not finished.",
      },
    ],
    qaRisks: [
      "Long first names can wrap in hero lines on narrow mobile clients.",
      "Verification links with long query strings can force horizontal overflow in some ESP editors.",
    ],
  },
  {
    slug: "password-reset",
    title: "Password reset",
    summary:
      "Handle account recovery with security-safe copy and a direct reset action that works across clients.",
    trigger: "Sent immediately after a user requests a password reset.",
    goal: "Help legitimate users recover access while keeping security messaging clear.",
    legacyExampleSlug: "password-reset",
    featuredRank: 2,
    requiredFields: [
      {
        field: "user.first_name",
        description: "Optional personalisation in the opener.",
        example: "Noah",
      },
      {
        field: "auth.reset_url",
        description: "One-time password reset link.",
        example: "https://app.example.com/reset?token=xyz789",
      },
      {
        field: "auth.reset_expiry_minutes",
        description: "Expiry policy shown in copy.",
        example: "30",
      },
    ],
    variants: [
      {
        title: "Reset link expired",
        description: "Alternative message pointing users to request a new secure link.",
      },
      {
        title: "Suspicious activity warning",
        description: "Adds account safety notice when request origin appears unusual.",
      },
    ],
    qaRisks: [
      "Some Outlook builds flatten rounded CTA corners, so button copy must stay legible without shape cues.",
      "Security copy can become too dense if line length is not capped.",
    ],
  },
  {
    slug: "billing",
    title: "Billing receipt",
    summary:
      "Deliver accurate charge confirmation with line-item clarity for finance and support teams.",
    trigger: "Sent when a payment is captured or subscription invoice is finalised.",
    goal: "Confirm billing details clearly and reduce support tickets about charges.",
    legacyExampleSlug: "receipt-email",
    featuredRank: 3,
    requiredFields: [
      {
        field: "invoice.number",
        description: "Reference for finance reconciliation.",
        example: "INV-1042",
      },
      {
        field: "invoice.total_gbp",
        description: "Total amount charged.",
        example: "£79.00",
      },
      {
        field: "billing.download_url",
        description: "Optional invoice PDF or portal destination.",
        example: "https://app.example.com/billing/invoices/INV-1042",
      },
    ],
    variants: [
      {
        title: "Payment failed",
        description: "Swaps confirmation copy for remediation steps and retry CTA.",
      },
      {
        title: "VAT invoice required",
        description: "Adds tax fields and legal footer language for VAT compliance.",
      },
    ],
    qaRisks: [
      "Currency symbol and amount alignment can drift if number formatting is not fixed before send.",
      "Line-item tables can clip in mobile clients when product names are excessively long.",
    ],
  },
  {
    slug: "reporting",
    title: "Weekly reporting digest",
    summary:
      "Share recurring product or campaign performance updates using a stable digest structure.",
    trigger: "Sent on a schedule to report weekly performance or operational metrics.",
    goal: "Keep stakeholders informed with scannable updates that can be repeated reliably.",
    legacyExampleSlug: "weekly-newsletter",
    featuredRank: 4,
    requiredFields: [
      {
        field: "report.period_label",
        description: "Time window shown in the heading.",
        example: "Week ending 7 April 2026",
      },
      {
        field: "report.top_metric_value",
        description: "Primary KPI surfaced near the top.",
        example: "41,290 active users",
      },
      {
        field: "report.dashboard_url",
        description: "Destination for full report details.",
        example: "https://app.example.com/reports/weekly",
      },
    ],
    variants: [
      {
        title: "Low engagement reminder",
        description: "Adjusts the opener when report readership drops below target.",
      },
      {
        title: "Executive summary version",
        description: "Reduces module count for leadership audiences.",
      },
    ],
    qaRisks: [
      "Dense metric rows become hard to scan if spacing is reduced in editor overrides.",
      "Image-heavy report cards can exceed weight limits in some ESP send pipelines.",
    ],
  },
  {
    slug: "notifications",
    title: "Security notification",
    summary:
      "Alert users about critical account events with clear actions and support escalation paths.",
    trigger: "Sent when security events or high-priority account alerts are detected.",
    goal: "Drive immediate, safe action while reducing confusion during urgent incidents.",
    legacyExampleSlug: "security-alert",
    featuredRank: 5,
    requiredFields: [
      {
        field: "event.timestamp_utc",
        description: "Time of the detected event.",
        example: "2026-04-09T08:12:00Z",
      },
      {
        field: "event.location_hint",
        description: "Approximate location or device context.",
        example: "Manchester, UK (Chrome on macOS)",
      },
      {
        field: "security.review_url",
        description: "Destination to confirm or deny the event.",
        example: "https://app.example.com/security/activity",
      },
    ],
    variants: [
      {
        title: "Confirmed safe",
        description: "Reassurance variant when the user approves the event.",
      },
      {
        title: "Access blocked",
        description: "Escalation variant when account lock or reset is triggered.",
      },
    ],
    qaRisks: [
      "Urgency copy can read as phishing-like if sender identity markers are weak.",
      "Action links must remain visible in dark mode, especially in mobile clients.",
    ],
  },
  {
    slug: "order-confirmation",
    title: "Order confirmation",
    summary:
      "Confirm post-purchase details with an operational structure that support teams can trust.",
    trigger: "Sent immediately after checkout is completed.",
    goal: "Confirm order details and reduce follow-up contacts about status or receipt access.",
    legacyExampleSlug: "order-confirmation",
    requiredFields: [
      {
        field: "order.number",
        description: "Customer-facing order reference.",
        example: "TH-20418",
      },
      {
        field: "order.total_gbp",
        description: "Order amount charged.",
        example: "£124.00",
      },
      {
        field: "order.manage_url",
        description: "Destination for tracking and support actions.",
        example: "https://shop.example.com/orders/TH-20418",
      },
    ],
    variants: [
      {
        title: "Digital delivery",
        description: "Replaces shipping blocks with download and access instructions.",
      },
      {
        title: "Back-order notice",
        description: "Adds fulfilment delay messaging with expected dispatch date.",
      },
    ],
    qaRisks: [
      "Order tables can break alignment if product names or SKU strings are unbounded.",
      "Fallback plain-text links are needed for clients that suppress button styles.",
    ],
  },
  {
    slug: "shipping-update",
    title: "Shipping update",
    summary:
      "Keep customers informed on fulfilment progress with clear tracking and status context.",
    trigger: "Sent when parcel status changes after dispatch.",
    goal: "Reduce where-is-my-order contacts with precise, timely status updates.",
    legacyExampleSlug: "shipping-notification",
    requiredFields: [
      {
        field: "shipment.tracking_number",
        description: "Carrier tracking reference.",
        example: "GBR123456789",
      },
      {
        field: "shipment.status_label",
        description: "Current fulfilment status.",
        example: "Out for delivery",
      },
      {
        field: "shipment.track_url",
        description: "Carrier or branded tracking destination.",
        example: "https://shop.example.com/tracking/GBR123456789",
      },
    ],
    variants: [
      {
        title: "Delivery delayed",
        description: "Adjusted copy for weather, customs, or carrier delays.",
      },
      {
        title: "Delivered confirmation",
        description: "Final state variant with support route for missing parcels.",
      },
    ],
    qaRisks: [
      "Carrier status text can exceed expected length and wrap unpredictably on mobile.",
      "Track URL integrity must be checked after ESP link wrapping.",
    ],
  },
  {
    slug: "trial-reminder",
    title: "Trial ending reminder",
    summary:
      "Prompt trial users to convert with clear usage context and a direct upgrade path.",
    trigger: "Sent as a timed reminder before trial expiry.",
    goal: "Increase paid conversion before trial access lapses.",
    legacyExampleSlug: "trial-ending-reminder",
    requiredFields: [
      {
        field: "trial.days_remaining",
        description: "Countdown value used in urgency messaging.",
        example: "3",
      },
      {
        field: "account.plan_name",
        description: "Current plan reference in copy.",
        example: "Starter trial",
      },
      {
        field: "billing.upgrade_url",
        description: "Conversion destination.",
        example: "https://app.example.com/billing/upgrade",
      },
    ],
    variants: [
      {
        title: "Final day reminder",
        description: "Short urgency-focused variant for day-of-expiry.",
      },
      {
        title: "Trial extended",
        description: "Alternative when support grants additional trial time.",
      },
    ],
    qaRisks: [
      "Countdown values can desynchronise if scheduled send timing is offset.",
      "Upgrade CTA hierarchy must stay clear when discount messaging is introduced.",
    ],
  },
  {
    slug: "upgrade-confirmation",
    title: "Upgrade confirmation",
    summary:
      "Confirm plan change and next account capabilities without introducing billing ambiguity.",
    trigger: "Sent when a user upgrades to a paid plan.",
    goal: "Reassure buyers and reduce immediate post-purchase support requests.",
    legacyExampleSlug: "upgrade-confirmation",
    requiredFields: [
      {
        field: "account.new_plan_name",
        description: "Name of the upgraded plan.",
        example: "Pro annual",
      },
      {
        field: "billing.next_invoice_date",
        description: "Next billing date shown for transparency.",
        example: "2027-04-09",
      },
      {
        field: "account.dashboard_url",
        description: "Destination for post-upgrade setup.",
        example: "https://app.example.com/dashboard",
      },
    ],
    variants: [
      {
        title: "Seat expansion confirmation",
        description: "Alternative copy when upgrade is capacity-only.",
      },
      {
        title: "Payment pending",
        description: "Fallback for delayed settlement states.",
      },
    ],
    qaRisks: [
      "Plan naming differences between billing and product systems can create copy mismatches.",
      "Locale-specific dates must be formatted consistently with account settings.",
    ],
  },
  {
    slug: "feature-announcement",
    title: "Feature announcement",
    summary:
      "Launch new capability updates with reusable structure that keeps messaging and CTA order consistent.",
    trigger: "Sent when releasing notable product updates.",
    goal: "Drive awareness and feature adoption with production-safe launch messaging.",
    legacyExampleSlug: "feature-announcement",
    requiredFields: [
      {
        field: "feature.title",
        description: "Primary release heading.",
        example: "Workflow templates in Hedgehog Core",
      },
      {
        field: "feature.value_points",
        description: "Short list of benefit lines used in content blocks.",
        example: "3 improvements to lifecycle build speed",
      },
      {
        field: "feature.learn_more_url",
        description: "Destination for full release context.",
        example: "https://app.example.com/changelog/workflow-release",
      },
    ],
    variants: [
      {
        title: "Private beta invitation",
        description: "Invitation-led variant with access request CTA.",
      },
      {
        title: "General availability release",
        description: "GA variant with migration or rollout guidance.",
      },
    ],
    qaRisks: [
      "Feature names and supporting stats can overrun headline areas in translated locales.",
      "Release imagery should be optional for clients that block remote assets by default.",
    ],
  },
  {
    slug: "campaign-launch",
    title: "Campaign launch",
    summary:
      "Launch a campaign send from a stable layout that keeps offer hierarchy and CTA placement consistent.",
    trigger: "Sent for product launches, seasonal pushes, or planned campaign announcements.",
    goal: "Ship campaign messaging quickly without rebuilding launch structure from scratch.",
    legacyExampleSlug: "product-launch",
    requiredFields: [
      {
        field: "campaign.headline",
        description: "Primary message shown in the hero block.",
        example: "Spring release is live",
      },
      {
        field: "campaign.primary_cta_url",
        description: "Main conversion destination for the send.",
        example: "https://app.example.com/launch",
      },
      {
        field: "campaign.supporting_cards",
        description: "Secondary highlights rendered below the hero.",
        example: "Feature highlights array with title, copy, and link",
      },
    ],
    variants: [
      {
        title: "Pre-launch teaser",
        description: "Shorter copy variant used before release day.",
      },
      {
        title: "Post-launch recap",
        description: "Follow-up version with adoption proof and usage links.",
      },
    ],
    qaRisks: [
      "Hero copy can overflow if campaign headlines are not length-capped before send.",
      "Multiple secondary cards need consistent image ratios to avoid uneven stacking on mobile.",
    ],
  },
  {
    slug: "newsletter-digest",
    title: "Newsletter digest",
    summary:
      "Run recurring content digests with repeatable structure so editorial teams and developers stay aligned.",
    trigger: "Sent on a regular cadence for editorial and product content roundups.",
    goal: "Publish recurring digests faster while keeping formatting and handoff stable.",
    legacyExampleSlug: "blog-digest",
    requiredFields: [
      {
        field: "digest.issue_title",
        description: "Edition title for this digest send.",
        example: "Template Hedgehog Weekly Digest #42",
      },
      {
        field: "digest.featured_article_url",
        description: "Main article destination in the top block.",
        example: "https://docs.example.com/blog/workflow-patterns",
      },
      {
        field: "digest.secondary_items",
        description: "Array of additional links for the roundup grid.",
        example: "List of title, summary, URL, and image",
      },
    ],
    variants: [
      {
        title: "Short-form digest",
        description: "Compressed version for weeks with fewer publishable updates.",
      },
      {
        title: "Feature-only edition",
        description: "Single-topic version focused on one major update.",
      },
    ],
    qaRisks: [
      "Editorial summaries can become too long and cause card height imbalance.",
      "Digest grids are sensitive to missing image assets at send time.",
    ],
  },
  {
    slug: "promotion-campaign",
    title: "Promotion campaign",
    summary:
      "Run time-bound promotions with a reusable conversion stack that keeps urgency copy clear and controlled.",
    trigger: "Sent for promotions, offers, and limited-time commercial pushes.",
    goal: "Increase conversion without introducing rushed markup regressions.",
    legacyExampleSlug: "promotion-email",
    requiredFields: [
      {
        field: "offer.label",
        description: "Promotion headline and offer code text.",
        example: "25% off until Friday",
      },
      {
        field: "offer.expiry_utc",
        description: "Cut-off timestamp used in urgency copy.",
        example: "2026-04-12T23:59:00Z",
      },
      {
        field: "offer.redeem_url",
        description: "Destination for redeeming the promotion.",
        example: "https://shop.example.com/offers/spring",
      },
    ],
    variants: [
      {
        title: "Reminder send",
        description: "Follow-up variation for users who did not click the first campaign email.",
      },
      {
        title: "Last-call send",
        description: "Final-hours variation with shorter copy and stronger urgency treatment.",
      },
    ],
    qaRisks: [
      "Countdown copy and expiry timestamps must match the timezone used by the ESP scheduler.",
      "Promotional modules can feel too dense if both product grids and urgency banners are stacked together.",
    ],
  },
];

function createWorkflow(definition: WorkflowDefinition): EmailWorkflow {
  const example = getEmailExampleBySlug(definition.legacyExampleSlug);
  if (!example) {
    throw new Error(
      `[workflows] Unknown legacy example slug: "${definition.legacyExampleSlug}".`,
    );
  }

  const layout = getEmailLayoutBySlug(example.layoutSlug);
  if (!layout) {
    throw new Error(
      `[workflows] Workflow "${definition.slug}" references unknown layout "${example.layoutSlug}".`,
    );
  }

  const componentStack = layout.componentBlocks.map((block, index) => {
    const component = getEmailComponentBySlug(block.componentSlug);
    if (!component) {
      throw new Error(
        `[workflows] Workflow "${definition.slug}" references unknown component "${block.componentSlug}".`,
      );
    }

    return {
      order: index + 1,
      componentSlug: component.slug,
      componentTitle: component.title,
      notes: block.notes,
    };
  });

  return {
    slug: definition.slug,
    title: definition.title,
    summary: definition.summary,
    trigger: definition.trigger,
    goal: definition.goal,
    system: example.system,
    linkedLayoutSlug: layout.slug,
    linkedLayoutTitle: layout.title,
    linkedLayoutDescription: layout.description,
    previewImageUrl: layout.previewImageUrl,
    sourceFile: example.sourceFile,
    componentStack,
    requiredFields: definition.requiredFields,
    variants: definition.variants,
    qaRisks: definition.qaRisks,
    handoffSteps: definition.handoffSteps ?? [...defaultHandoffSteps],
    freeAccess: definition.freeAccess ?? [...defaultFreeAccess],
    coreAccess: definition.coreAccess ?? [...defaultCoreAccess],
    legacyExampleSlug: definition.legacyExampleSlug,
    featuredRank: definition.featuredRank ?? null,
  };
}

const requiredFeaturedWorkflowSlugs = [
  "onboarding",
  "password-reset",
  "billing",
  "reporting",
  "notifications",
] as const;

function assertNoDuplicateWorkflowSlugs(workflows: EmailWorkflow[]): void {
  const seen = new Set<string>();

  for (const workflow of workflows) {
    if (seen.has(workflow.slug)) {
      throw new Error(`[workflows] Duplicate workflow slug found: "${workflow.slug}".`);
    }
    seen.add(workflow.slug);
  }
}

function assertRequiredFeaturedWorkflows(workflows: EmailWorkflow[]): void {
  const workflowBySlug = new Map(workflows.map((workflow) => [workflow.slug, workflow]));

  for (const slug of requiredFeaturedWorkflowSlugs) {
    const workflow = workflowBySlug.get(slug);
    if (!workflow) {
      throw new Error(`[workflows] Missing required featured workflow "${slug}".`);
    }
    if (!workflow.featuredRank || workflow.featuredRank > 5) {
      throw new Error(
        `[workflows] Featured workflow "${slug}" must have a featured rank between 1 and 5.`,
      );
    }
  }
}

function byFeaturedRankThenTitle(a: EmailWorkflow, b: EmailWorkflow): number {
  const aRank = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
  const bRank = b.featuredRank ?? Number.MAX_SAFE_INTEGER;

  if (aRank !== bRank) {
    return aRank - bRank;
  }

  return a.title.localeCompare(b.title, "en-GB");
}

export const emailWorkflows: EmailWorkflow[] = workflowDefinitions
  .map(createWorkflow)
  .sort(byFeaturedRankThenTitle);

assertNoDuplicateWorkflowSlugs(emailWorkflows);
assertRequiredFeaturedWorkflows(emailWorkflows);

const workflowBySlug = new Map(emailWorkflows.map((workflow) => [workflow.slug, workflow]));
const workflowByLegacyExampleSlug = new Map(
  emailWorkflows.map((workflow) => [workflow.legacyExampleSlug, workflow]),
);
const workflowsByComponentSlug = new Map<string, EmailWorkflow[]>();
const workflowsBySystem = new Map<EmailLayoutSystemSlug, EmailWorkflow[]>();

for (const workflow of emailWorkflows) {
  const systemEntries = workflowsBySystem.get(workflow.system) ?? [];
  systemEntries.push(workflow);
  workflowsBySystem.set(workflow.system, systemEntries);

  for (const item of workflow.componentStack) {
    const entries = workflowsByComponentSlug.get(item.componentSlug) ?? [];
    entries.push(workflow);
    workflowsByComponentSlug.set(item.componentSlug, entries);
  }
}

export function getEmailWorkflowBySlug(slug: string): EmailWorkflow | undefined {
  return workflowBySlug.get(slug);
}

export function getEmailWorkflowByLegacyExampleSlug(
  exampleSlug: string,
): EmailWorkflow | undefined {
  return workflowByLegacyExampleSlug.get(exampleSlug);
}

export function getEmailWorkflowsByComponentSlug(componentSlug: string): EmailWorkflow[] {
  return workflowsByComponentSlug.get(componentSlug) ?? [];
}

export function getEmailWorkflowsBySystem(
  system: EmailLayoutSystemSlug,
): EmailWorkflow[] {
  return workflowsBySystem.get(system) ?? [];
}

export function getFeaturedEmailWorkflows(limit: number = 5): EmailWorkflow[] {
  return emailWorkflows
    .filter((workflow) => workflow.featuredRank !== null)
    .sort(byFeaturedRankThenTitle)
    .slice(0, Math.max(0, limit));
}
