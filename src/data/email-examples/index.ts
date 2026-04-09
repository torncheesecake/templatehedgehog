import { readFileSync } from "node:fs";
import path from "node:path";
import { getEmailComponentBySlug, emailComponents } from "@/data/email-components";
import {
  type EmailLayoutSystemSlug,
  getEmailLayoutBySlug,
} from "@/data/email-layouts";

export type EmailExampleImplementation = {
  slug: string;
  title: string;
  description: string;
  system: EmailLayoutSystemSlug;
  layoutSlug: string;
  componentSlugs: string[];
  sourceFile: string;
  mjmlSource: string;
};

type ExampleDefinition = Omit<
  EmailExampleImplementation,
  "componentSlugs" | "mjmlSource"
> & {
  componentSourceFiles: string[];
};

const exampleLibraryRoot = path.join(
  process.cwd(),
  "src",
  "data",
  "email-examples",
  "library",
);

const componentSlugsBySourceFile = new Map<string, string[]>();

for (const component of emailComponents) {
  const known = componentSlugsBySourceFile.get(component.sourceFile) ?? [];
  known.push(component.slug);
  componentSlugsBySourceFile.set(component.sourceFile, known);
}

function getExampleFilePath(fileName: string): string {
  return path.join(exampleLibraryRoot, fileName);
}

function loadExampleMjml(fileName: string): string {
  const filePath = getExampleFilePath(fileName);

  try {
    const content = readFileSync(filePath, "utf8").trim();
    if (!content) {
      throw new Error("file is empty");
    }
    return content;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[email-examples] Failed to load example source \"${fileName}\" from ${filePath}: ${detail}`,
    );
  }
}

function resolveComponentSlugs(sourceFiles: string[], exampleSlug: string): string[] {
  const resolved: string[] = [];

  for (const sourceFile of sourceFiles) {
    const mapped = componentSlugsBySourceFile.get(sourceFile);
    if (!mapped || mapped.length === 0) {
      throw new Error(
        `[email-examples] Example \"${exampleSlug}\" references source file \"${sourceFile}\" with no matching registered component.`,
      );
    }

    resolved.push(...mapped);
  }

  return Array.from(new Set(resolved));
}

function createExample(definition: ExampleDefinition): EmailExampleImplementation {
  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    system: definition.system,
    layoutSlug: definition.layoutSlug,
    sourceFile: definition.sourceFile,
    componentSlugs: resolveComponentSlugs(definition.componentSourceFiles, definition.slug),
    mjmlSource: loadExampleMjml(definition.sourceFile),
  };
}

const exampleDefinitions: ExampleDefinition[] = [
  {
    slug: "order-confirmation",
    title: "Order Confirmation Example",
    description:
      "Complete post-purchase confirmation email combining transactional summary blocks and footer compliance.",
    system: "transactional",
    layoutSlug: "order-confirmation-system",
    sourceFile: "order-confirmation.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "order-confirmation-summary.mjml",
      "related-products-row.mjml",
      "footer-nostores.mjml",
    ],
  },
  {
    slug: "shipping-notification",
    title: "Shipping Notification Example",
    description:
      "Shipment status email with tracking context, order status updates, and delivery-safe transactional framing.",
    system: "transactional",
    layoutSlug: "shipping-notification-system",
    sourceFile: "shipping-notification.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "shipping-notification-tracker.mjml",
      "order-status-update.mjml",
      "footer-nostores.mjml",
    ],
  },
  {
    slug: "receipt-email",
    title: "Receipt Email Example",
    description:
      "Payment receipt email with line-item details and billing summary for operational and finance handoff.",
    system: "transactional",
    layoutSlug: "receipt-system",
    sourceFile: "receipt-email.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "receipt-line-items.mjml",
      "invoice-summary-card.mjml",
      "footer-nostores.mjml",
    ],
  },
  {
    slug: "password-reset",
    title: "Password Reset Example",
    description:
      "Authentication recovery email with reset guidance, secure CTA emphasis, and privacy-oriented close.",
    system: "transactional",
    layoutSlug: "password-reset-system",
    sourceFile: "password-reset.mjml",
    componentSourceFiles: [
      "header.mjml",
      "password-reset-card.mjml",
      "single-icon-left-superlight.mjml",
      "footer-nostores.mjml",
    ],
  },
  {
    slug: "security-alert",
    title: "Security Alert Example",
    description:
      "Account security notification email for suspicious activity with immediate action and support escalation.",
    system: "transactional",
    layoutSlug: "security-alert-system",
    sourceFile: "security-alert.mjml",
    componentSourceFiles: [
      "header.mjml",
      "security-alert-card.mjml",
      "support-ticket-confirmation.mjml",
      "footer-nostores.mjml",
    ],
  },
  {
    slug: "welcome-email",
    title: "Welcome Email Example",
    description:
      "Lifecycle onboarding email introducing account value, first actions, and product activation guidance.",
    system: "saas-lifecycle",
    layoutSlug: "saas-welcome-system",
    sourceFile: "welcome-email.mjml",
    componentSourceFiles: [
      "header.mjml",
      "welcome-email-hero.mjml",
      "onboarding-step-card.mjml",
      "app-download-superlight.mjml",
      "footer-onboarding.mjml",
    ],
  },
  {
    slug: "trial-ending-reminder",
    title: "Trial Ending Reminder Example",
    description:
      "Lifecycle reminder before trial expiry, combining usage context and focused upgrade action.",
    system: "saas-lifecycle",
    layoutSlug: "trial-ending-reminder-system",
    sourceFile: "trial-ending-reminder.mjml",
    componentSourceFiles: [
      "header.mjml",
      "lifecycle-trial-expiry-alert.mjml",
      "lifecycle-usage-summary.mjml",
      "accent-cta.mjml",
      "footer-onboarding.mjml",
    ],
  },
  {
    slug: "upgrade-confirmation",
    title: "Upgrade Confirmation Example",
    description:
      "Post-upgrade lifecycle email confirming plan change and reinforcing account progress.",
    system: "saas-lifecycle",
    layoutSlug: "upgrade-confirmation-system",
    sourceFile: "upgrade-confirmation.mjml",
    componentSourceFiles: [
      "header.mjml",
      "upgrade-confirmation-card.mjml",
      "lifecycle-usage-summary.mjml",
      "footer-onboarding.mjml",
    ],
  },
  {
    slug: "feature-announcement",
    title: "Feature Announcement Example",
    description:
      "Product release email with feature framing, supporting metrics, and conversion-ready call to action.",
    system: "saas-lifecycle",
    layoutSlug: "feature-announcement-system",
    sourceFile: "feature-announcement.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "feature-announcement-split.mjml",
      "engineering-stats-3-col.mjml",
      "accent-cta.mjml",
      "footer-social.mjml",
    ],
  },
  {
    slug: "product-launch",
    title: "Product Launch Example",
    description:
      "Campaign launch email combining hero narrative, feature highlights, and direct conversion action.",
    system: "campaigns",
    layoutSlug: "product-launch-campaign",
    sourceFile: "product-launch.mjml",
    componentSourceFiles: [
      "header.mjml",
      "hero-centred.mjml",
      "dual-image.mjml",
      "primary-cta.mjml",
      "footer.mjml",
    ],
  },
  {
    slug: "weekly-newsletter",
    title: "Weekly Newsletter Example",
    description:
      "Recurring digest email with stacked editorial items, secondary article grid, and editor note close.",
    system: "newsletter",
    layoutSlug: "weekly-digest-system",
    sourceFile: "weekly-newsletter.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "weekly-digest-list.mjml",
      "multi-article-newsletter-grid.mjml",
      "newsletter-editor-note.mjml",
      "footer-24-white.mjml",
    ],
  },
  {
    slug: "blog-digest",
    title: "Blog Digest Example",
    description:
      "Content marketing roundup with featured article emphasis and compact multi-article continuation.",
    system: "newsletter",
    layoutSlug: "editorial-newsletter-system",
    sourceFile: "blog-digest.mjml",
    componentSourceFiles: [
      "header-e3-center.mjml",
      "editorial-newsletter-feature.mjml",
      "blog-roundup-grid.mjml",
      "dual-cta.mjml",
      "footer-24-white.mjml",
    ],
  },
  {
    slug: "promotion-email",
    title: "Promotion Email Example",
    description:
      "Promotion email with urgency-led offer framing, product reinforcement, and campaign-safe dark close.",
    system: "campaigns",
    layoutSlug: "trust-and-conversion-brief",
    sourceFile: "promotion-email.mjml",
    componentSourceFiles: [
      "header-black.mjml",
      "discount-promotion-banner.mjml",
      "product-highlight-feature.mjml",
      "related-products-row.mjml",
      "footer-black.mjml",
    ],
  },
];

export const emailExamples: EmailExampleImplementation[] = exampleDefinitions.map(createExample);

function assertNoDuplicateExampleSlugs(examples: EmailExampleImplementation[]): void {
  const seen = new Set<string>();

  for (const example of examples) {
    if (seen.has(example.slug)) {
      throw new Error(`[email-examples] Duplicate example slug found: \"${example.slug}\".`);
    }
    seen.add(example.slug);
  }
}

function assertKnownLayouts(examples: EmailExampleImplementation[]): void {
  for (const example of examples) {
    if (!getEmailLayoutBySlug(example.layoutSlug)) {
      throw new Error(
        `[email-examples] Example \"${example.slug}\" references unknown layout slug \"${example.layoutSlug}\".`,
      );
    }
  }
}

function assertKnownComponents(examples: EmailExampleImplementation[]): void {
  for (const example of examples) {
    for (const componentSlug of example.componentSlugs) {
      if (!getEmailComponentBySlug(componentSlug)) {
        throw new Error(
          `[email-examples] Example \"${example.slug}\" references unknown component slug \"${componentSlug}\".`,
        );
      }
    }
  }
}

function assertCompleteMjmlExamples(examples: EmailExampleImplementation[]): void {
  for (const example of examples) {
    const source = example.mjmlSource;
    if (!source.startsWith("<!-- Purpose:")) {
      throw new Error(
        `[email-examples] Example \"${example.slug}\" is missing the required purpose comment header.`,
      );
    }

    if (!source.includes("<mjml>") || !source.includes("</mjml>")) {
      throw new Error(
        `[email-examples] Example \"${example.slug}\" is not a complete MJML document.`,
      );
    }
  }
}

assertNoDuplicateExampleSlugs(emailExamples);
assertKnownLayouts(emailExamples);
assertKnownComponents(emailExamples);
assertCompleteMjmlExamples(emailExamples);

const emailExampleBySlug = new Map(emailExamples.map((example) => [example.slug, example]));
const emailExamplesByComponentSlug = new Map<string, EmailExampleImplementation[]>();
const emailExamplesBySystem = new Map<EmailLayoutSystemSlug, EmailExampleImplementation[]>();

for (const example of emailExamples) {
  const systemExamples = emailExamplesBySystem.get(example.system) ?? [];
  systemExamples.push(example);
  emailExamplesBySystem.set(example.system, systemExamples);

  for (const componentSlug of example.componentSlugs) {
    const linkedExamples = emailExamplesByComponentSlug.get(componentSlug) ?? [];
    linkedExamples.push(example);
    emailExamplesByComponentSlug.set(componentSlug, linkedExamples);
  }
}

export function getEmailExampleBySlug(slug: string): EmailExampleImplementation | undefined {
  return emailExampleBySlug.get(slug);
}

export function getEmailExamplesByComponentSlug(
  componentSlug: string,
): EmailExampleImplementation[] {
  return emailExamplesByComponentSlug.get(componentSlug) ?? [];
}

export function getEmailExamplesBySystem(
  system: EmailLayoutSystemSlug,
): EmailExampleImplementation[] {
  return emailExamplesBySystem.get(system) ?? [];
}
