import { Copy, FileCode2 } from "lucide-react";
import type { StudioSourceOrigin } from "@/lib/studio/v2";
import type { SourceStats } from "../types";
import { sourceOriginLabel } from "../types";

export function SourceEditorPanel({
  copied,
  isDirty,
  onCopySource,
  onUpdateSource,
  selectedSource,
  selectedSourceOrigin,
  sourceStats,
}: {
  copied: "source" | "html" | "preview" | "handoff" | null;
  isDirty: boolean;
  onCopySource: () => void;
  onUpdateSource: (value: string) => void;
  selectedSource: string;
  selectedSourceOrigin: StudioSourceOrigin;
  sourceStats: SourceStats;
}) {
  return (
    <article className={`min-h-[620px] overflow-hidden rounded-lg border bg-[#071421] shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${isDirty ? "border-amber-300/35" : "border-white/10"}`}>
      <header className="sticky top-0 z-10 flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0a1726]/95 px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 shrink-0 text-[#c084fc]" aria-hidden="true" />
            <h3 className="truncate text-[0.88rem] font-semibold text-slate-100">MJML Source</h3>
          </div>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {sourceOriginLabel[selectedSourceOrigin]} · {isDirty ? "Dirty" : "Saved"} · {sourceStats.lines} lines
          </p>
        </div>
        <button
          type="button"
          onClick={onCopySource}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-[0.72rem] font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          {copied === "source" ? "Copied" : "Copy source"}
        </button>
      </header>
      <textarea
        aria-label="Editable MJML source"
        value={selectedSource}
        onChange={(event) => onUpdateSource(event.target.value)}
        placeholder="<mjml>Write or paste source MJML here</mjml>"
        spellCheck={false}
        className="h-[560px] w-full resize-y overflow-auto bg-[#050b14] p-5 font-mono text-[0.86rem] leading-7 text-slate-100 outline-none selection:bg-[#7c3aed]/45 focus:ring-2 focus:ring-inset focus:ring-[#7dd3fc] sm:text-[0.9rem]"
      />
    </article>
  );
}
