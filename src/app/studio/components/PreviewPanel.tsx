import { AlertTriangle, CheckCircle2, Code2, Copy, ExternalLink, Laptop, Save, Smartphone } from "lucide-react";
import { HtmlPreviewFrame } from "@/components/ui/HtmlPreviewFrame";
import type { StudioWorkflowWorkspace } from "@/data/studio";
import type { StudioStructuredContent } from "@/lib/studio/v2";
import type { CompileState, InlineEditableField, PreviewMode } from "../types";
import { IconPanelButton } from "./studioControls";

export const inlineEditableFields: Array<{ field: InlineEditableField; label: string; multiline?: boolean }> = [
  { field: "headline", label: "Headline" },
  { field: "bodyCopy", label: "Body copy", multiline: true },
  { field: "ctaLabel", label: "CTA label" },
  { field: "ctaUrl", label: "CTA URL" },
  { field: "footerLegalLine", label: "Footer/legal line", multiline: true },
  { field: "supportEmail", label: "Support email" },
];

export function PreviewPanel({
  compileMatchesSource,
  compileTone,
  copied,
  formatDateTime,
  inlineDraft,
  inlineField,
  lastCompiledAt,
  onApplyInlineEdit,
  onClearInlineField,
  onCopyPreviewHtml,
  onOpenPreview,
  onSelectInlineField,
  onSetInlineDraft,
  onSetPreviewMode,
  previewMode,
  selectedCompileState,
  selectedCompiledHtml,
  selectedStructuredContent,
  selectedWorkflow,
}: {
  compileMatchesSource: boolean;
  compileTone: string;
  copied: "source" | "html" | "preview" | "handoff" | null;
  formatDateTime: (value?: string) => string;
  inlineDraft: string;
  inlineField: InlineEditableField | null;
  lastCompiledAt: string;
  onApplyInlineEdit: () => void;
  onClearInlineField: () => void;
  onCopyPreviewHtml: () => void;
  onOpenPreview: () => void;
  onSelectInlineField: (field: InlineEditableField) => void;
  onSetInlineDraft: (value: string) => void;
  onSetPreviewMode: (mode: PreviewMode) => void;
  previewMode: PreviewMode;
  selectedCompileState: CompileState;
  selectedCompiledHtml: string;
  selectedStructuredContent: StudioStructuredContent;
  selectedWorkflow: StudioWorkflowWorkspace;
}) {
  return (
    <div className="space-y-4 border-t border-white/10 p-4">
      <div className={`rounded-lg border p-3 text-[0.78rem] leading-5 ${compileTone}`}>
        <div className="flex items-start gap-2">
          {selectedCompileState.status === "error" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : selectedCompileState.status === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Code2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <p>{selectedCompileState.message}</p>
        </div>
        <dl className="mt-3 grid gap-1 text-[0.7rem] sm:grid-cols-3">
          <div>
            <dt className="font-semibold uppercase tracking-[0.12em] opacity-70">Last success</dt>
            <dd>{formatDateTime(selectedCompileState.lastCompiledAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-[0.12em] opacity-70">Last failure</dt>
            <dd>{formatDateTime(selectedCompileState.lastFailedAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-[0.12em] opacity-70">Duration</dt>
            <dd>{selectedCompileState.durationMs ? `${selectedCompileState.durationMs}ms` : "Not yet"}</dd>
          </div>
        </dl>
        {!compileMatchesSource ? (
          <p className="mt-2 rounded-md border border-amber-300/30 bg-amber-950/25 p-2 text-amber-100">
            Preview may be stale. Compile the current source before export.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[0.95rem] font-semibold text-white">Email preview</h2>
          <p className="mt-1 text-[0.76rem] text-slate-400">
            {compileMatchesSource
              ? `Preview refreshed ${formatDateTime(lastCompiledAt || selectedCompileState.lastCompiledAt)}.`
              : "Compile the current source to refresh the preview."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IconPanelButton onClick={onCopyPreviewHtml}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copied === "preview" ? "Copied" : "Copy compiled HTML"}
          </IconPanelButton>
          <IconPanelButton onClick={onOpenPreview} disabled={!selectedCompiledHtml.trim()}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open preview
          </IconPanelButton>
          <IconPanelButton active={previewMode === "desktop"} onClick={() => onSetPreviewMode("desktop")}>
            <Laptop className="h-4 w-4" aria-hidden="true" />
            Desktop 980px
          </IconPanelButton>
          <IconPanelButton active={previewMode === "mobile"} onClick={() => onSetPreviewMode("mobile")}>
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Mobile 430px
          </IconPanelButton>
        </div>
      </div>
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[0.9rem] font-semibold text-white">Inline preview editing</h3>
            <p className="mt-1 text-[0.74rem] leading-5 text-slate-400">
              Safe preview regions update structured fields only. Generate MJML to apply them to source.
            </p>
          </div>
          {inlineField ? (
            <span className="rounded-md border border-[#8b5cf6]/35 bg-[#21113c] px-2.5 py-1 text-[0.72rem] font-semibold text-[#ddd6fe]">
              Mapped field: {inlineEditableFields.find((item) => item.field === inlineField)?.label}
            </span>
          ) : null}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {inlineEditableFields.map((item) => {
            const value = String(selectedStructuredContent[item.field] ?? "");
            const active = inlineField === item.field;

            return (
              <button
                key={item.field}
                type="button"
                onClick={() => onSelectInlineField(item.field)}
                className={`min-h-24 rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
                  active
                    ? "border-[#8b5cf6]/70 bg-[#21113c] shadow-[0_0_0_1px_rgba(139,92,246,0.5)]"
                    : "border-white/10 bg-[#06101c] hover:border-white/20 hover:bg-white/[0.055]"
                }`}
              >
                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-slate-500">
                  {item.label}
                </span>
                <span className={`mt-2 block text-[0.84rem] leading-5 ${active ? "text-white" : "text-slate-200"}`}>
                  {value.trim() || "Empty"}
                </span>
              </button>
            );
          })}
        </div>
        {inlineField ? (
          <div className="mt-4 rounded-lg border border-[#8b5cf6]/30 bg-[#120b24] p-3">
            <label className="grid gap-2">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#c4b5fd]">
                Edit {inlineEditableFields.find((item) => item.field === inlineField)?.label}
              </span>
              {inlineEditableFields.find((item) => item.field === inlineField)?.multiline ? (
                <textarea
                  value={inlineDraft}
                  onChange={(event) => onSetInlineDraft(event.target.value)}
                  className="min-h-28 resize-y rounded-lg border border-white/10 bg-[#06101c] p-3 text-[0.84rem] leading-6 text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
                />
              ) : (
                <input
                  value={inlineDraft}
                  onChange={(event) => onSetInlineDraft(event.target.value)}
                  className="h-11 rounded-lg border border-white/10 bg-[#06101c] px-3 text-[0.84rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
                />
              )}
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <IconPanelButton onClick={onApplyInlineEdit}>
                <Save className="h-4 w-4" aria-hidden="true" />
                Apply to structured content
              </IconPanelButton>
              <IconPanelButton onClick={onClearInlineField}>
                Clear selection
              </IconPanelButton>
            </div>
          </div>
        ) : null}
      </section>
      <div
        className={`mx-auto transition-all ${
          previewMode === "mobile" ? "max-w-[430px]" : "max-w-[980px]"
        }`}
      >
        <HtmlPreviewFrame
          html={selectedCompiledHtml}
          title={`${selectedWorkflow.workflow.name} preview`}
          variant={previewMode === "mobile" ? "compact" : "default"}
          className="studio-preview"
        />
      </div>
    </div>
  );
}
