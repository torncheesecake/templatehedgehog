import { Check, Download, FileArchive } from "lucide-react";
import { SectionHeading } from "./studioControls";

export function ExportPanel({
  exportMessage,
  hasCompiledHtml,
  onExport,
}: {
  exportMessage: string;
  hasCompiledHtml: boolean;
  onExport: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading>Export package</SectionHeading>
        <FileArchive className="h-4 w-4 text-[#6ee7b7]" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={onExport}
        disabled={!hasCompiledHtml}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#6ee7b7]/35 bg-[#10b981] px-3 text-[0.8rem] font-semibold text-[#03130d] transition hover:bg-[#6ee7b7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download export zip
      </button>
      {exportMessage ? (
        <div className="rounded-lg border border-[#6ee7b7]/25 bg-[#052116] p-3">
          <p className="text-[0.84rem] font-semibold text-[#bbf7d0]">Studio status</p>
          <p className="mt-1 text-[0.75rem] leading-5 text-slate-300">{exportMessage}</p>
        </div>
      ) : null}
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
        <p className="text-[0.8rem] font-semibold text-white">Export includes</p>
        <ul className="mt-2 grid gap-1.5 text-[0.76rem] text-slate-300">
          {[
            "/mjml/source.mjml",
            "/html/compiled.html",
            "/docs/qa-notes.md",
            "/docs/implementation-guide.md",
            "/docs/workflow-notes.md",
            "/docs/platform-handoff.md",
            "/docs/change-summary.md",
            "/docs/readme.md",
            "metadata.json",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#6ee7b7]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
