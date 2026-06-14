import type { StudioPlatform, StudioWorkflowWorkspace } from "@/data/studio";
import type { StudioReadinessScore } from "@/lib/studio/v2";
import type { CompileState } from "../types";
import { SectionHeading } from "./studioControls";

export function ProjectSummaryPanel({
  compileState,
  formatDateTime,
  isDirty,
  lastCompiledAt,
  lastSavedAt,
  platform,
  qaProgress,
  readiness,
  workflow,
}: {
  compileState: CompileState;
  formatDateTime: (value?: string) => string;
  isDirty: boolean;
  lastCompiledAt: string;
  lastSavedAt: string;
  platform: StudioPlatform;
  qaProgress: { completion: number };
  readiness: StudioReadinessScore;
  workflow: StudioWorkflowWorkspace;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <SectionHeading>Project summary</SectionHeading>
      <dl className="grid gap-2 text-[0.76rem] leading-5">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Workflow</dt>
          <dd className="text-right font-semibold text-slate-100">{workflow.workflow.name}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Platform</dt>
          <dd className="text-right text-slate-100">{platform}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Edit status</dt>
          <dd className={isDirty ? "text-amber-100" : "text-[#bbf7d0]"}>
            {isDirty ? "Unsaved edits" : "Saved locally"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Compile status</dt>
          <dd className={compileState.status === "error" ? "text-red-100" : "text-slate-100"}>
            {compileState.status}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">QA progress</dt>
          <dd className="text-slate-100">{qaProgress.completion}% manual</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Export readiness</dt>
          <dd className={readiness.status === "pass" ? "text-[#bbf7d0]" : readiness.status === "warn" ? "text-amber-100" : "text-red-100"}>
            {readiness.percentage}% · {readiness.status}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Last saved</dt>
          <dd className="text-right text-slate-100">{formatDateTime(lastSavedAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Last compiled</dt>
          <dd className="text-right text-slate-100">{formatDateTime(lastCompiledAt || compileState.lastCompiledAt)}</dd>
        </div>
      </dl>
    </section>
  );
}
