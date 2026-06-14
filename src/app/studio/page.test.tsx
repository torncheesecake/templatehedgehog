import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { getStudioWorkspaceData, type StudioQaState } from "@/data/studio";
import { calculateExportReadiness, type StudioPackageInspectionItem } from "@/lib/studio/v2";
import {
  buildStudioSourceDriftDiagnostics,
  getStudioSourceDrift,
  normaliseStudioSnapshots,
} from "./hooks/useStudioWorkspaceState";
import { buildStudioExportFiles, StudioWorkspace } from "./StudioWorkspace";
import StudioPage from "./page";

function renderStudioWorkspace() {
  return renderToStaticMarkup(<StudioWorkspace data={getStudioWorkspaceData()} />);
}

test("/studio renders the public Studio waitlist page", () => {
  const rendered = renderToStaticMarkup(<StudioPage />);

  assert.match(rendered, /Template Hedgehog Studio/i);
  assert.match(rendered, /Future product direction/i);
  assert.match(rendered, /Join Studio waitlist/i);
  assert.match(rendered, /Concept preview only/i);
  assert.match(rendered, /not live product UI/i);
  assert.match(rendered, /The archive is the product you can inspect and buy today/i);
  assert.doesNotMatch(rendered, /Basic Mode/i);
  assert.doesNotMatch(rendered, /Advanced Mode/i);
  assert.doesNotMatch(rendered, /Prepare one workflow email for handoff/i);
});

test("Studio workspace renders the Studio foundation shell", () => {
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /Template Hedgehog <span[^>]*>Studio<\/span>/i);
  assert.match(rendered, /Everything before send/i);
  assert.match(rendered, /Product launch email/i);
  assert.match(rendered, /Prepare one workflow email for handoff/i);
  for (const step of ["Compose", "Preview", "QA", "Handoff", "Export"]) {
    assert.match(rendered, new RegExp(step, "i"));
  }
  assert.match(rendered, /Basic Mode/i);
  assert.match(rendered, /Advanced Mode/i);
  assert.match(rendered, /Next action/i);
  assert.match(rendered, /Readiness summary/i);
  assert.match(rendered, /Can I export/i);
  assert.match(rendered, /Workflow brief/i);
  assert.match(rendered, /Workflow structure/i);
  assert.doesNotMatch(rendered, /Editable MJML source/i);
  assert.doesNotMatch(rendered, /Compiled HTML Drawer/i);
  assert.doesNotMatch(rendered, /Package inspector/i);
});

test("/studio renders the step-based workflow architecture", () => {
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /Step 1/i);
  assert.match(rendered, /Step 2/i);
  assert.match(rendered, /Step 3/i);
  assert.match(rendered, /Step 4/i);
  assert.match(rendered, /Step 5/i);
  assert.match(rendered, /Edit content and structure/i);
  assert.match(rendered, /Compile and review output/i);
  assert.match(rendered, /Clear blockers and warnings/i);
  assert.match(rendered, /Choose the sending platform/i);
  assert.match(rendered, /Download the handoff package/i);
});

test("/studio keeps heavy tools hidden from Basic Mode", () => {
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /Basic Mode hides developer tools/i);
  assert.match(rendered, /Switch to Advanced Mode for MJML source, compiled HTML, brand tokens, snapshots and package inspection/i);
  assert.doesNotMatch(rendered, /Editable MJML source/i);
  assert.doesNotMatch(rendered, /Copy HTML/i);
  assert.doesNotMatch(rendered, /Save snapshot/i);
  assert.doesNotMatch(rendered, /Workflow metadata/i);
});

test("/studio exposes modal and drawer architecture in the implementation", () => {
  const source = readFileSync("src/app/studio/StudioWorkspace.tsx", "utf8");

  assert.match(source, /Source Drawer/i);
  assert.match(source, /Compiled HTML Drawer/i);
  assert.match(source, /Brand Tokens Drawer/i);
  assert.match(source, /Snapshots Drawer/i);
  assert.match(source, /Package Inspector Drawer/i);
  assert.match(source, /Archive Browser Drawer/i);
  assert.match(source, /Reset source\?/i);
  assert.match(source, /Switch workflow\?/i);
  assert.match(source, /Restore snapshot\?/i);
  assert.match(source, /Export with warnings\?/i);
  assert.match(source, /Import MJML/i);
});

test("/studio keeps platform boundary copy available in product copy and data", () => {
  const data = getStudioWorkspaceData();
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /sending platform/i);
  assert.ok(data.platformGuidance.every((item) => item.platformHandles.length > 20));
  assert.ok(data.platformGuidance.every((item) => /handoff/i.test(item.handoffType)));
  assert.ok(data.platformGuidance.every((item) => item.studioHandles && item.platformHandles && item.manualSteps.length));
});

test("/studio exposes the real workflow catalogue and hides archive details by default", () => {
  const data = getStudioWorkspaceData();
  const rendered = renderStudioWorkspace();

  assert.equal(data.workflows.length, 4);
  assert.deepEqual(
    data.workflows.map((workflow) => workflow.libraryLabel),
    [
      "Product launch workflow",
      "Onboarding workflow",
      "Password reset workflow",
      "Weekly digest workflow",
    ],
  );
  assert.ok(data.workflows.every((workflow) => workflow.source.body.includes("<mjml>")));
  assert.ok(data.workflows.every((workflow) => workflow.compiled.body.includes("<html")));
  assert.match(rendered, /Product launch email/i);
  assert.match(rendered, /Onboarding email/i);
  assert.match(rendered, /Password reset email/i);
  assert.match(rendered, /Weekly digest email/i);
  assert.match(rendered, /Campaign/i);
  assert.match(rendered, /Lifecycle/i);
  assert.match(rendered, /Transactional/i);
  assert.match(rendered, /Newsletter/i);
  assert.doesNotMatch(rendered, /Archive browser/i);
  assert.doesNotMatch(rendered, /product-launch\.html/i);
  assert.doesNotMatch(rendered, /Recommended platforms/i);
});

test("/studio does not claim sending or automation as Studio functionality", () => {
  const rendered = renderStudioWorkspace();

  assert.doesNotMatch(rendered, /Studio sends/i);
  assert.doesNotMatch(rendered, /Studio automates/i);
  assert.doesNotMatch(rendered, /Send with Studio/i);
  assert.doesNotMatch(rendered, /Deploy to Mailchimp/i);
  assert.doesNotMatch(rendered, /Direct integration connected/i);
  assert.doesNotMatch(rendered, /Connect Mailchimp/i);
});

test("/studio data still contains grouped QA and all manual handoff platforms", () => {
  const data = getStudioWorkspaceData();
  const rendered = renderStudioWorkspace();

  const allGroups = new Set(data.workflows.flatMap((workflow) => workflow.qaItems.map((item) => item.group)));
  for (const group of ["Compile", "Content", "Responsive", "Accessibility basics", "Platform boundary", "Handoff"]) {
    assert.equal(allGroups.has(group as never), true);
  }

  assert.deepEqual(
    data.platformGuidance.map((item) => item.platform),
    ["Mailchimp", "HubSpot", "Salesforce", "NetSuite", "Klaviyo", "Customer.io", "Other"],
  );
  assert.match(rendered, /Handoff/i);
  assert.match(rendered, /Compile preview/i);
});

test("/studio renders workflow editing without requiring source visibility", () => {
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /Preheader/i);
  assert.match(rendered, /CTA URL/i);
  assert.match(rendered, /Apply changes to source/i);
  assert.match(rendered, /Workflow structure/i);
  assert.match(rendered, /Duplicate/i);
  assert.match(rendered, /Remove/i);
  assert.match(rendered, /This is the last required/i);
  assert.doesNotMatch(rendered, /font-mono/);
  assert.doesNotMatch(rendered, /h-\[560px\]/);
});

test("/studio keeps advanced local-state controls out of the first view", () => {
  const rendered = renderStudioWorkspace();

  assert.match(rendered, /snapshots/i);
  assert.match(rendered, /package inspection/i);
  assert.doesNotMatch(rendered, /Local snapshots/i);
  assert.doesNotMatch(rendered, /Save snapshot/i);
  assert.doesNotMatch(rendered, /Paste MJML/i);
  assert.doesNotMatch(rendered, /stored in this browser only/i);
});

test("Studio export package contents use fixed safe paths and metadata", () => {
  const data = getStudioWorkspaceData();
  const workflow = data.workflows[0];
  const guidance = data.platformGuidance[0];
  const qaState = Object.fromEntries(
    workflow.qaItems.map((item) => [item.key, "pass" as StudioQaState]),
  );
  const exportPackage = buildStudioExportFiles({
    workflow,
    platform: guidance.platform,
    guidance,
    source: workflow.source.body,
    html: workflow.compiled.body,
    qaState,
    compileState: {
      status: "success",
      message: "Compiled",
      sourceSnapshot: workflow.source.body,
      lastCompiledAt: "2026-06-03T00:00:00.000Z",
    },
    revision: 4,
    readiness: {
      percentage: 92,
      status: "warn",
      blockingIssues: [],
      recommendedNextAction: "Review warnings before export.",
    },
  });

  assert.deepEqual(
    exportPackage.files.map((file) => file.path.replace(`${exportPackage.folderName}/`, "")),
    [
      "mjml/source.mjml",
      "html/compiled.html",
      "docs/qa-notes.md",
      "docs/implementation-guide.md",
      "docs/workflow-notes.md",
      "docs/platform-handoff.md",
      "docs/change-summary.md",
      "docs/readme.md",
      "metadata.json",
    ],
  );
  assert.ok(exportPackage.files.every((file) => !file.path.includes("..")));

  const metadata = JSON.parse(exportPackage.files.at(-1)?.content ?? "{}") as {
    workflowId?: string;
    selectedPlatform?: string;
    qaCompletionPercentage?: number;
    readinessPercentage?: number;
    readinessStatus?: string;
    readinessRecommendedNextAction?: string;
    sourceHash?: string;
    compiledHtmlHash?: string;
    exportPackageVersion?: string;
    includedSections?: string[];
    studioVersion?: string;
  };
  assert.equal(metadata.workflowId, workflow.slug);
  assert.equal(metadata.selectedPlatform, guidance.platform);
  assert.equal(metadata.qaCompletionPercentage, 100);
  assert.equal(metadata.readinessPercentage, 92);
  assert.equal(metadata.readinessStatus, "warn");
  assert.equal(metadata.readinessRecommendedNextAction, "Review warnings before export.");
  assert.equal(typeof metadata.sourceHash, "string");
  assert.equal(typeof metadata.compiledHtmlHash, "string");
  assert.equal(metadata.exportPackageVersion, "studio-export-v2");
  assert.ok(Array.isArray(metadata.includedSections));
  assert.equal(metadata.studioVersion, "studio-v2-local");
});


test("Studio state guards mark structured token edits as source drift before apply", () => {
  const drift = getStudioSourceDrift({
    source: "<mjml><mj-body><mj-text>Old source</mj-text></mj-body></mjml>",
    generatedSource: "<mjml><mj-body><mj-text>New structured copy</mj-text></mj-body></mjml>",
    sourceOrigin: "library",
    structuredDirty: true,
  });

  assert.equal(drift.sourceMatchesStructured, false);
  assert.equal(drift.sourceOutOfSync, true);
  assert.match(drift.reason ?? "", /Structured content or brand tokens/i);
});

test("Studio state guards allow generated or manual source without false drift", () => {
  assert.equal(
    getStudioSourceDrift({
      source: "<mjml>generated</mjml>",
      generatedSource: "<mjml>generated</mjml>",
      sourceOrigin: "generated",
      structuredDirty: true,
    }).sourceOutOfSync,
    false,
  );

  assert.equal(
    getStudioSourceDrift({
      source: "<mjml>manual edit</mjml>",
      generatedSource: "<mjml>structured copy</mjml>",
      sourceOrigin: "manual",
      structuredDirty: true,
    }).sourceOutOfSync,
    false,
  );
});

test("Studio state guards block export readiness when source is out of sync", () => {
  const data = getStudioWorkspaceData();
  const workflow = data.workflows[0];
  const qaState = Object.fromEntries(
    workflow.qaItems.map((item) => [item.key, "pass" as StudioQaState]),
  );
  const packageInspection: StudioPackageInspectionItem[] = [
    {
      path: "mjml/source.mjml",
      included: true,
      generatedAt: "2026-06-04T00:00:00.000Z",
      status: "pass",
      explanation: "Present",
    },
  ];
  const drift = getStudioSourceDrift({
    brandTokensDirty: true,
    source: "<mjml><mj-body><mj-text>Old brand</mj-text></mj-body></mjml>",
    generatedSource: "<mjml><mj-body><mj-text>New brand</mj-text></mj-body></mjml>",
    sourceOrigin: "library",
    structuredDirty: false,
  });

  const driftDiagnostics = buildStudioSourceDriftDiagnostics(drift);
  const readiness = calculateExportReadiness({
    compileStatus: "success",
    manualQaState: qaState,
    contentChecks: driftDiagnostics,
    linkReview: [],
    imageReview: [],
    packageInspection,
    selectedPlatform: "Mailchimp",
  });

  assert.equal(readiness.status, "fail");
  assert.match(driftDiagnostics[0].label, /Structured edits applied to source/i);
  assert.match(readiness.blockingIssues.join(" "), /Resolve failed content QA checks/i);
});

test("Studio local snapshot normalisation drops corrupt snapshots and versions valid snapshots", () => {
  const validSnapshot = {
    id: "campaign-1",
    name: "Valid snapshot",
    createdAt: "2026-06-04T00:00:00.000Z",
    workflowSlug: "campaign-launch",
    source: "<mjml></mjml>",
    compiledHtml: "<html></html>",
    structuredContent: { workflowId: "campaign-launch" },
    brandTokens: { brandName: "Template Hedgehog" },
    qaState: { compiled: "pass" },
    platform: "Mailchimp",
    sourceOrigin: "generated",
  };

  const snapshots = normaliseStudioSnapshots([
    validSnapshot,
    { ...validSnapshot, id: 42 },
    null,
    "not a snapshot",
  ]);

  assert.equal(snapshots.length, 1);
  assert.equal(snapshots[0].id, "campaign-1");
  assert.equal(snapshots[0].version, 1);
});
