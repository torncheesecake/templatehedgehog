"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

const modules = [
  { id: "overview", label: "Executive overview", detail: "Top-line KPIs and trend pulse" },
  { id: "customers", label: "Customer intelligence", detail: "Health, ARR, and lifecycle signals" },
  { id: "billing", label: "Billing operations", detail: "Invoices, plans, and payment states" },
  { id: "reports", label: "Board reporting", detail: "Weekly narrative and funnel summaries" },
  { id: "team", label: "Team permissions", detail: "Role controls and access matrix" },
  { id: "onboarding", label: "Launch onboarding", detail: "Checklist and activation milestones" },
] as const;

const defaultSelection = ["overview", "customers", "billing"];

function toInitialState() {
  return modules.reduce<Record<string, boolean>>((acc, module) => {
    acc[module.id] = defaultSelection.includes(module.id);
    return acc;
  }, {});
}

export function BuildDashboardPreview() {
  const [selected, setSelected] = useState<Record<string, boolean>>(toInitialState);

  const selectedModules = useMemo(() => modules.filter((module) => selected[module.id]), [selected]);

  function toggleModule(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function selectAll() {
    setSelected(
      modules.reduce<Record<string, boolean>>((acc, module) => {
        acc[module.id] = true;
        return acc;
      }, {}),
    );
  }

  function resetSelection() {
    setSelected(toInitialState());
  }

  return (
    <section className="rounded-[1.6rem] bg-white/90 p-5 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-rose-600">Interactive preview</p>
          <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight text-white sm:text-[2.15rem]">
            Build your dashboard view
          </h3>
          <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-slate-500">
            Toggle modules to show buyers how flexible the layout is across teams and workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 text-[0.9rem] font-semibold text-slate-500 transition hover:border-slate-300"
          >
            Select all modules
          </button>
          <button
            type="button"
            onClick={resetSelection}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-[0.9rem] font-semibold text-slate-500 transition hover:border-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset view
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-2.5">
          {modules.map((module) => {
            const active = selected[module.id];
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => toggleModule(module.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-rose-600 bg-slate-100 text-slate-900"
                    : "border-slate-200 bg-white text-slate-500 hover:border-rose-600"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[1rem] font-semibold">{module.label}</span>
                    <span className="mt-1 block text-[0.92rem] text-slate-500">{module.detail}</span>
                  </span>
                  {active ? (
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-slate-900">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedModules.length > 0 ? (
              selectedModules.map((module) => (
                <div key={module.id} className="rounded-lg bg-white px-3 py-2.5">
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-rose-600">Active module</p>
                  <p className="mt-1 text-[1rem] font-semibold text-slate-900">{module.label}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 rounded-lg bg-white px-4 py-4 text-[0.95rem] text-slate-500">
                No modules selected. Turn on at least one module to preview a buyer-specific dashboard setup.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-rose-600">Current package summary</p>
            <p className="mt-2 text-[1rem] text-slate-500">
              {selectedModules.length} module{selectedModules.length === 1 ? "" : "s"} selected for this dashboard configuration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
