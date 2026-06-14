import { Code2, Copy } from "lucide-react";

export function CompiledHtmlPanel({
  compileMatchesSource,
  copied,
  onCopyHtml,
  selectedCompiledHtml,
}: {
  compileMatchesSource: boolean;
  copied: "source" | "html" | "preview" | "handoff" | null;
  onCopyHtml: () => void;
  selectedCompiledHtml: string;
}) {
  return (
    <article className="min-h-[620px] overflow-hidden rounded-lg border border-white/10 bg-[#071421] shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <header className="sticky top-0 z-10 flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0a1726]/95 px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 shrink-0 text-[#93c5fd]" aria-hidden="true" />
            <h3 className="truncate text-[0.88rem] font-semibold text-slate-100">Compiled HTML</h3>
          </div>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {selectedCompiledHtml ? `${selectedCompiledHtml.split(/\r\n|\r|\n/).length} lines` : "Empty"} · {compileMatchesSource ? "Matches source" : "Needs compile"}
          </p>
        </div>
        <button
          type="button"
          onClick={onCopyHtml}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-[0.72rem] font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          {copied === "html" ? "Copied" : "Copy HTML"}
        </button>
      </header>
      {selectedCompiledHtml.trim() ? (
        <pre className="h-[560px] overflow-auto whitespace-pre-wrap break-words bg-[#050b14] p-5 font-mono text-[0.84rem] leading-7 text-slate-100 selection:bg-[#2563eb]/45 sm:text-[0.88rem]">
          <code>{selectedCompiledHtml}</code>
        </pre>
      ) : (
        <div className="flex h-[560px] items-center justify-center bg-[#050b14] p-6 text-center text-[0.84rem] leading-6 text-slate-400">
          Compile MJML to create HTML output.
        </div>
      )}
    </article>
  );
}
