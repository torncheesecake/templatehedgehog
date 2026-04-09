"use client";

import Image from "next/image";
import { ArrowRight, Layers3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowStep = {
  label: string;
  detail: string;
};

interface WorkflowFlowDiagramProps {
  title?: string;
  subtitle?: string;
  steps: FlowStep[];
  className?: string;
}

export function WorkflowFlowDiagram({
  title = "Workflow diagram",
  subtitle = "Trigger to output",
  steps,
  className,
}: WorkflowFlowDiagramProps) {
  return (
    <article className={cn("rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 sm:p-6", className)}>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
        {title}
      </p>
      <h3 className="mt-2 text-[1.22rem] font-semibold leading-7 text-(--text-primary-dark)">
        {subtitle}
      </h3>

      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="rounded-[0.82rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--dune-deep) text-[0.78rem] font-semibold text-(--text-primary-dark)">
                {index + 1}
              </span>
              <div>
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                  {step.label}
                </p>
                <p className="mt-1 text-[0.88rem] leading-6 text-(--text-primary-dark)">
                  {step.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

interface MjmlHtmlSplitViewProps {
  mjml: string;
  html: string;
  title?: string;
  className?: string;
}

export function MjmlHtmlSplitView({
  mjml,
  html,
  title = "MJML to compiled HTML",
  className,
}: MjmlHtmlSplitViewProps) {
  return (
    <article className={cn("rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 sm:p-6", className)}>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
        {title}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">MJML source</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
            {mjml}
          </pre>
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Compiled HTML</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
            {html}
          </pre>
        </div>
      </div>
    </article>
  );
}

interface PackFileTreePreviewProps {
  lines: string[];
  title?: string;
  className?: string;
}

export function PackFileTreePreview({
  lines,
  title = "Pack file tree",
  className,
}: PackFileTreePreviewProps) {
  return (
    <article className={cn("rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 sm:p-6", className)}>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
        {title}
      </p>
      <pre className="mt-3 overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-4 text-[0.78rem] leading-6 text-(--text-primary-dark)">
        {lines.join("\n")}
      </pre>
    </article>
  );
}

interface WorkflowStackVisualProps {
  title?: string;
  description?: string;
  steps: string[];
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
}

export function WorkflowStackVisual({
  title = "Workflow stack breakdown",
  description = "Workflow, layout, and components map directly in the same system.",
  steps,
  imageUrl,
  imageAlt = "Workflow stack preview",
  className,
}: WorkflowStackVisualProps) {
  return (
    <article className={cn("rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 sm:p-6", className)}>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
        {title}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--surface-strong)">
          <Layers3 className="h-4 w-4 text-(--text-primary-dark)" />
        </span>
        <p className="text-[0.9rem] leading-7 text-(--th-body-copy)">
          {description}
        </p>
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
          <li key={step} className="rounded-[0.6rem] border border-(--surface-line) bg-(--surface-strong) px-3.5 py-2.5">
            {step}
          </li>
        ))}
      </ol>
    </article>
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
      <article className="rounded-[1rem] border border-(--surface-line) bg-(--surface-strong) p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-7">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--surface-soft)">
            <Layers3 className="h-4 w-4 text-(--th-body-copy)" />
          </span>
          <p className="text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">{leftTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {leftItems.map((item) => (
            <li key={`left-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-(--th-body-copy)">{item.label}</p>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Higher effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-(--th-body-copy)">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-(--surface-line)">
                <span className="block h-full rounded-full bg-[hsl(var(--th-accent-support)/0.38)]" style={{ width: `${item.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-[1rem] border border-(--surface-line) bg-(--hedgehog-core-navy) p-6 shadow-[0_24px_44px_rgba(0,0,0,0.38)] sm:p-7">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--surface-soft)">
            <Zap className="h-4 w-4 text-(--text-primary-dark)" />
          </span>
          <p className="text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">{rightTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {rightItems.map((item) => (
            <li key={`right-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-(--text-primary-dark)">{item.label}</p>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">Lower effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-(--dune-muted)">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-(--surface-line)">
                <span className="block h-full rounded-full bg-(--text-primary-dark)" style={{ width: `${item.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
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
