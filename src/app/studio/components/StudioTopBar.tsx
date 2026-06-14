import { MailCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function StudioTopBar({
  compileStatus,
  dirtyLabel,
  exportReady,
  nextAction,
  onNextAction,
  readinessLabel,
  workflowName,
}: {
  compileStatus: string;
  dirtyLabel: string;
  exportReady: boolean;
  nextAction: string;
  onNextAction: () => void;
  readinessLabel: string;
  workflowName: string;
}) {
  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#06111d]/95 px-4 shadow-[0_1px_0_rgba(255,255,255,0.04)] sm:px-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Sparkles className="h-6 w-6 shrink-0 text-[#a855f7]" aria-hidden="true" />
          <h1 className="truncate text-[1rem] font-semibold text-white">
            Template Hedgehog <span className="text-[#c084fc]">Studio</span> <span className="text-slate-300">- Private Alpha</span>
          </h1>
        </div>
        <div className="hidden h-7 w-px bg-white/15 sm:block" />
        <div className="hidden min-w-0 md:block">
          <p className="truncate text-[0.86rem] font-semibold text-slate-100">{workflowName}</p>
          <p className="text-[0.72rem] text-slate-400">Everything before send</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        <StatusPill label="Save" value={dirtyLabel} />
        <StatusPill label="Compile" value={compileStatus} />
        <StatusPill label="Readiness" value={readinessLabel} active={exportReady} />
        <button
          type="button"
          onClick={onNextAction}
          className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[0.76rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
            exportReady
              ? "border-[#6ee7b7]/50 bg-[#10b981] text-[#03130d]"
              : "border-[#8b5cf6]/60 bg-[#7c3aed] text-white"
          }`}
        >
          <MailCheck className="h-4 w-4" aria-hidden="true" />
          {nextAction}
        </button>
      </div>
    </header>
  );
}

function StatusPill({
  active = false,
  label,
  value,
}: {
  active?: boolean;
  label: string;
  value: ReactNode;
}) {
  return (
    <span className={`hidden rounded-lg border px-2.5 py-1.5 text-[0.7rem] leading-4 sm:block ${
      active ? "border-[#6ee7b7]/35 bg-[#052116] text-[#bbf7d0]" : "border-white/10 bg-white/[0.04] text-slate-300"
    }`}>
      <span className="text-slate-500">{label}</span>
      <span className="ml-1 font-semibold">{value}</span>
    </span>
  );
}
