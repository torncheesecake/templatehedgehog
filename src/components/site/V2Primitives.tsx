import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Download,
  ExternalLink,
  FileCode2,
  FolderTree,
  MonitorCheck,
  PackageOpen,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/data/testimonials";

const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

type HeroAction = {
  href: string;
  label: string;
  primary?: boolean;
  className?: string;
};

export function V2PageHero({
  title,
  copy,
  actions = [],
  children,
  compact = false,
  visualWeight = "standard",
}: {
  title: string;
  copy: string;
  actions?: HeroAction[];
  children?: ReactNode;
  compact?: boolean;
  visualWeight?: "standard" | "dominant";
}) {
  const hasDominantVisual = children && visualWeight === "dominant";

  return (
    <section className={cn("border-b border-[var(--border-subtle)]", compact ? "py-14 sm:py-16" : "py-16 sm:py-20")}>
      <div className={pageWidth}>
        <div className={cn(
          "grid gap-10",
          children ? "lg:items-center" : "",
          children && !hasDominantVisual ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]" : "",
          hasDominantVisual ? "lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12" : "",
        )}>
          <div>
            <h1 className="max-w-[13ch] font-serif text-[clamp(3rem,7.2vw,5.85rem)] font-semibold leading-[0.92] text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-8 text-[var(--text-secondary)]">
              {copy}
            </p>
            {actions.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={cn(
                      "th-btn",
                      action.primary
                        ? "th-btn-primary"
                        : cn(
                          "th-btn-secondary",
                          action.className ? "" : "text-[var(--text-primary)]",
                        ),
                      action.className,
                    )}
                  >
                    {action.label}
                    {action.primary ? <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /> : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function SourceToHandoffPreview({
  image,
  alt,
  priority = false,
}: {
  image: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <article className="relative overflow-hidden rounded-[1.15rem] border border-[var(--identity-source-border)] bg-[var(--bg-structural)] shadow-[0_32px_95px_rgba(49,59,114,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[var(--identity-source)] px-5 py-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] !text-[var(--identity-source-on-dark)]">Production artefact</p>
          <p className="mt-1 text-[0.82rem] !text-[var(--text-on-structural-muted)]">Source-to-handoff preview</p>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--identity-source-on-dark)] ring-1 ring-white/35" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-indigo)] ring-1 ring-white/35" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-mint)] ring-1 ring-white/35" />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="min-w-0 border-b border-white/10 bg-[linear-gradient(145deg,var(--identity-source),var(--bg-structural))] p-5 lg:border-b-0 lg:border-r">
          <div className="border-l border-white/20 bg-[color-mix(in_srgb,var(--identity-source)_58%,black)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[0.72rem] font-semibold uppercase !text-[var(--identity-source-on-dark)]">MJML source</p>
              <p className="rounded-full bg-white/[0.08] px-2 py-1 text-[0.7rem] font-semibold !text-[var(--text-on-structural-muted)]">editable</p>
            </div>
            <pre className="overflow-hidden text-[0.72rem] leading-6 !text-[#e8f5ed] sm:text-[0.78rem]">
{`<mj-section>
  <mj-column>
    <mj-text mj-class="eyebrow">
      Release bulletin
    </mj-text>
    <mj-text mj-class="h1">
      Launch email updates
    </mj-text>
    <mj-button href="{{cta_url}}">
      Review workflow
    </mj-button>
  </mj-column>
</mj-section>`}
            </pre>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border-t border-white/15 pt-3">
              <p className="text-[0.72rem] font-semibold uppercase !text-[var(--identity-source-on-dark)]">Workflow notes</p>
              <p className="mt-2 text-[0.82rem] leading-6 !text-[#e2e8f0]">Trigger, audience, layout, and handoff notes stay with the artefact.</p>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-[0.72rem] font-semibold uppercase !text-[var(--text-on-structural-muted)]">Compiled output</p>
              <p className="mt-2 text-[0.82rem] leading-6 !text-[#e2e8f0]">MJML source moves into production-safe HTML for delivery.</p>
            </div>
          </div>
        </div>

        <div className="relative min-w-0 bg-[var(--bg-canvas)] p-5">
          <div className="relative overflow-hidden border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-200 px-4 py-2.5">
              <p className="text-[0.72rem] font-semibold uppercase text-slate-500">Layout and output preview</p>
            </div>
            <div className="relative aspect-[16/11] bg-white">
              <Image src={image} alt={alt} fill sizes="(max-width: 1280px) 92vw, 48vw" unoptimized priority={priority} className="object-cover object-top" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="border-t border-slate-200 bg-white pt-3">
              <p className="text-[0.72rem] font-semibold uppercase text-slate-500">QA state</p>
              <div className="mt-2 space-y-1.5 text-[0.82rem] leading-5 text-slate-700">
                {["Structure", "Responsive", "Handoff"].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--action-primary)]" aria-hidden="true" />
                    {item} ready
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--identity-source-border)] bg-white pt-3">
              <p className="text-[0.72rem] font-semibold uppercase text-[var(--identity-source)]">Handoff pack</p>
              <div className="mt-2 grid gap-1.5 text-[0.82rem] font-semibold text-slate-800">
                <span>source.mjml</span>
                <span>compiled.html</span>
                <span>implementation-notes.md</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function V2Section({
  title,
  copy,
  children,
  surface = "canvas",
  className,
}: {
  title?: string;
  copy?: string;
  children: ReactNode;
  surface?: "canvas" | "surface" | "dark" | "gradient";
  className?: string;
}) {
  const isDark = surface === "dark" || surface === "gradient";
  const surfaceClass = {
    canvas: "bg-[var(--bg-canvas)]",
    surface: "bg-[var(--bg-surface)]",
    dark: "bg-[var(--bg-structural)]",
    gradient: "bg-[linear-gradient(135deg,var(--bg-structural)_0%,var(--bg-structural)_42%,var(--identity-source)_100%)]",
  }[surface];

  return (
    <section className={cn("border-b border-[var(--border-subtle)] py-16 sm:py-20", surfaceClass, isDark ? "!border-[var(--border-on-structural)]" : "", className)}>
      <div className={pageWidth}>
        {title || copy ? (
          <div className="mb-10 max-w-3xl">
            {title ? <h2 className={cn("font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1]", isDark ? "!text-[var(--colour-high-priority)]" : "text-[var(--text-primary)]")}>{title}</h2> : null}
            {copy ? <p className={cn("mt-4 text-[1rem] leading-8", isDark ? "!text-[var(--text-on-structural-muted)]" : "text-[var(--text-secondary)]")}>{copy}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function WorkflowAssembly({
  className,
  compact = false,
  tone = "light",
}: {
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
}) {
  const steps = [
    { label: "Trigger", detail: "Real send event" },
    { label: "Workflow", detail: "Message journey" },
    { label: "Layout", detail: "Complete structure" },
    { label: "Components", detail: "Reusable blocks" },
    { label: "Email", detail: "Production output" },
  ];

  if (tone === "light") {
    return (
      <div className={cn("overflow-hidden border-y border-[var(--border-subtle)] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]", className)}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
          <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">Workflow assembly</p>
          <p className="text-[0.78rem] font-semibold text-[var(--text-primary)]">Trigger to production output</p>
        </div>
        <div className={cn("grid gap-0 p-4", compact ? "sm:grid-cols-5" : "md:grid-cols-5")}>
          {steps.map((step, index) => (
            <div key={step.label} className="relative min-w-0 border-t border-[var(--border-subtle)] py-4 pl-0 pr-3 first:border-t-0 sm:border-l sm:border-t-0 sm:pl-4 sm:first:border-l-0 md:py-3">
              <p className="text-[0.7rem] font-semibold text-[var(--identity-source)]">0{index + 1}</p>
              <h3 className="mt-2 text-[1.05rem] font-semibold text-[var(--text-primary)]">{step.label}</h3>
              <p className="mt-1 text-[0.82rem] leading-6 text-[var(--text-secondary)]">{step.detail}</p>
              {index < steps.length - 1 ? (
                <ArrowRight className="absolute right-3 top-5 hidden h-4 w-4 text-[var(--action-primary)] md:block" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-[1.05rem] border border-white/15 bg-[var(--bg-structural)] shadow-[0_24px_70px_rgba(49,59,114,0.18)]", className)}>
      <div className="border-b border-white/10 bg-[var(--identity-source)] px-4 py-3">
        <p className="text-[0.78rem] font-semibold uppercase !text-[var(--identity-source-on-dark)]">Workflow Assembly</p>
      </div>
      <div className={cn("grid gap-3 p-4", compact ? "sm:grid-cols-5" : "md:grid-cols-5")}>
        {steps.map((step, index) => (
          <div key={step.label} className="relative min-w-0 border-l border-white/12 bg-[color-mix(in_srgb,var(--bg-structural)_82%,black)] p-4 first:border-l-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="inline-flex rounded-full bg-[var(--identity-source)] px-2 py-0.5 text-[0.72rem] font-semibold !text-[var(--identity-source-on-dark)]">0{index + 1}</p>
            <h3 className="mt-3 text-[1rem] font-semibold !text-[var(--colour-high-priority)]">{step.label}</h3>
            <p className="mt-1 text-[0.82rem] leading-6 !text-[var(--text-on-structural-muted)]">{step.detail}</p>
            {index < steps.length - 1 ? (
              <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 !text-[var(--action-primary)] md:block" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const buildComparisonRows = [
  {
    label: "Time",
    scratch: "Four to twelve hours per new email type, repeated every time a send is needed.",
    hedgehog: "Start from a workflow-matched system in under an hour and edit copy, not structure.",
  },
  {
    label: "QA passes",
    scratch: "Mobile stacking, Outlook rendering, footer copy, and link checks are redone from memory each build.",
    hedgehog: "QA notes ship inside the archive, so client risks and rendering caveats are already written down.",
  },
  {
    label: "Consistency",
    scratch: "Each project and each person diverges, and the inconsistency shows across sends.",
    hedgehog: "Source, structure, and token conventions stay consistent across every workflow you ship.",
  },
  {
    label: "Handoff friction",
    scratch: "Every handoff is improvised, with screenshots in chat and source nobody can find later.",
    hedgehog: "Every handoff carries source, compiled HTML, preview, and QA notes in one reviewed package.",
  },
] as const;

export function BuildComparison() {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
      <article className="flex min-h-full flex-col border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
          The usual path
        </p>
        <h3 className="mt-2 text-[1.45rem] font-semibold text-[var(--text-secondary)]">
          Free MJML, an ESP builder, or a marketplace template.
        </h3>
        <p className="mt-3 text-[0.92rem] leading-7 text-[var(--text-meta)]">
          Free MJML gives you a compiler, not a system. An ESP builder locks the work to one platform and produces no portable source. A marketplace template is visual HTML with no workflow context, QA notes, or updates.
        </p>
        <dl className="mt-6 flex-1 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
          {buildComparisonRows.map((row) => (
            <div key={row.label} className="grid gap-1.5 py-4">
              <dt className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                {row.label}
              </dt>
              <dd className="text-[0.9rem] leading-7 text-[var(--text-secondary)]">
                {row.scratch}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="flex min-h-full flex-col border border-black bg-black p-5 text-white shadow-[0_26px_64px_rgba(0,0,0,0.16)] sm:p-6">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] !text-white/70">
          The resolved path
        </p>
        <h3 className="mt-2 text-[1.45rem] font-semibold !text-white">
          The production system behind the send.
        </h3>
        <p className="mt-3 text-[0.92rem] leading-7 !text-white/80">
          Template Hedgehog gives you the MJML source, compiled output, QA context, and handoff guidance that the cheaper paths leave out, plus updates as the archive improves.
        </p>
        <dl className="mt-6 flex-1 divide-y divide-white/15 border-t border-white/15">
          {buildComparisonRows.map((row) => (
            <div key={row.label} className="grid gap-1.5 py-4">
              <dt className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.08em] !text-white/70">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
                {row.label}
              </dt>
              <dd className="text-[0.9rem] leading-7 !text-white/85">
                {row.hedgehog}
              </dd>
            </div>
          ))}
        </dl>
        <Link href="/pricing#pro" className="th-btn th-btn-sm th-btn-primary-on-dark mt-7 w-fit">
          Compare Pro
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </article>
    </div>
  );
}

export function ProductPreview({
  image,
  alt,
  title,
  copy,
  className,
  priority = false,
}: {
  image: string;
  alt: string;
  title: string;
  copy: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article className={cn("overflow-hidden rounded-[1.1rem] border border-[var(--border-strong)] bg-[var(--bg-surface)]", className)}>
      <div className="relative aspect-[16/10] bg-white">
        <Image src={image} alt={alt} fill sizes="(max-width: 1280px) 92vw, 56vw" unoptimized priority={priority} className="object-cover object-top" />
      </div>
      <div className="p-5">
        <h3 className="text-[1.2rem] font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">{copy}</p>
      </div>
    </article>
  );
}

export type ValueReceiptWorkflowExample = {
  title: string;
  summary: string;
  trigger: string;
  deliverables: string[];
  href: string;
};

const receiptDeliverables = [
  {
    title: "MJML source",
    detail: "Editable source files for each layout and workflow.",
    filename: "source.mjml",
    icon: FileCode2,
    tone: "source",
  },
  {
    title: "Compiled HTML",
    detail: "Production output ready for ESP upload or developer handoff.",
    filename: "compiled.html",
    icon: Code2,
    tone: "output",
  },
  {
    title: "Preview",
    detail: "Rendered email previews so the structure can be inspected quickly.",
    filename: "preview.png",
    icon: MonitorCheck,
    tone: "output",
  },
  {
    title: "QA notes",
    detail: "Client risks, responsive checks, and send-time caveats.",
    filename: "qa-notes.md",
    icon: ClipboardCheck,
    tone: "source",
  },
  {
    title: "Implementation guidance",
    detail: "Notes for variables, image hosting, compilation, and handoff.",
    filename: "implementation-guide.md",
    icon: BookOpenCheck,
    tone: "source",
  },
  {
    title: "Workflow examples",
    detail: "Trigger, fields, variants, layout, and component stack context.",
    filename: "workflow-examples.md",
    icon: CheckCircle2,
    tone: "progress",
  },
] as const;

export function ValueReceipt({
  image,
  alt,
  workflowExamples,
  compact = false,
  previewHref,
}: {
  image?: string;
  alt?: string;
  workflowExamples: ValueReceiptWorkflowExample[];
  compact?: boolean;
  previewHref?: string;
}) {
  const gridClass = compact
    ? "grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    : "grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]";

  return (
    <div className={gridClass}>
      <article className="overflow-hidden rounded-[1.2rem] border border-[var(--identity-source-border)] bg-[var(--bg-surface)] shadow-[0_22px_60px_rgba(49,59,114,0.1)]">
        <div className="border-b border-[var(--identity-source-border)] bg-[var(--identity-source-soft)] px-4 py-3">
          <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">What is in the pack</p>
          <p className="mt-1 text-[0.9rem] leading-6 text-[var(--text-secondary)]">The purchase is a production handoff, not a list of abstract features.</p>
        </div>
        {image ? (
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
            <div className="min-w-0 border-b border-[var(--border-subtle)] bg-white p-4 md:border-b-0 md:border-r">
              <div className="relative overflow-hidden rounded-[0.95rem] border border-[var(--border-subtle)] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
                <div className="border-b border-[var(--border-subtle)] px-3 py-2">
                  <p className="text-[0.72rem] font-semibold uppercase text-[var(--text-meta)]">Preview</p>
                </div>
                <div className="relative aspect-[15/11]">
                  <Image
                    src={image}
                    alt={alt ?? "Template Hedgehog email preview"}
                    fill
                    sizes="(max-width: 768px) 92vw, 360px"
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
                {previewHref ? (
                  <Link
                    href={previewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border-t border-[var(--border-subtle)] px-3 py-2 text-[0.78rem] font-semibold text-[var(--action-primary)]"
                  >
                    Open full-size preview
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </div>
            <ReceiptDeliverableList />
          </div>
        ) : (
          <ReceiptDeliverableList />
        )}
      </article>

      <article className="rounded-[1.2rem] border border-[var(--border-strong)] bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">Workflow examples</p>
            <h3 className="mt-1 text-[1.35rem] font-semibold text-[var(--text-primary)]">Real send systems, not blank templates.</h3>
          </div>
          <Link href="/workflows?view=product" className="inline-flex items-center text-[0.9rem] font-semibold text-[var(--action-primary)]">
            View workflows
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3">
          {workflowExamples.map((workflow) => (
            <Link
              key={workflow.href}
              href={workflow.href}
              className="group rounded-[0.95rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 transition hover:border-[var(--identity-source-border)] hover:bg-[var(--identity-source-soft)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[1.02rem] font-semibold text-[var(--text-primary)]">{workflow.title}</h4>
                  <p className="mt-1 text-[0.86rem] leading-6 text-[var(--text-secondary)]">{workflow.summary}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--action-primary)] transition group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase text-[var(--text-meta)]">Trigger</p>
              <p className="mt-1 text-[0.86rem] leading-6 text-[var(--text-secondary)]">{workflow.trigger}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {workflow.deliverables.map((deliverable) => (
                  <span key={deliverable} className="rounded-full border border-[var(--identity-source-border)] bg-white px-2.5 py-1 text-[0.76rem] font-semibold text-[var(--identity-source)]">
                    {deliverable}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </article>
    </div>
  );
}

function ReceiptDeliverableList() {
  return (
    <div className="grid min-w-0 gap-3 bg-[var(--bg-surface)] p-4">
      {receiptDeliverables.map((item) => {
        const Icon = item.icon;
        const isSource = item.tone === "source";
        const isProgress = item.tone === "progress";
        return (
          <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[0.9rem] border border-[var(--border-subtle)] bg-white p-3">
            <span
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full",
                isSource ? "bg-[var(--identity-source-soft)] text-[var(--identity-source)]" : "",
                isProgress ? "bg-[var(--bg-accent-soft)] text-[var(--action-primary)]" : "",
                !isSource && !isProgress ? "bg-[var(--identity-output-soft)] text-[var(--identity-output)]" : "",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h4 className="text-[0.96rem] font-semibold text-[var(--text-primary)]">{item.title}</h4>
                <code className="rounded-full bg-[var(--bg-canvas)] px-2 py-0.5 text-[0.72rem] font-semibold text-[var(--identity-source)]">{item.filename}</code>
              </div>
              <p className="mt-1 text-[0.84rem] leading-6 text-[var(--text-secondary)]">{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const trustProofItems = [
  {
    title: "Full preview inspection",
    copy: "Open rendered layout previews before buying so you can inspect hierarchy, spacing, mobile stacking assumptions, and production fit.",
    action: "Inspect layouts",
    href: "/layouts",
    icon: MonitorCheck,
  },
  {
    title: "QA and testing proof",
    copy: "Workflow notes call out responsive risks, Outlook caveats, long-content issues, image handling, and handoff checks before ESP import.",
    action: "Read QA notes",
    href: "/workflows?view=product",
    icon: ShieldCheck,
  },
  {
    title: "Public sample pack",
    copy: "Download a complete workflow sample with real MJML source, compiled HTML, QA notes, testing notes, implementation guide, and licence reference.",
    action: "Inspect sample",
    href: "/sample-pack",
    icon: Download,
  },
  {
    title: "Built from email production work",
    copy: "Created by Artifexa from hands-on MJML and HTML email production experience, including campaign-template work for NetSuite campaign use.",
    action: "Founder proof",
    href: "/about#founder-proof",
    icon: UserCheck,
  },
] as const;

const archiveFolders = [
  {
    path: "components/",
    detail: "Reusable MJML blocks with compiled HTML output.",
  },
  {
    path: "layouts/",
    detail: "Complete email systems assembled from production blocks.",
  },
  {
    path: "workflows/",
    detail: "Trigger, fields, QA risks, variants, and handoff notes.",
  },
  {
    path: "examples/",
    detail: "Reference sends showing how systems work in context.",
  },
  {
    path: "docs/",
    detail: "Setup, editing, compilation, and implementation guidance.",
  },
  {
    path: "README.md + changelog",
    detail: "Version, licence, update, and delivery notes.",
  },
] as const;

const postPurchaseSteps = [
  {
    title: "Checkout confirms the tier",
    copy: "Stripe checkout records the selected Core, Pro, or Team archive and redirects back to the success page.",
  },
  {
    title: "Signed download is issued",
    copy: "A signed download link is issued for the matching private archive, not a public source folder.",
  },
  {
    title: "Archive opens into real artefacts",
    copy: "You receive source files, compiled HTML, previews, workflow notes, docs, version metadata, and licence guidance.",
  },
  {
    title: "Implementation starts from handoff notes",
    copy: "Use the included guidance to edit copy, map variables, host images, compile output, and run client checks before upload.",
  },
] as const;

/**
 * Pack counts, passed in from server pages so this module never imports the
 * Node-only pack helpers (which would poison the client bundle).
 */
export type LicenceCounts = {
  starterComponentCount: number;
  starterLayoutCount: number;
  componentCount: number;
  layoutCount: number;
  workflowCount: number;
};

function buildLicenceRows(counts: LicenceCounts) {
  return [
    {
      tier: "Core",
      use: "The essential starting system for your own implementation",
      receives: `${counts.starterComponentCount} components, ${counts.starterLayoutCount} layouts (welcome, onboarding, password reset, order confirmation) in the simplest inline dialect, MJML source, compiled HTML, previews, and setup docs`,
      rights: "Use inside your own implementation. Redistribution, resale, and white-label reuse are not included.",
      updates: "Standard fixes for the purchased archive version",
    },
    {
      tier: "Pro",
      use: "Recurring production email work for your organisation",
      receives: `${counts.componentCount} components, ${counts.layoutCount} layouts, ${counts.workflowCount} workflows, a self-contained class stylesheet in every file, token examples, QA notes, advanced guidance, and compiled output`,
      rights: "Use the full archive for your own organisation's production email work. Client resale, redistribution, and white-label reuse are not included.",
      updates: "6 months of versioned updates",
    },
    {
      tier: "Team",
      use: "Client work, white-label use, or internal rollout across teams",
      receives: "Full Pro archive plus a shared framework head, commercial reuse rights, white-label/internal deployment, reusable generation framework, and priority support",
      rights: "Commercial reuse rights for approved client, white-label, or internal deployment workflows. Source archive resale is still not permitted.",
      updates: "12 months of updates and priority support",
    },
  ] as const;
}

const testingChecks = [
  "MJML source and compiled HTML are kept together for every sampled workflow.",
  "Responsive inspection points: 320px, 375px, and 600px.",
  "Seed-test guidance covers Gmail, Outlook Desktop, and Apple Mail where available.",
  "QA notes call out long names, long URLs, blocked images, dark mode, and ESP HTML rewriting.",
  "Final platform testing remains required after upload because ESP editors can alter HTML.",
] as const;

const supportItems = [
  {
    title: "Download support",
    copy: "If checkout succeeds but the signed archive link fails, email support with the purchase email or Stripe receipt so the matching tier can be checked and resolved.",
  },
  {
    title: "Delivery and refund expectation",
    copy: "If the paid archive cannot be delivered, is inaccessible, or materially differs from the described tier contents, support will resolve the issue or refund the purchase.",
  },
  {
    title: "Update access",
    copy: "Pro includes 6 months of versioned updates. Team includes 12 months. Version and changelog metadata ship inside the archive.",
  },
  {
    title: "Licence questions",
    copy: "If you plan to reuse the archive across clients, white-label work, or internal deployment, ask before buying so Team is scoped correctly.",
  },
] as const;

const founderProofItems = [
  {
    title: "Years of HTML email production",
    copy: "The archive comes from repeated hands-on HTML email work where the same lifecycle, transactional, campaign, and digest structures kept being rebuilt.",
    icon: ClipboardCheck,
  },
  {
    title: "MJML source ownership",
    copy: "MJML is useful while building because teams can change source deliberately. Compiled HTML is useful at handoff because platforms and reviewers often need final markup.",
    icon: FileCode2,
  },
  {
    title: "NetSuite email work",
    copy: "The product is informed by campaign-template and email handoff work around NetSuite use cases, where source ownership and platform boundaries matter.",
    icon: Code2,
  },
  {
    title: "QA and handoff frustrations",
    copy: "Email work often fails at the edges: mobile stacking, Outlook caveats, long copy, missing image rules, unclear merge fields, and unclear ownership after export.",
    icon: ShieldCheck,
  },
  {
    title: "Reusable production systems",
    copy: "Template Hedgehog packages the source, output, preview, notes, and workflow context that usually have to be recreated project by project.",
    icon: FolderTree,
  },
] as const;

export function FounderProof() {
  return (
    <article id="founder-proof" className="overflow-hidden rounded-[1.2rem] border border-[var(--border-strong)] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-[var(--identity-source-border)] bg-[var(--identity-source-soft)] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--identity-source)]">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">Founder proof</p>
              <h3 className="mt-1 text-[1.35rem] font-semibold text-[var(--text-primary)]">Why I built Template Hedgehog.</h3>
            </div>
          </div>
          <p className="mt-4 text-[0.96rem] leading-8 text-[var(--text-secondary)]">
            I built Template Hedgehog after years of working with HTML email, MJML source, compiled output, and campaign-template handoff. The same production patterns kept coming back: onboarding, resets, receipts, launches, digests, support routes, and operational alerts.
          </p>
          <p className="mt-4 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
            The useful work was rarely the empty template. It was source ownership, QA notes, preview checks, platform boundaries, and handoff context that made the email safe to change and ship.
          </p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {founderProofItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--identity-source)]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h4 className="mt-3 text-[1rem] font-semibold text-[var(--text-primary)]">{item.title}</h4>
                <p className="mt-2 text-[0.86rem] leading-6 text-[var(--text-secondary)]">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function TrustProofGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {trustProofItems.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className="flex min-h-full flex-col rounded-[1rem] border border-[var(--border-subtle)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--identity-source-soft)] text-[var(--identity-source)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[1.05rem] font-semibold text-[var(--text-primary)]">{item.title}</h3>
            <p className="mt-2 flex-1 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{item.copy}</p>
            <Link href={item.href} className="mt-4 inline-flex items-center text-[0.86rem] font-semibold text-[var(--action-primary)]">
              {item.action}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function ArchiveStructureProof() {
  return (
    <article className="overflow-hidden rounded-[1.2rem] border border-[var(--border-strong)] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-[var(--border-subtle)] bg-[var(--identity-source-soft)] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--identity-source)]">
              <FolderTree className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">Archive structure</p>
              <h3 className="mt-1 text-[1.35rem] font-semibold text-[var(--text-primary)]">The zip opens into a working handoff.</h3>
            </div>
          </div>
          <p className="mt-4 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
            The paid archive is organised by source, output, workflows, docs, and version context so a buyer can inspect and implement without guessing where files live.
          </p>
          <Link
            href="/sample-pack"
            className="th-btn th-btn-sm th-btn-primary mt-5"
          >
            Inspect sample pack
            <Download className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {archiveFolders.map((folder) => (
            <div key={folder.path} className="rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <code className="text-[0.88rem] font-semibold text-[var(--identity-source)]">{folder.path}</code>
              <p className="mt-2 text-[0.86rem] leading-6 text-[var(--text-secondary)]">{folder.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function PostPurchaseProof() {
  return (
    <article className="rounded-[1.2rem] border border-[var(--border-strong)] bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-accent-soft)] text-[var(--action-primary)]">
          <PackageOpen className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.78rem] font-semibold uppercase text-[var(--action-primary)]">After purchase</p>
          <h3 className="mt-1 text-[1.35rem] font-semibold text-[var(--text-primary)]">What arrives and how it is delivered.</h3>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {postPurchaseSteps.map((step, index) => (
          <div key={step.title} className="rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
            <p className="text-[0.72rem] font-semibold text-[var(--identity-source)]">0{index + 1}</p>
            <h4 className="mt-2 text-[0.98rem] font-semibold text-[var(--text-primary)]">{step.title}</h4>
            <p className="mt-2 text-[0.84rem] leading-6 text-[var(--text-secondary)]">{step.copy}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function LicenceMatrix({ counts }: { counts: LicenceCounts }) {
  const licenceRows = buildLicenceRows(counts);
  return (
    <article className="overflow-hidden border-y border-[var(--border-strong)] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-4 border-b border-[var(--border-subtle)] bg-[linear-gradient(135deg,#ffffff_0%,var(--bg-canvas)_100%)] px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">Licence and commercial use</p>
          <h3 className="mt-2 max-w-2xl text-[1.55rem] font-semibold leading-tight text-[var(--text-primary)]">
            Choose by what the archive is allowed to support.
          </h3>
        </div>
        <p className="max-w-3xl text-[0.95rem] leading-7 text-[var(--text-secondary)]">
          The files change between Core and Pro. The permission model changes at Team. Use this to separate package depth from commercial reuse rights.
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-3">
        {licenceRows.map((row) => {
          const isPro = row.tier === "Pro";
          const isTeam = row.tier === "Team";

          return (
            <section
              key={row.tier}
              className={cn(
                "border-t border-[var(--border-subtle)] p-5 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0 sm:p-6",
                isPro ? "bg-[var(--bg-canvas)]" : "bg-white",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    {isTeam ? "Rights and support" : isPro ? "Full archive" : "Starter use"}
                  </p>
                  <h4 className="mt-2 font-serif text-[1.6rem] font-semibold leading-none text-[var(--text-primary)]">
                    {row.tier}
                  </h4>
                </div>
                <span className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  isPro ? "border-black bg-black" : "border-[var(--border-subtle)] bg-white text-[var(--text-primary)]",
                )}>
                  {isTeam ? <UserCheck className="h-4 w-4" aria-hidden="true" /> : isPro ? <PackageOpen className="h-4 w-4" style={{ color: "#ffffff" }} aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                </span>
              </div>

              <p className="mt-4 text-[0.98rem] font-semibold leading-7 text-[var(--text-primary)]">
                {row.use}
              </p>

              <dl className="mt-5 space-y-4">
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">Archive</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-[var(--text-secondary)]">{row.receives}</dd>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">Commercial rights</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-[var(--text-secondary)]">{row.rights}</dd>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">Updates</dt>
                  <dd className="mt-2 text-[0.9rem] leading-6 text-[var(--text-secondary)]">{row.updates}</dd>
                </div>
              </dl>
            </section>
          );
        })}
      </div>

      <div className="border-t border-[var(--border-subtle)] bg-black px-5 py-4 sm:px-6">
        <p className="max-w-none text-[0.9rem] font-semibold leading-6 !text-white">
          Source archive resale is not permitted on any tier. Team adds approved reuse rights, white-label or internal deployment cover, priority support, and a longer update window.
        </p>
      </div>
    </article>
  );
}

export function TestingProofPanel() {
  return (
    <article className="rounded-[1.2rem] border border-[var(--border-strong)] bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--identity-source-soft)] text-[var(--identity-source)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.78rem] font-semibold uppercase text-[var(--identity-source)]">Email-client QA</p>
          <h3 className="mt-1 text-[1.35rem] font-semibold text-[var(--text-primary)]">Testing proof is documented, not implied.</h3>
        </div>
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {testingChecks.map((check) => (
          <li key={check} className="flex items-start gap-3 rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action-primary)]" aria-hidden="true" />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function SupportRefundPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {supportItems.map((item) => (
        <article key={item.title} className="rounded-[1rem] border border-[var(--border-subtle)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <h3 className="text-[1.05rem] font-semibold text-[var(--text-primary)]">{item.title}</h3>
          <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{item.copy}</p>
        </article>
      ))}
    </div>
  );
}

export function FeatureBlock({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="border-t border-[var(--border-subtle)] pt-5">
      <h3 className="text-[1.2rem] font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 text-[0.95rem] leading-7 text-[var(--th-text-secondary)]">{copy}</p>
    </article>
  );
}

export function CatalogueCard({
  href,
  title,
  copy,
  image,
  meta,
  badge,
}: {
  href: string;
  title: string;
  copy: string;
  image: string;
  meta?: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group block border-t border-[var(--border-subtle)] pt-5 transition hover:border-[var(--identity-source-border)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-[var(--border-subtle)] transition group-hover:shadow-[0_20px_48px_rgba(49,59,114,0.11)]">
        <Image src={image} alt={`${title} preview`} fill sizes="(max-width: 768px) 92vw, 360px" unoptimized className="object-cover object-top transition duration-300 group-hover:scale-[1.015]" />
      </div>
      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {meta ? <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">{meta}</p> : null}
          {badge ? <span className="rounded-full border border-[var(--action-primary)] px-2 py-0.5 text-[0.68rem] font-semibold uppercase text-[var(--action-primary)]">{badge}</span> : null}
        </div>
        <h3 className="mt-2 text-[1.1rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--identity-source)]">{title}</h3>
        <p className="mt-2 line-clamp-3 text-[0.9rem] leading-6 text-[var(--text-secondary)]">{copy}</p>
      </div>
    </Link>
  );
}

export function CTASection({
  title,
  copy,
  href,
  label,
}: {
  title: string;
  copy: string;
  href: string;
  label: string;
}) {
  return (
    <V2Section surface="gradient">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <h2 className="max-w-3xl font-serif text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.96] !text-[var(--colour-high-priority)]">{title}</h2>
          <p className="mt-4 max-w-2xl text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">{copy}</p>
        </div>
        <Link href={href} className="th-btn th-btn-primary-on-dark w-fit">
          {label}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </V2Section>
  );
}

export function PricingTierCard({
  name,
  price,
  outcome,
  copy,
  points,
  action,
  badge,
  highlighted = false,
  tone = "neutral",
}: {
  name: string;
  price: string;
  outcome: string;
  copy: string;
  points: string[];
  action: ReactNode;
  badge?: string;
  highlighted?: boolean;
  tone?: "neutral" | "amethyst" | "indigo";
}) {
  const toneClass = {
    neutral: "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
    amethyst: "border-[var(--border-strong)] bg-[var(--bg-surface)]",
    indigo: "border-[var(--border-strong)] bg-[var(--bg-surface)]",
  }[tone];
  const toneLabelClass = {
    neutral: "text-[var(--text-meta)]",
    amethyst: "text-[var(--text-primary)]",
    indigo: "text-[var(--text-primary)]",
  }[tone];

  return (
    <article className={cn("flex min-h-full flex-col border p-5 sm:p-6", highlighted ? "!border-black !bg-black !text-white shadow-[0_26px_64px_rgba(0,0,0,0.16)] ring-1 ring-black" : "", toneClass)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn("text-[0.82rem] font-semibold uppercase", highlighted ? "!text-white/70" : toneLabelClass)}>{outcome}</p>
        {badge ? <span className={cn("rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase", highlighted ? "border-white/35 !text-white" : "border-[var(--action-primary)] text-[var(--action-primary)]")}>{badge}</span> : null}
      </div>
      <h3 className={cn("mt-3 text-[1.55rem] font-semibold", highlighted ? "!text-white" : "text-[var(--text-primary)]")}>{name}</h3>
      <p className={cn("mt-2 text-[2.7rem] font-semibold leading-none", highlighted ? "!text-white" : "text-[var(--text-primary)]")}>{price}</p>
      <p className={cn("mt-4 text-[0.95rem] leading-7", highlighted ? "!text-white/82" : "text-[var(--text-secondary)]")}>{copy}</p>
      <ul className={cn("mt-5 flex-1 space-y-2 text-[0.9rem] leading-6", highlighted ? "!text-white/82" : "text-[var(--text-secondary)]")}>
        {points.map((point) => (
          <li key={point}>• {point}</li>
        ))}
      </ul>
      <div className="mt-6">{action}</div>
    </article>
  );
}

const trustSignals = [
  {
    title: "Secure, verified checkout",
    copy: "Payment runs through Stripe, and delivery is released only after a signature-verified Stripe webhook confirms the purchase.",
    icon: ShieldCheck,
  },
  {
    title: "Refund cover",
    copy: "If the paid archive cannot be delivered, is inaccessible, or does not match the tier described, support will resolve it or refund the purchase.",
    icon: CheckCircle2,
  },
  {
    title: "Source you own and can move",
    copy: "You receive editable MJML and compiled HTML you keep inside the licence, ready to hand to Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, or any ESP.",
    icon: Code2,
  },
  {
    title: "Founder-led support",
    copy: "Support is handled directly by email for purchase, download, archive, and licence questions, not routed through a ticket queue.",
    icon: UserCheck,
  },
] as const;

export function TrustStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustSignals.map((signal) => {
        const Icon = signal.icon;
        return (
          <article
            key={signal.title}
            className="flex min-h-full flex-col border border-[var(--border-subtle)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--identity-source-soft)] text-[var(--identity-source)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[1.05rem] font-semibold text-[var(--text-primary)]">{signal.title}</h3>
            <p className="mt-2 flex-1 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{signal.copy}</p>
          </article>
        );
      })}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const attribution = [testimonial.role, testimonial.company].filter(Boolean).join(", ");

  return (
    <figure className="flex min-h-full flex-col border border-[var(--border-subtle)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
      <blockquote className="flex-1 text-[1.02rem] leading-8 text-[var(--text-primary)]">
        “{testimonial.quote}”
      </blockquote>
      {(testimonial.name || attribution) ? (
        <figcaption className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          {testimonial.name ? (
            <p className="text-[0.92rem] font-semibold text-[var(--text-primary)]">{testimonial.name}</p>
          ) : null}
          {attribution ? (
            <p className="mt-0.5 text-[0.86rem] leading-6 text-[var(--text-secondary)]">{attribution}</p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Renders nothing while the testimonials data file is empty, so the site
 * never shows a hollow or fabricated "what customers say" block.
 */
export function Testimonials({
  title = "What buyers say.",
  copy,
}: {
  title?: string;
  copy?: string;
}) {
  const published = testimonials.filter((item) => item.permissionConfirmed !== false);

  if (published.length === 0) {
    return null;
  }

  return (
    <div>
      {(title || copy) ? (
        <div className="mb-8 max-w-3xl">
          {title ? (
            <h2 className="font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] text-[var(--text-primary)]">
              {title}
            </h2>
          ) : null}
          {copy ? <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">{copy}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {published.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.name ?? "anon"}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}
