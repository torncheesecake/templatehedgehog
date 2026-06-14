import { Workflow } from "lucide-react";
import type { StudioWorkflowWorkspace, StudioWorkspaceData } from "@/data/studio";
import { SectionHeading } from "./studioControls";

const readinessTone = {
  ready: "bg-[#6ee7b7]",
  "needs review": "bg-amber-300",
  passed: "bg-[#6ee7b7]",
  exported: "bg-indigo-300",
};

export function WorkflowRail({
  data,
  selectedWorkflow,
  onSelectWorkflow,
  getWorkflowStatus,
}: {
  data: StudioWorkspaceData;
  selectedWorkflow: StudioWorkflowWorkspace;
  onSelectWorkflow: (slug: string) => void;
  getWorkflowStatus: (workflow: StudioWorkflowWorkspace) => string;
}) {
  return (
    <aside className="border-b border-white/10 bg-[#06111d] lg:border-b-0 lg:border-r">
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <SectionHeading>Workflows</SectionHeading>
        </div>
        <nav aria-label="Studio workflows">
          <ul className="space-y-2">
            {data.workflows.map((workflow) => {
              const active = workflow.slug === selectedWorkflow.slug;
              const status = getWorkflowStatus(workflow) as keyof typeof readinessTone;

              return (
                <li key={workflow.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelectWorkflow(workflow.slug)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
                      active
                        ? "border-[#8b5cf6]/60 bg-[#21113c] text-white"
                        : "border-white/10 bg-white/[0.025] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${readinessTone[status] ?? "bg-slate-500"}`} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[0.82rem] font-semibold">{workflow.workflow.name}</span>
                      <span className="mt-1 block text-[0.7rem] text-slate-400">{workflow.category}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
