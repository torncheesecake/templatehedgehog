"use client";

import { useMemo, useState } from "react";

interface ChecklistItem {
  title: string;
  owner: string;
  done: boolean;
}

interface LaunchChecklistProps {
  initialItems: ChecklistItem[];
}

export function LaunchChecklist({ initialItems }: LaunchChecklistProps) {
  const [items, setItems] = useState(initialItems);

  const completion = useMemo(() => {
    const completed = items.filter((item) => item.done).length;
    return Math.round((completed / items.length) * 100);
  }, [items]);

  function toggle(index: number) {
    setItems((current) =>
      current.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item)),
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Launch checklist</h2>
          <p className="mt-1 text-sm text-slate-500">Operational readiness before go-live</p>
        </div>
        <p className="text-xl font-semibold text-rose-600">{completion}%</p>
      </div>

      <div className="mt-3 h-2.5 rounded-full bg-white">
        <div className="h-full rounded-full bg-gradient-to-r from-(--accent-primary) to-(--accent-primary)" style={{ width: `${completion}%` }} />
      </div>

      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <button
            key={`${item.title}-${item.owner}`}
            type="button"
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left"
            aria-pressed={item.done}
          >
            <div>
              <p className={`font-medium ${item.done ? "text-rose-600 line-through" : "text-slate-900"}`}>{item.title}</p>
              <p className="text-sm text-slate-500">Owner: {item.owner}</p>
            </div>
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm ${
                item.done
                  ? "border-rose-600 bg-slate-100 text-rose-600"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {item.done ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
