import { Camera, RotateCcw, Trash2 } from "lucide-react";
import type { StudioLocalSnapshot } from "../types";
import { SectionHeading } from "./studioControls";

export function LocalStatePanel({
  formatDateTime,
  onCreateSnapshot,
  onDeleteSnapshot,
  onRestoreSnapshot,
  snapshots,
  workflowSlug,
}: {
  formatDateTime: (value?: string) => string;
  onCreateSnapshot: () => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  onRestoreSnapshot: (snapshot: StudioLocalSnapshot) => void;
  snapshots: StudioLocalSnapshot[];
  workflowSlug: string;
}) {
  const workflowSnapshots = snapshots.filter((snapshot) => snapshot.workflowSlug === workflowSlug);

  return (
    <section className="space-y-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading>Local snapshots</SectionHeading>
        <button
          type="button"
          onClick={onCreateSnapshot}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-[0.72rem] font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
        >
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          Save snapshot
        </button>
      </div>
      <p className="text-[0.74rem] leading-5 text-slate-400">
        Snapshots are stored in this browser only. They capture source, tokens, QA, platform, structure, and compile metadata.
      </p>
      {workflowSnapshots.length ? (
        <ul className="grid gap-2">
          {workflowSnapshots.map((snapshot) => (
            <li key={snapshot.id} className="rounded-lg border border-white/10 bg-[#071421] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[0.78rem] font-semibold text-slate-100">{snapshot.name}</p>
                  <p className="mt-1 text-[0.68rem] text-slate-500">{formatDateTime(snapshot.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => onRestoreSnapshot(snapshot)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                    aria-label={`Restore ${snapshot.name}`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSnapshot(snapshot.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-300/25 bg-red-950/20 text-red-100 hover:bg-red-950/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                    aria-label={`Delete ${snapshot.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-white/10 bg-[#071421] p-3 text-[0.74rem] leading-5 text-slate-400">
          No local snapshots for this workflow yet.
        </p>
      )}
    </section>
  );
}
