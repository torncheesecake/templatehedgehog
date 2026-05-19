import { cn } from "@/lib/utils";

interface OperationalRailProps {
  steps: Array<{ label: string; detail: string }>;
  orientation?: "vertical" | "horizontal";
  className?: string;
  activeIndex?: number;
}

export function OperationalRail({
  steps,
  orientation = "vertical",
  className,
  activeIndex = 0,
}: OperationalRailProps) {
  if (orientation === "horizontal") {
    return (
      <ol className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
        {steps.map((step, index) => (
          (() => {
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex;
            return (
          <li
            key={step.label}
            className={cn(
              "min-w-[16rem] snap-start rounded-[0.9rem] border border-[var(--border-subtle)] px-4 py-4 transition",
              isActive
                ? "bg-[var(--bg-surface)]"
                : isComplete
                  ? "bg-[var(--bg-muted)]"
                  : "bg-[var(--bg-canvas)]",
            )}
          >
            <p className={cn("text-[0.78rem]", isActive || isComplete ? "text-[var(--th-text-secondary)]" : "text-[var(--th-text-muted)]")}>{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-2 text-[1rem] font-semibold text-[var(--text-primary)]">{step.label}</p>
            <p className="mt-2 text-[0.9rem] leading-7 text-[var(--th-text-secondary)]">{step.detail}</p>
          </li>
            );
          })()
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn("space-y-5", className)}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        return (
        <li key={step.label} className="relative pl-8 transition-opacity">
          <span className={cn("absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full transition", isActive || isComplete ? "bg-[var(--action-primary)]" : "bg-[var(--border-strong)]")} />
          {index < steps.length - 1 ? (
            <span className={cn("absolute left-[4px] top-5 h-[calc(100%+0.5rem)] w-px transition", isComplete ? "bg-[var(--action-primary)]/60" : "bg-[var(--border-subtle)]")} />
          ) : null}
          <p className={cn("text-[0.8rem] transition", isActive || isComplete ? "text-[var(--th-text-secondary)]" : "text-[var(--th-text-meta)]")}>{String(index + 1).padStart(2, "0")}</p>
          <p className="mt-1 text-[1.03rem] font-semibold text-[var(--text-primary)]">{step.label}</p>
          <p className="mt-1 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">{step.detail}</p>
        </li>
        );
      })}
    </ol>
  );
}
