import assert from "node:assert/strict";
import test from "node:test";
import { getStudioWorkspaceData } from "@/data/studio";
import { buildStudioExportFiles } from "./exportMetadata";
import {
  DEFAULT_BRAND_TOKENS,
  STUDIO_PACK_MANIFESTS,
  calculateExportReadiness,
  checkStudioEntitlement,
  duplicateStructuredComponent,
  generateMjmlFromStructuredContent,
  getAvailableComponentsForPack,
  inspectPackage,
  insertStructuredComponent,
  migrateWorkflowToStructuredContent,
  removeStructuredComponent,
  reorderStructuredComponent,
  reviewImages,
  reviewLinks,
  runContentQa,
  shouldConfirmMjmlRegeneration,
  shouldConfirmWorkflowSwitch,
  validateBrandTokens,
  type StudioPackageFile,
  type StudioStructuredContent,
} from "./v2";

test("Studio v2 migrates v1 workflow data into structured content", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content = migrateWorkflowToStructuredContent(workflow);

  assert.equal(content.version, "studio-structured-v2");
  assert.equal(content.workflowId, workflow.slug);
  assert.ok(content.preheader);
  assert.ok(content.headline);
  assert.ok(content.ctaUrl);
  assert.ok(content.components.length >= 3);
});

test("Studio v2 generates MJML from structured content and brand tokens", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content = migrateWorkflowToStructuredContent(workflow);
  const mjml = generateMjmlFromStructuredContent(
    {
      ...content,
      headline: "Structured product headline",
      ctaUrl: "https://templatehedgehog.co.uk/studio",
    },
    {
      ...DEFAULT_BRAND_TOKENS,
      primaryColour: "#123456",
    },
  );

  assert.match(mjml, /<mjml>/);
  assert.match(mjml, /Structured product headline/);
  assert.match(mjml, /#123456/);
  assert.match(mjml, /https:\/\/templatehedgehog\.co\.uk\/studio/);
});

test("Studio v2 specialises product launch structure and QA", () => {
  const workflow = getStudioWorkspaceData().workflows.find((item) => item.slug === "campaign-launch");
  assert.ok(workflow);

  const content = migrateWorkflowToStructuredContent(workflow);
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);
  const mjml = generateMjmlFromStructuredContent(content, DEFAULT_BRAND_TOKENS);

  assert.ok(workflow.qaItems.some((item) => item.key === "launch-offer"));
  assert.ok(workflow.qaItems.some((item) => item.key === "launch-suppression"));
  assert.ok(content.components.some((component) => component.componentId === "feature-list"));
  assert.ok(checks.some((item) => item.key === "campaign-launch-positioning-copy" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "campaign-launch-benefit-stack" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "campaign-launch-cta-intent" && item.status === "pass"));
  assert.match(mjml, /Launch message states what is new/);
  assert.match(mjml, /See what's new/);
});

test("Studio v2 specialises onboarding structure and QA", () => {
  const workflow = getStudioWorkspaceData().workflows.find((item) => item.slug === "onboarding");
  assert.ok(workflow);

  const content = migrateWorkflowToStructuredContent(workflow);
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);
  const mjml = generateMjmlFromStructuredContent(content, DEFAULT_BRAND_TOKENS);

  assert.ok(workflow.qaItems.some((item) => item.key === "activation-step"));
  assert.ok(workflow.qaItems.some((item) => item.key === "onboarding-trigger"));
  assert.ok(content.components.some((component) => component.componentId === "feature-list"));
  assert.ok(checks.some((item) => item.key === "onboarding-activation-copy" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "onboarding-step-structure" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "onboarding-cta-specificity" && item.status === "pass"));
  assert.match(mjml, /Confirm the user's current setup state/);
  assert.match(mjml, /Start setup/);
});

test("Studio v2 specialises password reset QA for transactional security review", () => {
  const workflow = getStudioWorkspaceData().workflows.find((item) => item.slug === "password-reset");
  assert.ok(workflow);

  const content = migrateWorkflowToStructuredContent(workflow);
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);

  assert.ok(workflow.qaItems.some((item) => item.key === "token-expiry" && /expiry/i.test(item.label)));
  assert.ok(workflow.qaItems.some((item) => item.key === "transactional-classification"));
  assert.ok(checks.some((item) => item.key === "password-reset-token-expiry-copy" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "password-reset-unexpected-request-copy" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "password-reset-cta-specificity" && item.status === "pass"));
});

test("Studio v2 specialises weekly digest structure with repeatable content items", () => {
  const workflow = getStudioWorkspaceData().workflows.find((item) => item.slug === "reporting");
  assert.ok(workflow);

  const content = migrateWorkflowToStructuredContent(workflow);
  const digestItems = content.components.filter((component) => component.componentId === "digest-item");
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);
  const mjml = generateMjmlFromStructuredContent(content, DEFAULT_BRAND_TOKENS);

  assert.equal(digestItems.length, 3);
  assert.ok(workflow.qaItems.some((item) => item.key === "digest-items"));
  assert.ok(checks.some((item) => item.key === "weekly-digest-multiple-items" && item.status === "pass"));
  assert.ok(checks.some((item) => item.key === "weekly-digest-item-links" && item.status === "pass"));
  assert.match(mjml, /Product update/);
  assert.match(mjml, /Customer story/);
  assert.match(mjml, /Next action/);
});

test("Studio export guides include workflow-specific handoff notes", () => {
  const data = getStudioWorkspaceData();
  const campaignWorkflow = data.workflows.find((item) => item.slug === "campaign-launch");
  const onboardingWorkflow = data.workflows.find((item) => item.slug === "onboarding");
  const passwordWorkflow = data.workflows.find((item) => item.slug === "password-reset");
  const digestWorkflow = data.workflows.find((item) => item.slug === "reporting");
  const mailchimpGuidance = data.platformGuidance.find((item) => item.platform === "Mailchimp");
  const hubspotGuidance = data.platformGuidance.find((item) => item.platform === "HubSpot");
  const customerIoGuidance = data.platformGuidance.find((item) => item.platform === "Customer.io");
  const klaviyoGuidance = data.platformGuidance.find((item) => item.platform === "Klaviyo");
  assert.ok(campaignWorkflow);
  assert.ok(onboardingWorkflow);
  assert.ok(passwordWorkflow);
  assert.ok(digestWorkflow);
  assert.ok(mailchimpGuidance);
  assert.ok(hubspotGuidance);
  assert.ok(customerIoGuidance);
  assert.ok(klaviyoGuidance);

  const campaignContent = migrateWorkflowToStructuredContent(campaignWorkflow);
  const onboardingContent = migrateWorkflowToStructuredContent(onboardingWorkflow);
  const passwordContent = migrateWorkflowToStructuredContent(passwordWorkflow);
  const digestContent = migrateWorkflowToStructuredContent(digestWorkflow);
  const campaignExport = buildStudioExportFiles({
    workflow: campaignWorkflow,
    platform: "Mailchimp",
    guidance: mailchimpGuidance,
    source: generateMjmlFromStructuredContent(campaignContent, DEFAULT_BRAND_TOKENS),
    html: "<html><body>Product launch</body></html>",
    qaState: Object.fromEntries(campaignWorkflow.qaItems.map((item) => [item.key, "pass"])),
    compileState: { status: "success", message: "Compiled" },
    revision: 1,
    structuredContent: campaignContent,
    savedStructuredContent: campaignContent,
  });
  const onboardingExport = buildStudioExportFiles({
    workflow: onboardingWorkflow,
    platform: "HubSpot",
    guidance: hubspotGuidance,
    source: generateMjmlFromStructuredContent(onboardingContent, DEFAULT_BRAND_TOKENS),
    html: "<html><body>Onboarding</body></html>",
    qaState: Object.fromEntries(onboardingWorkflow.qaItems.map((item) => [item.key, "pass"])),
    compileState: { status: "success", message: "Compiled" },
    revision: 1,
    structuredContent: onboardingContent,
    savedStructuredContent: onboardingContent,
  });
  const passwordExport = buildStudioExportFiles({
    workflow: passwordWorkflow,
    platform: "Customer.io",
    guidance: customerIoGuidance,
    source: generateMjmlFromStructuredContent(passwordContent, DEFAULT_BRAND_TOKENS),
    html: "<html><body>Password reset</body></html>",
    qaState: Object.fromEntries(passwordWorkflow.qaItems.map((item) => [item.key, "pass"])),
    compileState: { status: "success", message: "Compiled" },
    revision: 1,
    structuredContent: passwordContent,
    savedStructuredContent: passwordContent,
  });
  const digestExport = buildStudioExportFiles({
    workflow: digestWorkflow,
    platform: "Klaviyo",
    guidance: klaviyoGuidance,
    source: generateMjmlFromStructuredContent(digestContent, DEFAULT_BRAND_TOKENS),
    html: "<html><body>Weekly digest</body></html>",
    qaState: Object.fromEntries(digestWorkflow.qaItems.map((item) => [item.key, "pass"])),
    compileState: { status: "success", message: "Compiled" },
    revision: 1,
    structuredContent: digestContent,
    savedStructuredContent: digestContent,
  });

  const campaignGuide = campaignExport.files.find((file) => file.path.endsWith("/docs/implementation-guide.md"))?.content ?? "";
  const onboardingGuide = onboardingExport.files.find((file) => file.path.endsWith("/docs/implementation-guide.md"))?.content ?? "";
  const passwordGuide = passwordExport.files.find((file) => file.path.endsWith("/docs/implementation-guide.md"))?.content ?? "";
  const digestGuide = digestExport.files.find((file) => file.path.endsWith("/docs/implementation-guide.md"))?.content ?? "";

  assert.match(campaignGuide, /Product launch readiness/);
  assert.match(campaignGuide, /audience targeting, suppression lists/);
  assert.match(onboardingGuide, /Onboarding readiness/);
  assert.match(onboardingGuide, /Trigger logic, suppression rules/);
  assert.match(passwordGuide, /Password reset readiness/);
  assert.match(passwordGuide, /Token generation, token expiry, account verification/);
  assert.match(digestGuide, /Weekly digest content checklist/);
  assert.match(digestGuide, /repeated Digest item sections/);
});

test("Studio v2 validates brand tokens locally", () => {
  const diagnostics = validateBrandTokens({
    ...DEFAULT_BRAND_TOKENS,
    primaryColour: "blue",
    supportEmail: "not-an-email",
  });

  assert.ok(diagnostics.some((item) => item.key === "brand-primaryColour" && item.status === "fail"));
  assert.ok(diagnostics.some((item) => item.key === "brand-support-email" && item.status === "fail"));
});

test("Studio v2 inserts components into the structured model and checks pack entitlement", () => {
  const component = insertStructuredComponent([], "image-block");
  const proComponents = getAvailableComponentsForPack("pro");

  assert.equal(component.componentId, "image-block");
  assert.ok(proComponents.some((item) => item.id === "image-block"));
  assert.equal(checkStudioEntitlement("core", "workflow", "password-reset"), false);
  assert.equal(checkStudioEntitlement("team", "component", "social-links"), true);
  assert.ok(STUDIO_PACK_MANIFESTS.team.exportCapabilities.includes("platform-handoff"));
});

test("Studio v2 content QA catches missing fields, placeholders, and broken component references", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content: StudioStructuredContent = {
    ...migrateWorkflowToStructuredContent(workflow),
    preheader: "",
    headline: "TODO",
    ctaUrl: "not-a-url",
    heroImageUrl: "https://example.com/placeholder.png",
    heroImageAlt: "",
    components: [
      {
        instanceId: "bad-1",
        componentId: "hero",
        fields: { headline: "", bodyCopy: "" },
      },
    ],
  };
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);

  assert.ok(checks.some((item) => item.key === "required-preheader" && item.status === "fail"));
  assert.ok(checks.some((item) => item.key === "cta-url-format" && item.status === "fail"));
  assert.ok(checks.some((item) => item.key === "image-alt" && item.status === "fail"));
  assert.ok(checks.some((item) => item.key === "placeholder-text" && item.status === "warn"));
  assert.ok(checks.some((item) => item.key.includes("required-fields") && item.status === "fail"));
});

test("Studio v2 link and image review use local inspection only", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content = {
    ...migrateWorkflowToStructuredContent(workflow),
    ctaUrl: "#",
    supportEmail: "support@templatehedgehog.co.uk",
    socialLinks: [{ label: "Bad", url: "javascript:alert(1)" }],
    heroImageUrl: "https://example.com/placeholder.png",
    heroImageAlt: "",
  };
  const links = reviewLinks(content, '<a href="mailto:broken">Email</a>');
  const images = reviewImages(content, '<img src="https://example.com/x.png" alt="">');

  assert.ok(links.some((item) => item.value === "#" && item.status === "warn"));
  assert.ok(links.some((item) => item.value.startsWith("javascript:") && item.status === "fail"));
  assert.ok(links.some((item) => item.value === "mailto:broken" && item.status === "fail"));
  assert.ok(images.some((item) => item.context === "Hero image" && item.status === "fail"));
  assert.ok(images.some((item) => item.source === "compiled-html" && item.status === "fail"));
});

test("Studio v2 package inspector and readiness score report blockers", () => {
  const files: StudioPackageFile[] = [
    { path: "template-hedgehog-studio-test/mjml/source.mjml", content: "<mjml />" },
    { path: "template-hedgehog-studio-test/html/compiled.html", content: "<html></html>" },
    { path: "template-hedgehog-studio-test/metadata.json", content: "{}" },
  ];
  const inspection = inspectPackage(files, "2026-06-03T00:00:00.000Z");
  const readiness = calculateExportReadiness({
    compileStatus: "error",
    manualQaState: { compiled: "fail" },
    contentChecks: [{ key: "headline", label: "Headline", status: "fail", explanation: "Missing", suggestedFix: "Add it" }],
    linkReview: [],
    imageReview: [],
    packageInspection: inspection,
    selectedPlatform: undefined,
  });

  assert.ok(inspection.some((item) => item.path === "docs/qa-notes.md" && item.status === "fail"));
  assert.equal(readiness.status, "fail");
  assert.ok(readiness.blockingIssues.length >= 3);
});

test("Studio v2 source guards require confirmation for risky local state changes", () => {
  assert.equal(shouldConfirmMjmlRegeneration("manual", true), true);
  assert.equal(shouldConfirmMjmlRegeneration("generated", true), false);
  assert.equal(shouldConfirmMjmlRegeneration("manual", false), false);
  assert.equal(shouldConfirmWorkflowSwitch(false, true), true);
  assert.equal(shouldConfirmWorkflowSwitch(true, false), true);
  assert.equal(shouldConfirmWorkflowSwitch(false, false), false);
});

test("Studio v2 component actions duplicate, reorder, and protect the last required section", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content = migrateWorkflowToStructuredContent(workflow);
  const firstComponent = content.components[0];
  const duplicated = duplicateStructuredComponent(content.components, firstComponent.instanceId);

  assert.equal(duplicated.changed, true);
  assert.equal(duplicated.components.length, content.components.length + 1);
  assert.notEqual(duplicated.components[1].instanceId, firstComponent.instanceId);

  const reordered = reorderStructuredComponent(duplicated.components, duplicated.components[1].instanceId, "down");
  assert.equal(reordered.changed, true);
  assert.equal(reordered.components[2].componentId, firstComponent.componentId);

  const removalBlocked = removeStructuredComponent(content.components, firstComponent.instanceId);
  assert.equal(removalBlocked.changed, false);
  assert.equal(removalBlocked.status, "fail");

  const removalAllowed = removeStructuredComponent(duplicated.components, duplicated.components[1].instanceId);
  assert.equal(removalAllowed.changed, true);
});

test("Studio v2 content QA catches invalid URLs, invalid email, and long unbroken copy", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const content = {
    ...migrateWorkflowToStructuredContent(workflow),
    headline: "x".repeat(500),
    ctaLabel: "Open ".repeat(50),
    ctaUrl: "banana",
    supportEmail: "mailto:support@templatehedgehog.co.uk",
    bodyCopy: "A".repeat(80),
  };
  const checks = runContentQa(content, DEFAULT_BRAND_TOKENS);
  const links = reviewLinks(content, "");

  assert.ok(checks.some((item) => item.key === "headline-length" && item.status === "warn"));
  assert.ok(checks.some((item) => item.key === "cta-label-length" && item.status === "warn"));
  assert.ok(checks.some((item) => item.key === "cta-url-format" && item.status === "fail"));
  assert.ok(checks.some((item) => item.key === "support-email-format" && item.status === "fail"));
  assert.ok(checks.some((item) => item.key === "long-unbroken-word" && item.status === "warn"));
  assert.ok(links.some((item) => item.context === "Primary CTA" && item.status === "fail"));
});

test("Studio v2 generated MJML safely escapes HTML, script tags, and special characters", () => {
  const workflow = getStudioWorkspaceData().workflows[0];
  const mjml = generateMjmlFromStructuredContent(
    {
      ...migrateWorkflowToStructuredContent(workflow),
      headline: '<script>alert("x")</script> & launch',
      bodyCopy: "5 > 3 & 2 < 4",
    },
    DEFAULT_BRAND_TOKENS,
  );

  assert.match(mjml, /&lt;script&gt;alert\("x"\)&lt;\/script&gt; &amp; launch/);
  assert.match(mjml, /5 &gt; 3 &amp; 2 &lt; 4/);
  assert.doesNotMatch(mjml, /<script>alert/);
});

test("Studio v2 readiness blocks export for failed QA and critical package failures", () => {
  const readiness = calculateExportReadiness({
    compileStatus: "success",
    manualQaState: { compiled: "pass", "handoff-ready": "fail" },
    contentChecks: [],
    linkReview: [{ source: "structured", context: "Primary CTA", value: "banana", status: "fail", explanation: "Bad", suggestedFix: "Fix it" }],
    imageReview: [],
    packageInspection: [{ path: "html/compiled.html", included: true, generatedAt: "", status: "pass", explanation: "Included" }],
    selectedPlatform: "Mailchimp",
  });

  assert.equal(readiness.status, "fail");
  assert.ok(readiness.blockingIssues.includes("Finish the QA step before export."));
  assert.ok(readiness.blockingIssues.includes("Resolve failed link review items."));
});
