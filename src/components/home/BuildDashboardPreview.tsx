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
    <section className="rounded-[1.6rem] bg-(--hedgehog-core-navy)/90 p-5 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-primary)">Interactive preview</p>
          <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight text-white sm:text-[2.15rem]">
            Build your dashboard view
          </h3>
          <p className="mt-3 max-w-[54ch] text-[1rem] leading-7 text-(--dune-muted)">
            Toggle modules to show buyers how flexible the layout is across teams and workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex h-10 items-center rounded-full border border-(--hedgehog-core-blue-deep) px-4 text-[0.9rem] font-semibold text-(--dune-muted) transition hover:border-(--dune-muted)"
          >
            Select all modules
          </button>
          <button
            type="button"
            onClick={resetSelection}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-(--hedgehog-core-blue-deep) px-4 text-[0.9rem] font-semibold text-(--dune-muted) transition hover:border-(--dune-muted)"
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
                    ? "border-(--accent-primary) bg-(--hedgehog-core-blue-deep) text-(--text-primary-dark)"
                    : "border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) text-(--dune-muted) hover:border-(--accent-primary)"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[1rem] font-semibold">{module.label}</span>
                    <span className="mt-1 block text-[0.92rem] text-(--dune-muted)">{module.detail}</span>
                  </span>
                  {active ? (
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--accent-primary) text-(--text-primary-dark)">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-(--hedgehog-core-navy) p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedModules.length > 0 ? (
              selectedModules.map((module) => (
                <div key={module.id} className="rounded-lg bg-(--hedgehog-core-navy) px-3 py-2.5">
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--accent-primary)">Active module</p>
                  <p className="mt-1 text-[1rem] font-semibold text-(--text-primary-dark)">{module.label}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 rounded-lg bg-(--hedgehog-core-navy) px-4 py-4 text-[0.95rem] text-(--dune-muted)">
                No modules selected. Turn on at least one module to preview a buyer-specific dashboard setup.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-4 py-3">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--accent-primary)">Current package summary</p>
            <p className="mt-2 text-[1rem] text-(--dune-muted)">
              {selectedModules.length} module{selectedModules.length === 1 ? "" : "s"} selected for this dashboard configuration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
