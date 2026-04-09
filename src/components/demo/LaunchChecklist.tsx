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
    <section className="rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Launch checklist</h2>
          <p className="mt-1 text-sm text-(--dune-muted)">Operational readiness before go-live</p>
        </div>
        <p className="text-xl font-semibold text-(--accent-primary)">{completion}%</p>
      </div>

      <div className="mt-3 h-2.5 rounded-full bg-(--hedgehog-core-navy)">
        <div className="h-full rounded-full bg-gradient-to-r from-(--accent-primary) to-(--accent-primary)" style={{ width: `${completion}%` }} />
      </div>

      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <button
            key={`${item.title}-${item.owner}`}
            type="button"
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-left"
            aria-pressed={item.done}
          >
            <div>
              <p className={`font-medium ${item.done ? "text-(--accent-primary) line-through" : "text-(--surface-strong)"}`}>{item.title}</p>
              <p className="text-sm text-(--dune-muted)">Owner: {item.owner}</p>
            </div>
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm ${
                item.done
                  ? "border-(--accent-primary) bg-(--hedgehog-core-blue-deep) text-(--accent-primary)"
                  : "border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) text-(--dune-muted)"
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
