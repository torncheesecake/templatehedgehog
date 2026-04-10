import {
  isEmailComponentCategory,
  type EmailComponentCategory,
} from "@/data/email-components/categories";
import { expandedEmailComponents } from "@/data/email-components/expanded";
import { minedEmailComponents } from "@/data/email-components/mined";
import { waveTwoEmailComponents } from "@/data/email-components/wave-two";
import { loadMjmlLibraryFragment, wrapMjmlFragment } from "@/data/mjml-library";
import { withBasePath } from "@/lib/asset-path";

export type EmailCompatibilityStatus = "tested" | "partial" | "unknown";

export type EmailCompatibility = {
  client: string;
  status: EmailCompatibilityStatus;
  notes?: string;
};

export type EmailComponent = {
  slug: string;
  title: string;
  category: EmailComponentCategory;
  description: string;
  tags: string[];
  sourceFile: string;
  previewImageUrl: string;
  compatibility?: EmailCompatibility[];
  usageGuidance: string[];
  accessibilityNotes: string[];
  mjmlSource: string;
};

const headerFragment = loadMjmlLibraryFragment("header.mjml");
const heroCentredFragment = loadMjmlLibraryFragment("hero-centred.mjml");
const textLeftFragment = loadMjmlLibraryFragment("text-left.mjml");
const dualImageFragment = loadMjmlLibraryFragment("dual-image.mjml");
const textCentredFragment = loadMjmlLibraryFragment("text-centred.mjml");
const singleImageRightFragment = loadMjmlLibraryFragment("single-image-right.mjml");
const singleImageLeftFragment = loadMjmlLibraryFragment("single-image-left.mjml");
const primaryCtaFragment = loadMjmlLibraryFragment("primary-cta.mjml");
const testimonialFragment = loadMjmlLibraryFragment("testimonial.mjml");
const footerFragment = loadMjmlLibraryFragment("footer.mjml");

const coreEmailComponents: EmailComponent[] = [
  {
    slug: "header-brand-row",
    title: "Header",
    category: "Headers",
    description:
      "Simple top row with brand identity and a view-in-browser link for reliable email starts.",
    tags: ["header", "brand", "utility", "view-in-browser"],
    sourceFile: "header.mjml",
    previewImageUrl: "/email-shots-v3/header-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Two-column alignment and browser link remain stable.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Link alignment can shift by a few pixels in narrow desktop panes.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use at the top of launch, lifecycle, and newsletter sends where sender recognition matters immediately.",
      "Swap the placeholder logo asset and destination URL before compiling for production.",
      "Keep the row shallow so mobile clients do not crowd the first content block.",
    ],
    accessibilityNotes: [
      "Ensure the logo image has meaningful alt text that matches the sender brand.",
      "Keep the browser-view link text descriptive so screen-reader users understand the action.",
    ],
    mjmlSource: wrapMjmlFragment(headerFragment),
  },
  {
    slug: "hero-overlay-modern",
    title: "Hero Centred",
    category: "Heroes",
    description:
      "Centred hero section with label, headline, support copy, image, and primary CTA.",
    tags: ["hero", "centred", "cta", "marketing"],
    sourceFile: "hero-centred.mjml",
    previewImageUrl: "/email-shots-v3/hero-centred-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Hero text, CTA, and spacing render as expected.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Background treatment can flatten in legacy Word rendering.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "unknown",
        notes: "Pending full visual regression pass.",
      },
    ],
    usageGuidance: [
      "Use for launch, announcement, and single-message campaigns where one clear CTA should dominate.",
      "Keep the headline tight so Outlook line wrapping stays controlled.",
      "Replace the placeholder image with an absolute HTTPS asset before handing off compiled HTML.",
    ],
    accessibilityNotes: [
      "Use a descriptive heading hierarchy so the first headline still makes sense out of visual context.",
      "Make sure the hero image alt text adds meaning rather than repeating the headline.",
    ],
    mjmlSource: wrapMjmlFragment(heroCentredFragment),
  },
  {
    slug: "hero-image-left",
    title: "Text Left",
    category: "Content Blocks",
    description:
      "Left-aligned text block with heading, body copy, and inline action button.",
    tags: ["text", "left", "copy", "content"],
    sourceFile: "text-left.mjml",
    previewImageUrl: "/email-shots-v3/text-left-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Typography and CTA button spacing are consistent.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "SVG arrow icon in button can be suppressed in older builds.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use below a hero when you need a short explanation and one supporting action.",
      "Works well for feature callouts, editorial copy, and onboarding guidance.",
      "If the CTA is optional, remove the button rather than leaving unused visual weight.",
    ],
    accessibilityNotes: [
      "Keep paragraph contrast high because this block often carries explanatory copy.",
      "Use a CTA label that describes the destination instead of generic language like click here.",
    ],
    mjmlSource: wrapMjmlFragment(textLeftFragment),
  },
  {
    slug: "dual-image-feature-grid",
    title: "Dual Image",
    category: "Product Sections",
    description:
      "Responsive two-column cards for product highlights, service updates, or content picks.",
    tags: ["grid", "2-column", "features", "catalogue"],
    sourceFile: "dual-image.mjml",
    previewImageUrl: "/email-shots-v3/dual-image-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Two-column stack behaviour is consistent across screen sizes.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Column spacing may compress in legacy Word rendering.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use for two featured products, services, offers, or content cards in one compact section.",
      "Keep image aspect ratios consistent so stacked mobile cards stay tidy.",
      "Duplicate or trim columns in MJML if you need a single highlight or a three-up variant later.",
    ],
    accessibilityNotes: [
      "Give each image alt text that distinguishes one card from the other.",
      "Avoid placing critical meaning in the image alone because columns may stack on mobile clients.",
    ],
    mjmlSource: wrapMjmlFragment(dualImageFragment),
  },
  {
    slug: "quad-image-showcase",
    title: "Text Centred",
    category: "Content Blocks",
    description:
      "Centred copy block with heading, body copy, and CTA for message-led sections.",
    tags: ["text", "centred", "copy", "content"],
    sourceFile: "text-centred.mjml",
    previewImageUrl: "/email-shots-v3/text-centred-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Single-column text and CTA render with expected spacing.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Button vertical rhythm can appear tighter than web clients.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use as a separator block between heavier visual sections to reset reading rhythm.",
      "Works well for editorial intros, reminders, and closing summaries.",
      "Limit copy length so the centred layout stays easy to scan on mobile.",
    ],
    accessibilityNotes: [
      "Centred copy can become harder to read in long paragraphs, so keep line lengths moderate.",
      "Maintain clear CTA text and sufficient colour contrast on any supporting button.",
    ],
    mjmlSource: wrapMjmlFragment(textCentredFragment),
  },
  {
    slug: "logo-grid-trust-strip",
    title: "Single Image Right",
    category: "Content Blocks",
    description:
      "Split block with copy on the left and a supporting image on the right.",
    tags: ["image", "split", "right", "marketing"],
    sourceFile: "single-image-right.mjml",
    previewImageUrl: "/email-shots-v3/single-image-right-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Two-column split collapses cleanly on mobile.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Image and text columns can stack earlier in narrow Outlook panes.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use when copy needs to lead and imagery should support the message.",
      "Best for product intros, event promotions, or feature summaries.",
      "Check the stacked mobile order when the image carries important context.",
    ],
    accessibilityNotes: [
      "If the image is decorative, use neutral alt text rather than duplicating adjacent copy.",
      "Check reading order after stacking so the message still makes sense for keyboard and screen-reader users.",
    ],
    mjmlSource: wrapMjmlFragment(singleImageRightFragment),
  },
  {
    slug: "accent-cta-button",
    title: "Primary CTA Button",
    category: "Buttons",
    description:
      "Single-action dark CTA block used to close campaign sections.",
    tags: ["cta", "button", "primary", "lifecycle"],
    sourceFile: "primary-cta.mjml",
    previewImageUrl: "/email-shots-v3/primary-cta-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Button shape and dark fill are stable.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Rounded corners can flatten on some legacy Outlook variants.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use as the primary action after a hero, proof block, or information section.",
      "Keep to one button per section so the send has a clear next step.",
      "Match the CTA label and destination URL to the campaign intent before exporting.",
    ],
    accessibilityNotes: [
      "Button copy should be action-specific and not rely on surrounding text alone.",
      "Check contrast between button fill and text after applying brand colours.",
    ],
    mjmlSource: wrapMjmlFragment(primaryCtaFragment),
  },
  {
    slug: "single-image-left",
    title: "Single Image Left",
    category: "Content Blocks",
    description:
      "Split block with image on the left and supporting copy on the right.",
    tags: ["image", "split", "left", "marketing"],
    sourceFile: "single-image-left.mjml",
    previewImageUrl: "/email-shots-v3/single-image-left-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Two-column split and CTA render consistently.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Column proportions can tighten in legacy Word rendering.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use when the image should lead the story and the copy closes the section.",
      "Works well for case studies, updates, or feature spotlights.",
      "Swap imagery carefully so the left-first reading order still makes sense once stacked on mobile.",
    ],
    accessibilityNotes: [
      "Use meaningful alt text for the leading image because it arrives first in the reading order.",
      "Avoid embedding important copy inside the image itself, especially for mobile clients.",
    ],
    mjmlSource: wrapMjmlFragment(singleImageLeftFragment),
  },
  {
    slug: "testimonial-quote",
    title: "Testimonial / Quote",
    category: "Content Blocks",
    description:
      "Customer quote section for social proof in marketing and nurture emails.",
    tags: ["testimonial", "quote", "proof", "content"],
    sourceFile: "testimonial.mjml",
    previewImageUrl: "/email-shots-v3/testimonial-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Quote typography and spacing render as expected.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Large headline text can wrap slightly earlier than web clients.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
      },
    ],
    usageGuidance: [
      "Use near conversion sections to reinforce trust without adding another large content block.",
      "Keep the quote concise so it reads like evidence rather than body copy.",
      "Pair it with a CTA below when the testimonial is part of a sales sequence.",
    ],
    accessibilityNotes: [
      "Attribute the quote clearly so it is understandable without relying on visual styling.",
      "Do not use oversized decorative quotation marks that could distract from the actual copy.",
    ],
    mjmlSource: wrapMjmlFragment(testimonialFragment),
  },
  {
    slug: "footer-contact-compliance",
    title: "Footer",
    category: "Footers",
    description:
      "Support details plus preference and unsubscribe links for compliant email endings.",
    tags: ["footer", "support", "compliance", "unsubscribe"],
    sourceFile: "footer.mjml",
    previewImageUrl: "/email-shots-v3/footer-component.png",
    compatibility: [
      {
        client: "Gmail (Web + Mobile)",
        status: "tested",
        notes: "Social icons and stacked sections are stable.",
      },
      {
        client: "Outlook Desktop (Windows)",
        status: "partial",
        notes: "Inline SVG icons may not render in older Outlook versions.",
      },
      {
        client: "Apple Mail (macOS + iOS)",
        status: "tested",
      },
      {
        client: "Yahoo Mail",
        status: "tested",
        notes: "Footer section and links verified in web view.",
      },
    ],
    usageGuidance: [
      "Use at the bottom of every commercial send for support details and compliance links.",
      "Replace all placeholder links and legal copy with your own sender information.",
      "Retain unsubscribe or preference links when sending marketing email rather than transactional mail.",
    ],
    accessibilityNotes: [
      "Link text should stay explicit so preference and unsubscribe actions are clear in assistive tech.",
      "Keep support details readable at smaller sizes because footer text often renders tightly on mobile.",
    ],
    mjmlSource: wrapMjmlFragment(footerFragment),
  },
];

function getEmailComponentPreviewImageUrl(slug: string): string {
  return withBasePath(`/email-shots-v3/${slug}.png`);
}

export const emailComponents: EmailComponent[] = [
  ...coreEmailComponents,
  ...expandedEmailComponents,
  ...waveTwoEmailComponents,
  ...minedEmailComponents,
].map((component) => ({
  ...component,
  previewImageUrl: getEmailComponentPreviewImageUrl(component.slug),
}));

const REQUIRED_COMPLETE_EXAMPLE_SOURCE_FILES = [
  "header.mjml",
  "hero-centred.mjml",
  "text-left.mjml",
  "dual-image.mjml",
  "text-centred.mjml",
  "single-image-right.mjml",
  "primary-cta.mjml",
  "footer.mjml",
] as const;

function assertNoDuplicateSlugs(components: EmailComponent[]): void {
  const seen = new Set<string>();

  for (const component of components) {
    if (seen.has(component.slug)) {
      throw new Error(
        `[email-components] Duplicate slug found: "${component.slug}". Slugs must be unique.`,
      );
    }
    seen.add(component.slug);
  }
}

function assertCompatibilityShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!component.compatibility) continue;

    for (const entry of component.compatibility) {
      if (!entry.client || typeof entry.client !== "string") {
        throw new Error(
          `[email-components] Invalid compatibility client for slug "${component.slug}".`,
        );
      }

      if (
        entry.status !== "tested"
        && entry.status !== "partial"
        && entry.status !== "unknown"
      ) {
        throw new Error(
          `[email-components] Invalid compatibility status for slug "${component.slug}".`,
        );
      }
    }
  }
}

function assertCategoryShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!isEmailComponentCategory(component.category)) {
      throw new Error(
        `[email-components] Invalid category "${component.category}" for slug "${component.slug}".`,
      );
    }
  }
}

function assertSourceFileShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!component.sourceFile || typeof component.sourceFile !== "string") {
      throw new Error(
        `[email-components] Invalid sourceFile for slug "${component.slug}".`,
      );
    }
  }
}

function assertDescriptiveMetadataShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!component.description.trim()) {
      throw new Error(
        `[email-components] Missing description for slug "${component.slug}".`,
      );
    }

    if (!Array.isArray(component.tags) || component.tags.length < 2) {
      throw new Error(
        `[email-components] Missing descriptive tags for slug "${component.slug}".`,
      );
    }

    for (const tag of component.tags) {
      if (!tag.trim()) {
        throw new Error(
          `[email-components] Empty tag entry for slug "${component.slug}".`,
        );
      }
    }
  }
}

function assertUsageGuidanceShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!Array.isArray(component.usageGuidance) || component.usageGuidance.length === 0) {
      throw new Error(
        `[email-components] Missing usageGuidance for slug "${component.slug}".`,
      );
    }

    for (const guidance of component.usageGuidance) {
      if (!guidance.trim()) {
        throw new Error(
          `[email-components] Empty usageGuidance entry for slug "${component.slug}".`,
        );
      }
    }
  }
}

function assertAccessibilityNotesShape(components: EmailComponent[]): void {
  for (const component of components) {
    if (!Array.isArray(component.accessibilityNotes) || component.accessibilityNotes.length === 0) {
      throw new Error(
        `[email-components] Missing accessibilityNotes for slug "${component.slug}".`,
      );
    }

    for (const note of component.accessibilityNotes) {
      if (!note.trim()) {
        throw new Error(
          `[email-components] Empty accessibilityNotes entry for slug "${component.slug}".`,
        );
      }
    }
  }
}

function assertCompleteExampleCoverage(components: EmailComponent[]): void {
  const available = new Set(
    components.map((component) => component.sourceFile.toLowerCase()),
  );

  for (const requiredFile of REQUIRED_COMPLETE_EXAMPLE_SOURCE_FILES) {
    if (!available.has(requiredFile.toLowerCase())) {
      throw new Error(
        `[email-components] Missing required complete-example component source: "${requiredFile}".`,
      );
    }
  }
}

assertNoDuplicateSlugs(emailComponents);
assertCompatibilityShape(emailComponents);
assertCategoryShape(emailComponents);
assertSourceFileShape(emailComponents);
assertDescriptiveMetadataShape(emailComponents);
assertUsageGuidanceShape(emailComponents);
assertAccessibilityNotesShape(emailComponents);
assertCompleteExampleCoverage(emailComponents);

const emailComponentBySlug = new Map(
  emailComponents.map((component) => [component.slug, component]),
);

export function getEmailComponentBySlug(
  slug: string,
): EmailComponent | undefined {
  return emailComponentBySlug.get(slug);
}

export function getRelatedEmailComponents(
  currentSlug: string,
  limit: number = 3,
): EmailComponent[] {
  const current = getEmailComponentBySlug(currentSlug);
  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags);

  return emailComponents
    .filter((component) => component.slug !== currentSlug)
    .map((component) => {
      let score = 0;

      if (component.category === current.category) {
        score += 4;
      }

      for (const tag of component.tags) {
        if (currentTags.has(tag)) {
          score += 1;
        }
      }

      return { component, score };
    })
    .sort((left, right) => right.score - left.score || left.component.title.localeCompare(right.component.title))
    .slice(0, limit)
    .map((entry) => entry.component);
}
