"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  Boxes,
  Code2,
  FileCode2,
  PackageCheck,
  Palette,
  Play,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import type { StudioQaState, StudioWorkflowWorkspace, StudioWorkspaceData } from "@/data/studio";
import { buildStudioExportFiles } from "@/lib/studio/exportMetadata";
import { BrandTokenPanel } from "./components/BrandTokenPanel";
import { CompiledHtmlPanel } from "./components/CompiledHtmlPanel";
import { ComponentStructurePanel } from "./components/ComponentStructurePanel";
import { ExportPanel } from "./components/ExportPanel";
import { HandoffPanel } from "./components/HandoffPanel";
import { LocalStatePanel } from "./components/LocalStatePanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { QaChecklistPanel } from "./components/QaChecklistPanel";
import { QuickEditPanel } from "./components/QuickEditPanel";
import { SourceEditorPanel } from "./components/SourceEditorPanel";
import { StudioTopBar } from "./components/StudioTopBar";
import { WorkflowRail } from "./components/WorkflowRail";
import { IconPanelButton, SectionHeading, getStatusTone } from "./components/studioControls";
import { QA_GROUPS, useStudioWorkspaceState } from "./hooks/useStudioWorkspaceState";
import type { StudioLocalSnapshot } from "./types";
import { sourceOriginLabel } from "./types";

type StudioWorkspaceProps = {
  data: StudioWorkspaceData;
};

type StudioStep = "compose" | "preview" | "qa" | "handoff" | "export";
type StudioDrawer = "source" | "html" | "brand" | "snapshots" | "package" | "archive" | null;
type StudioMode = "basic" | "advanced";

const MODE_STORAGE_KEY = "template-hedgehog-studio-mode";

const steps: Array<{
  id: StudioStep;
  label: string;
  summary: string;
}> = [
  { id: "compose", label: "Compose", summary: "Edit content and structure." },
  { id: "preview", label: "Preview", summary: "Compile and review output." },
  { id: "qa", label: "QA", summary: "Clear blockers and warnings." },
  { id: "handoff", label: "Handoff", summary: "Choose the sending platform." },
  { id: "export", label: "Export", summary: "Download the handoff package." },
];

export { buildStudioExportFiles };

export function StudioWorkspace({ data }: StudioWorkspaceProps) {
  const [activeStep, setActiveStep] = useState<StudioStep>("compose");
  const [drawer, setDrawer] = useState<StudioDrawer>(null);
  const [mode, setMode] = useState<StudioMode>(() => {
    if (typeof window === "undefined") return "basic";
    try {
      const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
      return stored === "advanced" || stored === "basic" ? stored : "basic";
    } catch {
      return "basic";
    }
  });
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pastedMjml, setPastedMjml] = useState("");
  const [pendingWorkflowSlug, setPendingWorkflowSlug] = useState("");
  const [pendingSnapshot, setPendingSnapshot] = useState<StudioLocalSnapshot | null>(null);
  const [exportWarningOpen, setExportWarningOpen] = useState(false);
  const {
    state: {
      brandTokens,
      copied,
      exportMessage,
      inlineDraft,
      inlineField,
      lastCompiledAt,
      lastSavedAt,
      previewMode,
      selectedComponentId,
      selectedPack,
      snapshots,
      storageMessage,
      structuredMessage,
    },
    derived: {
      availableComponents,
      brandChecks,
      compileMatchesSource,
      contentChecks,
      exportReady,
      formatDateTime,
      getWorkflowStatus,
      imageReview,
      isDirty,
      linkReview,
      packageInspection,
      qaProgress,
      readiness,
      selectedCompiledHtml,
      selectedCompileState,
      selectedGuidance,
      selectedPlatform,
      selectedQaState,
      selectedSavedStructuredContent,
      selectedSource,
      selectedSourceOrigin,
      selectedStructuredContent,
      selectedWorkflow,
      sourceStats,
      structuredDirty,
      workflowEntitled,
    },
    actions: {
      applyInlineEdit,
      applyStructuredToMjml,
      clearInlineField,
      compileSource,
      copyPreviewHtml,
      copyText,
      createSnapshot,
      deleteSnapshot,
      duplicateComponent,
      exportPackage,
      insertSelectedComponent,
      markPreviewChecked,
      openPreviewInNewTab,
      removeComponent,
      reorderComponent,
      resetAllStructuredFields,
      resetSource,
      resetStructure,
      resetStructuredField,
      restoreSnapshot,
      saveSource,
      saveStructuredContent,
      selectInlineField,
      selectWorkflow,
      setInlineDraft,
      setQaValues,
      setSelectedComponentId,
      setSelectedPlatform,
      updateBrandToken,
      updateComponentField,
      updateQa,
      updateSelectedPack,
      updateSocialLink,
      updateSource,
      updateStructuredField,
    },
  } = useStudioWorkspaceState(data);

  function updateMode(nextMode: StudioMode) {
    setMode(nextMode);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
    } catch {
      // Local persistence is optional for this UI preference.
    }
  }

  const nextStep = getNextStep({
    activeStep,
    compileStatus: selectedCompileState.status,
    compileMatchesSource,
    readinessStatus: readiness.status,
    exportReady,
    qaCompletion: qaProgress.completion,
  });
  const compileTone =
    selectedCompileState.status === "success"
      ? "border-[#6ee7b7]/30 bg-[#052116] text-[#bbf7d0]"
      : selectedCompileState.status === "error"
        ? "border-red-300/35 bg-red-950/30 text-red-100"
        : "border-white/10 bg-white/[0.035] text-slate-300";
  const topBarNextAction = nextStep.target ? nextStep.label : "Handoff ready";
  const pendingWorkflow = data.workflows.find((workflow) => workflow.slug === pendingWorkflowSlug);
  const packageStatus = useMemo(
    () => packageInspection.reduce(
      (counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }),
      { pass: 0, warn: 0, fail: 0 },
    ),
    [packageInspection],
  );

  function requestWorkflowSelection(slug: string) {
    if (slug === selectedWorkflow.slug) return;
    if (isDirty || structuredDirty) {
      setPendingWorkflowSlug(slug);
      return;
    }
    selectWorkflow(slug);
    setActiveStep("compose");
    setDrawer(null);
  }

  function confirmWorkflowSelection() {
    if (!pendingWorkflowSlug) return;
    selectWorkflow(pendingWorkflowSlug, true);
    setPendingWorkflowSlug("");
    setActiveStep("compose");
    setDrawer(null);
  }

  function runPrimaryAction() {
    if (nextStep.target === "compile") {
      setActiveStep("preview");
      void compileSource();
      return;
    }
    if (nextStep.target === "export") {
      setActiveStep("export");
      return;
    }
    if (nextStep.target) setActiveStep(nextStep.target);
  }

  function submitPastedMjml() {
    if (pastedMjml.length > 200_000) {
      return;
    }
    if (!/<mjml[\s>]/i.test(pastedMjml)) {
      return;
    }
    updateSource(pastedMjml, "manual");
    setPastedMjml("");
    setImportModalOpen(false);
    setActiveStep("preview");
  }

  function requestExport() {
    if (readiness.status === "warn") {
      setExportWarningOpen(true);
      return;
    }
    exportPackage();
  }

  return (
    <main className="studio-shell min-h-screen bg-[#030913] text-slate-200">
      <div className="flex min-h-screen flex-col">
        <StudioTopBar
          compileStatus={selectedCompileState.status}
          dirtyLabel={isDirty || structuredDirty ? "Unsaved" : "Saved"}
          exportReady={exportReady}
          nextAction={topBarNextAction}
          onNextAction={runPrimaryAction}
          readinessLabel={formatReadinessLabel(readiness)}
          workflowName={selectedWorkflow.workflow.name}
        />

        <section className="border-b border-[#8b5cf6]/25 bg-[#100b22] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#c084fc]">
                Template Hedgehog Studio - Private Alpha
              </p>
              <p className="mt-1 text-[0.8rem] font-semibold leading-5 text-slate-100">
                On the roadmap, not included in any tier. Everything before send.
              </p>
              <p className="mt-1 text-[0.8rem] leading-5 text-slate-300">
                Local-first workspace to choose workflows, edit content, compile, preview, QA, prepare handoff, and export ZIPs.
              </p>
              <p className="mt-1 text-[0.76rem] leading-5 text-slate-400">
                This public alpha route is for evaluation and local testing. The paid archive is complete without Studio; licensed production use follows your archive tier. Studio does not send email or manage audiences, consent, unsubscribe, automation, delivery, or reporting.
              </p>
            </div>
            <Link
              href="/pricing#pro"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#c084fc]/45 px-3 text-[0.74rem] font-semibold text-[#f5d0fe] transition hover:border-[#f0abfc] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
            >
              See Pro
            </Link>
          </div>
        </section>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
          <WorkflowRail
            data={data}
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={requestWorkflowSelection}
            getWorkflowStatus={getWorkflowStatus}
          />

          <section className="min-w-0 bg-[#071421]">
            <div className="border-b border-white/10 bg-[#081725] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Prepare one workflow email for handoff
                  </p>
                  <h2 className="mt-1 truncate text-[1.1rem] font-semibold text-white">{selectedWorkflow.workflow.name}</h2>
                </div>
                <ModeToggle mode={mode} onChange={updateMode} />
              </div>
              <StepTabs activeStep={activeStep} onSelectStep={setActiveStep} />
              {mode === "advanced" ? (
                <AdvancedDrawerLauncher onOpen={setDrawer} />
              ) : (
                <p className="mt-3 text-[0.74rem] leading-5 text-slate-400">
                  Basic Mode hides developer tools. Switch to Advanced Mode for MJML source, compiled HTML, brand tokens, snapshots and package inspection.
                </p>
              )}
            </div>

            <div className="p-4">
              {activeStep === "compose" ? (
                <StepPanel title="Compose" copy="Edit the content and workflow structure before generating MJML.">
                  <WorkflowBrief workflow={selectedWorkflow} />
                  <QuickEditPanel
                    content={selectedStructuredContent}
                    message={structuredMessage}
                    onApplyToSource={applyStructuredToMjml}
                    onResetAll={resetAllStructuredFields}
                    onResetField={resetStructuredField}
                    onSave={saveStructuredContent}
                    onUpdateField={updateStructuredField}
                    onUpdateSocialLink={updateSocialLink}
                    savedContent={selectedSavedStructuredContent}
                    structuredDirty={structuredDirty}
                  />
                  <ComponentStructurePanel
                    availableComponents={availableComponents}
                    content={selectedStructuredContent}
                    onDuplicateComponent={duplicateComponent}
                    onInsertSelectedComponent={insertSelectedComponent}
                    onRemoveComponent={removeComponent}
                    onReorderComponent={reorderComponent}
                    onResetStructure={resetStructure}
                    onSelectComponent={setSelectedComponentId}
                    onUpdateComponentField={updateComponentField}
                    selectedComponentId={selectedComponentId}
                  />
                </StepPanel>
              ) : null}

              {activeStep === "preview" ? (
                <StepPanel title="Preview" copy="Compile locally, then check desktop and mobile output.">
                  <div className={`rounded-lg border p-4 text-[0.8rem] leading-5 ${compileTone}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">Compile status: {selectedCompileState.status}</p>
                        <p className="mt-1">{selectedCompileState.message}</p>
                      </div>
                      <IconPanelButton
                        testId="studio-preview-compile"
                        active={selectedCompileState.status === "success"}
                        onClick={compileSource}
                        disabled={selectedCompileState.status === "compiling"}
                      >
                        <Play className="h-4 w-4" aria-hidden="true" />
                        {selectedCompileState.status === "compiling" ? "Compiling" : "Compile"}
                      </IconPanelButton>
                    </div>
                    {!compileMatchesSource ? <p className="mt-2 text-amber-100">Preview is stale. Compile the current source before handoff.</p> : null}
                  </div>
                  <PreviewPanel
                    compileMatchesSource={compileMatchesSource}
                    compileTone={compileTone}
                    copied={copied}
                    formatDateTime={formatDateTime}
                    inlineDraft={inlineDraft}
                    inlineField={inlineField}
                    lastCompiledAt={lastCompiledAt[selectedWorkflow.slug]}
                    onApplyInlineEdit={applyInlineEdit}
                    onClearInlineField={clearInlineField}
                    onCopyPreviewHtml={copyPreviewHtml}
                    onOpenPreview={openPreviewInNewTab}
                    onSelectInlineField={selectInlineField}
                    onSetInlineDraft={setInlineDraft}
                    onSetPreviewMode={markPreviewChecked}
                    previewMode={previewMode}
                    selectedCompileState={selectedCompileState}
                    selectedCompiledHtml={selectedCompiledHtml}
                    selectedStructuredContent={selectedStructuredContent}
                    selectedWorkflow={selectedWorkflow}
                  />
                </StepPanel>
              ) : null}

              {activeStep === "qa" ? (
                <StepPanel title="QA" copy="Review blockers, warnings and grouped before-send checks.">
                  <QaChecklistPanel
                    brandChecks={brandChecks}
                    contentChecks={contentChecks}
                    formatDateTime={formatDateTime}
                    imageReview={imageReview}
                    linkReview={linkReview}
                    onResetQa={() =>
                      setQaValues(
                        Object.fromEntries(selectedWorkflow.qaItems.map((item) => [item.key, "unchecked"])) as Record<string, StudioQaState>,
                      )
                    }
                    onUpdateQa={updateQa}
                    packageInspection={packageInspection}
                    qaGroups={QA_GROUPS}
                    qaProgress={qaProgress}
                    qaState={selectedQaState}
                    readiness={readiness}
                    workflow={selectedWorkflow}
                  />
                </StepPanel>
              ) : null}

              {activeStep === "handoff" ? (
                <StepPanel title="Handoff" copy="Choose the target sending platform and review manual handoff responsibilities.">
                  <HandoffPanel
                    guidance={selectedGuidance}
                    onCopySteps={() => copyText("handoff", selectedGuidance.manualSteps.join("\n"))}
                    platformGuidance={data.platformGuidance}
                    selectedPlatform={selectedPlatform}
                    onSelectPlatform={setSelectedPlatform}
                    workflow={selectedWorkflow}
                  />
                </StepPanel>
              ) : null}

              {activeStep === "export" ? (
                <StepPanel title="Export" copy="Package the reviewed source, compiled HTML, QA notes and implementation guide.">
                  <section className={`rounded-lg border p-4 ${getStatusTone(readiness.status)}`}>
                    <SectionHeading>Readiness result</SectionHeading>
                    <p className="mt-3 text-[2.25rem] font-semibold leading-none text-white">{readiness.percentage}%</p>
                    <p className="mt-2 text-[0.82rem] leading-5">{readiness.recommendedNextAction}</p>
                  </section>
                  <ExportPanel
                    exportMessage={exportMessage}
                    hasCompiledHtml={Boolean(selectedCompiledHtml.trim())}
                    onExport={requestExport}
                  />
                </StepPanel>
              ) : null}
            </div>
          </section>

          <aside className="border-t border-white/10 bg-[#071421] lg:border-l lg:border-t-0">
            <div className="space-y-4 p-4">
              <section className="rounded-lg border border-[#8b5cf6]/35 bg-[#21113c] p-4">
                <SectionHeading>Next action</SectionHeading>
                <p className="mt-3 text-[0.92rem] font-semibold text-white">{nextStep.label}</p>
                <p className="mt-1 text-[0.76rem] leading-5 text-slate-300">{nextStep.copy}</p>
                {nextStep.target ? (
                  <button
                    type="button"
                    onClick={runPrimaryAction}
                    className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#8b5cf6]/50 bg-[#7c3aed] px-3 text-[0.76rem] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                  >
                    {nextStep.label}
                  </button>
                ) : null}
              </section>

              <CompactStatus
                compileMatchesSource={compileMatchesSource}
                compileStatus={selectedCompileState.status}
                dirty={isDirty || structuredDirty}
                platform={selectedPlatform}
                qaProgress={qaProgress.completion}
                readiness={readiness}
              />

              <section className={`rounded-lg border p-4 text-[0.76rem] leading-5 ${getStatusTone(readiness.status)}`}>
                <SectionHeading>Can I export?</SectionHeading>
                <p className="mt-3 text-[1.5rem] font-semibold leading-none text-white">{readiness.percentage}%</p>
                <p className="mt-2">{exportReady ? "Yes. Package is ready for manual handoff." : readiness.recommendedNextAction}</p>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <StudioDrawer
        drawer={drawer}
        onClose={() => setDrawer(null)}
        title={getDrawerTitle(drawer)}
      >
        {drawer === "source" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <IconPanelButton onClick={saveSource} disabled={!isDirty}>
                <Save className="h-4 w-4" aria-hidden="true" />
                Save locally
              </IconPanelButton>
              <IconPanelButton onClick={() => setResetModalOpen(true)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset source
              </IconPanelButton>
              <IconPanelButton onClick={() => setImportModalOpen(true)}>
                <FileCode2 className="h-4 w-4" aria-hidden="true" />
                Paste MJML
              </IconPanelButton>
            </div>
            <SourceEditorPanel
              copied={copied}
              isDirty={isDirty}
              onCopySource={() => copyText("source", selectedSource)}
              onUpdateSource={updateSource}
              selectedSource={selectedSource}
              selectedSourceOrigin={selectedSourceOrigin}
              sourceStats={sourceStats}
            />
          </div>
        ) : null}
        {drawer === "html" ? (
          <CompiledHtmlPanel
            compileMatchesSource={compileMatchesSource}
            copied={copied}
            onCopyHtml={() => copyText("html", selectedCompiledHtml)}
            selectedCompiledHtml={selectedCompiledHtml}
          />
        ) : null}
        {drawer === "brand" ? (
          <BrandTokenPanel
            brandTokens={brandTokens}
            compileMatchesSource={compileMatchesSource}
            formatDateTime={formatDateTime}
            lastCompiledAt={lastCompiledAt[selectedWorkflow.slug] || selectedCompileState.lastCompiledAt || ""}
            lastSavedAt={lastSavedAt[selectedWorkflow.slug]}
            onUpdateBrandToken={updateBrandToken}
            onUpdateSelectedPack={updateSelectedPack}
            selectedPack={selectedPack}
            storageMessage={storageMessage}
            structuredDirty={structuredDirty}
            workflowEntitled={workflowEntitled}
          />
        ) : null}
        {drawer === "snapshots" ? (
          <LocalStatePanel
            formatDateTime={formatDateTime}
            onCreateSnapshot={createSnapshot}
            onDeleteSnapshot={deleteSnapshot}
            onRestoreSnapshot={setPendingSnapshot}
            snapshots={snapshots}
            workflowSlug={selectedWorkflow.slug}
          />
        ) : null}
        {drawer === "package" ? (
          <PackageInspector counts={packageStatus} formatDateTime={formatDateTime} packageInspection={packageInspection} />
        ) : null}
        {drawer === "archive" ? (
          <ArchiveBrowser workflow={selectedWorkflow} sourceOrigin={selectedSourceOrigin} sourceStats={sourceStats} />
        ) : null}
      </StudioDrawer>

      <ConfirmModal
        open={resetModalOpen}
        title="Reset source?"
        body="This restores the selected workflow to the original archive source and clears local compile/export state."
        confirmLabel="Reset source"
        onCancel={() => setResetModalOpen(false)}
        onConfirm={() => {
          resetSource(true);
          setResetModalOpen(false);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingWorkflowSlug)}
        title="Switch workflow?"
        body={`Switch to ${pendingWorkflow?.workflow.name ?? "the selected workflow"}? Unsaved local edits in the current workflow may be overwritten.`}
        confirmLabel="Switch workflow"
        onCancel={() => setPendingWorkflowSlug("")}
        onConfirm={confirmWorkflowSelection}
      />

      <ConfirmModal
        open={Boolean(pendingSnapshot)}
        title="Restore snapshot?"
        body={`Restore ${pendingSnapshot?.name ?? "this snapshot"}? Current local edits for this workflow may be overwritten.`}
        confirmLabel="Restore snapshot"
        onCancel={() => setPendingSnapshot(null)}
        onConfirm={() => {
          if (pendingSnapshot) restoreSnapshot(pendingSnapshot, true);
          setPendingSnapshot(null);
          setDrawer(null);
        }}
      />

      <ConfirmModal
        open={exportWarningOpen}
        title="Export with warnings?"
        body={readiness.recommendedNextAction}
        confirmLabel="Export anyway"
        onCancel={() => setExportWarningOpen(false)}
        onConfirm={() => {
          exportPackage(true);
          setExportWarningOpen(false);
        }}
      />

      <StudioModal open={importModalOpen} title="Import MJML" onClose={() => setImportModalOpen(false)}>
        <div className="space-y-3">
          <p className="text-[0.78rem] leading-5 text-slate-300">
            Paste text MJML under 200KB. This replaces the current source draft locally.
          </p>
          <textarea
            aria-label="Paste MJML source"
            value={pastedMjml}
            onChange={(event) => setPastedMjml(event.target.value)}
            className="h-56 w-full resize-y rounded-lg border border-white/10 bg-[#050b14] p-3 font-mono text-[0.78rem] leading-5 text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
            placeholder="<mjml>...</mjml>"
          />
          {pastedMjml && !/<mjml[\s>]/i.test(pastedMjml) ? (
            <p className="text-[0.74rem] text-red-100">Import needs a valid &lt;mjml&gt; root.</p>
          ) : null}
          {pastedMjml.length > 200_000 ? (
            <p className="text-[0.74rem] text-red-100">Paste is over 200KB.</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setImportModalOpen(false)} className="rounded-lg border border-white/10 px-3 py-2 text-[0.76rem] font-semibold text-slate-300">
              Cancel
            </button>
            <button
              type="button"
              onClick={submitPastedMjml}
              disabled={!/<mjml[\s>]/i.test(pastedMjml) || pastedMjml.length > 200_000}
              className="rounded-lg border border-[#8b5cf6]/50 bg-[#7c3aed] px-3 py-2 text-[0.76rem] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Import MJML
            </button>
          </div>
        </div>
      </StudioModal>
    </main>
  );
}

function StepTabs({
  activeStep,
  onSelectStep,
}: {
  activeStep: StudioStep;
  onSelectStep: (step: StudioStep) => void;
}) {
  return (
    <nav className="mt-4" aria-label="Studio workflow steps">
      <ol className="grid gap-2 md:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              data-testid={`studio-step-${step.id}`}
              onClick={() => onSelectStep(step.id)}
              aria-pressed={activeStep === step.id}
              className={`h-full w-full rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
                activeStep === step.id
                  ? "border-[#8b5cf6]/60 bg-[#21113c] text-white"
                  : "border-white/10 bg-white/[0.025] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Step {index + 1}</span>
              <span className="mt-1 block text-[0.84rem] font-semibold">{step.label}</span>
              <span className="mt-1 block text-[0.7rem] leading-4 text-slate-400">{step.summary}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepPanel({ children, copy, title }: { children: ReactNode; copy: string; title: string }) {
  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Active step</p>
        <h2 className="mt-1 text-[1.35rem] font-semibold text-white">{title}</h2>
        <p className="mt-1 text-[0.82rem] leading-6 text-slate-400">{copy}</p>
      </div>
      {children}
    </section>
  );
}

function ModeToggle({ mode, onChange }: { mode: StudioMode; onChange: (mode: StudioMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.035] p-1">
      {(["basic", "advanced"] as StudioMode[]).map((item) => (
        <button
          key={item}
          type="button"
          data-testid={`studio-mode-${item}`}
          onClick={() => onChange(item)}
          className={`h-8 rounded-md px-3 text-[0.74rem] font-semibold capitalize transition ${
            mode === item ? "bg-[#7c3aed] text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          {item} Mode
        </button>
      ))}
    </div>
  );
}

function AdvancedDrawerLauncher({ onOpen }: { onOpen: (drawer: Exclude<StudioDrawer, null>) => void }) {
  const tools: Array<{ drawer: Exclude<StudioDrawer, null>; label: string; icon: ReactNode }> = [
    { drawer: "source", label: "MJML source", icon: <FileCode2 className="h-4 w-4" aria-hidden="true" /> },
    { drawer: "html", label: "Compiled HTML", icon: <Code2 className="h-4 w-4" aria-hidden="true" /> },
    { drawer: "brand", label: "Brand tokens", icon: <Palette className="h-4 w-4" aria-hidden="true" /> },
    { drawer: "snapshots", label: "Snapshots", icon: <Boxes className="h-4 w-4" aria-hidden="true" /> },
    { drawer: "package", label: "Package inspector", icon: <PackageCheck className="h-4 w-4" aria-hidden="true" /> },
    { drawer: "archive", label: "Archive browser", icon: <Archive className="h-4 w-4" aria-hidden="true" /> },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tools.map((tool) => (
        <IconPanelButton key={tool.drawer} testId={`studio-drawer-${tool.drawer}`} onClick={() => onOpen(tool.drawer)}>
          {tool.icon}
          {tool.label}
        </IconPanelButton>
      ))}
    </div>
  );
}

function CompactStatus({
  compileMatchesSource,
  compileStatus,
  dirty,
  platform,
  qaProgress,
  readiness,
}: {
  compileMatchesSource: boolean;
  compileStatus: string;
  dirty: boolean;
  platform: string;
  qaProgress: number;
  readiness: { percentage: number; status: "pass" | "warn" | "fail" };
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <SectionHeading>Readiness summary</SectionHeading>
      <dl className="mt-3 grid gap-2 text-[0.76rem] leading-5">
        <SummaryRow label="Save" value={dirty ? "Unsaved" : "Saved locally"} tone={dirty ? "warn" : "pass"} />
        <SummaryRow label="Compile" value={compileStatus} tone={compileStatus === "error" ? "fail" : compileStatus === "success" ? "pass" : "warn"} />
        <SummaryRow label="Preview" value={compileMatchesSource ? "Current" : "Stale"} tone={compileMatchesSource ? "pass" : "warn"} />
        <SummaryRow label="QA" value={`${qaProgress}%`} tone={qaProgress === 100 ? "pass" : "warn"} />
        <SummaryRow label="Platform" value={platform} tone="pass" />
        <SummaryRow label="Export" value={formatReadinessLabel(readiness)} tone={readiness.status} />
      </dl>
    </section>
  );
}

function WorkflowBrief({ workflow }: { workflow: StudioWorkflowWorkspace }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Workflow brief</p>
          <h3 className="mt-1 text-[0.95rem] font-semibold text-white">{workflow.workflow.name}</h3>
          <p className="mt-2 text-[0.78rem] leading-5 text-slate-300">{workflow.workflow.summary}</p>
        </div>
        <dl className="grid gap-2 text-[0.74rem] leading-5">
          <div>
            <dt className="font-semibold text-slate-100">Trigger</dt>
            <dd className="text-slate-300">{workflow.workflow.trigger}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-100">Goal</dt>
            <dd className="text-slate-300">{workflow.workflow.goal}</dd>
          </div>
        </dl>
      </div>
      {workflow.workflow.risks.length ? (
        <div className="mt-4 rounded-md border border-amber-300/20 bg-amber-950/20 p-3">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-amber-100">Review before handoff</p>
          <ul className="mt-2 grid gap-1 text-[0.74rem] leading-5 text-slate-300">
            {workflow.workflow.risks.map((risk) => (
              <li key={risk}>- {risk}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function SummaryRow({ label, tone, value }: { label: string; tone: "pass" | "warn" | "fail"; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className={tone === "pass" ? "text-[#bbf7d0]" : tone === "warn" ? "text-amber-100" : "text-red-100"}>{value}</dd>
    </div>
  );
}

function formatReadinessLabel(readiness: { percentage: number; status: "pass" | "warn" | "fail" }) {
  const statusLabel = readiness.status === "pass"
    ? "Ready"
    : readiness.status === "warn"
      ? "Review warnings"
      : "Needs QA";

  return `${readiness.percentage}% ${statusLabel}`;
}

function StudioDrawer({
  children,
  drawer,
  onClose,
  title,
}: {
  children: ReactNode;
  drawer: StudioDrawer;
  onClose: () => void;
  title: string;
}) {
  if (!drawer) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/50" role="presentation">
      <aside className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-white/10 bg-[#071421] shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h2 className="text-[0.95rem] font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-200"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

function getDrawerTitle(drawer: StudioDrawer) {
  if (drawer === "source") return "Source Drawer";
  if (drawer === "html") return "Compiled HTML Drawer";
  if (drawer === "brand") return "Brand Tokens Drawer";
  if (drawer === "snapshots") return "Snapshots Drawer";
  if (drawer === "package") return "Package Inspector Drawer";
  if (drawer === "archive") return "Archive Browser Drawer";
  return "";
}

function PackageInspector({
  counts,
  formatDateTime,
  packageInspection,
}: {
  counts: { pass: number; warn: number; fail: number };
  formatDateTime: (value?: string) => string;
  packageInspection: Array<{
    explanation: string;
    generatedAt: string;
    included: boolean;
    path: string;
    status: "pass" | "warn" | "fail";
  }>;
}) {
  return (
    <section className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-[0.76rem] text-slate-300">
        {counts.pass} pass · {counts.warn} warn · {counts.fail} fail
      </div>
      <div className="grid gap-2">
        {packageInspection.map((item) => (
          <div key={item.path} className={`rounded-lg border p-3 text-[0.74rem] leading-5 ${getStatusTone(item.status)}`}>
            <p className="font-semibold">{item.path}</p>
            <p className="mt-1">{item.included ? "Included" : "Missing"} · {item.explanation}</p>
            <p className="mt-1">Generated: {formatDateTime(item.generatedAt)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArchiveBrowser({
  sourceOrigin,
  sourceStats,
  workflow,
}: {
  sourceOrigin: string;
  sourceStats: { lines: number; characters: number };
  workflow: StudioWorkflowWorkspace;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <SectionHeading>Workflow metadata</SectionHeading>
        <dl className="mt-3 grid gap-2 text-[0.78rem] leading-5">
          {[
            { label: "Use case", value: workflow.category },
            { label: "Source file", value: workflow.archive.sourceFile },
            { label: "Compiled file", value: workflow.archive.compiledFile },
            { label: "Recommended platforms", value: workflow.recommendedPlatforms.join(", ") },
            { label: "Source origin", value: sourceOriginLabel[sourceOrigin as keyof typeof sourceOriginLabel] ?? sourceOrigin },
            { label: "Source size", value: `${sourceStats.lines} lines · ${sourceStats.characters.toLocaleString("en-GB")} chars` },
          ].map((item) => (
            <div key={item.label} className="flex justify-between gap-3 border-b border-white/10 py-2 last:border-b-0">
              <dt className="text-slate-400">{item.label}</dt>
              <dd className="text-right text-slate-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <SectionHeading>Archive browser</SectionHeading>
        <p className="mt-3 text-[0.78rem] leading-5 text-slate-300">Layout: {workflow.archive.layoutTitle}</p>
        <p className="mt-2 text-[0.78rem] leading-5 text-slate-300">Components: {workflow.archive.componentTitles.join(", ")}</p>
      </div>
    </section>
  );
}

function StudioModal({
  children,
  onClose,
  open,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <section className="w-full max-w-lg rounded-xl border border-white/10 bg-[#071421] p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-slate-300" aria-label="Close modal">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}

function ConfirmModal({
  body,
  confirmLabel,
  onCancel,
  onConfirm,
  open,
  title,
}: {
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}) {
  return (
    <StudioModal open={open} title={title} onClose={onCancel}>
      <p className="text-[0.8rem] leading-6 text-slate-300">{body}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-white/10 px-3 py-2 text-[0.76rem] font-semibold text-slate-300">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="rounded-lg border border-[#8b5cf6]/50 bg-[#7c3aed] px-3 py-2 text-[0.76rem] font-semibold text-white">
          {confirmLabel}
        </button>
      </div>
    </StudioModal>
  );
}

function getNextStep({
  activeStep,
  compileMatchesSource,
  compileStatus,
  exportReady,
  qaCompletion,
  readinessStatus,
}: {
  activeStep: StudioStep;
  compileMatchesSource: boolean;
  compileStatus: string;
  exportReady: boolean;
  qaCompletion: number;
  readinessStatus: "pass" | "warn" | "fail";
}) {
  if (compileStatus !== "success" || !compileMatchesSource) {
    return {
      label: "Compile preview",
      copy: "Compile the current MJML before QA or export.",
      target: "compile" as const,
    };
  }
  if (qaCompletion < 100 || readinessStatus === "fail") {
    return {
      label: activeStep === "qa" ? "Complete QA" : "Go to QA",
      copy: "Review manual QA and fix any blockers.",
      target: "qa" as const,
    };
  }
  if (activeStep !== "handoff" && activeStep !== "export") {
    return {
      label: "Go to Handoff",
      copy: "Confirm platform responsibilities before export.",
      target: "handoff" as const,
    };
  }
  return {
    label: activeStep === "export" ? (exportReady ? "Handoff ready" : "Download ZIP") : "Go to Export",
    copy: exportReady ? "The latest package has been exported." : "The workflow is ready for manual handoff packaging.",
    target: "export" as const,
  };
}
