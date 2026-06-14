import type {
  StudioPlatform,
  StudioQaGroup,
  StudioQaState,
  StudioWorkflowWorkspace,
  StudioWorkspaceData,
} from "@/data/studio";
import {
  DEFAULT_BRAND_TOKENS,
  STUDIO_COMPONENT_MANIFESTS,
  STUDIO_V2_VERSION,
  buildInitialStructuredContent,
  type StudioBrandTokens,
  type StudioReadinessScore,
  type StudioSourceOrigin,
  type StudioStructuredContent,
} from "@/lib/studio/v2";

type StudioExportCompileState = {
  status: "ready" | "compiling" | "success" | "error";
  message: string;
  lastCompiledAt?: string;
  lastFailedAt?: string;
  durationMs?: number;
  sourceSnapshot?: string;
};

const QA_GROUPS: StudioQaGroup[] = ["Compile", "Content", "Responsive", "Accessibility basics", "Platform boundary", "Handoff"];

const sourceOriginLabel: Record<StudioSourceOrigin, string> = {
  library: "Library source",
  generated: "Generated MJML",
  manual: "Manual MJML",
};

function sanitiseFileName(value: string, fallback: string) {
  const safe = value
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 96);

  return safe || fallback;
}

function sanitiseFolderName(value: string) {
  return sanitiseFileName(value, "studio-export").replace(/\.[^.]+$/, "");
}

function calculateQaProgress(workflow: StudioWorkflowWorkspace, qaState: Record<string, StudioQaState>) {
  const total = workflow.qaItems.length;
  const passed = workflow.qaItems.filter((item) => qaState[item.key] === "pass").length;
  const completion = total > 0 ? Math.round((passed / total) * 100) : 0;

  return { total, passed, completion };
}

function createStudioHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function buildQaNotes(workflow: StudioWorkflowWorkspace, qaState: Record<string, StudioQaState>) {
  const lines = [`# QA notes: ${workflow.workflow.name}`, ""];

  for (const group of QA_GROUPS) {
    const items = workflow.qaItems.filter((item) => item.group === group);
    if (!items.length) continue;

    lines.push(`## ${group}`);
    for (const item of items) {
      const state = qaState[item.key] ?? "unchecked";
      const marker = state === "pass" ? "x" : state === "fail" ? "!" : " ";
      lines.push(`- [${marker}] ${item.label} (${state})`);
    }
    lines.push("");
  }

  lines.push("Boundary notes:");
  lines.push("- Studio checks production readiness before send.");
  lines.push("- The sending platform handles audiences, consent, unsubscribe, GDPR workflows, automation, delivery, and reporting.");

  return lines.join("\n");
}

function buildPlatformHandoff(platform: StudioPlatform, guidance: StudioWorkspaceData["platformGuidance"][number]) {
  return [
    `# Platform handoff: ${platform}`,
    "",
    guidance.summary,
    "",
    `Handoff type: ${guidance.handoffType}`,
    "",
    "## What Studio gives you",
    guidance.studioHandles,
    "",
    "## What the platform handles",
    guidance.platformHandles,
    "",
    "## Recommended handoff file",
    guidance.recommendedFile,
    "",
    "## Manual handoff steps",
    ...guidance.manualSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "## Known caveats",
    guidance.caveats,
    "",
    "Studio prepares the email system. The sending platform sends, automates, manages consent and unsubscribes, and reports.",
  ].join("\n");
}

function buildWorkflowSpecificImplementationSections(workflow: StudioWorkflowWorkspace) {
  if (workflow.slug === "campaign-launch") {
    return [
      "",
      "## Product launch readiness",
      "",
      "- Confirm the email names the launched product, release, or offer clearly.",
      "- Confirm the audience segment, exclusions, and suppression rules inside the sending platform.",
      "- Review the benefit stack so every feature point connects to a customer outcome.",
      "- Confirm the CTA lands on a launch page, demo booking page, product detail page, or other conversion path.",
      "- Confirm the campaign window, launch date, and any availability claims before send.",
      "- Send platform tests to product, marketing, and implementation reviewers before scheduling.",
      "",
      "## Campaign boundary",
      "",
      "Studio prepares the launch message, MJML, HTML, QA notes and handoff guidance. Campaign scheduling, audience targeting, suppression lists, unsubscribe handling, A/B testing and reporting stay in the sending platform.",
    ];
  }

  if (workflow.slug === "onboarding") {
    return [
      "",
      "## Onboarding readiness",
      "",
      "- Confirm the recipient state that triggers this email, such as new account, incomplete setup, or first activation moment.",
      "- Keep the email focused on one activation step rather than a full product tour.",
      "- Confirm the CTA opens the correct setup, dashboard, checklist, or activation destination.",
      "- Confirm support copy routes users to the right help channel if setup stalls.",
      "- Confirm where this email sits in the wider onboarding sequence.",
      "- Test with a platform profile that matches the intended lifecycle state before activation.",
      "",
      "## Lifecycle boundary",
      "",
      "Studio prepares the onboarding email artefacts. Trigger logic, suppression rules, product events, lifecycle timing, journeys and reporting stay in the sending platform.",
    ];
  }

  if (workflow.slug === "password-reset") {
    return [
      "",
      "## Password reset readiness",
      "",
      "- Confirm the sending platform classifies this as transactional or service email, not a marketing campaign.",
      "- Map the one-time reset token or reset URL inside the sending platform.",
      "- Confirm the reset token expiry policy and add matching copy to the email.",
      "- Confirm the reset link is scoped to the requesting account and cannot be reused.",
      "- Include wording for recipients who did not request account access.",
      "- Send a platform test event before live use, using a non-production recipient.",
      "",
      "## Security boundary",
      "",
      "Studio prepares MJML, HTML, QA notes and handoff guidance only. Token generation, token expiry, account verification, abuse controls, rate limits and delivery are owned by the application and sending platform.",
    ];
  }

  if (workflow.slug === "reporting") {
    return [
      "",
      "## Weekly digest content checklist",
      "",
      "- Review every digest item title, summary and URL.",
      "- Confirm the digest order matches editorial priority.",
      "- Confirm the preheader explains that this is a weekly round-up.",
      "- Check the mobile preview for long item titles and repeated links.",
      "- Keep subscription, preference and unsubscribe handling inside the sending platform.",
      "",
      "## Digest export guidance",
      "",
      "Use `/mjml/source.mjml` as the editable source of truth and `/html/compiled.html` as the manual paste/upload artefact. The repeated Digest item sections are local Studio structure; if the sending platform uses feeds or dynamic blocks, map those fields there after paste/upload.",
    ];
  }

  return [];
}

function buildImplementationGuide(workflow: StudioWorkflowWorkspace, platform: StudioPlatform, guidance: StudioWorkspaceData["platformGuidance"][number]) {
  return [
    `# Implementation guide: ${workflow.workflow.name}`,
    "",
    `Target platform: ${platform}`,
    "",
    "## What to upload",
    guidance.whatToUpload,
    "",
    "## What to paste",
    guidance.whatToPaste,
    "",
    "## What Studio handles",
    guidance.studioHandles,
    "",
    "## What the platform handles",
    guidance.platformHandles,
    "",
    "## Handoff type",
    guidance.handoffType,
    "",
    "## Caveats",
    guidance.caveats,
    ...buildWorkflowSpecificImplementationSections(workflow),
  ].join("\n");
}

function buildWorkflowNotes(workflow: StudioWorkflowWorkspace) {
  return [
    `# Workflow notes: ${workflow.workflow.name}`,
    "",
    `Use case: ${workflow.workflow.summary}`,
    `Trigger: ${workflow.workflow.trigger}`,
    `Goal: ${workflow.workflow.goal}`,
    "",
    "## Included archive",
    `Layout: ${workflow.archive.layoutTitle}`,
    `Source file: ${workflow.archive.sourceFile}`,
    `Compiled file: ${workflow.archive.compiledFile}`,
    `Components: ${workflow.archive.componentTitles.join(", ")}`,
    "",
    "## Workflow-specific QA focus",
    ...workflow.qaItems
      .filter((item) => !["compiled", "html-generated", "no-compile-errors", "preview-generated", "platform-selected"].includes(item.key))
      .map((item) => `- ${item.label}`),
  ].join("\n");
}

function changedStructuredFields(structuredContent: StudioStructuredContent, savedStructuredContent: StudioStructuredContent) {
  return Object.keys(structuredContent).filter((key) => {
    if (key === "components" || key === "socialLinks" || key === "version" || key === "workflowId") return false;
    const field = key as keyof StudioStructuredContent;
    return JSON.stringify(structuredContent[field]) !== JSON.stringify(savedStructuredContent[field]);
  });
}

function buildChangeSummary({
  workflow,
  sourceOrigin,
  structuredContent,
  savedStructuredContent,
  brandTokens,
  revision,
}: {
  workflow: StudioWorkflowWorkspace;
  sourceOrigin: StudioSourceOrigin;
  structuredContent: StudioStructuredContent;
  savedStructuredContent: StudioStructuredContent;
  brandTokens: StudioBrandTokens;
  revision: number;
}) {
  const changedFields = changedStructuredFields(structuredContent, savedStructuredContent);

  return [
    `# Change summary: ${workflow.workflow.name}`,
    "",
    `Source origin: ${sourceOriginLabel[sourceOrigin]}`,
    `Revision: ${revision}`,
    `Changed tokens: ${changedFields.length ? changedFields.join(", ") : "No unsaved structured token changes"}`,
    `Active brand: ${brandTokens.brandName}`,
    `Support email: ${brandTokens.supportEmail}`,
    "",
    "## Included sections",
    ...structuredContent.components.map((component, index) => {
      const manifest = STUDIO_COMPONENT_MANIFESTS.find((item) => item.id === component.componentId);
      return `${index + 1}. ${manifest?.name ?? component.componentId} (${component.componentId})`;
    }),
    "",
    "Structure and token edits are local Studio state. Review MJML source and compiled preview in your sending platform before send.",
  ].join("\n");
}

function buildExportReadme({
  workflow,
  platform,
  guidance,
}: {
  workflow: StudioWorkflowWorkspace;
  platform: StudioPlatform;
  guidance: StudioWorkspaceData["platformGuidance"][number];
}) {
  return [
    "# Template Hedgehog Studio export",
    "",
    `Workflow: ${workflow.workflow.name}`,
    `Platform target: ${platform}`,
    "",
    "## What this package contains",
    "- `/mjml/source.mjml`: editable MJML source",
    "- `/html/compiled.html`: compiled HTML for manual handoff",
    "- `/docs/qa-notes.md`: manual QA state",
    "- `/docs/implementation-guide.md`: platform handoff instructions",
    "- `/docs/workflow-notes.md`: workflow context",
    "- `/docs/platform-handoff.md`: selected platform boundary notes",
    "- `/docs/change-summary.md`: changed tokens and included sections",
    "- `metadata.json`: machine-readable local export metadata",
    "",
    "## Boundary",
    "Studio prepares everything before send. It does not send campaigns, manage audiences, manage consent, manage unsubscribes, automate journeys, report analytics, or connect to platform APIs.",
    "",
    "## Selected platform",
    guidance.summary,
  ].join("\n");
}

function buildWorkflowMetadata({
  workflow,
  platform,
  compileState,
  qaState,
  sourceFileName,
  source,
  html,
  revision,
  readiness,
  sourceOrigin,
  structuredContent,
  savedStructuredContent,
  brandTokens,
}: {
  workflow: StudioWorkflowWorkspace;
  platform: StudioPlatform;
  compileState: StudioExportCompileState;
  qaState: Record<string, StudioQaState>;
  sourceFileName: string;
  source: string;
  html: string;
  revision: number;
  readiness?: StudioReadinessScore;
  sourceOrigin: StudioSourceOrigin;
  structuredContent: StudioStructuredContent;
  savedStructuredContent: StudioStructuredContent;
  brandTokens: StudioBrandTokens;
}) {
  const qaProgress = calculateQaProgress(workflow, qaState);

  return JSON.stringify(
    {
      workflowId: workflow.slug,
      workflowTitle: workflow.workflow.name,
      selectedPlatform: platform,
      exportTimestamp: new Date().toISOString(),
      studioVersion: STUDIO_V2_VERSION,
      appVersion: STUDIO_V2_VERSION,
      sourceFilename: sourceFileName,
      sourceOrigin,
      sourceHash: createStudioHash(source),
      compiledHtmlHash: createStudioHash(html),
      compileStatus: compileState.status,
      compileLastSucceededAt: compileState.lastCompiledAt,
      compileLastFailedAt: compileState.lastFailedAt,
      compileDurationMs: compileState.durationMs,
      qaCompletionPercentage: qaProgress.completion,
      readinessPercentage: readiness?.percentage,
      readinessStatus: readiness?.status,
      readinessBlockingIssues: readiness?.blockingIssues ?? [],
      readinessRecommendedNextAction: readiness?.recommendedNextAction,
      changedTokens: changedStructuredFields(structuredContent, savedStructuredContent),
      includedSections: structuredContent.components.map((component) => component.componentId),
      brandTokens: {
        brandName: brandTokens.brandName,
        primaryColour: brandTokens.primaryColour,
        accentColour: brandTokens.accentColour,
        backgroundColour: brandTokens.backgroundColour,
        textColour: brandTokens.textColour,
        fontFamily: brandTokens.fontFamily,
        logoUrl: brandTokens.logoUrl,
        supportEmail: brandTokens.supportEmail,
        footerCompanyLine: brandTokens.footerCompanyLine,
      },
      exportPackageVersion: "studio-export-v2",
      revision,
      layout: workflow.archive.layoutTitle,
      components: workflow.archive.componentTitles,
      localOnly: true,
    },
    null,
    2,
  );
}

export function buildStudioExportFiles({
  workflow,
  platform,
  guidance,
  source,
  html,
  qaState,
  compileState,
  revision,
  readiness,
  sourceOrigin = "library",
  structuredContent,
  savedStructuredContent,
  brandTokens = DEFAULT_BRAND_TOKENS,
}: {
  workflow: StudioWorkflowWorkspace;
  platform: StudioPlatform;
  guidance: StudioWorkspaceData["platformGuidance"][number];
  source: string;
  html: string;
  qaState: Record<string, StudioQaState>;
  compileState: StudioExportCompileState;
  revision: number;
  readiness?: StudioReadinessScore;
  sourceOrigin?: StudioSourceOrigin;
  structuredContent?: StudioStructuredContent;
  savedStructuredContent?: StudioStructuredContent;
  brandTokens?: StudioBrandTokens;
}) {
  const folderName = sanitiseFolderName(`template-hedgehog-studio-${workflow.slug}`);
  const safeSourceFile = sanitiseFileName(workflow.archive.sourceFile, "source.mjml");
  const fallbackStructured = buildInitialStructuredContent([workflow])[workflow.slug];
  const effectiveStructured = structuredContent ?? fallbackStructured;
  const effectiveSavedStructured = savedStructuredContent ?? effectiveStructured;
  const metadata = buildWorkflowMetadata({
    workflow,
    platform,
    compileState,
    qaState,
    sourceFileName: safeSourceFile,
    source,
    html,
    revision,
    readiness,
    sourceOrigin,
    structuredContent: effectiveStructured,
    savedStructuredContent: effectiveSavedStructured,
    brandTokens,
  });

  return {
    folderName,
    zipFileName: `${folderName}.zip`,
    files: [
      { path: `${folderName}/mjml/source.mjml`, content: source },
      { path: `${folderName}/html/compiled.html`, content: html },
      { path: `${folderName}/docs/qa-notes.md`, content: buildQaNotes(workflow, qaState) },
      { path: `${folderName}/docs/implementation-guide.md`, content: buildImplementationGuide(workflow, platform, guidance) },
      { path: `${folderName}/docs/workflow-notes.md`, content: buildWorkflowNotes(workflow) },
      { path: `${folderName}/docs/platform-handoff.md`, content: buildPlatformHandoff(platform, guidance) },
      { path: `${folderName}/docs/change-summary.md`, content: buildChangeSummary({ workflow, sourceOrigin, structuredContent: effectiveStructured, savedStructuredContent: effectiveSavedStructured, brandTokens, revision }) },
      { path: `${folderName}/docs/readme.md`, content: buildExportReadme({ workflow, platform, guidance }) },
      { path: `${folderName}/metadata.json`, content: metadata },
    ],
  };
}
