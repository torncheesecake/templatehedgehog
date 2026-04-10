"use client";

import Image from "next/image";
import { ArrowRight, FileCode2, GitBranchPlus, Layers3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualPanel } from "@/components/site/SectionPrimitives";

export type FlowStep = {
  label: string;
  detail: string;
};

interface WorkflowFlowDiagramProps {
  title?: string;
  subtitle?: string;
  steps: FlowStep[];
  className?: string;
  tone?: "dark" | "soft";
}

export function WorkflowFlowDiagram({
  title = "Workflow diagram",
  subtitle = "Trigger to output",
  steps,
  className,
  tone = "dark",
}: WorkflowFlowDiagramProps) {
  return (
    <VisualPanel tone={tone} className={className}>
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{title}</p>
      <h3 className="mt-2 text-[1.26rem] font-semibold leading-7 text-(--text-primary-dark)">{subtitle}</h3>

      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className="rounded-[0.86rem] border border-(--surface-line) bg-(--surface-strong) px-4 py-3.5"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--surface-soft) text-[0.78rem] font-semibold text-(--text-primary-dark)">
                {index + 1}
              </span>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-(--th-body-copy)">
                  {step.label}
                </p>
                <p className="mt-1 text-[0.9rem] leading-6 text-(--text-primary-dark)">{step.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </VisualPanel>
  );
}

interface MjmlHtmlSplitViewProps {
  mjml: string;
  html: string;
  title?: string;
  className?: string;
  tone?: "dark" | "soft";
}

export function MjmlHtmlSplitView({
  mjml,
  html,
  title = "MJML to compiled HTML",
  className,
  tone = "dark",
}: MjmlHtmlSplitViewProps) {
  return (
    <VisualPanel tone={tone} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
          <FileCode2 className="h-3.5 w-3.5" />
          Production pair
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">MJML source</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.78rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
            {mjml}
          </pre>
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Compiled HTML</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.78rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
            {html}
          </pre>
        </div>
      </div>
    </VisualPanel>
  );
}

interface PackFileTreePreviewProps {
  lines: string[];
  title?: string;
  className?: string;
  tone?: "dark" | "soft";
}

export function PackFileTreePreview({
  lines,
  title = "Pack file tree",
  className,
  tone = "dark",
}: PackFileTreePreviewProps) {
  return (
    <VisualPanel tone={tone} className={className}>
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{title}</p>
      <pre className="mt-3 overflow-x-auto rounded-[0.78rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.78rem] leading-6 text-(--text-primary-dark)">
        {lines.join("\n")}
      </pre>
    </VisualPanel>
  );
}

interface WorkflowStackVisualProps {
  title?: string;
  description?: string;
  steps: string[];
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  tone?: "dark" | "soft";
}

export function WorkflowStackVisual({
  title = "Workflow stack breakdown",
  description = "Workflow, layout, and components map directly in one implementation chain.",
  steps,
  imageUrl,
  imageAlt = "Workflow stack preview",
  className,
  tone = "dark",
}: WorkflowStackVisualProps) {
  return (
    <VisualPanel tone={tone} className={className}>
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{title}</p>
      <div className="mt-3 flex items-start gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--surface-strong)">
          <Layers3 className="h-4 w-4 text-(--text-primary-dark)" />
        </span>
        <p className="text-[0.9rem] leading-7 text-(--th-body-copy)">{description}</p>
      </div>

      {imageUrl ? (
        <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-[0.78rem] border border-(--surface-line) bg-(--bg-soft)">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1280px) 90vw, 32vw"
            className="object-cover object-top"
          />
        </div>
      ) : null}

      <ol className="mt-4 space-y-2.5 text-[0.82rem] leading-6 text-(--th-body-copy)">
        {steps.map((step) => (
          <li key={step} className="rounded-[0.64rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-2.5">
            {step}
          </li>
        ))}
      </ol>
    </VisualPanel>
  );
}

export type EffortItem = {
  label: string;
  note: string;
  value: number;
};

interface EffortComparisonVisualProps {
  leftTitle: string;
  rightTitle: string;
  leftItems: EffortItem[];
  rightItems: EffortItem[];
  className?: string;
}

export function EffortComparisonVisual({
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  className,
}: EffortComparisonVisualProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <VisualPanel className="border-[hsl(var(--th-accent-support)/0.14)] bg-(--surface-strong) shadow-[0_14px_28px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--surface-soft)">
            <Layers3 className="h-4 w-4 text-(--th-body-copy)" />
          </span>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{leftTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {leftItems.map((item) => (
            <li key={`left-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-(--th-body-copy)">{item.label}</p>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Higher effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-(--th-body-copy)">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-(--surface-line)">
                <span className="block h-full rounded-full bg-[hsl(var(--th-accent-support)/0.38)]" style={{ width: `${item.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </VisualPanel>

      <article className="relative overflow-hidden rounded-[1.08rem] border border-[hsl(var(--th-accent-support)/0.32)] bg-(--hedgehog-core-navy) p-6 shadow-[0_30px_56px_rgba(0,0,0,0.42)] ring-1 ring-[hsl(var(--th-accent-support)/0.2)] sm:p-7 lg:-translate-y-1">
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--surface-soft)">
            <Zap className="h-4 w-4 text-(--text-primary-dark)" />
          </span>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.09em] text-(--dune-muted)">{rightTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {rightItems.map((item) => (
            <li key={`right-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-(--text-primary-dark)">{item.label}</p>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--dune-muted)">Lower effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-(--dune-muted)">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-(--surface-line)">
                <span className="block h-full rounded-full bg-(--accent-primary)" style={{ width: `${item.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

interface SystemArchitectureVisualProps {
  title?: string;
  subtitle?: string;
  workflowLabel: string;
  layoutLabel: string;
  componentLabels: string[];
  outputLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  tone?: "dark" | "soft";
}

export function SystemArchitectureVisual({
  title = "System architecture",
  subtitle = "Workflow to output mapping",
  workflowLabel,
  layoutLabel,
  componentLabels,
  outputLabel = "Compiled HTML output",
  imageUrl,
  imageAlt = "System architecture preview",
  className,
  tone = "dark",
}: SystemArchitectureVisualProps) {
  return (
    <VisualPanel tone={tone} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">{title}</p>
          <h3 className="mt-1 text-[1.14rem] font-semibold leading-7 text-(--text-primary-dark)">{subtitle}</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
          <GitBranchPlus className="h-3.5 w-3.5" />
          Registry linked
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <ol className="space-y-2.5">
          <li className="rounded-[0.72rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-2.5 text-[0.84rem] font-semibold text-(--text-primary-dark)">
            workflow/{workflowLabel}
          </li>
          <li className="rounded-[0.72rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-2.5 text-[0.84rem] font-semibold text-(--text-primary-dark)">
            layout/{layoutLabel}
          </li>
          {componentLabels.map((label) => (
            <li key={label} className="rounded-[0.72rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-2.5 text-[0.84rem] text-(--th-body-copy)">
              component/{label}
            </li>
          ))}
          <li className="rounded-[0.72rem] border border-(--surface-line) bg-[hsl(var(--th-accent-support)/0.12)] px-3.5 py-2.5 text-[0.84rem] font-semibold text-(--text-primary-dark)">
            {outputLabel}
          </li>
        </ol>

        <div className="rounded-[0.78rem] border border-(--surface-line) bg-(--surface-strong) p-3">
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.62rem] border border-(--surface-line) bg-(--bg-soft)">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 1280px) 90vw, 24vw"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-[0.62rem] border border-dashed border-(--surface-line) text-[0.82rem] text-(--th-body-copy)">
              Layout preview
            </div>
          )}
          <p className="mt-3 text-[0.82rem] leading-6 text-(--th-body-copy)">
            Same mapping in docs, workflow pages, and downloadable pack files.
          </p>
        </div>
      </div>
    </VisualPanel>
  );
}

export function InlineArrowLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn("inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--th-body-copy) transition hover:text-(--text-primary-dark)", className)}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
