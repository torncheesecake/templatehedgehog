"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  StudioQaGroup,
  StudioQaState,
  StudioPlatform,
  StudioWorkflowWorkspace,
  StudioWorkspaceData,
} from "@/data/studio";
import {
  DEFAULT_BRAND_TOKENS,
  STUDIO_COMPONENT_MANIFESTS,
  buildInitialStructuredContent,
  calculateExportReadiness,
  checkStudioEntitlement,
  duplicateStructuredComponent,
  generateMjmlFromStructuredContent,
  getAvailableComponentsForPack,
  inspectPackage,
  insertStructuredComponent,
  removeStructuredComponent,
  reorderStructuredComponent,
  reviewImages,
  reviewLinks,
  runContentQa,
  shouldConfirmMjmlRegeneration,
  shouldConfirmWorkflowSwitch,
  validateBrandTokens,
  type StudioBrandTokens,
  type StudioDiagnostic,
  type StudioEditorMode,
  type StudioPackId,
  type StudioSourceOrigin,
  type StudioStructuredComponentId,
  type StudioStructuredContent,
} from "@/lib/studio/v2";
import { buildStudioExportFiles } from "@/lib/studio/exportMetadata";
import { createStudioZip, downloadStudioBlob } from "@/lib/studio/zip";
import type { CompileState, InlineEditableField, PreviewMode, StudioLocalSnapshot } from "../types";

const INLINE_FIELD_LABELS: Record<InlineEditableField, string> = {
  headline: "Headline",
  bodyCopy: "Body copy",
  ctaLabel: "CTA label",
  ctaUrl: "CTA URL",
  footerLegalLine: "Footer/legal line",
  supportEmail: "Support email",
};

type StoredStudioState = {
  sourceDrafts?: Record<string, string>;
  savedSources?: Record<string, string>;
  compiledHtml?: Record<string, string>;
  structuredContent?: Record<string, StudioStructuredContent>;
  savedStructuredContent?: Record<string, StudioStructuredContent>;
  brandTokens?: StudioBrandTokens;
  selectedPack?: StudioPackId;
  editorMode?: StudioEditorMode;
  sourceOrigins?: Record<string, StudioSourceOrigin>;
  qa?: Record<string, Record<string, StudioQaState | boolean>>;
  selectedWorkflowSlug?: string;
  platforms?: Record<string, StudioPlatform>;
  lastSavedAt?: Record<string, string>;
  lastCompiledAt?: Record<string, string>;
  exportStatus?: Record<string, string>;
  revisions?: Record<string, number>;
  snapshots?: StudioLocalSnapshot[];
};

type QaPersistenceOverrides = {
  nextLastCompiledAt?: Record<string, string>;
  nextExportStatus?: Record<string, string>;
  nextStructured?: Record<string, StudioStructuredContent>;
};

export const STUDIO_STORAGE_KEY = "template-hedgehog-studio:v1";
export const QA_GROUPS: StudioQaGroup[] = ["Compile", "Content", "Responsive", "Accessibility basics", "Platform boundary", "Handoff"];

export type StudioSourceDriftState = {
  sourceMatchesStructured: boolean;
  sourceOutOfSync: boolean;
  reason?: string;
};

export function getStudioSourceDrift({
  brandTokensDirty = false,
  source,
  generatedSource,
  sourceOrigin,
  structuredDirty,
}: {
  brandTokensDirty?: boolean;
  source: string;
  generatedSource: string;
  sourceOrigin: StudioSourceOrigin;
  structuredDirty: boolean;
}): StudioSourceDriftState {
  const sourceMatchesStructured = source === generatedSource;
  const shouldTrackStructuredSource =
    sourceOrigin !== "manual" && (structuredDirty || brandTokensDirty || sourceOrigin === "generated");
  const sourceOutOfSync = shouldTrackStructuredSource && !sourceMatchesStructured;

  return {
    sourceMatchesStructured,
    sourceOutOfSync,
    reason: sourceOutOfSync
      ? "Structured content or brand tokens have changed without regenerating the MJML source."
      : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normaliseStudioSnapshots(value: unknown): StudioLocalSnapshot[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((snapshot): snapshot is StudioLocalSnapshot => {
      if (!isRecord(snapshot)) return false;
      return (
        typeof snapshot.id === "string" &&
        typeof snapshot.name === "string" &&
        typeof snapshot.createdAt === "string" &&
        typeof snapshot.workflowSlug === "string" &&
        typeof snapshot.source === "string" &&
        typeof snapshot.compiledHtml === "string" &&
        isRecord(snapshot.structuredContent) &&
        isRecord(snapshot.brandTokens) &&
        isRecord(snapshot.qaState) &&
        typeof snapshot.platform === "string" &&
        (snapshot.sourceOrigin === "library" || snapshot.sourceOrigin === "generated" || snapshot.sourceOrigin === "manual")
      );
    })
    .map((snapshot) => ({
      ...snapshot,
      version: snapshot.version ?? 1,
    }))
    .slice(0, 12);
}

export function buildStudioSourceDriftDiagnostics(drift: StudioSourceDriftState): StudioDiagnostic[] {
  if (!drift.sourceOutOfSync) return [];

  return [
    {
      key: "source-structured-drift",
      status: "fail",
      label: "Structured edits applied to source",
      explanation: drift.reason ?? "Structured content and MJML source are out of sync.",
      suggestedFix: "Apply structured content to source, then compile the current MJML before export.",
    },
  ];
}

function readStoredStudioState(): StoredStudioState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STUDIO_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredStudioState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredStudioState(update: StoredStudioState): boolean {
  if (typeof window === "undefined") return false;

  try {
    const previous = readStoredStudioState();
    window.localStorage.setItem(
      STUDIO_STORAGE_KEY,
      JSON.stringify({
        ...previous,
        ...update,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

function buildInitialRecord<T>(
  workflows: StudioWorkflowWorkspace[],
  stored: Record<string, T> | undefined,
  getDefault: (workflow: StudioWorkflowWorkspace) => T,
): Record<string, T> {
  return Object.fromEntries(
    workflows.map((workflow) => [
      workflow.slug,
      stored?.[workflow.slug] ?? getDefault(workflow),
    ]),
  );
}

function normaliseQaValue(value: StudioQaState | boolean | undefined, fallback: StudioQaState): StudioQaState {
  if (value === true) return "pass";
  if (value === false) return "unchecked";
  if (value === "pass" || value === "fail" || value === "unchecked") return value;
  return fallback;
}

function buildInitialQa(
  workflows: StudioWorkflowWorkspace[],
  stored?: Record<string, Record<string, StudioQaState | boolean>>,
) {
  return Object.fromEntries(
    workflows.map((workflow) => [
      workflow.slug,
      Object.fromEntries(
        workflow.qaItems.map((item) => [
          item.key,
          normaliseQaValue(stored?.[workflow.slug]?.[item.key], item.defaultState),
        ]),
      ),
    ]),
  );
}

function createCompileState(workflows: StudioWorkflowWorkspace[]): Record<string, CompileState> {
  return Object.fromEntries(
    workflows.map((workflow) => [
      workflow.slug,
      {
        status: "ready",
        message: `Precompiled HTML loaded from ${workflow.compiled.filename}.`,
        lastCompiledAt: undefined,
        sourceSnapshot: workflow.source.body,
      },
    ]),
  );
}

function buildInitialPlatform(workflows: StudioWorkflowWorkspace[], stored?: Record<string, StudioPlatform>) {
  return Object.fromEntries(
    workflows.map((workflow) => [
      workflow.slug,
      stored?.[workflow.slug] ?? workflow.recommendedPlatforms[0] ?? "Mailchimp",
    ]),
  ) as Record<string, StudioPlatform>;
}

function buildInitialNumberRecord(workflows: StudioWorkflowWorkspace[], stored?: Record<string, number>) {
  return Object.fromEntries(workflows.map((workflow) => [workflow.slug, stored?.[workflow.slug] ?? 1]));
}

function buildInitialStringRecord(workflows: StudioWorkflowWorkspace[], stored?: Record<string, string>) {
  return Object.fromEntries(workflows.map((workflow) => [workflow.slug, stored?.[workflow.slug] ?? ""]));
}

function buildInitialSourceOriginRecord(
  workflows: StudioWorkflowWorkspace[],
  stored?: Record<string, StudioSourceOrigin>,
) {
  return Object.fromEntries(
    workflows.map((workflow) => [workflow.slug, stored?.[workflow.slug] ?? "library"]),
  ) as Record<string, StudioSourceOrigin>;
}

function buildInitialStructuredRecord(
  workflows: StudioWorkflowWorkspace[],
  stored?: Record<string, StudioStructuredContent>,
) {
  const defaults = buildInitialStructuredContent(workflows);
  return Object.fromEntries(
    workflows.map((workflow) => [workflow.slug, stored?.[workflow.slug] ?? defaults[workflow.slug]]),
  ) as Record<string, StudioStructuredContent>;
}

function buildInitialBrandTokens(stored?: StudioBrandTokens): StudioBrandTokens {
  return {
    ...DEFAULT_BRAND_TOKENS,
    ...(stored ?? {}),
  };
}

function structuredContentEquals(left: StudioStructuredContent, right: StudioStructuredContent): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function brandTokensEqual(left: StudioBrandTokens, right: StudioBrandTokens): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function calculateQaProgress(workflow: StudioWorkflowWorkspace, qaState: Record<string, StudioQaState>) {
  const total = workflow.qaItems.length;
  const passed = workflow.qaItems.filter((item) => qaState[item.key] === "pass").length;
  const failed = workflow.qaItems.filter((item) => qaState[item.key] === "fail").length;
  const completion = total > 0 ? Math.round((passed / total) * 100) : 0;

  return { total, passed, failed, completion };
}

function formatDateTime(value?: string) {
  if (!value) return "Not yet";

  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function useStudioWorkspaceState(data: StudioWorkspaceData) {
  const storedState = useMemo(() => ({} as StoredStudioState), []);
  const [storageMessage, setStorageMessage] = useState("");
  const [selectedWorkflowSlug, setSelectedWorkflowSlug] = useState(
    storedState.selectedWorkflowSlug ?? data.initialWorkflowSlug,
  );
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [platforms, setPlatforms] = useState(() => buildInitialPlatform(data.workflows, storedState.platforms));
  const [sourceDrafts, setSourceDrafts] = useState(() =>
    buildInitialRecord(data.workflows, storedState.sourceDrafts, (workflow) => workflow.source.body),
  );
  const [savedSources, setSavedSources] = useState(() =>
    buildInitialRecord(data.workflows, storedState.savedSources, (workflow) => workflow.source.body),
  );
  const [structuredDrafts, setStructuredDrafts] = useState(() =>
    buildInitialStructuredRecord(data.workflows, storedState.structuredContent),
  );
  const [savedStructuredDrafts, setSavedStructuredDrafts] = useState(() =>
    buildInitialStructuredRecord(data.workflows, storedState.savedStructuredContent),
  );
  const [brandTokens, setBrandTokens] = useState(() => buildInitialBrandTokens(storedState.brandTokens));
  const [selectedPack, setSelectedPack] = useState<StudioPackId>(storedState.selectedPack ?? "team");
  const [editorMode, setEditorMode] = useState<StudioEditorMode>(storedState.editorMode ?? "structured");
  const [sourceOrigins, setSourceOrigins] = useState(() =>
    buildInitialSourceOriginRecord(data.workflows, storedState.sourceOrigins),
  );
  const [selectedComponentId, setSelectedComponentId] = useState<StudioStructuredComponentId>("image-block");
  const [compiledHtml, setCompiledHtml] = useState(() =>
    buildInitialRecord(data.workflows, storedState.compiledHtml, (workflow) => workflow.compiled.body),
  );
  const [compileStates, setCompileStates] = useState(() => createCompileState(data.workflows));
  const [qaStates, setQaStates] = useState(() => buildInitialQa(data.workflows, storedState.qa));
  const [lastSavedAt, setLastSavedAt] = useState(() => buildInitialStringRecord(data.workflows, storedState.lastSavedAt));
  const [lastCompiledAt, setLastCompiledAt] = useState(() =>
    buildInitialStringRecord(data.workflows, storedState.lastCompiledAt),
  );
  const [exportStatus, setExportStatus] = useState(() => buildInitialStringRecord(data.workflows, storedState.exportStatus));
  const [revisions, setRevisions] = useState(() => buildInitialNumberRecord(data.workflows, storedState.revisions));
  const [snapshots, setSnapshots] = useState<StudioLocalSnapshot[]>(() => normaliseStudioSnapshots(storedState.snapshots));
  const [exportMessage, setExportMessage] = useState("");
  const [structuredMessage, setStructuredMessage] = useState("");
  const [inlineField, setInlineField] = useState<InlineEditableField | null>(null);
  const [inlineDraft, setInlineDraft] = useState("");
  const [copied, setCopied] = useState<"source" | "html" | "preview" | "handoff" | null>(null);

  useEffect(() => {
    const stored = readStoredStudioState();
    if (!Object.keys(stored).length) return;

    setSelectedWorkflowSlug(stored.selectedWorkflowSlug ?? data.initialWorkflowSlug);
    setSourceDrafts(buildInitialRecord(data.workflows, stored.sourceDrafts, (workflow) => workflow.source.body));
    setSavedSources(buildInitialRecord(data.workflows, stored.savedSources, (workflow) => workflow.source.body));
    setStructuredDrafts(buildInitialStructuredRecord(data.workflows, stored.structuredContent));
    setSavedStructuredDrafts(buildInitialStructuredRecord(data.workflows, stored.savedStructuredContent));
    setBrandTokens(buildInitialBrandTokens(stored.brandTokens));
    setSelectedPack(stored.selectedPack ?? "team");
    setEditorMode(stored.editorMode ?? "structured");
    setSourceOrigins(buildInitialSourceOriginRecord(data.workflows, stored.sourceOrigins));
    setCompiledHtml(buildInitialRecord(data.workflows, stored.compiledHtml, (workflow) => workflow.compiled.body));
    setQaStates(buildInitialQa(data.workflows, stored.qa));
    setPlatforms(buildInitialPlatform(data.workflows, stored.platforms));
    setLastSavedAt(buildInitialStringRecord(data.workflows, stored.lastSavedAt));
    setLastCompiledAt(buildInitialStringRecord(data.workflows, stored.lastCompiledAt));
    setExportStatus(buildInitialStringRecord(data.workflows, stored.exportStatus));
    setRevisions(buildInitialNumberRecord(data.workflows, stored.revisions));
    setSnapshots(normaliseStudioSnapshots(stored.snapshots));
  }, [data.initialWorkflowSlug, data.workflows]);

  const selectedWorkflow = useMemo(
    () =>
      data.workflows.find((item) => item.slug === selectedWorkflowSlug) ??
      data.workflows[0],
    [data.workflows, selectedWorkflowSlug],
  );

  const selectedGuidance = useMemo(
    () =>
      data.platformGuidance.find((item) => item.platform === platforms[selectedWorkflow.slug]) ??
      data.platformGuidance[0],
    [data.platformGuidance, platforms, selectedWorkflow.slug],
  );

  const selectedSource = sourceDrafts[selectedWorkflow.slug] ?? selectedWorkflow.source.body;
  const selectedSavedSource = savedSources[selectedWorkflow.slug] ?? selectedWorkflow.source.body;
  const selectedStructuredContent = structuredDrafts[selectedWorkflow.slug];
  const selectedSavedStructuredContent = savedStructuredDrafts[selectedWorkflow.slug];
  const selectedCompiledHtml = compiledHtml[selectedWorkflow.slug] ?? selectedWorkflow.compiled.body;
  const selectedSourceOrigin = sourceOrigins[selectedWorkflow.slug] ?? "library";
  const selectedCompileState = compileStates[selectedWorkflow.slug] ?? {
    status: "ready",
    message: "Ready to compile.",
  };
  const selectedQaState = qaStates[selectedWorkflow.slug] ?? {};
  const selectedPlatform = platforms[selectedWorkflow.slug] ?? selectedWorkflow.recommendedPlatforms[0] ?? "Mailchimp";
  const isDirty = selectedSource !== selectedSavedSource;
  const sourceStats = {
    lines: selectedSource ? selectedSource.split(/\r\n|\r|\n/).length : 0,
    characters: selectedSource.length,
  };
  const selectedRevision = revisions[selectedWorkflow.slug] ?? 1;
  const qaProgress = calculateQaProgress(selectedWorkflow, selectedQaState);
  const compileMatchesSource =
    selectedCompileState.status === "success" && selectedCompileState.sourceSnapshot === selectedSource;
  const structuredDirty = !structuredContentEquals(selectedStructuredContent, selectedSavedStructuredContent);
  const brandTokensDirty = !brandTokensEqual(brandTokens, DEFAULT_BRAND_TOKENS);
  const generatedOverwriteNeedsConfirmation = shouldConfirmMjmlRegeneration(selectedSourceOrigin, isDirty);
  const availableComponents = getAvailableComponentsForPack(selectedPack);
  const brandChecks = validateBrandTokens(brandTokens);
  const generatedSourceFromStructured = generateMjmlFromStructuredContent(selectedStructuredContent, brandTokens);
  const { sourceOutOfSync } = getStudioSourceDrift({
    brandTokensDirty,
    source: selectedSource,
    generatedSource: generatedSourceFromStructured,
    sourceOrigin: selectedSourceOrigin,
    structuredDirty,
  });
  const contentChecks = [
    ...runContentQa(selectedStructuredContent, brandTokens),
    ...buildStudioSourceDriftDiagnostics({
      sourceMatchesStructured: selectedSource === generatedSourceFromStructured,
      sourceOutOfSync,
      reason: sourceOutOfSync
        ? "Structured content or brand tokens have changed without regenerating the MJML source."
        : undefined,
    }),
  ];
  const linkReview = reviewLinks(selectedStructuredContent, selectedCompiledHtml);
  const imageReview = reviewImages(selectedStructuredContent, selectedCompiledHtml);
  const previewExportPackage = buildStudioExportFiles({
    workflow: selectedWorkflow,
    platform: selectedPlatform,
    guidance: selectedGuidance,
    source: selectedSource,
    html: selectedCompiledHtml,
    qaState: selectedQaState,
    compileState: selectedCompileState,
    revision: selectedRevision,
    sourceOrigin: selectedSourceOrigin,
    structuredContent: selectedStructuredContent,
    savedStructuredContent: selectedSavedStructuredContent,
    brandTokens,
  });
  const packageInspection = inspectPackage(
    previewExportPackage.files,
    exportStatus[selectedWorkflow.slug] || lastCompiledAt[selectedWorkflow.slug] || "",
  );
  const readiness = calculateExportReadiness({
    compileStatus: selectedCompileState.status,
    manualQaState: selectedQaState,
    contentChecks,
    linkReview,
    imageReview,
    packageInspection,
    selectedPlatform,
  });
  const workflowEntitled = checkStudioEntitlement(selectedPack, "workflow", selectedWorkflow.slug);
  const exportReady = readiness.status === "pass" && Boolean(exportStatus[selectedWorkflow.slug]);

  function getWorkflowStatus(workflow: StudioWorkflowWorkspace) {
    const source = sourceDrafts[workflow.slug] ?? workflow.source.body;
    const saved = savedSources[workflow.slug] ?? workflow.source.body;
    if (exportStatus[workflow.slug]) return "exported";
    if (source !== saved) return "edited";
    if ((compileStates[workflow.slug]?.status ?? "ready") === "error") return "needs review";
    return "ready";
  }

  function persist(update: StoredStudioState) {
    const stored = writeStoredStudioState(update);
    if (!stored) {
      setStorageMessage("Local browser storage is unavailable. Changes remain in memory for this session only.");
    } else if (storageMessage) {
      setStorageMessage("");
    }
    return stored;
  }

  function persistSelection(slug: string) {
    persist({ selectedWorkflowSlug: slug });
  }

  function persistSources({
    nextDrafts = sourceDrafts,
    nextSaved = savedSources,
    nextStructured = structuredDrafts,
    nextSavedStructured = savedStructuredDrafts,
    nextBrandTokens = brandTokens,
    nextSelectedPack = selectedPack,
    nextEditorMode = editorMode,
    nextSourceOrigins = sourceOrigins,
    nextCompiled = compiledHtml,
    nextQa = qaStates,
    nextPlatforms = platforms,
    nextLastSavedAt = lastSavedAt,
    nextLastCompiledAt = lastCompiledAt,
    nextExportStatus = exportStatus,
    nextRevisions = revisions,
    nextSnapshots = snapshots,
  }: {
    nextDrafts?: Record<string, string>;
    nextSaved?: Record<string, string>;
    nextStructured?: Record<string, StudioStructuredContent>;
    nextSavedStructured?: Record<string, StudioStructuredContent>;
    nextBrandTokens?: StudioBrandTokens;
    nextSelectedPack?: StudioPackId;
    nextEditorMode?: StudioEditorMode;
    nextSourceOrigins?: Record<string, StudioSourceOrigin>;
    nextCompiled?: Record<string, string>;
    nextQa?: Record<string, Record<string, StudioQaState>>;
    nextPlatforms?: Record<string, StudioPlatform>;
    nextLastSavedAt?: Record<string, string>;
    nextLastCompiledAt?: Record<string, string>;
    nextExportStatus?: Record<string, string>;
    nextRevisions?: Record<string, number>;
    nextSnapshots?: StudioLocalSnapshot[];
  } = {}) {
    persist({
      sourceDrafts: nextDrafts,
      savedSources: nextSaved,
      structuredContent: nextStructured,
      savedStructuredContent: nextSavedStructured,
      brandTokens: nextBrandTokens,
      selectedPack: nextSelectedPack,
      editorMode: nextEditorMode,
      sourceOrigins: nextSourceOrigins,
      compiledHtml: nextCompiled,
      qa: nextQa,
      platforms: nextPlatforms,
      lastSavedAt: nextLastSavedAt,
      lastCompiledAt: nextLastCompiledAt,
      exportStatus: nextExportStatus,
      revisions: nextRevisions,
      snapshots: nextSnapshots,
      selectedWorkflowSlug,
    });
  }

  function selectWorkflow(slug: string, force = false) {
    if (slug === selectedWorkflow.slug) return;
    if (!force && shouldConfirmWorkflowSwitch(isDirty, structuredDirty) && typeof window !== "undefined") {
      const proceed = window.confirm("This workflow has unsaved local edits. Switch workflow anyway?");
      if (!proceed) return;
    }
    setSelectedWorkflowSlug(slug);
    setPreviewMode("desktop");
    setExportMessage("");
    setCopied(null);
    setInlineField(null);
    setInlineDraft("");
    persistSelection(slug);
  }

  function updateQa(key: string, value: StudioQaState) {
    setQaStates((previous) => {
      const next = {
        ...previous,
        [selectedWorkflow.slug]: {
          ...(previous[selectedWorkflow.slug] ?? {}),
          [key]: value,
        },
      };
      persistSources({ nextQa: next });
      return next;
    });
  }

  function setQaValues(
    values: Record<string, StudioQaState>,
    persistenceOverrides: QaPersistenceOverrides = {},
  ) {
    setQaStates((previous) => {
      const next = {
        ...previous,
        [selectedWorkflow.slug]: {
          ...(previous[selectedWorkflow.slug] ?? {}),
          ...values,
        },
      };
      persistSources({ nextQa: next, ...persistenceOverrides });
      return next;
    });
  }

  function updateSource(
    value: string,
    origin: StudioSourceOrigin = "manual",
    persistenceOverrides: QaPersistenceOverrides = {},
  ) {
    const nextSourceOrigins = { ...sourceOrigins, [selectedWorkflow.slug]: origin };
    const nextLastCompiledAt = { ...lastCompiledAt, [selectedWorkflow.slug]: "" };
    const nextExportStatus = { ...exportStatus, [selectedWorkflow.slug]: "" };

    setSourceOrigins(nextSourceOrigins);
    setLastCompiledAt(nextLastCompiledAt);
    setExportStatus(nextExportStatus);
    setSourceDrafts((previous) => {
      const next = { ...previous, [selectedWorkflow.slug]: value };
      persistSources({ nextDrafts: next, nextSourceOrigins, nextLastCompiledAt, nextExportStatus, ...persistenceOverrides });
      return next;
    });
    setCompileStates((previous) => ({
      ...previous,
      [selectedWorkflow.slug]: {
        status: "ready",
        message: "Source changed. Compile the current MJML to refresh preview and export readiness.",
        sourceSnapshot: value,
      },
    }));
    setQaValues({
      compiled: "unchecked",
      "html-generated": "unchecked",
      "no-compile-errors": "unchecked",
      "preview-generated": "unchecked",
      "handoff-ready": "unchecked",
    }, { nextLastCompiledAt, nextExportStatus, ...persistenceOverrides });
    setExportMessage("");
  }

  function saveSource() {
    const savedAt = new Date().toISOString();
    setSavedSources((previous) => {
      const next = { ...previous, [selectedWorkflow.slug]: selectedSource };
      const nextSavedAt = { ...lastSavedAt, [selectedWorkflow.slug]: savedAt };
      const nextRevisions = { ...revisions, [selectedWorkflow.slug]: selectedRevision + 1 };
      setLastSavedAt(nextSavedAt);
      setRevisions(nextRevisions);
      persistSources({ nextSaved: next, nextLastSavedAt: nextSavedAt, nextRevisions });
      return next;
    });
    setCompileStates((previous) => ({
      ...previous,
      [selectedWorkflow.slug]: {
        status: "ready",
        message: "Source saved locally in this browser.",
        sourceSnapshot: selectedSource,
      },
    }));
  }

  function resetSource(force = false) {
    if (!force && isDirty && typeof window !== "undefined") {
      const proceed = window.confirm("Reset this workflow to the original archive source?");
      if (!proceed) return;
    }

    const baseSource = selectedWorkflow.source.body;
    const baseHtml = selectedWorkflow.compiled.body;
    const baseStructured = buildInitialStructuredRecord([selectedWorkflow])[selectedWorkflow.slug];
    const resetAt = new Date().toISOString();
    const resetQa = Object.fromEntries(
      selectedWorkflow.qaItems.map((item) => [item.key, item.defaultState]),
    ) as Record<string, StudioQaState>;

    setSourceDrafts((previous) => {
      const next = { ...previous, [selectedWorkflow.slug]: baseSource };
      setSavedSources((savedPrevious) => {
        const savedNext = { ...savedPrevious, [selectedWorkflow.slug]: baseSource };
        setCompiledHtml((compiledPrevious) => {
          const compiledNext = { ...compiledPrevious, [selectedWorkflow.slug]: baseHtml };
          const nextLastSavedAt = { ...lastSavedAt, [selectedWorkflow.slug]: resetAt };
          const nextLastCompiledAt = { ...lastCompiledAt, [selectedWorkflow.slug]: "" };
          const nextExportStatus = { ...exportStatus, [selectedWorkflow.slug]: "" };
          const nextQaStates = { ...qaStates, [selectedWorkflow.slug]: resetQa };
          const nextRevisions = { ...revisions, [selectedWorkflow.slug]: selectedRevision + 1 };
          const nextStructured = { ...structuredDrafts, [selectedWorkflow.slug]: baseStructured };
          const nextSavedStructured = { ...savedStructuredDrafts, [selectedWorkflow.slug]: baseStructured };
          const nextSourceOrigins = { ...sourceOrigins, [selectedWorkflow.slug]: "library" as StudioSourceOrigin };
          setLastSavedAt(nextLastSavedAt);
          setLastCompiledAt(nextLastCompiledAt);
          setExportStatus(nextExportStatus);
          setQaStates(nextQaStates);
          setRevisions(nextRevisions);
          setStructuredDrafts(nextStructured);
          setSavedStructuredDrafts(nextSavedStructured);
          setSourceOrigins(nextSourceOrigins);
          persistSources({
            nextDrafts: next,
            nextSaved: savedNext,
            nextStructured,
            nextSavedStructured,
            nextSourceOrigins,
            nextCompiled: compiledNext,
            nextQa: nextQaStates,
            nextLastSavedAt,
            nextLastCompiledAt,
            nextExportStatus,
            nextRevisions,
          });
          return compiledNext;
        });
        return savedNext;
      });
      return next;
    });
    setCompileStates((previous) => ({
      ...previous,
      [selectedWorkflow.slug]: {
        status: "ready",
        message: "Source reset to the library version.",
        sourceSnapshot: baseSource,
      },
    }));
    setExportMessage("");
  }

  function importPastedMjml() {
    if (typeof window === "undefined") return;
    const pasted = window.prompt("Paste MJML source for this workflow. Only text MJML under 200KB is accepted.");
    if (!pasted) return;
    if (pasted.length > 200_000) {
      setExportMessage("Import blocked. Paste MJML under 200KB.");
      return;
    }
    if (!/<mjml[\s>]/i.test(pasted)) {
      setExportMessage("Import blocked. Paste text that contains a valid <mjml> root.");
      return;
    }
    updateSource(pasted, "manual");
    setStructuredMessage("Pasted MJML imported as manual source. Compile before preview or export.");
  }

  function createSnapshot() {
    const name =
      typeof window !== "undefined"
        ? window.prompt("Name this local Studio snapshot", `${selectedWorkflow.workflow.name} snapshot`)
        : `${selectedWorkflow.workflow.name} snapshot`;
    const trimmedName = name?.trim();
    if (!trimmedName) return;

    const createdAt = new Date().toISOString();
    const snapshot: StudioLocalSnapshot = {
      version: 1,
      id: `${selectedWorkflow.slug}-${createdAt}`,
      name: trimmedName.slice(0, 80),
      createdAt,
      workflowSlug: selectedWorkflow.slug,
      source: selectedSource,
      compiledHtml: selectedCompiledHtml,
      structuredContent: selectedStructuredContent,
      brandTokens,
      qaState: selectedQaState,
      platform: selectedPlatform,
      sourceOrigin: selectedSourceOrigin,
      lastCompiledAt: lastCompiledAt[selectedWorkflow.slug],
      compileState: selectedCompileState,
    };
    const nextSnapshots = [snapshot, ...snapshots.filter((item) => item.id !== snapshot.id)].slice(0, 12);
    setSnapshots(nextSnapshots);
    persistSources({ nextSnapshots });
    setExportMessage(`Local snapshot saved: ${snapshot.name}.`);
  }

  function restoreSnapshot(snapshot: StudioLocalSnapshot, force = false) {
    const [normalisedSnapshot] = normaliseStudioSnapshots([snapshot]);
    if (!normalisedSnapshot) {
      setExportMessage("Snapshot restore blocked. This local snapshot uses an unsupported shape.");
      return;
    }

    if (!force && typeof window !== "undefined") {
      const proceed = window.confirm(`Restore local snapshot "${normalisedSnapshot.name}"? Current unsaved edits for this workflow may be overwritten.`);
      if (!proceed) return;
    }

    const workflowSlug = normalisedSnapshot.workflowSlug;
    const nextDrafts = { ...sourceDrafts, [workflowSlug]: normalisedSnapshot.source };
    const nextSaved = { ...savedSources, [workflowSlug]: normalisedSnapshot.source };
    const nextCompiled = { ...compiledHtml, [workflowSlug]: normalisedSnapshot.compiledHtml };
    const nextStructured = { ...structuredDrafts, [workflowSlug]: normalisedSnapshot.structuredContent as StudioStructuredContent };
    const nextSavedStructured = { ...savedStructuredDrafts, [workflowSlug]: normalisedSnapshot.structuredContent as StudioStructuredContent };
    const nextBrandTokens = normalisedSnapshot.brandTokens as StudioBrandTokens;
    const nextQa = { ...qaStates, [workflowSlug]: normalisedSnapshot.qaState as Record<string, StudioQaState> };
    const nextPlatforms = { ...platforms, [workflowSlug]: normalisedSnapshot.platform as StudioPlatform };
    const nextSourceOrigins = { ...sourceOrigins, [workflowSlug]: normalisedSnapshot.sourceOrigin };
    const nextLastCompiledAt = { ...lastCompiledAt, [workflowSlug]: normalisedSnapshot.lastCompiledAt ?? "" };
    const nextExportStatus = { ...exportStatus, [workflowSlug]: "" };
    setSelectedWorkflowSlug(workflowSlug);
    setSourceDrafts(nextDrafts);
    setSavedSources(nextSaved);
    setCompiledHtml(nextCompiled);
    setStructuredDrafts(nextStructured);
    setSavedStructuredDrafts(nextSavedStructured);
    setBrandTokens(nextBrandTokens);
    setQaStates(nextQa);
    setPlatforms(nextPlatforms);
    setSourceOrigins(nextSourceOrigins);
    setLastCompiledAt(nextLastCompiledAt);
    setExportStatus(nextExportStatus);
    setCompileStates((previous) => ({
      ...previous,
      [workflowSlug]: normalisedSnapshot.compileState ?? {
        status: "ready",
        message: "Snapshot restored. Compile before export readiness is recalculated.",
        sourceSnapshot: normalisedSnapshot.source,
      },
    }));
    persistSources({
      nextDrafts,
      nextSaved,
      nextCompiled,
      nextStructured,
      nextSavedStructured,
      nextBrandTokens,
      nextQa,
      nextPlatforms,
      nextSourceOrigins,
      nextLastCompiledAt,
      nextExportStatus,
    });
    persistSelection(workflowSlug);
    setExportMessage(`Restored local snapshot: ${normalisedSnapshot.name}.`);
  }

  function deleteSnapshot(snapshotId: string) {
    const snapshot = snapshots.find((item) => item.id === snapshotId);
    if (snapshot && typeof window !== "undefined") {
      const proceed = window.confirm(`Delete local snapshot "${snapshot.name}"?`);
      if (!proceed) return;
    }
    const nextSnapshots = snapshots.filter((item) => item.id !== snapshotId);
    setSnapshots(nextSnapshots);
    persistSources({ nextSnapshots });
    setExportMessage(snapshot ? `Deleted local snapshot: ${snapshot.name}.` : "Deleted local snapshot.");
  }

  async function compileSource() {
    const compileStartedAt = Date.now();
    setCompileStates((previous) => ({
      ...previous,
      [selectedWorkflow.slug]: {
        status: "compiling",
        message: "Compiling MJML locally...",
        sourceSnapshot: selectedSource,
      },
    }));

    try {
      const response = await fetch("/api/studio/local-compile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mjml: selectedSource }),
      });
      const payload = await response.json().catch(() => ({})) as { html?: string; error?: string };

      if (!response.ok || !payload.html) {
        throw new Error(payload.error ?? "Local compile failed.");
      }

      const compiledAt = new Date().toISOString();
      setCompiledHtml((previous) => {
        const next = { ...previous, [selectedWorkflow.slug]: payload.html ?? "" };
        const nextLastCompiledAt = { ...lastCompiledAt, [selectedWorkflow.slug]: compiledAt };
        setLastCompiledAt(nextLastCompiledAt);
        persistSources({ nextCompiled: next, nextLastCompiledAt });
        return next;
      });
      setCompileStates((previous) => ({
        ...previous,
        [selectedWorkflow.slug]: {
          status: "success",
          message: `Compile succeeded in ${Date.now() - compileStartedAt}ms. Preview updated from the edited source.`,
          lastCompiledAt: compiledAt,
          durationMs: Date.now() - compileStartedAt,
          sourceSnapshot: selectedSource,
        },
      }));
      setQaValues({
        compiled: "pass",
        "html-generated": "pass",
        "no-compile-errors": "pass",
        "preview-generated": "pass",
      });
      setExportMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Local compile failed.";
      setCompileStates((previous) => ({
        ...previous,
        [selectedWorkflow.slug]: {
          status: "error",
          message: `${message} Previous valid preview is still shown.`,
          lastFailedAt: new Date().toISOString(),
          durationMs: Date.now() - compileStartedAt,
          sourceSnapshot: selectedSource,
        },
      }));
      setQaValues({
        compiled: "fail",
        "html-generated": "fail",
        "no-compile-errors": "fail",
        "preview-generated": "unchecked",
        "handoff-ready": "unchecked",
      });
    }
  }

  async function copyText(kind: "source" | "html" | "preview" | "handoff", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  function copyPreviewHtml() {
    void copyText("preview", selectedCompiledHtml);
  }

  function updateEditorMode(nextMode: StudioEditorMode) {
    setEditorMode(nextMode);
    persistSources({ nextEditorMode: nextMode });
  }

  function updateSelectedPack(nextPack: StudioPackId) {
    setSelectedPack(nextPack);
    persistSources({ nextSelectedPack: nextPack });
  }

  function updateStructuredField<K extends keyof StudioStructuredContent>(
    key: K,
    value: StudioStructuredContent[K],
  ) {
    const nextExportStatus = { ...exportStatus, [selectedWorkflow.slug]: "" };
    setExportStatus(nextExportStatus);
    setStructuredDrafts((previous) => {
      const next = {
        ...previous,
        [selectedWorkflow.slug]: {
          ...selectedStructuredContent,
          [key]: value,
        },
      };
      persistSources({ nextStructured: next, nextExportStatus });
      return next;
    });
    setStructuredMessage("Structured edits are staged locally. Apply them to MJML when ready.");
    setExportMessage("");
  }

  function applyStructuredContent(nextContent: StudioStructuredContent, message: string, regenerateSource = false) {
    const nextStructured = {
      ...structuredDrafts,
      [selectedWorkflow.slug]: nextContent,
    };
    setStructuredDrafts((previous) => {
      const next = {
        ...previous,
        [selectedWorkflow.slug]: nextContent,
      };
      persistSources({ nextStructured: next });
      return next;
    });
    if (regenerateSource) {
      updateSource(generateMjmlFromStructuredContent(nextContent, brandTokens), "generated", { nextStructured });
    }
    setStructuredMessage(message);
    setExportMessage("");
  }

  function resetStructuredField<K extends keyof StudioStructuredContent>(key: K) {
    updateStructuredField(key, selectedSavedStructuredContent[key]);
    setStructuredMessage(`${String(key)} reset to the saved structured value.`);
  }

  function resetAllStructuredFields() {
    setStructuredDrafts((previous) => {
      const next = {
        ...previous,
        [selectedWorkflow.slug]: selectedSavedStructuredContent,
      };
      persistSources({ nextStructured: next });
      return next;
    });
    setStructuredMessage("All structured fields reset to the saved local version.");
  }

  function selectInlineField(field: InlineEditableField) {
    setInlineField(field);
    setInlineDraft(String(selectedStructuredContent[field] ?? ""));
  }

  function applyInlineEdit() {
    if (!inlineField) return;
    updateStructuredField(inlineField, inlineDraft as never);
    setStructuredMessage(`${INLINE_FIELD_LABELS[inlineField] ?? inlineField} updated in structured content. Generate MJML to refresh source.`);
  }

  function updateSocialLink(index: number, key: "label" | "url", value: string) {
    const socialLinks = selectedStructuredContent.socialLinks.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    updateStructuredField("socialLinks", socialLinks);
  }

  function updateBrandToken<K extends keyof StudioBrandTokens>(key: K, value: StudioBrandTokens[K]) {
    const next = { ...brandTokens, [key]: value };
    const nextExportStatus = { ...exportStatus, [selectedWorkflow.slug]: "" };
    setBrandTokens(next);
    setExportStatus(nextExportStatus);
    persistSources({ nextBrandTokens: next, nextExportStatus });
    setStructuredMessage("Brand tokens saved locally. Apply structured content to regenerate MJML.");
  }

  function saveStructuredContent() {
    const nextSaved = {
      ...savedStructuredDrafts,
      [selectedWorkflow.slug]: selectedStructuredContent,
    };
    setSavedStructuredDrafts(nextSaved);
    persistSources({ nextSavedStructured: nextSaved });
    setStructuredMessage("Structured content saved locally in this browser.");
  }

  function applyStructuredToMjml() {
    if (generatedOverwriteNeedsConfirmation && typeof window !== "undefined") {
      const proceed = window.confirm("Generate MJML will replace unsaved manual source edits for this workflow. Continue?");
      if (!proceed) return;
    }

    const generated = generateMjmlFromStructuredContent(selectedStructuredContent, brandTokens);
    const changedFields = Object.keys(selectedStructuredContent).filter((key) => {
      if (key === "components" || key === "socialLinks" || key === "version" || key === "workflowId") return false;
      const field = key as keyof StudioStructuredContent;
      return JSON.stringify(selectedStructuredContent[field]) !== JSON.stringify(selectedSavedStructuredContent[field]);
    });
    updateSource(generated, "generated");
    setStructuredMessage(
      `Structured content generated MJML. ${changedFields.length ? `Changed tokens: ${changedFields.join(", ")}.` : "No changed tokens."} Compile to refresh the preview.`,
    );
  }

  function insertSelectedComponent() {
    const nextComponent = insertStructuredComponent(selectedStructuredContent.components, selectedComponentId);
    const nextContent = {
      ...selectedStructuredContent,
      components: [...selectedStructuredContent.components, nextComponent],
    };
    applyStructuredContent(
      nextContent,
      `${nextComponent.componentId} inserted. Structure edits regenerated the MJML source locally. Review source before export.`,
      true,
    );
  }

  function applyComponentMutation(result: ReturnType<typeof duplicateStructuredComponent>) {
    if (!result.changed) {
      setStructuredMessage(result.message);
      return;
    }

    applyStructuredContent(
      { ...selectedStructuredContent, components: result.components },
      `${result.message} Structure edits regenerated the MJML source locally. Review source before export.`,
      true,
    );
  }

  function duplicateComponent(instanceId: string) {
    applyComponentMutation(duplicateStructuredComponent(selectedStructuredContent.components, instanceId));
  }

  function reorderComponent(instanceId: string, direction: "up" | "down") {
    applyComponentMutation(reorderStructuredComponent(selectedStructuredContent.components, instanceId, direction));
  }

  function removeComponent(instanceId: string) {
    const component = selectedStructuredContent.components.find((item) => item.instanceId === instanceId);
    const manifest = component
      ? STUDIO_COMPONENT_MANIFESTS.find((item) => item.id === component.componentId)
      : undefined;

    if (typeof window !== "undefined") {
      const proceed = window.confirm(`Remove ${manifest?.name ?? component?.componentId ?? "this component"} from the structured model?`);
      if (!proceed) return;
    }

    applyComponentMutation(removeStructuredComponent(selectedStructuredContent.components, instanceId));
  }

  function updateComponentField(instanceId: string, field: string, value: string) {
    const nextComponents = selectedStructuredContent.components.map((component) =>
      component.instanceId === instanceId
        ? {
            ...component,
            fields: {
              ...component.fields,
              [field]: value,
            },
          }
        : component,
    );
    applyStructuredContent(
      { ...selectedStructuredContent, components: nextComponents },
      "Component field updated. Structure edits regenerated the MJML source locally. Review source before export.",
      true,
    );
  }

  function resetStructure() {
    const baseStructured = buildInitialStructuredRecord([selectedWorkflow])[selectedWorkflow.slug];
    applyStructuredContent(
      { ...selectedStructuredContent, components: baseStructured.components },
      "Section structure reset to the original workflow. MJML source regenerated locally.",
      true,
    );
  }

  function setSelectedPlatform(platform: StudioPlatform) {
    setPlatforms((previous) => {
      const next = { ...previous, [selectedWorkflow.slug]: platform };
      persistSources({ nextPlatforms: next });
      return next;
    });
    setQaValues({ "platform-selected": "pass" });
  }

  function markPreviewChecked(mode: PreviewMode) {
    setPreviewMode(mode);
    setQaValues({
      [mode === "mobile" ? "mobile-preview" : "desktop-preview"]: "pass",
    });
  }

  function openPreviewInNewTab() {
    if (typeof window === "undefined" || !selectedCompiledHtml.trim()) return;

    const blob = new Blob([selectedCompiledHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  function exportPackage(forceWarning = false) {
    if (!selectedCompiledHtml.trim()) {
      setExportMessage("Export failed. Compile the MJML source before preparing a handoff package.");
      return;
    }

    if (selectedCompileState.status !== "success" || !compileMatchesSource) {
      setExportMessage("Export blocked. Compile the current MJML source successfully before packaging.");
      setQaValues({ "handoff-ready": "fail" });
      return;
    }

    if (sourceOutOfSync) {
      setExportMessage("Export blocked. Apply structured or brand token changes to the MJML source, then compile before packaging.");
      setQaValues({ "handoff-ready": "fail" });
      return;
    }

    if (readiness.status === "fail") {
      setExportMessage(`Export blocked. ${readiness.recommendedNextAction}`);
      setQaValues({ "handoff-ready": "fail" });
      return;
    }

    if (!forceWarning && readiness.status === "warn" && typeof window !== "undefined") {
      const proceed = window.confirm(`Export has warnings. ${readiness.recommendedNextAction} Continue with manual handoff package?`);
      if (!proceed) {
        setExportMessage("Export paused. Resolve warnings or confirm warning-state export.");
        return;
      }
    }

    if (packageInspection.some((item) => item.status === "fail")) {
      setExportMessage("Export blocked. Package inspector found a missing or empty critical file.");
      setQaValues({ "handoff-ready": "fail" });
      return;
    }

    const exportQaState = {
      ...selectedQaState,
      "implementation-guide": "pass",
      "platform-selected": "pass",
      "handoff-ready": "pass",
    } as Record<string, StudioQaState>;
    const exportPackageData = buildStudioExportFiles({
      workflow: selectedWorkflow,
      platform: selectedPlatform,
      guidance: selectedGuidance,
      source: selectedSource,
      html: selectedCompiledHtml,
      qaState: exportQaState,
      compileState: selectedCompileState,
      revision: selectedRevision,
      readiness,
      sourceOrigin: selectedSourceOrigin,
      structuredContent: selectedStructuredContent,
      savedStructuredContent: selectedSavedStructuredContent,
      brandTokens,
    });

    try {
      const zip = createStudioZip(exportPackageData.files);
      const exportedAt = new Date().toISOString();
      const nextExportStatus = { ...exportStatus, [selectedWorkflow.slug]: exportedAt };

      downloadStudioBlob(zip, exportPackageData.zipFileName);
      setExportStatus(nextExportStatus);
      persistSources({ nextExportStatus });
      setQaValues(exportQaState);
      setExportMessage(`Export package downloaded for ${selectedWorkflow.workflow.name}.`);
    } catch {
      setExportMessage("Export failed. Browser ZIP generation was not available for this session.");
      setQaValues({ "handoff-ready": "fail" });
    }
  }


  return {
    state: {
      brandTokens,
      copied,
      editorMode,
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
      selectedRevision,
      selectedSavedStructuredContent,
      selectedSource,
      selectedSourceOrigin,
      selectedStructuredContent,
      selectedWorkflow,
      sourceStats,
      sourceOutOfSync,
      structuredDirty,
      workflowEntitled,
    },
    actions: {
      applyInlineEdit,
      applyStructuredToMjml,
      clearInlineField: () => setInlineField(null),
      compileSource,
      copyPreviewHtml,
      copyText,
      createSnapshot,
      deleteSnapshot,
      duplicateComponent,
      exportPackage,
      importPastedMjml,
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
      updateEditorMode,
      updateQa,
      updateSelectedPack,
      updateSocialLink,
      updateSource,
      updateStructuredField,
    },
  };
}
