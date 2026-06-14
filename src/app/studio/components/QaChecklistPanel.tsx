import { AlertTriangle, Check, XCircle } from "lucide-react";
import type { StudioQaGroup, StudioQaState, StudioWorkflowWorkspace } from "@/data/studio";
import type { StudioReadinessScore } from "@/lib/studio/v2";
import { getStatusTone, SectionHeading } from "./studioControls";

type ReviewStatus = "pass" | "warn" | "fail";

type ContentCheck = {
  key: string;
  label: string;
  status: ReviewStatus;
  explanation: string;
  suggestedFix?: string;
};

type LinkReviewItem = {
  context: string;
  explanation: string;
  label?: string;
  source: string;
  status: ReviewStatus;
  value: string;
};

type PackageInspectionItem = {
  explanation: string;
  generatedAt: string;
  included: boolean;
  path: string;
  status: ReviewStatus;
};

export function QaChecklistPanel({
  brandChecks,
  contentChecks,
  formatDateTime,
  imageReview,
  linkReview,
  onResetQa,
  onUpdateQa,
  packageInspection,
  qaGroups,
  qaProgress,
  qaState,
  readiness,
  workflow,
}: {
  brandChecks: ContentCheck[];
  contentChecks: ContentCheck[];
  formatDateTime: (value?: string) => string;
  imageReview: LinkReviewItem[];
  linkReview: LinkReviewItem[];
  onResetQa: () => void;
  onUpdateQa: (key: string, value: StudioQaState) => void;
  packageInspection: PackageInspectionItem[];
  qaGroups: StudioQaGroup[];
  qaProgress: { total: number; passed: number; completion: number };
  qaState: Record<string, StudioQaState>;
  readiness: StudioReadinessScore;
  workflow: StudioWorkflowWorkspace;
}) {
  return (
    <>
      <section className={`space-y-3 rounded-lg border p-4 ${getStatusTone(readiness.status)}`}>
        <SectionHeading>Export readiness</SectionHeading>
        <p className="text-[2rem] font-semibold leading-none text-white">{readiness.percentage}%</p>
        <p className="text-[0.76rem] leading-5">{readiness.recommendedNextAction}</p>
        {readiness.blockingIssues.length ? (
          <ul className="grid gap-1 text-[0.72rem] leading-5">
            {readiness.blockingIssues.slice(0, 4).map((issue) => (
              <li key={issue}>Blocker: {issue}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <SectionHeading>QA checklist</SectionHeading>
          <span className="rounded-md border border-[#6ee7b7]/25 bg-[#6ee7b7]/12 px-2 py-1 text-[0.7rem] font-semibold text-[#bbf7d0]">
            {qaProgress.passed} / {qaProgress.total} passed · {qaProgress.completion}%
          </span>
        </div>
        <button
          type="button"
          onClick={onResetQa}
          className="text-[0.72rem] font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
        >
          Reset QA
        </button>
        <div className="space-y-4">
          {qaGroups.map((group) => {
            const items = workflow.qaItems.filter((item) => item.group === group);
            if (!items.length) return null;
            const passed = items.filter((item) => qaState[item.key] === "pass").length;

            return (
              <section key={group} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[0.78rem] font-semibold text-white">{group}</h3>
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.66rem] font-semibold text-slate-300">
                    {passed} / {items.length} manual checks
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => items.forEach((item) => onUpdateQa(item.key, "pass"))}
                    className="rounded-md border border-[#6ee7b7]/35 bg-[#052116] px-2 py-1 text-[0.68rem] font-semibold text-[#bbf7d0] transition hover:bg-[#06351f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                  >
                    Mark group complete
                  </button>
                  <button
                    type="button"
                    onClick={() => items.forEach((item) => onUpdateQa(item.key, "unchecked"))}
                    className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[0.68rem] font-semibold text-slate-400 transition hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                  >
                    Reset group
                  </button>
                </div>
                <ul className="mt-3 space-y-3">
                  {items.map((item) => {
                    const state = qaState[item.key] ?? "unchecked";

                    return (
                      <li key={item.key} className="space-y-2">
                        <div className="flex items-center gap-2 text-[0.78rem] text-slate-200">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                            {state === "pass" ? (
                              <Check className="h-3.5 w-3.5 text-[#6ee7b7]" aria-hidden="true" />
                            ) : state === "fail" ? (
                              <XCircle className="h-3.5 w-3.5 text-red-200" aria-hidden="true" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
                            )}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {(["unchecked", "pass", "fail"] as StudioQaState[]).map((option) => (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={state === option}
                              onClick={() => onUpdateQa(item.key, option)}
                              className={`rounded-md border px-2 py-1 text-[0.68rem] font-semibold capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
                                state === option
                                  ? option === "pass"
                                    ? "border-[#6ee7b7]/45 bg-[#052116] text-[#bbf7d0]"
                                    : option === "fail"
                                      ? "border-red-300/45 bg-red-950/35 text-red-100"
                                      : "border-amber-300/40 bg-amber-950/30 text-amber-100"
                                  : "border-white/10 bg-white/[0.025] text-slate-400 hover:bg-white/[0.06]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      <details className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <summary className="cursor-pointer text-[0.78rem] font-semibold text-slate-100">Diagnostics</summary>
        <div className="mt-4 space-y-4">
          <section className="space-y-3">
            <SectionHeading>Content QA</SectionHeading>
            <div className="grid gap-2">
              {[...brandChecks, ...contentChecks].map((check) => (
                <div key={check.key} className={`rounded-lg border p-3 text-[0.72rem] leading-5 ${getStatusTone(check.status)}`}>
                  <p className="font-semibold">{check.label}</p>
                  <p className="mt-1">{check.explanation}</p>
                  {check.status !== "pass" ? <p className="mt-1">Fix: {check.suggestedFix}</p> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeading>Link review</SectionHeading>
            <div className="grid gap-2">
              {linkReview.slice(0, 6).map((item, index) => (
                <div key={`${item.source}-${item.context}-${item.value}-${index}`} className={`rounded-lg border p-3 text-[0.72rem] leading-5 ${getStatusTone(item.status)}`}>
                  <p className="font-semibold">{item.context}</p>
                  <p className="mt-1 break-all">{item.label ? `${item.label}: ` : ""}{item.value || "Missing"}</p>
                  <p className="mt-1">{item.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeading>Image review</SectionHeading>
            <div className="grid gap-2">
              {imageReview.length ? imageReview.slice(0, 5).map((item, index) => (
                <div key={`${item.source}-${item.context}-${item.value}-${index}`} className={`rounded-lg border p-3 text-[0.72rem] leading-5 ${getStatusTone(item.status)}`}>
                  <p className="font-semibold">{item.context}</p>
                  <p className="mt-1 break-all">Source: {item.value || "Missing"}</p>
                  <p className="mt-1">Alt: {item.label || "Missing"}</p>
                </div>
              )) : (
                <div className="rounded-lg border border-amber-300/35 bg-amber-950/25 p-3 text-[0.72rem] leading-5 text-amber-100">
                  No structured images are set. Add an image only if this workflow needs one.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeading>Package inspector</SectionHeading>
            <div className="grid gap-2">
              {packageInspection.map((item) => (
                <div key={item.path} className={`rounded-lg border p-3 text-[0.72rem] leading-5 ${getStatusTone(item.status)}`}>
                  <p className="font-semibold">{item.path}</p>
                  <p className="mt-1">{item.included ? "Included" : "Missing"} · {item.explanation}</p>
                  <p className="mt-1">Generated: {formatDateTime(item.generatedAt)}</p>
                  <p className="mt-1">Preview/open: {item.path.endsWith(".html") ? "email preview" : "available after export"}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </details>
    </>
  );
}
