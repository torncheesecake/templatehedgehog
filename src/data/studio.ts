import { emailComponents, getEmailComponentBySlug } from "@/data/email-components";
import { getEmailExampleBySlug } from "@/data/email-examples";
import { compiledExamplesBySlug } from "@/data/email-examples/compiled";
import { emailLayouts, getEmailLayoutBySlug } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";

export type StudioStepStatus = "ready" | "needs review" | "passed" | "exported";
export type StudioQaGroup = "Compile" | "Content" | "Responsive" | "Accessibility basics" | "Platform boundary" | "Handoff";
export type StudioQaState = "unchecked" | "pass" | "fail";

export type StudioWorkflowStep = {
  label: string;
  status: StudioStepStatus;
};

export type StudioPlatform =
  | "Mailchimp"
  | "HubSpot"
  | "Salesforce"
  | "NetSuite"
  | "Klaviyo"
  | "Customer.io"
  | "Other";

export type StudioPlatformGuidance = {
  platform: StudioPlatform;
  summary: string;
  guidance: string;
  whatToUpload: string;
  whatToPaste: string;
  platformHandles: string;
  studioHandles: string;
  recommendedFile: string;
  caveats: string;
  manualSteps: string[];
  handoffType: "Manual handoff";
};

export type StudioWorkflowWorkspace = {
  slug: string;
  libraryLabel: string;
  category: "Campaign" | "Lifecycle" | "Transactional" | "Newsletter";
  recommendedPlatforms: StudioPlatform[];
  workflow: {
    name: string;
    summary: string;
    trigger: string;
    goal: string;
    fields: Array<{
      field: string;
      description: string;
      example: string;
    }>;
    risks: string[];
  };
  steps: StudioWorkflowStep[];
  source: {
    mode: "MJML Source";
    filename: string;
    body: string;
    metadata: Array<{
      label: string;
      value: string;
    }>;
  };
  compiled: {
    mode: "Compiled HTML";
    filename: string;
    body: string;
    snippet: string;
  };
  archive: {
    layoutTitle: string;
    sourceFile: string;
    compiledFile: string;
    componentTitles: string[];
  };
  qaItems: Array<{
    key: string;
    group: StudioQaGroup;
    label: string;
    defaultState: StudioQaState;
  }>;
  quickEdits: Array<{
    key: string;
    label: string;
    value: string;
    replacements: string[];
  }>;
};

export type StudioWorkspaceData = {
  initialWorkflowSlug: string;
  workflows: StudioWorkflowWorkspace[];
  library: {
    layouts: string[];
    components: string[];
  };
  handoffArtefacts: string[];
  platformGuidance: StudioPlatformGuidance[];
};

const studioWorkflowDefinitions = [
  {
    slug: "campaign-launch",
    label: "Product launch workflow",
    name: "Product launch email",
    category: "Campaign",
    recommendedPlatforms: ["Mailchimp", "HubSpot", "Salesforce", "Klaviyo", "Customer.io"],
  },
  {
    slug: "onboarding",
    label: "Onboarding workflow",
    name: "Onboarding email",
    category: "Lifecycle",
    recommendedPlatforms: ["HubSpot", "Salesforce", "Klaviyo", "Customer.io"],
  },
  {
    slug: "password-reset",
    label: "Password reset workflow",
    name: "Password reset email",
    category: "Transactional",
    recommendedPlatforms: ["Customer.io", "Salesforce", "HubSpot"],
  },
  {
    slug: "reporting",
    label: "Weekly digest workflow",
    name: "Weekly digest email",
    category: "Newsletter",
    recommendedPlatforms: ["Mailchimp", "HubSpot", "Klaviyo", "Customer.io"],
  },
] as const;

function createSnippet(html: string): string {
  return html.replace(/\s+/g, " ").trim().slice(0, 1150);
}

function createStudioWorkflowWorkspace(
  definition: (typeof studioWorkflowDefinitions)[number],
): StudioWorkflowWorkspace {
  const workflow = emailWorkflows.find((item) => item.slug === definition.slug);

  if (!workflow) {
    throw new Error(`[studio] Required workflow "${definition.slug}" is missing.`);
  }

  const example = getEmailExampleBySlug(workflow.legacyExampleSlug);

  if (!example) {
    throw new Error(
      `[studio] Required example "${workflow.legacyExampleSlug}" for workflow "${definition.slug}" is missing.`,
    );
  }

  const compiledHtml = compiledExamplesBySlug[example.slug];

  if (!compiledHtml) {
    throw new Error(`[studio] Required compiled HTML for example "${example.slug}" is missing.`);
  }

  const layout = getEmailLayoutBySlug(example.layoutSlug);
  const componentTitles = example.componentSlugs.map((slug) => {
    const component = getEmailComponentBySlug(slug);
    return component?.title ?? slug;
  });
  const workflowSpecificQaItems: StudioWorkflowWorkspace["qaItems"] =
    definition.slug === "campaign-launch"
      ? [
          { key: "launch-offer", group: "Content", label: "Launch offer and positioning reviewed", defaultState: "unchecked" },
          { key: "launch-audience", group: "Content", label: "Target audience or segment reviewed", defaultState: "unchecked" },
          { key: "launch-proof", group: "Content", label: "Feature proof or benefit stack reviewed", defaultState: "unchecked" },
          { key: "launch-timing", group: "Handoff", label: "Launch date, availability, or campaign window confirmed", defaultState: "unchecked" },
          { key: "launch-destination", group: "Handoff", label: "CTA destination supports the launch conversion path", defaultState: "unchecked" },
          { key: "launch-suppression", group: "Platform boundary", label: "Campaign audience, exclusions, and suppressions handled in platform", defaultState: "unchecked" },
        ]
      : definition.slug === "onboarding"
        ? [
            { key: "activation-step", group: "Content", label: "First activation step reviewed", defaultState: "unchecked" },
            { key: "onboarding-user-state", group: "Content", label: "Recipient state and product context reviewed", defaultState: "unchecked" },
            { key: "onboarding-support-path", group: "Content", label: "Support path or help route reviewed", defaultState: "unchecked" },
            { key: "onboarding-sequence-context", group: "Handoff", label: "Place in onboarding sequence confirmed", defaultState: "unchecked" },
            { key: "onboarding-trigger", group: "Platform boundary", label: "Lifecycle trigger and suppression logic handled in platform", defaultState: "unchecked" },
            { key: "onboarding-test-profile", group: "Handoff", label: "Test profile planned before workflow activation", defaultState: "unchecked" },
          ]
        : definition.slug === "password-reset"
      ? [
          { key: "security-copy", group: "Content", label: "Security-specific reset wording reviewed", defaultState: "unchecked" },
          { key: "token-expiry", group: "Content", label: "Reset token expiry reviewed", defaultState: "unchecked" },
          { key: "account-access-wording", group: "Content", label: "Unexpected account access wording reviewed", defaultState: "unchecked" },
          { key: "transactional-classification", group: "Platform boundary", label: "Transactional message type confirmed in platform", defaultState: "unchecked" },
          { key: "reset-token-mapping", group: "Platform boundary", label: "One-time reset token/link mapped in platform", defaultState: "unchecked" },
          { key: "transactional-test", group: "Handoff", label: "Transactional test event planned before live use", defaultState: "unchecked" },
        ]
      : definition.slug === "reporting"
        ? [
            { key: "digest-items", group: "Content", label: "Multiple digest items reviewed", defaultState: "unchecked" },
            { key: "digest-item-links", group: "Content", label: "Every digest item link reviewed", defaultState: "unchecked" },
            { key: "newsletter-preheader", group: "Content", label: "Newsletter subject and preheader reviewed", defaultState: "unchecked" },
            { key: "digest-scan", group: "Responsive", label: "Digest item stack checked on mobile", defaultState: "unchecked" },
            { key: "newsletter-subscription-boundary", group: "Platform boundary", label: "Subscription and unsubscribe handled by platform", defaultState: "unchecked" },
            { key: "digest-export-guidance", group: "Handoff", label: "Digest export guidance reviewed", defaultState: "unchecked" },
          ]
        : [];

  return {
    slug: definition.slug,
    libraryLabel: definition.label,
    category: definition.category,
    recommendedPlatforms: [...definition.recommendedPlatforms],
    workflow: {
      name: definition.name,
      summary: workflow.summary,
      trigger: workflow.trigger,
      goal: workflow.goal,
      fields: workflow.requiredFields.slice(0, 3),
      risks: workflow.qaRisks.slice(0, 3),
    },
    steps: [
      { label: "Author", status: "ready" },
      { label: "Review", status: "needs review" },
      { label: "Compile", status: "passed" },
      { label: "QA", status: "passed" },
      { label: "Handoff", status: "exported" },
    ],
    source: {
      mode: "MJML Source",
      filename: example.sourceFile,
      body: example.mjmlSource,
      metadata: [
        { label: "Workflow", value: definition.name },
        { label: "Layout", value: example.layoutSlug },
        { label: "System", value: example.system },
        { label: "Blocks", value: `${example.componentSlugs.length} components` },
      ],
    },
    compiled: {
      mode: "Compiled HTML",
      filename: `${example.slug}.html`,
      body: compiledHtml,
      snippet: createSnippet(compiledHtml),
    },
    archive: {
      layoutTitle: layout?.title ?? example.layoutSlug,
      sourceFile: example.sourceFile,
      compiledFile: `${example.slug}.html`,
      componentTitles,
    },
    qaItems: [
      { key: "compiled", group: "Compile", label: "MJML compiled successfully", defaultState: "pass" },
      { key: "html-generated", group: "Compile", label: "HTML generated", defaultState: "pass" },
      { key: "no-compile-errors", group: "Compile", label: "No compile errors", defaultState: "pass" },
      { key: "preview-generated", group: "Compile", label: "Preview generated", defaultState: "pass" },
      { key: "cta-hrefs", group: "Content", label: "CTA hrefs reviewed", defaultState: "unchecked" },
      { key: "preview-text", group: "Content", label: "Preview text reviewed", defaultState: "unchecked" },
      { key: "footer-legal", group: "Content", label: "Footer/legal line reviewed", defaultState: "unchecked" },
      ...workflowSpecificQaItems,
      { key: "alt-text", group: "Accessibility basics", label: "Images alt text reviewed", defaultState: "pass" },
      { key: "mobile-preview", group: "Responsive", label: "Mobile width preview checked", defaultState: "unchecked" },
      { key: "desktop-preview", group: "Responsive", label: "Desktop preview checked", defaultState: "unchecked" },
      { key: "unsubscribe-platform", group: "Platform boundary", label: "Unsubscribe handled by sending platform", defaultState: "unchecked" },
      { key: "gdpr-platform", group: "Platform boundary", label: "Consent/GDPR handled by sending platform", defaultState: "unchecked" },
      { key: "audience-platform", group: "Platform boundary", label: "Audience/segmentation handled by sending platform", defaultState: "unchecked" },
      { key: "implementation-guide", group: "Handoff", label: "Implementation guide included", defaultState: "unchecked" },
      { key: "platform-selected", group: "Handoff", label: "Platform target selected", defaultState: "pass" },
      { key: "handoff-ready", group: "Handoff", label: "Export package prepared", defaultState: "unchecked" },
    ],
    quickEdits: [
      {
        key: "previewText",
        label: "Preview text",
        value:
          definition.slug === "campaign-launch"
            ? "New product launch: key benefits, proof, and next action inside."
            : definition.slug === "onboarding"
              ? "Start with the first useful setup step and know where to get help."
              : definition.slug === "password-reset"
                ? "Secure password reset link. Expires soon."
                : "Your weekly product and lifecycle email digest.",
        replacements: ["TemplateHedgehog reusable email block"],
      },
      {
        key: "headline",
        label: "Headline",
        value:
          definition.slug === "campaign-launch"
            ? "Launch your next product with clear campaign momentum"
            : definition.slug === "onboarding"
              ? "Welcome to the product"
              : definition.slug === "password-reset"
                ? "Reset your password"
                : "This week at a glance",
        replacements:
          definition.slug === "campaign-launch"
            ? ['Launch your next product with <span style="color: #2f67ef;">clear campaign momentum</span>']
            : definition.slug === "onboarding"
              ? ["Welcome to the product"]
              : definition.slug === "password-reset"
                ? ["Reset your password"]
                : ["This week at a glance"],
      },
      {
        key: "ctaLabel",
        label: "CTA label",
        value:
          definition.slug === "campaign-launch"
            ? "See what's new"
            : definition.slug === "onboarding"
              ? "Start setup"
              : definition.slug === "password-reset"
                ? "Reset password"
                : "Read full digest",
        replacements: ["TemplateHedgehog"],
      },
      {
        key: "ctaUrl",
        label: "CTA URL",
        value: "https://templatehedgehog.co.uk",
        replacements: ["https://templatehedgehog.co.uk"],
      },
      {
        key: "brandName",
        label: "Brand name",
        value: "TemplateHedgehog",
        replacements: ["TemplateHedgehog"],
      },
      {
        key: "supportEmail",
        label: "Support email",
        value: "support@templatehedgehog.co.uk",
        replacements: ["support@templatehedgehog.co.uk", "hello@templatehedgehog.co.uk"],
      },
      {
        key: "footerLegal",
        label: "Footer legal line",
        value:
          definition.slug === "campaign-launch"
            ? "You are receiving this product launch update because you opted in. Audiences, suppressions, and unsubscribe handling stay in the sending platform."
            : definition.slug === "onboarding"
              ? "You are receiving this onboarding email because you created an account or started setup. Lifecycle triggers and suppressions stay in the sending platform."
              : definition.slug === "password-reset"
                ? "This password reset link should expire according to your platform policy. If you did not request this, contact support."
                : "You are receiving this weekly digest because you subscribed. Manage preferences in the sending platform.",
        replacements: ["Replace app availability and platform eligibility copy with your own production policy."],
      },
    ],
  };
}

export function getStudioWorkspaceData(): StudioWorkspaceData {
  return {
    initialWorkflowSlug: "campaign-launch",
    workflows: studioWorkflowDefinitions.map(createStudioWorkflowWorkspace),
    library: {
      layouts: emailLayouts.slice(0, 6).map((layout) => layout.title),
      components: emailComponents.slice(0, 8).map((component) => component.title),
    },
    handoffArtefacts: [
      "MJML source",
      "compiled HTML",
      "QA notes",
      "implementation guide",
      "preview reference",
      "platform notes",
    ],
    platformGuidance: [
      {
        platform: "Mailchimp",
        summary: "Best for custom-coded campaign templates that are handed off to Mailchimp lists and campaigns.",
        guidance:
          "Paste compiled HTML into a custom-coded template. Mailchimp handles audience, unsubscribe, and delivery.",
        whatToUpload: "Use the compiled HTML file as a custom-coded template.",
        whatToPaste: "Paste the compiled HTML into Mailchimp's custom code editor.",
        platformHandles: "audiences, unsubscribe, consent, delivery, and reporting.",
        studioHandles: "MJML source, compiled HTML, QA notes, preview, and handoff notes.",
        recommendedFile: "/html/compiled.html",
        caveats: "Mailchimp merge tags and unsubscribe tags must be reviewed inside Mailchimp before send.",
        manualSteps: [
          "Create or open a custom-coded email template in Mailchimp.",
          "Paste `/html/compiled.html` into the custom code editor.",
          "Map merge tags, unsubscribe tags, and audience fields inside Mailchimp.",
          "Send tests from Mailchimp before scheduling or sending.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "HubSpot",
        summary: "Best for HubSpot marketing emails where final modules, tokens, subscriptions, and automation stay in HubSpot.",
        guidance:
          "Use compiled HTML or adapt the MJML source according to HubSpot template requirements. HubSpot handles sending, automation, and compliance workflows.",
        whatToUpload: "Upload or recreate the compiled HTML in HubSpot's design/template tools.",
        whatToPaste: "Paste compiled HTML where HubSpot allows custom email markup.",
        platformHandles: "contacts, subscription types, automation, consent, delivery, and reporting.",
        studioHandles: "source structure, compile output, QA notes, and platform handoff context.",
        recommendedFile: "/html/compiled.html",
        caveats: "HubSpot module rules and personalisation tokens should be mapped in HubSpot after import.",
        manualSteps: [
          "Create or open the relevant email/template in HubSpot.",
          "Use `/html/compiled.html` as the custom markup reference where HubSpot allows it.",
          "Map HubSpot personalisation tokens, subscription type, and legal footer in HubSpot.",
          "Use HubSpot preview and test-send tools before activating automation.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "Salesforce",
        summary: "Best for Salesforce Marketing Cloud handoff where journeys, data extensions, and AMPscript stay in Salesforce.",
        guidance:
          "Use compiled HTML or adapt the MJML source according to Salesforce Marketing Cloud requirements. Salesforce handles sending, automation, and compliance workflows.",
        whatToUpload: "Use the compiled HTML as the email template body or content block source.",
        whatToPaste: "Paste compiled HTML into the Salesforce Marketing Cloud email/content editor.",
        platformHandles: "data extensions, journeys, subscribers, compliance workflows, delivery, and reporting.",
        studioHandles: "MJML source, production HTML, QA checklist, preview, and handoff notes.",
        recommendedFile: "/html/compiled.html",
        caveats: "AMPscript, data extension fields, and preference centre links must be added in Salesforce.",
        manualSteps: [
          "Create the email asset or content block in Salesforce Marketing Cloud.",
          "Paste `/html/compiled.html` into the appropriate HTML editor.",
          "Map AMPscript, data extension fields, sender profile, and preference links in Salesforce.",
          "Run Salesforce preview, validation, and test sends before journey activation.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "NetSuite",
        summary: "Best for NetSuite campaign/template preparation where records, recipient logic, and fields stay in NetSuite.",
        guidance:
          "Use compiled HTML in NetSuite campaign/template workflows. NetSuite handles recipients, campaign records, and delivery logic.",
        whatToUpload: "Keep the compiled HTML and implementation guide with the NetSuite campaign/template record.",
        whatToPaste: "Paste compiled HTML into NetSuite's email template or campaign editor.",
        platformHandles: "recipients, campaign records, permissions, delivery logic, and reporting.",
        studioHandles: "workflow structure, source, compiled HTML, QA notes, and preview reference.",
        recommendedFile: "/docs/implementation-guide.md",
        caveats: "NetSuite field IDs, records, and recipient logic are configured in NetSuite, not Studio.",
        manualSteps: [
          "Create or open the NetSuite email template or campaign record.",
          "Use `/docs/implementation-guide.md` to map the handoff details.",
          "Paste `/html/compiled.html` where NetSuite accepts template HTML.",
          "Map NetSuite fields, records, recipient criteria, and sending controls in NetSuite.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "Klaviyo",
        summary: "Best for Klaviyo template handoff where profiles, flows, feeds, and consent stay in Klaviyo.",
        guidance:
          "Use compiled HTML or adapt the MJML source according to Klaviyo requirements. Klaviyo handles sending, automation, and compliance workflows.",
        whatToUpload: "Use the compiled HTML as the source for a custom email template.",
        whatToPaste: "Paste compiled HTML into Klaviyo's template editor where custom HTML is supported.",
        platformHandles: "profiles, lists, consent, flows, segmentation, delivery, and reporting.",
        studioHandles: "editable MJML, compiled HTML, QA notes, preview, and implementation guidance.",
        recommendedFile: "/html/compiled.html",
        caveats: "Klaviyo variables, product feeds, and unsubscribe tags must be reviewed in Klaviyo.",
        manualSteps: [
          "Create or open a Klaviyo custom HTML template.",
          "Paste `/html/compiled.html` into the custom HTML editor.",
          "Map Klaviyo variables, unsubscribe tags, and product/feed content in Klaviyo.",
          "Use Klaviyo preview and test-send tools before flow or campaign use.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "Customer.io",
        summary: "Best for Customer.io campaigns or transactional messages where people, events, and journeys stay in Customer.io.",
        guidance:
          "Use compiled HTML or adapt the MJML source according to Customer.io requirements. Customer.io handles sending, automation, and compliance workflows.",
        whatToUpload: "Use the compiled HTML as the message body source for the campaign or transactional message.",
        whatToPaste: "Paste compiled HTML into Customer.io's code editor and map variables there.",
        platformHandles: "people, segments, journeys, transactional triggers, delivery, and reporting.",
        studioHandles: "source editing, compile, QA, preview, and handoff package generation.",
        recommendedFile: "/html/compiled.html",
        caveats: "Liquid variables, transactional event data, and unsubscribe handling must be mapped in Customer.io.",
        manualSteps: [
          "Create or open the Customer.io message.",
          "Paste `/html/compiled.html` into the code editor.",
          "Map Liquid variables, event data, message type, and unsubscribe handling in Customer.io.",
          "Preview and send tests from Customer.io before enabling the campaign or transaction.",
        ],
        handoffType: "Manual handoff",
      },
      {
        platform: "Other",
        summary: "Best for a generic manual handoff into any sending platform that supports custom email HTML.",
        guidance:
          "Use the MJML source, compiled HTML, QA notes, and implementation guide as a manual handoff pack for your chosen sending platform.",
        whatToUpload: "Use the export package files according to your platform's custom template workflow.",
        whatToPaste: "Paste compiled HTML into the platform's custom HTML or template editor.",
        platformHandles: "audience data, consent, unsubscribe, automation, delivery, and reporting.",
        studioHandles: "everything before send: source, compile, QA, preview, and handoff.",
        recommendedFile: "/docs/platform-handoff.md",
        caveats: "Review the platform's required unsubscribe, consent, token, and image hosting rules before send.",
        manualSteps: [
          "Read `/docs/readme.md` and `/docs/platform-handoff.md` first.",
          "Use `/html/compiled.html` where your platform accepts custom HTML.",
          "Map platform-specific tokens, consent, unsubscribe, and sending controls in that platform.",
          "Use the platform's preview and test-send tools before any real send.",
        ],
        handoffType: "Manual handoff",
      },
    ],
  };
}
