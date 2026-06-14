import type {
  StudioPlatform,
  StudioQaState,
  StudioWorkflowWorkspace,
} from "@/data/studio";

export type StudioPackId = "core" | "pro" | "team";
export type StudioCheckStatus = "pass" | "warn" | "fail";
export type StudioEditorMode = "structured" | "advanced";
export type StudioSourceOrigin = "library" | "generated" | "manual";

export type StudioBrandTokens = {
  brandName: string;
  primaryColour: string;
  accentColour: string;
  backgroundColour: string;
  textColour: string;
  fontFamily: string;
  logoUrl: string;
  supportEmail: string;
  footerCompanyLine: string;
};

export type StudioSocialLink = {
  label: string;
  url: string;
};

export type StudioStructuredComponentId =
  | "hero"
  | "body-copy"
  | "digest-item"
  | "image-block"
  | "feature-list"
  | "primary-cta"
  | "social-links"
  | "footer-note";

export type StudioStructuredComponentManifest = {
  id: StudioStructuredComponentId;
  name: string;
  purpose: string;
  requiredFields: string[];
  pack: StudioPackId;
  defaultFields: Record<string, string>;
};

export type StudioInsertedComponent = {
  instanceId: string;
  componentId: StudioStructuredComponentId;
  fields: Record<string, string>;
};

export type StudioComponentMutationResult = {
  components: StudioInsertedComponent[];
  changed: boolean;
  status: StudioCheckStatus;
  message: string;
};

export type StudioStructuredContent = {
  version: "studio-structured-v2";
  workflowId: string;
  preheader: string;
  headline: string;
  bodyCopy: string;
  ctaLabel: string;
  ctaUrl: string;
  brandName: string;
  logoUrl: string;
  heroImageUrl: string;
  heroImageAlt: string;
  supportEmail: string;
  footerLegalLine: string;
  socialLinks: StudioSocialLink[];
  components: StudioInsertedComponent[];
};

export type StudioDiagnostic = {
  key: string;
  status: StudioCheckStatus;
  label: string;
  explanation: string;
  suggestedFix: string;
};

export type StudioReviewItem = {
  source: "structured" | "compiled-html";
  context: string;
  value: string;
  label?: string;
  status: StudioCheckStatus;
  explanation: string;
  suggestedFix: string;
};

export type StudioPackageFile = {
  path: string;
  content: string;
};

export type StudioPackageInspectionItem = {
  path: string;
  included: boolean;
  generatedAt: string;
  status: StudioCheckStatus;
  explanation: string;
};

export type StudioReadinessInput = {
  compileStatus: "ready" | "compiling" | "success" | "error";
  manualQaState: Record<string, StudioQaState>;
  contentChecks: StudioDiagnostic[];
  linkReview: StudioReviewItem[];
  imageReview: StudioReviewItem[];
  packageInspection: StudioPackageInspectionItem[];
  selectedPlatform?: StudioPlatform;
};

export type StudioReadinessScore = {
  percentage: number;
  status: StudioCheckStatus;
  blockingIssues: string[];
  recommendedNextAction: string;
};

export type StudioPackManifest = {
  id: StudioPackId;
  name: string;
  version: string;
  components: StudioStructuredComponentId[];
  layouts: string[];
  workflows: string[];
  exportCapabilities: string[];
  docs: string[];
  compatibleStudioVersions: string[];
};

export const STUDIO_V2_VERSION = "studio-v2-local";

export const DEFAULT_BRAND_TOKENS: StudioBrandTokens = {
  brandName: "Template Hedgehog",
  primaryColour: "#2f67ef",
  accentColour: "#8b5cf6",
  backgroundColour: "#f3f4f6",
  textColour: "#1a1a1a",
  fontFamily: "'Inter', Arial, sans-serif",
  logoUrl: "https://templatehedgehog.co.uk/icon.svg",
  supportEmail: "support@templatehedgehog.co.uk",
  footerCompanyLine: "Template Hedgehog Ltd. Update platform compliance copy before send.",
};

export const STUDIO_COMPONENT_MANIFESTS: StudioStructuredComponentManifest[] = [
  {
    id: "hero",
    name: "Hero",
    purpose: "Lead with the main campaign message and supporting copy.",
    requiredFields: ["headline", "bodyCopy"],
    pack: "core",
    defaultFields: {
      headline: "Write the main message",
      bodyCopy: "Add the most important reason to keep reading.",
    },
  },
  {
    id: "body-copy",
    name: "Body copy",
    purpose: "Add explanatory paragraph copy.",
    requiredFields: ["bodyCopy"],
    pack: "core",
    defaultFields: {
      bodyCopy: "Explain the next useful detail for this audience.",
    },
  },
  {
    id: "primary-cta",
    name: "Primary CTA",
    purpose: "Add a clear action button.",
    requiredFields: ["ctaLabel", "ctaUrl"],
    pack: "core",
    defaultFields: {
      ctaLabel: "Open link",
      ctaUrl: "https://example.com",
    },
  },
  {
    id: "digest-item",
    name: "Digest item",
    purpose: "Add one repeatable newsletter item with its own summary and link.",
    requiredFields: ["itemTitle", "itemSummary", "itemUrl"],
    pack: "pro",
    defaultFields: {
      itemTitle: "First item to review",
      itemSummary: "Summarise why this update matters to the reader.",
      itemUrl: "https://templatehedgehog.co.uk",
      ctaLabel: "Read more",
    },
  },
  {
    id: "image-block",
    name: "Image block",
    purpose: "Add one production image with alt text.",
    requiredFields: ["imageUrl", "imageAlt"],
    pack: "pro",
    defaultFields: {
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
      imageAlt: "Product interface preview",
    },
  },
  {
    id: "feature-list",
    name: "Feature list",
    purpose: "Show three benefits or steps.",
    requiredFields: ["itemOne", "itemTwo", "itemThree"],
    pack: "pro",
    defaultFields: {
      itemOne: "First useful point",
      itemTwo: "Second useful point",
      itemThree: "Third useful point",
    },
  },
  {
    id: "social-links",
    name: "Social links",
    purpose: "Add social/profile links for manual platform handoff.",
    requiredFields: ["label", "url"],
    pack: "team",
    defaultFields: {
      label: "Website",
      url: "https://templatehedgehog.co.uk",
    },
  },
  {
    id: "footer-note",
    name: "Footer note",
    purpose: "Add a compliance or operational footer note.",
    requiredFields: ["footerLegalLine"],
    pack: "core",
    defaultFields: {
      footerLegalLine: "You are receiving this because you opted in to product email.",
    },
  },
];

export const STUDIO_PACK_MANIFESTS: Record<StudioPackId, StudioPackManifest> = {
  core: {
    id: "core",
    name: "Core pack",
    version: "1.0.0",
    components: ["hero", "body-copy", "primary-cta", "footer-note"],
    layouts: ["Product Launch Campaign", "Onboarding Activation Flow"],
    workflows: ["campaign-launch", "onboarding"],
    exportCapabilities: ["mjml", "html", "qa-notes", "implementation-guide", "metadata"],
    docs: ["implementation-guide", "workflow-notes"],
    compatibleStudioVersions: [STUDIO_V2_VERSION],
  },
  pro: {
    id: "pro",
    name: "Pro pack",
    version: "1.0.0",
    components: ["hero", "body-copy", "primary-cta", "digest-item", "image-block", "feature-list", "footer-note"],
    layouts: ["Product Launch Campaign", "Onboarding Activation Flow", "Password Reset", "Weekly Newsletter"],
    workflows: ["campaign-launch", "onboarding", "password-reset", "reporting"],
    exportCapabilities: ["mjml", "html", "qa-notes", "implementation-guide", "workflow-notes", "metadata"],
    docs: ["implementation-guide", "workflow-notes", "platform-handoff"],
    compatibleStudioVersions: [STUDIO_V2_VERSION],
  },
  team: {
    id: "team",
    name: "Team pack",
    version: "1.0.0",
    components: STUDIO_COMPONENT_MANIFESTS.map((component) => component.id),
    layouts: ["Product Launch Campaign", "Onboarding Activation Flow", "Password Reset", "Weekly Newsletter"],
    workflows: ["campaign-launch", "onboarding", "password-reset", "reporting"],
    exportCapabilities: ["mjml", "html", "qa-notes", "implementation-guide", "workflow-notes", "platform-handoff", "metadata"],
    docs: ["implementation-guide", "workflow-notes", "platform-handoff", "security-boundaries"],
    compatibleStudioVersions: [STUDIO_V2_VERSION],
  },
};

const FIXED_EXPORT_PATHS = [
  "mjml/source.mjml",
  "html/compiled.html",
  "docs/qa-notes.md",
  "docs/implementation-guide.md",
  "docs/workflow-notes.md",
  "docs/platform-handoff.md",
  "metadata.json",
];

export const REQUIRED_WORKFLOW_COMPONENTS: StudioStructuredComponentId[] = [
  "hero",
  "body-copy",
  "primary-cta",
  "footer-note",
];

function escapeMjml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isValidHexColour(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

function isProbablyUrl(value: string): boolean {
  if (!value.trim()) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return !trimmed.includes(":") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isPlaceholder(value: string): boolean {
  return /\b(todo|tbd|placeholder|lorem ipsum|replace me|your-|example\.com)\b/i.test(value);
}

function containsAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function createInstanceId(componentId: StudioStructuredComponentId, count: number): string {
  return `${componentId}-${count + 1}`;
}

function createUniqueInstanceId(
  existingComponents: StudioInsertedComponent[],
  componentId: StudioStructuredComponentId,
): string {
  let index = existingComponents.length + 1;
  let candidate = createInstanceId(componentId, index - 1);

  while (existingComponents.some((component) => component.instanceId === candidate)) {
    index += 1;
    candidate = createInstanceId(componentId, index - 1);
  }

  return candidate;
}

function hasLongUnbrokenWord(value: string, maxLength = 48): boolean {
  return value.split(/\s+/).some((word) => word.length > maxLength);
}

export function shouldConfirmMjmlRegeneration(origin: StudioSourceOrigin, hasSourceChanges: boolean): boolean {
  return origin === "manual" && hasSourceChanges;
}

export function shouldConfirmWorkflowSwitch(hasSourceChanges: boolean, hasStructuredChanges: boolean): boolean {
  return hasSourceChanges || hasStructuredChanges;
}

export function validateBrandTokens(tokens: StudioBrandTokens): StudioDiagnostic[] {
  const checks: StudioDiagnostic[] = [];
  const colourFields: Array<keyof StudioBrandTokens> = [
    "primaryColour",
    "accentColour",
    "backgroundColour",
    "textColour",
  ];

  for (const field of colourFields) {
    const value = tokens[field];
    checks.push({
      key: `brand-${field}`,
      status: isValidHexColour(value) ? "pass" : "fail",
      label: `${field} token`,
      explanation: isValidHexColour(value)
        ? `${field} is a valid hex colour.`
        : `${field} must be a six-character hex colour such as #2f67ef.`,
      suggestedFix: "Use a full hex colour value.",
    });
  }

  checks.push({
    key: "brand-name",
    status: tokens.brandName.trim() ? "pass" : "fail",
    label: "Brand name",
    explanation: tokens.brandName.trim() ? "Brand name is available." : "Brand name is required for generated MJML.",
    suggestedFix: "Add the customer or product brand name.",
  });

  checks.push({
    key: "brand-support-email",
    status: isValidEmail(tokens.supportEmail) ? "pass" : "fail",
    label: "Support email",
    explanation: isValidEmail(tokens.supportEmail)
      ? "Support email looks valid."
      : "Support email must be a valid email address.",
    suggestedFix: "Use a support address that the sending platform can display.",
  });

  checks.push({
    key: "brand-logo",
    status: tokens.logoUrl.trim() && isProbablyUrl(tokens.logoUrl) ? "pass" : "warn",
    label: "Logo URL/path",
    explanation: tokens.logoUrl.trim()
      ? "Logo reference is present."
      : "No logo reference is set. The generated email will use text branding.",
    suggestedFix: "Add an HTTPS logo URL or local path before platform handoff.",
  });

  return checks;
}

export function migrateWorkflowToStructuredContent(workflow: StudioWorkflowWorkspace): StudioStructuredContent {
  const fields = Object.fromEntries(workflow.quickEdits.map((field) => [field.key, field.value]));
  const firstImage = workflow.source.body.match(/<mj-image[^>]+src="([^"]+)"/i)?.[1] ?? "";
  const firstImageAlt = workflow.source.body.match(/<mj-image[^>]+alt="([^"]*)"/i)?.[1] ?? "";
  const isCampaignLaunch = workflow.slug === "campaign-launch";
  const isOnboarding = workflow.slug === "onboarding";
  const isPasswordReset = workflow.slug === "password-reset";
  const isWeeklyDigest = workflow.slug === "reporting";
  const preheader = fields.previewText ?? (
    isCampaignLaunch
      ? "New product launch: key benefits, proof, and next action inside."
      : isOnboarding
        ? "Start with the first useful setup step and know where to get help."
        : isPasswordReset
          ? "Secure password reset link. Expires soon."
          : isWeeklyDigest
            ? "Your weekly product and lifecycle email digest."
            : "Template Hedgehog reusable email block"
  );
  const headline = fields.headline ?? workflow.workflow.name;
  const bodyCopy = isCampaignLaunch
    ? "Introduce the new product or release, explain the clearest customer benefit, and send readers to one launch destination for details, demo booking, or purchase intent."
    : isOnboarding
      ? "Welcome the user, confirm where they are in setup, and guide them to the first activation step that helps them get value from the product."
      : isPasswordReset
        ? "Use the button below to reset your password. For security, this link should expire and can only be used for the account that requested it. If you did not request a reset, ignore this email or contact support."
        : isWeeklyDigest
          ? "A concise weekly round-up of the updates, resources, and next actions worth reviewing."
          : workflow.workflow.summary;
  const ctaLabel = isCampaignLaunch
    ? "See what's new"
    : isOnboarding
      ? "Start setup"
      : isPasswordReset
        ? "Reset password"
        : isWeeklyDigest
          ? "Read full digest"
          : fields.ctaLabel ?? "Open link";
  const ctaUrl = fields.ctaUrl ?? "https://templatehedgehog.co.uk";
  const footerLegalLine = isCampaignLaunch
    ? "You are receiving this product launch update because you opted in. Audiences, suppressions, and unsubscribe handling stay in the sending platform."
    : isOnboarding
      ? "You are receiving this onboarding email because you created an account or started setup. Lifecycle triggers and suppressions stay in the sending platform."
      : isPasswordReset
        ? "This password reset email was requested for account access. The sending platform must provide the token, expiry policy, and delivery controls."
        : isWeeklyDigest
          ? "You are receiving this weekly digest because you subscribed. Manage preferences and unsubscribe in the sending platform."
          : fields.footerLegal ?? DEFAULT_BRAND_TOKENS.footerCompanyLine;
  const heroComponent = {
    ...insertStructuredComponent([], "hero"),
    fields: { headline, bodyCopy },
  };
  const bodyCopyComponent = {
    ...insertStructuredComponent([], "body-copy"),
    fields: { bodyCopy },
  };
  const ctaComponent = {
    ...insertStructuredComponent([], "primary-cta"),
    fields: { ctaLabel, ctaUrl },
  };
  const footerComponent = {
    ...insertStructuredComponent([], "footer-note"),
    fields: { footerLegalLine },
  };
  const baseComponents: StudioInsertedComponent[] = [
    heroComponent,
    bodyCopyComponent,
    ctaComponent,
    footerComponent,
  ];
  const campaignComponents: StudioInsertedComponent[] = isCampaignLaunch
    ? [
        heroComponent,
        bodyCopyComponent,
        {
          ...insertStructuredComponent([], "feature-list"),
          fields: {
            itemOne: "Launch message states what is new and who it is for.",
            itemTwo: "Benefit stack links the release to a concrete customer outcome.",
            itemThree: "Primary CTA points to a launch page, demo, or product detail.",
          },
        },
        {
          ...insertStructuredComponent([], "image-block"),
          fields: {
            imageUrl: firstImage,
            imageAlt: firstImageAlt || "Product launch preview",
          },
        },
        ctaComponent,
        footerComponent,
      ]
    : baseComponents;
  const onboardingComponents: StudioInsertedComponent[] = isOnboarding
    ? [
        heroComponent,
        bodyCopyComponent,
        {
          ...insertStructuredComponent([], "feature-list"),
          fields: {
            itemOne: "Confirm the user's current setup state.",
            itemTwo: "Give one first activation step, not a full product tour.",
            itemThree: "Provide a support route if the setup step stalls.",
          },
        },
        ctaComponent,
        footerComponent,
      ]
    : campaignComponents;
  const digestComponents: StudioInsertedComponent[] = isWeeklyDigest
    ? [
        heroComponent,
        bodyCopyComponent,
        {
          ...insertStructuredComponent([], "digest-item"),
          instanceId: "digest-item-1",
          fields: {
            itemTitle: "Product update",
            itemSummary: "Summarise the most useful product change from this week.",
            itemUrl: "https://templatehedgehog.co.uk/changelog",
            ctaLabel: "Read update",
          },
        },
        {
          ...insertStructuredComponent([], "digest-item"),
          instanceId: "digest-item-2",
          fields: {
            itemTitle: "Customer story",
            itemSummary: "Highlight one proof point, use case, or customer result.",
            itemUrl: "https://templatehedgehog.co.uk/workflows",
            ctaLabel: "View story",
          },
        },
        {
          ...insertStructuredComponent([], "digest-item"),
          instanceId: "digest-item-3",
          fields: {
            itemTitle: "Next action",
            itemSummary: "Give readers one useful action to take before next week.",
            itemUrl: "https://templatehedgehog.co.uk/docs",
            ctaLabel: "Open guide",
          },
        },
        ctaComponent,
        footerComponent,
      ]
    : onboardingComponents;

  return {
    version: "studio-structured-v2",
    workflowId: workflow.slug,
    preheader,
    headline,
    bodyCopy,
    ctaLabel,
    ctaUrl,
    brandName: fields.brandName ?? DEFAULT_BRAND_TOKENS.brandName,
    logoUrl: firstImage,
    heroImageUrl: firstImage,
    heroImageAlt: firstImageAlt,
    supportEmail: fields.supportEmail ?? DEFAULT_BRAND_TOKENS.supportEmail,
    footerLegalLine,
    socialLinks: [
      { label: "Website", url: ctaUrl },
    ],
    components: digestComponents,
  };
}

export function buildInitialStructuredContent(workflows: StudioWorkflowWorkspace[]) {
  return Object.fromEntries(
    workflows.map((workflow) => [workflow.slug, migrateWorkflowToStructuredContent(workflow)]),
  ) as Record<string, StudioStructuredContent>;
}

export function applyBrandTokensToStructuredContent(
  content: StudioStructuredContent,
  tokens: StudioBrandTokens,
): StudioStructuredContent {
  return {
    ...content,
    brandName: content.brandName.trim() || tokens.brandName,
    logoUrl: content.logoUrl.trim() || tokens.logoUrl,
    supportEmail: content.supportEmail.trim() || tokens.supportEmail,
    footerLegalLine: content.footerLegalLine.trim() || tokens.footerCompanyLine,
  };
}

export function insertStructuredComponent(
  existingComponents: StudioInsertedComponent[],
  componentId: StudioStructuredComponentId,
): StudioInsertedComponent {
  const manifest = STUDIO_COMPONENT_MANIFESTS.find((component) => component.id === componentId);
  if (!manifest) {
    throw new Error(`Unsupported Studio component: ${componentId}`);
  }

  return {
    instanceId: createUniqueInstanceId(existingComponents, componentId),
    componentId,
    fields: { ...manifest.defaultFields },
  };
}

export function duplicateStructuredComponent(
  components: StudioInsertedComponent[],
  instanceId: string,
): StudioComponentMutationResult {
  const index = components.findIndex((component) => component.instanceId === instanceId);
  if (index < 0) {
    return {
      components,
      changed: false,
      status: "fail",
      message: "Component was not found.",
    };
  }

  const source = components[index];
  const duplicate: StudioInsertedComponent = {
    ...source,
    instanceId: createUniqueInstanceId(components, source.componentId),
    fields: { ...source.fields },
  };
  const next = [...components];
  next.splice(index + 1, 0, duplicate);

  return {
    components: next,
    changed: true,
    status: "pass",
    message: `${source.componentId} duplicated.`,
  };
}

export function reorderStructuredComponent(
  components: StudioInsertedComponent[],
  instanceId: string,
  direction: "up" | "down",
): StudioComponentMutationResult {
  const index = components.findIndex((component) => component.instanceId === instanceId);
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || nextIndex < 0 || nextIndex >= components.length) {
    return {
      components,
      changed: false,
      status: "warn",
      message: "Component cannot move further in that direction.",
    };
  }

  const next = [...components];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

  return {
    components: next,
    changed: true,
    status: "pass",
    message: "Component order updated.",
  };
}

export function removeStructuredComponent(
  components: StudioInsertedComponent[],
  instanceId: string,
): StudioComponentMutationResult {
  const component = components.find((item) => item.instanceId === instanceId);
  if (!component) {
    return {
      components,
      changed: false,
      status: "fail",
      message: "Component was not found.",
    };
  }

  const requiredCount = components.filter((item) => item.componentId === component.componentId).length;
  if (REQUIRED_WORKFLOW_COMPONENTS.includes(component.componentId) && requiredCount <= 1) {
    return {
      components,
      changed: false,
      status: "fail",
      message: "This is the last required section for the workflow.",
    };
  }

  return {
    components: components.filter((item) => item.instanceId !== instanceId),
    changed: true,
    status: "pass",
    message: `${component.componentId} removed.`,
  };
}

export function getAvailableComponentsForPack(pack: StudioPackId): StudioStructuredComponentManifest[] {
  const manifest = STUDIO_PACK_MANIFESTS[pack];
  return STUDIO_COMPONENT_MANIFESTS.filter((component) => manifest.components.includes(component.id));
}

export function checkStudioEntitlement(
  pack: StudioPackId,
  kind: "workflow" | "component" | "export",
  id: string,
): boolean {
  const manifest = STUDIO_PACK_MANIFESTS[pack];
  if (kind === "workflow") return manifest.workflows.includes(id);
  if (kind === "component") return manifest.components.includes(id as StudioStructuredComponentId);
  return manifest.exportCapabilities.includes(id);
}

function renderInsertedComponent(component: StudioInsertedComponent, tokens: StudioBrandTokens): string {
  const fields = component.fields;

  if (component.componentId === "image-block") {
    return `
      <mj-section background-color="#ffffff" padding="0 34px 24px 34px">
        <mj-column>
          <mj-image src="${escapeMjml(fields.imageUrl ?? "")}" alt="${escapeMjml(fields.imageAlt ?? "")}" border-radius="12px" />
        </mj-column>
      </mj-section>`;
  }

  if (component.componentId === "feature-list") {
    return `
      <mj-section background-color="#ffffff" padding="0 34px 24px 34px">
        <mj-column>
          <mj-text font-size="15px" line-height="24px" color="${tokens.textColour}">1. ${escapeMjml(fields.itemOne ?? "")}</mj-text>
          <mj-text font-size="15px" line-height="24px" color="${tokens.textColour}">2. ${escapeMjml(fields.itemTwo ?? "")}</mj-text>
          <mj-text font-size="15px" line-height="24px" color="${tokens.textColour}">3. ${escapeMjml(fields.itemThree ?? "")}</mj-text>
        </mj-column>
      </mj-section>`;
  }

  if (component.componentId === "digest-item") {
    return `
      <mj-section background-color="#ffffff" padding="0 34px 14px 34px">
        <mj-column>
          <mj-table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="border:1px solid #e5e7eb;border-radius:14px;padding:18px 20px;background-color:#f9fafb;">
                <p style="margin:0 0 8px 0;font-size:18px;line-height:26px;font-weight:700;color:${tokens.textColour};">${escapeMjml(fields.itemTitle ?? "")}</p>
                <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;color:${tokens.textColour};">${escapeMjml(fields.itemSummary ?? "")}</p>
                <a href="${escapeMjml(fields.itemUrl ?? "")}" style="color:${tokens.primaryColour};font-weight:700;text-decoration:none;">${escapeMjml(fields.ctaLabel ?? "Read more")}</a>
              </td>
            </tr>
          </mj-table>
        </mj-column>
      </mj-section>`;
  }

  if (component.componentId === "social-links") {
    return `
      <mj-section background-color="#ffffff" padding="0 34px 20px 34px">
        <mj-column>
          <mj-text align="center" font-size="13px" color="${tokens.textColour}">
            <a href="${escapeMjml(fields.url ?? "")}" style="color:${tokens.primaryColour};">${escapeMjml(fields.label ?? "Website")}</a>
          </mj-text>
        </mj-column>
      </mj-section>`;
  }

  if (component.componentId === "footer-note") {
    return `
      <mj-section background-color="#ffffff" padding="0 34px 8px 34px">
        <mj-column>
          <mj-text font-size="12px" line-height="20px" color="#6b7280" align="center">${escapeMjml(fields.footerLegalLine ?? "")}</mj-text>
        </mj-column>
      </mj-section>`;
  }

  return "";
}

export function generateMjmlFromStructuredContent(
  content: StudioStructuredContent,
  tokens: StudioBrandTokens,
): string {
  const resolved = applyBrandTokensToStructuredContent(content, tokens);
  const logo = resolved.logoUrl.trim()
    ? `<mj-image src="${escapeMjml(resolved.logoUrl)}" alt="${escapeMjml(`${resolved.brandName} logo`)}" width="128px" padding="0 0 12px 0" />`
    : `<mj-text align="center" font-size="16px" font-weight="700" color="${tokens.primaryColour}">${escapeMjml(resolved.brandName)}</mj-text>`;
  const heroImage = resolved.heroImageUrl.trim()
    ? `<mj-image src="${escapeMjml(resolved.heroImageUrl)}" alt="${escapeMjml(resolved.heroImageAlt)}" border-radius="14px" padding="0 0 22px 0" />`
    : "";
  const socialLinks = resolved.socialLinks
    .filter((item) => item.label.trim() && item.url.trim())
    .map((item) => `<a href="${escapeMjml(item.url)}" style="color:${tokens.primaryColour};">${escapeMjml(item.label)}</a>`)
    .join(" &nbsp; ");
  const insertedComponents = resolved.components
    .map((component) => renderInsertedComponent(component, tokens))
    .join("\n");

  return `<mjml>
  <mj-head>
    <mj-preview>${escapeMjml(resolved.preheader)}</mj-preview>
    <mj-attributes>
      <mj-all font-family="${escapeMjml(tokens.fontFamily)}" />
      <mj-body background-color="${escapeMjml(tokens.backgroundColour)}" width="640px" />
      <mj-text color="${escapeMjml(tokens.textColour)}" />
      <mj-button background-color="${escapeMjml(tokens.primaryColour)}" color="#ffffff" border-radius="999px" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="${escapeMjml(tokens.backgroundColour)}">
    <mj-section background-color="#ffffff" padding="28px 34px 8px 34px">
      <mj-column>
        ${logo}
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="10px 34px 28px 34px">
      <mj-column>
        ${heroImage}
        <mj-text align="center" font-size="34px" line-height="40px" font-weight="800" color="${escapeMjml(tokens.textColour)}">${escapeMjml(resolved.headline)}</mj-text>
        <mj-text align="center" font-size="16px" line-height="26px" color="${escapeMjml(tokens.textColour)}">${escapeMjml(resolved.bodyCopy)}</mj-text>
        <mj-button href="${escapeMjml(resolved.ctaUrl)}" font-size="16px" font-weight="700" inner-padding="14px 30px">${escapeMjml(resolved.ctaLabel)}</mj-button>
      </mj-column>
    </mj-section>
    ${insertedComponents}
    <mj-section background-color="#ffffff" padding="18px 34px 28px 34px">
      <mj-column>
        <mj-text align="center" font-size="12px" line-height="20px" color="#6b7280">${escapeMjml(resolved.footerLegalLine)}</mj-text>
        <mj-text align="center" font-size="12px" line-height="20px" color="#6b7280">Support: <a href="mailto:${escapeMjml(resolved.supportEmail)}">${escapeMjml(resolved.supportEmail)}</a></mj-text>
        ${socialLinks ? `<mj-text align="center" font-size="12px" line-height="20px">${socialLinks}</mj-text>` : ""}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}

export function runContentQa(content: StudioStructuredContent, tokens: StudioBrandTokens): StudioDiagnostic[] {
  const checks: StudioDiagnostic[] = [];
  const merged = applyBrandTokensToStructuredContent(content, tokens);
  const requiredFields: Array<[keyof StudioStructuredContent, string]> = [
    ["preheader", "Preheader"],
    ["headline", "Headline"],
    ["bodyCopy", "Body copy"],
    ["ctaLabel", "CTA label"],
    ["ctaUrl", "CTA URL"],
    ["supportEmail", "Support email"],
    ["footerLegalLine", "Footer/legal line"],
  ];

  for (const [key, label] of requiredFields) {
    const value = String(merged[key] ?? "");
    checks.push({
      key: `required-${String(key)}`,
      status: value.trim() ? "pass" : "fail",
      label,
      explanation: value.trim() ? `${label} is present.` : `${label} is required before export.`,
      suggestedFix: `Add ${label.toLowerCase()} in structured editing.`,
    });
  }

  checks.push({
    key: "cta-url-format",
    status: isProbablyUrl(merged.ctaUrl) ? "pass" : "fail",
    label: "CTA URL format",
    explanation: isProbablyUrl(merged.ctaUrl) ? "CTA URL has a valid local format." : "CTA URL must be an http, https, or mailto URL.",
    suggestedFix: "Use a complete URL such as https://example.com/path.",
  });

  checks.push({
    key: "support-email-format",
    status: isValidEmail(merged.supportEmail) ? "pass" : "fail",
    label: "Support email format",
    explanation: isValidEmail(merged.supportEmail) ? "Support email looks valid." : "Support email is missing or malformed.",
    suggestedFix: "Use a valid support email address.",
  });

  checks.push({
    key: "image-alt",
    status: merged.heroImageUrl.trim() && !merged.heroImageAlt.trim() ? "fail" : "pass",
    label: "Image alt text",
    explanation: merged.heroImageUrl.trim() && !merged.heroImageAlt.trim()
      ? "A hero image is set without alt text."
      : "Image alt text is acceptable.",
    suggestedFix: "Add concise descriptive alt text for each image.",
  });

  const placeholderFields = [
    merged.preheader,
    merged.headline,
    merged.bodyCopy,
    merged.ctaLabel,
    merged.footerLegalLine,
    merged.heroImageUrl,
  ];
  const hasPlaceholder = placeholderFields.some(isPlaceholder);
  checks.push({
    key: "placeholder-text",
    status: hasPlaceholder ? "warn" : "pass",
    label: "Placeholder text",
    explanation: hasPlaceholder ? "One or more fields look like placeholder content." : "No obvious placeholder content was found.",
    suggestedFix: "Replace placeholder copy, sample URLs, and TODO language before handoff.",
  });

  checks.push({
    key: "headline-length",
    status: merged.headline.length > 90 ? "warn" : "pass",
    label: "Headline length",
    explanation: merged.headline.length > 90 ? "Headline is long for common email layouts." : "Headline length is reasonable.",
    suggestedFix: "Keep the headline near 90 characters or less.",
  });

  checks.push({
    key: "cta-label-length",
    status: merged.ctaLabel.length > 36 ? "warn" : "pass",
    label: "CTA label length",
    explanation: merged.ctaLabel.length > 36 ? "CTA label may wrap awkwardly on mobile." : "CTA label length is reasonable.",
    suggestedFix: "Shorten the CTA label.",
  });

  const longTextFields = [
    merged.headline,
    merged.bodyCopy,
    merged.ctaLabel,
    merged.footerLegalLine,
  ];
  const hasLongWord = longTextFields.some((value) => hasLongUnbrokenWord(value));
  checks.push({
    key: "long-unbroken-word",
    status: hasLongWord ? "warn" : "pass",
    label: "Long unbroken text",
    explanation: hasLongWord
      ? "One or more fields contain an unusually long unbroken word that may damage mobile layout."
      : "No risky unbroken words were found.",
    suggestedFix: "Add spaces or shorten long tokens before export.",
  });

  for (const requiredComponent of REQUIRED_WORKFLOW_COMPONENTS) {
    checks.push({
      key: `required-component-${requiredComponent}`,
      status: merged.components.some((component) => component.componentId === requiredComponent) ? "pass" : "fail",
      label: `${requiredComponent} section`,
      explanation: merged.components.some((component) => component.componentId === requiredComponent)
        ? "Required workflow section is present."
        : "A required workflow section is missing.",
      suggestedFix: "Restore the required section before export.",
    });
  }

  const brokenComponents = merged.components.filter((component) =>
    !STUDIO_COMPONENT_MANIFESTS.some((manifest) => manifest.id === component.componentId),
  );
  checks.push({
    key: "component-references",
    status: brokenComponents.length ? "fail" : "pass",
    label: "Internal model references",
    explanation: brokenComponents.length
      ? "One or more structured components no longer exist in the local manifest."
      : "Structured component references resolve locally.",
    suggestedFix: "Remove or replace unsupported structured components.",
  });

  for (const component of merged.components) {
    const manifest = STUDIO_COMPONENT_MANIFESTS.find((item) => item.id === component.componentId);
    if (!manifest) continue;
    const missingFields = manifest.requiredFields.filter((field) => !String(component.fields[field] ?? "").trim());
    checks.push({
      key: `component-${component.instanceId}-required-fields`,
      status: missingFields.length ? "fail" : "pass",
      label: `${manifest.name} required fields`,
      explanation: missingFields.length
        ? `${manifest.name} is missing: ${missingFields.join(", ")}.`
        : `${manifest.name} has required fields.`,
      suggestedFix: "Complete the component fields before generating MJML.",
    });

    for (const [field, value] of Object.entries(component.fields)) {
      if (/url$/i.test(field) && value.trim()) {
        const review = reviewUrl(value);
        checks.push({
          key: `component-${component.instanceId}-${field}-url`,
          status: review.status,
          label: `${manifest.name} ${field}`,
          explanation: review.explanation,
          suggestedFix: review.suggestedFix,
        });
      }
    }
  }

  if (merged.workflowId === "campaign-launch") {
    const combinedCopy = [
      merged.preheader,
      merged.headline,
      merged.bodyCopy,
      merged.ctaLabel,
      merged.footerLegalLine,
      ...merged.components.flatMap((component) => Object.values(component.fields)),
    ].join(" ");
    const featureLists = merged.components.filter((component) => component.componentId === "feature-list");
    const completeFeatureLists = featureLists.filter((component) =>
      ["itemOne", "itemTwo", "itemThree"].every((field) => String(component.fields[field] ?? "").trim()),
    );

    checks.push({
      key: "campaign-launch-positioning-copy",
      status: containsAny(combinedCopy, [/\blaunch\b/i, /\bnew\b/i, /\brelease\b/i, /\bavailable\b/i]) ? "pass" : "warn",
      label: "Launch positioning",
      explanation: containsAny(combinedCopy, [/\blaunch\b/i, /\bnew\b/i, /\brelease\b/i, /\bavailable\b/i])
        ? "Copy frames the message as a product launch or release."
        : "Copy does not clearly read like a product launch.",
      suggestedFix: "State what is launching, who it is for, and why it matters now.",
    });

    checks.push({
      key: "campaign-launch-benefit-stack",
      status: completeFeatureLists.length > 0 ? "pass" : "warn",
      label: "Launch benefit stack",
      explanation: completeFeatureLists.length > 0
        ? "A complete benefit or proof stack is present."
        : "Product launch emails need concrete benefits, proof points, or feature highlights.",
      suggestedFix: "Add or complete a Feature list section with three launch-specific points.",
    });

    checks.push({
      key: "campaign-launch-cta-intent",
      status: containsAny(merged.ctaLabel, [/\bsee\b/i, /\bview\b/i, /\bbook\b/i, /\bstart\b/i, /\btry\b/i, /\blearn\b/i]) ? "pass" : "warn",
      label: "Launch CTA intent",
      explanation: containsAny(merged.ctaLabel, [/\bsee\b/i, /\bview\b/i, /\bbook\b/i, /\bstart\b/i, /\btry\b/i, /\blearn\b/i])
        ? "CTA label supports a launch conversion path."
        : "CTA label is generic for a product launch.",
      suggestedFix: "Use a launch action such as 'See what is new', 'Book a demo', or 'Start trial'.",
    });
  }

  if (merged.workflowId === "onboarding") {
    const combinedCopy = [
      merged.preheader,
      merged.headline,
      merged.bodyCopy,
      merged.ctaLabel,
      merged.footerLegalLine,
      ...merged.components.flatMap((component) => Object.values(component.fields)),
    ].join(" ");
    const featureLists = merged.components.filter((component) => component.componentId === "feature-list");
    const completeFeatureLists = featureLists.filter((component) =>
      ["itemOne", "itemTwo", "itemThree"].every((field) => String(component.fields[field] ?? "").trim()),
    );

    checks.push({
      key: "onboarding-activation-copy",
      status: containsAny(combinedCopy, [/\bsetup\b/i, /\bactivate\b/i, /\bstart\b/i, /\bfirst step\b/i, /\bwelcome\b/i]) ? "pass" : "warn",
      label: "Activation wording",
      explanation: containsAny(combinedCopy, [/\bsetup\b/i, /\bactivate\b/i, /\bstart\b/i, /\bfirst step\b/i, /\bwelcome\b/i])
        ? "Copy gives the recipient a clear onboarding or activation frame."
        : "Copy does not clearly explain the first activation step.",
      suggestedFix: "Name the user's current state and the first useful setup action.",
    });

    checks.push({
      key: "onboarding-step-structure",
      status: completeFeatureLists.length > 0 ? "pass" : "warn",
      label: "Onboarding step structure",
      explanation: completeFeatureLists.length > 0
        ? "A complete onboarding step list is present."
        : "Onboarding emails need a clear step list or support path.",
      suggestedFix: "Add or complete a Feature list section with state, next step, and support route.",
    });

    checks.push({
      key: "onboarding-cta-specificity",
      status: containsAny(merged.ctaLabel, [/\bsetup\b/i, /\bstart\b/i, /\bcontinue\b/i, /\bactivate\b/i, /\bopen\b/i]) ? "pass" : "warn",
      label: "Onboarding CTA",
      explanation: containsAny(merged.ctaLabel, [/\bsetup\b/i, /\bstart\b/i, /\bcontinue\b/i, /\bactivate\b/i, /\bopen\b/i])
        ? "CTA is specific enough for an onboarding action."
        : "CTA is generic for a lifecycle onboarding email.",
      suggestedFix: "Use a direct next-step CTA such as 'Start setup' or 'Continue onboarding'.",
    });
  }

  if (merged.workflowId === "password-reset") {
    const combinedCopy = [
      merged.preheader,
      merged.headline,
      merged.bodyCopy,
      merged.ctaLabel,
      merged.footerLegalLine,
      ...merged.components.flatMap((component) => Object.values(component.fields)),
    ].join(" ");

    checks.push({
      key: "password-reset-token-expiry-copy",
      status: containsAny(combinedCopy, [/\bexpir(?:e|es|y|ation)\b/i, /\bvalid for\b/i]) ? "pass" : "warn",
      label: "Token expiry wording",
      explanation: containsAny(combinedCopy, [/\bexpir(?:e|es|y|ation)\b/i, /\bvalid for\b/i])
        ? "Password reset copy references token expiry."
        : "Password reset copy does not clearly mention link expiry.",
      suggestedFix: "State that the reset link expires according to the sending platform's policy.",
    });

    checks.push({
      key: "password-reset-unexpected-request-copy",
      status: containsAny(combinedCopy, [/\bif you did not\b/i, /\bif you didn't\b/i, /\bignore this email\b/i, /\bnot request\b/i]) ? "pass" : "warn",
      label: "Unexpected reset request wording",
      explanation: containsAny(combinedCopy, [/\bif you did not\b/i, /\bif you didn't\b/i, /\bignore this email\b/i, /\bnot request\b/i])
        ? "Copy tells recipients what to do if they did not request access."
        : "Copy should explain what happens if the recipient did not request a password reset.",
      suggestedFix: "Add account access wording such as 'If you did not request this, ignore this email or contact support.'",
    });

    checks.push({
      key: "password-reset-cta-specificity",
      status: /\breset\b/i.test(merged.ctaLabel) && /\bpassword\b/i.test(merged.ctaLabel) ? "pass" : "warn",
      label: "Password reset CTA",
      explanation: /\breset\b/i.test(merged.ctaLabel) && /\bpassword\b/i.test(merged.ctaLabel)
        ? "CTA is specific to resetting a password."
        : "CTA is generic for a security-sensitive transactional email.",
      suggestedFix: "Use a direct CTA such as 'Reset password'.",
    });
  }

  if (merged.workflowId === "reporting") {
    const digestItems = merged.components.filter((component) => component.componentId === "digest-item");
    const completeDigestItems = digestItems.filter((component) =>
      ["itemTitle", "itemSummary", "itemUrl"].every((field) => String(component.fields[field] ?? "").trim()),
    );

    checks.push({
      key: "weekly-digest-multiple-items",
      status: completeDigestItems.length >= 2 ? "pass" : "fail",
      label: "Multiple digest items",
      explanation: completeDigestItems.length >= 2
        ? "Weekly digest has multiple complete content items."
        : "Weekly digest needs at least two complete content items before export.",
      suggestedFix: "Add or duplicate Digest item sections and complete title, summary, and URL fields.",
    });

    checks.push({
      key: "weekly-digest-preheader",
      status: containsAny(merged.preheader, [/\bweek\b/i, /\bdigest\b/i, /\bround-?up\b/i]) ? "pass" : "warn",
      label: "Newsletter preheader",
      explanation: containsAny(merged.preheader, [/\bweek\b/i, /\bdigest\b/i, /\bround-?up\b/i])
        ? "Preheader frames the email as a digest."
        : "Preheader does not clearly frame the email as a digest or round-up.",
      suggestedFix: "Use a preheader that sets the weekly digest expectation.",
    });

    checks.push({
      key: "weekly-digest-item-links",
      status: digestItems.every((component) => isProbablyUrl(String(component.fields.itemUrl ?? ""))) ? "pass" : "fail",
      label: "Digest item links",
      explanation: digestItems.every((component) => isProbablyUrl(String(component.fields.itemUrl ?? "")))
        ? "All digest item links have valid local URL formats."
        : "One or more digest item links are missing or malformed.",
      suggestedFix: "Use complete http, https, or mailto URLs for each digest item.",
    });
  }

  return checks;
}

function reviewUrl(value: string): Pick<StudioReviewItem, "status" | "explanation" | "suggestedFix"> {
  if (!value.trim()) {
    return {
      status: "fail",
      explanation: "URL is empty.",
      suggestedFix: "Add a complete URL or remove the link.",
    };
  }

  if (/^javascript:/i.test(value)) {
    return {
      status: "fail",
      explanation: "Unsafe JavaScript URL.",
      suggestedFix: "Use an https or mailto URL.",
    };
  }

  if (isPlaceholder(value) || value === "#") {
    return {
      status: "warn",
      explanation: "URL looks like a placeholder.",
      suggestedFix: "Replace placeholder links before handoff.",
    };
  }

  if (!isProbablyUrl(value)) {
    return {
      status: "fail",
      explanation: "URL format is malformed.",
      suggestedFix: "Use http, https, or mailto.",
    };
  }

  if (value.startsWith("mailto:") && !isValidEmail(value.replace(/^mailto:/i, ""))) {
    return {
      status: "fail",
      explanation: "Mailto link is malformed.",
      suggestedFix: "Use mailto:name@example.com.",
    };
  }

  return {
    status: "pass",
    explanation: "URL format looks valid locally.",
    suggestedFix: "Review final platform tokens inside the sending platform.",
  };
}

export function reviewLinks(content: StudioStructuredContent, compiledHtml = ""): StudioReviewItem[] {
  const structuredLinks: StudioReviewItem[] = [
    {
      source: "structured",
      context: "Primary CTA",
      value: content.ctaUrl,
      label: content.ctaLabel,
      ...reviewUrl(content.ctaUrl),
    },
    {
      source: "structured",
      context: "Support email",
      value: `mailto:${content.supportEmail}`,
      label: "Support",
      ...reviewUrl(`mailto:${content.supportEmail}`),
    },
    ...content.socialLinks.map((link) => ({
      source: "structured" as const,
      context: "Social link",
      value: link.url,
      label: link.label,
      ...reviewUrl(link.url),
    })),
  ];

  const htmlLinks = Array.from(compiledHtml.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)).map((match) => {
    const value = match[1] ?? "";
    const label = (match[2] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      source: "compiled-html" as const,
      context: "Compiled HTML link",
      value,
      label,
      ...reviewUrl(value),
    };
  });

  return [...structuredLinks, ...htmlLinks];
}

export function reviewImages(content: StudioStructuredContent, compiledHtml = ""): StudioReviewItem[] {
  const structuredImages: StudioReviewItem[] = content.heroImageUrl.trim()
    ? [
        {
          source: "structured",
          context: "Hero image",
          value: content.heroImageUrl,
          label: content.heroImageAlt,
          status: !content.heroImageUrl.trim() ? "fail" : !content.heroImageAlt.trim() ? "fail" : isPlaceholder(content.heroImageUrl) ? "warn" : "pass",
          explanation: !content.heroImageUrl.trim()
            ? "Image source is empty."
            : !content.heroImageAlt.trim()
              ? "Image alt text is missing."
              : isPlaceholder(content.heroImageUrl)
                ? "Image source looks like a placeholder."
                : "Image reference has source and alt text.",
          suggestedFix: "Add a production image source and descriptive alt text.",
        },
      ]
    : [];

  const htmlImages = Array.from(compiledHtml.matchAll(/<img\b[^>]*>/gi)).map((match) => {
    const tag = match[0] ?? "";
    const src = tag.match(/\bsrc="([^"]*)"/i)?.[1] ?? "";
    const alt = tag.match(/\balt="([^"]*)"/i)?.[1] ?? "";
    const status: StudioCheckStatus = !src.trim() || !alt.trim() ? "fail" : isPlaceholder(src) ? "warn" : "pass";
    return {
      source: "compiled-html" as const,
      context: "Compiled HTML image",
      value: src,
      label: alt,
      status,
      explanation: !src.trim()
        ? "Compiled image source is empty."
        : !alt.trim()
          ? "Compiled image alt text is missing."
          : isPlaceholder(src)
            ? "Compiled image source looks like a placeholder."
            : "Compiled image has source and alt text.",
      suggestedFix: "Review image source and alt text before platform handoff.",
    };
  });

  return [...structuredImages, ...htmlImages];
}

export function inspectPackage(files: StudioPackageFile[], generatedAt = new Date().toISOString()): StudioPackageInspectionItem[] {
  const normalised = files.map((file) => ({
    ...file,
    safePath: file.path.replace(/^template-hedgehog-studio-[^/]+\//, ""),
  }));

  return FIXED_EXPORT_PATHS.map((path) => {
    const file = normalised.find((item) => item.safePath === path);
    const critical = path === "mjml/source.mjml" || path === "html/compiled.html" || path === "metadata.json";
    const included = Boolean(file);
    const empty = included && !file?.content.trim();
    return {
      path,
      included,
      generatedAt,
      status: !included || (critical && empty) ? "fail" : empty ? "warn" : "pass",
      explanation: !included
        ? "File is missing from the export package."
        : empty
          ? "File is included but empty."
          : "File is included and has content.",
    };
  });
}

export function calculateExportReadiness(input: StudioReadinessInput): StudioReadinessScore {
  const blockingIssues: string[] = [];
  const hasWarnings =
    input.contentChecks.some((check) => check.status === "warn") ||
    input.linkReview.some((item) => item.status === "warn") ||
    input.imageReview.some((item) => item.status === "warn") ||
    input.packageInspection.some((item) => item.status === "warn");
  let score = 0;

  if (input.compileStatus === "success") {
    score += 20;
  } else {
    blockingIssues.push("Compile the current MJML before export.");
  }

  if (!input.contentChecks.some((check) => check.status === "fail")) {
    score += 25;
  } else {
    blockingIssues.push("Resolve failed content QA checks.");
  }

  const manualItems = Object.values(input.manualQaState);
  const manualPassRate = manualItems.length
    ? manualItems.filter((item) => item === "pass").length / manualItems.length
    : 0;
  score += Math.round(manualPassRate * 20);
  if (manualPassRate < 1) blockingIssues.push("Finish the QA step before export.");

  if (!input.linkReview.some((item) => item.status === "fail")) {
    score += 12;
  } else {
    blockingIssues.push("Resolve failed link review items.");
  }

  if (!input.imageReview.some((item) => item.status === "fail")) {
    score += 8;
  } else {
    blockingIssues.push("Resolve failed image review items.");
  }

  if (input.selectedPlatform) {
    score += 5;
  } else {
    blockingIssues.push("Choose the manual handoff platform.");
  }

  if (!input.packageInspection.some((item) => item.status === "fail")) {
    score += 10;
  } else {
    blockingIssues.push("Fix missing critical export package files.");
  }

  score = Math.min(100, score);
  const status = blockingIssues.length ? "fail" : hasWarnings || score < 90 ? "warn" : "pass";
  const recommendedNextAction = blockingIssues[0] ?? (hasWarnings ? "Review warnings before export." : "Package is ready for manual handoff.");

  return {
    percentage: score,
    status,
    blockingIssues,
    recommendedNextAction,
  };
}
