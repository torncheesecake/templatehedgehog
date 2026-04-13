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
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{title}</p>
      <h3 className="mt-2 text-[1.26rem] font-semibold leading-7 text-slate-900">{subtitle}</h3>

      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className="rounded-[0.86rem] border border-slate-200 bg-white px-4 py-3.5"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[0.78rem] font-semibold text-slate-900">
                {index + 1}
              </span>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-600">
                  {step.label}
                </p>
                <p className="mt-1 text-[0.9rem] leading-6 text-slate-900">{step.detail}</p>
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
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
          <FileCode2 className="h-3.5 w-3.5" />
          Production pair
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">MJML source</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.78rem] border border-slate-200 bg-white p-4 text-[0.74rem] leading-6 text-slate-900">
            {mjml}
          </pre>
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Compiled HTML</p>
          <pre className="mt-2 overflow-x-auto rounded-[0.78rem] border border-slate-200 bg-white p-4 text-[0.74rem] leading-6 text-slate-900">
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
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{title}</p>
      <pre className="mt-3 overflow-x-auto rounded-[0.78rem] border border-slate-200 bg-white p-4 text-[0.78rem] leading-6 text-slate-900">
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
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{title}</p>
      <div className="mt-3 flex items-start gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
          <Layers3 className="h-4 w-4 text-slate-900" />
        </span>
        <p className="text-[0.9rem] leading-7 text-slate-600">{description}</p>
      </div>

      {imageUrl ? (
        <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-[0.78rem] border border-slate-200 bg-slate-50">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1280px) 90vw, 32vw"
            className="object-cover object-top"
          />
        </div>
      ) : null}

      <ol className="mt-4 space-y-2.5 text-[0.82rem] leading-6 text-slate-600">
        {steps.map((step) => (
          <li key={step} className="rounded-[0.64rem] border border-slate-200 bg-white px-3.5 py-2.5">
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
      <VisualPanel className="border-[hsl(var(--th-accent-support)/0.14)] bg-white shadow-[0_14px_28px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">
            <Layers3 className="h-4 w-4 text-slate-600" />
          </span>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{leftTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {leftItems.map((item) => (
            <li key={`left-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-slate-600">{item.label}</p>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-600">Higher effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-slate-600">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-[hsl(var(--th-accent-support)/0.38)]" style={{ width: `${item.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </VisualPanel>

      <article className="relative overflow-hidden rounded-[1.08rem] border border-[hsl(var(--th-accent-support)/0.32)] bg-white p-6 shadow-[0_30px_56px_rgba(0,0,0,0.42)] ring-1 ring-[hsl(var(--th-accent-support)/0.2)] sm:p-7 lg:-translate-y-1">
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">
            <Zap className="h-4 w-4 text-slate-900" />
          </span>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.09em] text-slate-500">{rightTitle}</p>
        </div>
        <ul className="mt-5 space-y-4">
          {rightItems.map((item) => (
            <li key={`right-${item.label}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9rem] font-semibold text-slate-900">{item.label}</p>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-500">Lower effort</p>
              </div>
              <p className="mt-1 text-[0.88rem] leading-6 text-slate-500">{item.note}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-slate-900" style={{ width: `${item.value}%` }} />
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
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">{title}</p>
          <h3 className="mt-1 text-[1.14rem] font-semibold leading-7 text-slate-900">{subtitle}</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
          <GitBranchPlus className="h-3.5 w-3.5" />
          Registry linked
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <ol className="space-y-2.5">
          <li className="rounded-[0.72rem] border border-slate-200 bg-white px-3.5 py-2.5 text-[0.84rem] font-semibold text-slate-900">
            workflow/{workflowLabel}
          </li>
          <li className="rounded-[0.72rem] border border-slate-200 bg-white px-3.5 py-2.5 text-[0.84rem] font-semibold text-slate-900">
            layout/{layoutLabel}
          </li>
          {componentLabels.map((label) => (
            <li key={label} className="rounded-[0.72rem] border border-slate-200 bg-white px-3.5 py-2.5 text-[0.84rem] text-slate-600">
              component/{label}
            </li>
          ))}
          <li className="rounded-[0.72rem] border border-slate-200 bg-[hsl(var(--th-accent-support)/0.12)] px-3.5 py-2.5 text-[0.84rem] font-semibold text-slate-900">
            {outputLabel}
          </li>
        </ol>

        <div className="rounded-[0.78rem] border border-slate-200 bg-white p-3">
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.62rem] border border-slate-200 bg-slate-50">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 1280px) 90vw, 24vw"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-[0.62rem] border border-dashed border-slate-200 text-[0.82rem] text-slate-600">
              Layout preview
            </div>
          )}
          <p className="mt-3 text-[0.82rem] leading-6 text-slate-600">
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
      className={cn("inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-slate-600 transition hover:text-slate-900", className)}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
