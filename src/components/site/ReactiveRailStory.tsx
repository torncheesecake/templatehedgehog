"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OperationalRail } from "@/components/site/OperationalRail";

interface StoryStep {
  label: string;
  detail: string;
  heading: string;
  body: string;
}

interface ReactiveRailStoryProps {
  steps: StoryStep[];
}

export function ReactiveRailStory({ steps }: ReactiveRailStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index ?? 0);
        if (!Number.isNaN(index)) setActiveIndex(index);
      },
      { threshold: [0.45, 0.65, 0.85], rootMargin: "-10% 0px -25% 0px" },
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [steps.length]);

  const progressLabel = useMemo(
    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`,
    [activeIndex, steps.length],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <aside className="lg:sticky lg:top-[7.2rem] lg:self-start">
        <p className="mb-4 text-[0.8rem] text-[var(--th-text-muted)]">Progress {progressLabel}</p>
        <OperationalRail
          steps={steps.map(({ label, detail }) => ({ label, detail }))}
          activeIndex={activeIndex}
        />
      </aside>

      <div className="space-y-14">
        {steps.map((step, index) => (
          <div
            key={step.label}
            data-index={index}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={`min-h-[56vh] border-l pl-6 transition ${
              activeIndex === index ? "border-[var(--action-primary)]" : "border-[var(--th-border-dark)]"
            }`}
          >
            <p className="text-[0.8rem] text-[var(--th-text-muted)]">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-[1.85rem] font-semibold leading-tight text-[var(--text-primary)]">{step.heading}</h3>
            <p className="mt-4 max-w-xl text-[1rem] leading-8 text-[var(--text-secondary)]">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
