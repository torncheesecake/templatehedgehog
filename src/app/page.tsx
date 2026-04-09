import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  getEmailWorkflowBySlug,
  getFeaturedEmailWorkflows,
} from "@/data/workflows";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_PROJECT_STRUCTURE,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

const displaySerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const primaryWorkflowSlugs = [
  "onboarding",
  "password-reset",
  "billing",
  "reporting",
  "notifications",
] as const;

const comparisonRows = [
  {
    label: "Time",
    fromScratch: "4 to 8 hours to assemble and stabilise a single production flow",
    withHedgehog: "Start from a mapped workflow and adapt in under an hour",
  },
  {
    label: "QA passes",
    fromScratch: "Multiple rounds to catch layout drift and client-specific breakage",
    withHedgehog: "Fewer passes because structure and output are already production-oriented",
  },
  {
    label: "Consistency",
    fromScratch: "Patterns diverge between campaigns and lifecycle sends over time",
    withHedgehog: "Shared workflow, layout, and component structure across every send",
  },
  {
    label: "Handoff friction",
    fromScratch: "Manual interpretation between development, QA, and ESP delivery",
    withHedgehog: "MJML source plus compiled HTML and workflow context in one system",
  },
] as const;

const mjmlSnippet = `<mj-section padding="24px">
  <mj-column>
    <mj-text>Reset your password</mj-text>
    <mj-button href="{{auth.reset_url}}">Reset now</mj-button>
  </mj-column>
</mj-section>`;

const htmlSnippet = `<table role="presentation" width="100%">
  <tr>
    <td style="padding:24px;">
      <a href="{{auth.reset_url}}">Reset now</a>
    </td>
  </tr>
</table>`;

const includedBreakdown = [
  {
    title: `${COMPONENT_COUNT} components`,
    detail: "Reusable MJML building blocks for campaign, lifecycle, and transactional sends.",
  },
  {
    title: `${LAYOUT_COUNT} layouts`,
    detail: "Full structures grouped by system so teams stop rebuilding shell markup.",
  },
  {
    title: `${WORKFLOW_COUNT} workflows (and growing)`,
    detail: "Trigger-based implementations for onboarding, security, billing, reporting, and more.",
  },
  {
    title: "Documentation",
    detail: "Practical implementation notes, client behaviour guidance, and handoff context.",
  },
  {
    title: "Compiled HTML outputs",
    detail: "Final delivery markup paired with MJML source for QA and ESP import.",
  },
] as const;

function buildWorkflowShowcase() {
  const featuredBySlug = new Map(
    getFeaturedEmailWorkflows(10).map((workflow) => [workflow.slug, workflow]),
  );

  return primaryWorkflowSlugs
    .map((slug) => featuredBySlug.get(slug) ?? getEmailWorkflowBySlug(slug))
    .filter((workflow): workflow is NonNullable<typeof workflow> => workflow !== undefined);
}

export default function Home() {
  const VS = visualSystem;
  const workflowShowcase = buildWorkflowShowcase();
  const mappingWorkflow =
    workflowShowcase[0] ?? getEmailWorkflowBySlug("onboarding");

  const mappingSteps = mappingWorkflow
    ? [
        `workflow/${mappingWorkflow.slug}`,
        `layout/${mappingWorkflow.linkedLayoutSlug}`,
        ...mappingWorkflow.componentStack
          .slice(0, 3)
          .map((item) => `component/${item.componentSlug}`),
      ]
    : [];

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core" />

      <section className={cn(VS.widths.page, "pb-24 pt-14 sm:pt-16 lg:pb-28 lg:pt-20")}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="max-w-[760px]">
            <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">
              Production-ready MJML system
            </p>
            <h1
              className={cn(
                "mt-4 max-w-[15ch] text-[3rem] font-semibold leading-[0.9] text-(--text-primary-dark) sm:text-[4.15rem] lg:text-[4.65rem]",
                displaySerif.className,
              )}
            >
              Stop rebuilding the same emails every project
            </h1>
            <p className="mt-6 max-w-[62ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
              A production-ready MJML system with workflows, components, and layouts that help you ship faster and
              reduce QA headaches.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/pricing" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_20px_38px_rgba(0,0,0,0.32)]")}>
                Get Hedgehog Core
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/workflows" className={cn(VS.buttons.secondaryLight, "h-10 border-(--surface-line) bg-(--surface-soft) px-4 text-[0.84rem]")}>
                Explore workflows
              </Link>
            </div>

            <ul className="mt-9 grid gap-3 text-[0.98rem] leading-7 text-(--th-body-copy) sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                Workflow-first implementation paths
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                MJML source paired with compiled HTML
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                Reduced QA rework across clients
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                Cleaner handoff to ESP delivery
              </li>
            </ul>
          </div>

          <aside className="surface-card-soft p-6 sm:p-7">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Why teams buy Core</p>
            <h2 className="mt-2 text-[1.56rem] font-semibold leading-[1.08] text-(--text-primary-dark)">
              Reuse a working system, not one-off snippets
            </h2>
            <ul className="mt-5 space-y-3.5 text-[0.98rem] leading-7 text-(--th-body-copy)">
              <li className="flex items-start gap-3">
                <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                Build from tested workflow structure instead of blank files.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                Keep delivery-safe HTML beside editable MJML for every handoff.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                Maintain consistency across campaigns, lifecycle sends, and transactional messages.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-(--border-light) bg-(--bg-soft) py-20 sm:py-24 lg:py-24">
        <div className={VS.widths.page}>
          <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">Primary feature</p>
          <h2
            className={cn(
              "mt-3 max-w-[20ch] text-[2.12rem] font-semibold leading-[0.94] text-(--text-primary-light) sm:text-[2.72rem]",
              displaySerif.className,
            )}
          >
            Start from a workflow, not a blank email
          </h2>
          <p className="mt-4 max-w-[72ch] text-[1rem] leading-8 text-(--text-secondary-light)">
            Each workflow includes layout, component stack, MJML source, and compiled HTML.
          </p>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {workflowShowcase.map((workflow) => (
              <article
                key={workflow.slug}
                className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              >
                <h3 className="text-[1.08rem] font-semibold leading-7 text-(--text-primary-light)">
                  {workflow.title}
                </h3>
                <p className="mt-2 text-[0.94rem] leading-7 text-(--text-secondary-light)">
                  {workflow.goal}
                </p>
                <p className="mt-2 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">
                  {workflow.linkedLayoutTitle}
                </p>
                <Link
                  href={`/workflows/${workflow.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-soft-elevated)"
                >
                  View workflow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-9">
            <Link href="/workflows" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_16px_30px_rgba(0,0,0,0.16)]")}>
              Explore workflows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-(--surface-line) bg-(--surface-soft) py-20 sm:py-24 lg:py-24">
        <div className={VS.widths.page}>
          <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--accent-support)">Common objection</p>
          <h2
            className={cn(
              "mt-3 max-w-[18ch] text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.5rem]",
              displaySerif.className,
            )}
          >
            Why not build it yourself?
          </h2>

          <div className="mt-8 overflow-hidden rounded-[1rem] border border-(--surface-line) bg-(--surface-soft)">
            <div className="grid grid-cols-[minmax(120px,0.28fr)_1fr_1fr] border-b border-(--surface-line) bg-(--dune-deep)">
              <p className="px-5 py-3.5 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Area</p>
              <p className="px-5 py-3.5 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Building from scratch</p>
              <p className="px-5 py-3.5 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Using Hedgehog</p>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(120px,0.28fr)_1fr_1fr] border-b border-(--surface-line) last:border-b-0"
              >
                <p className="px-5 py-3.5 text-[0.95rem] font-semibold text-(--text-primary-dark)">{row.label}</p>
                <p className="px-5 py-3.5 text-[0.92rem] leading-7 text-(--th-body-copy)">{row.fromScratch}</p>
                <p className="px-5 py-3.5 text-[0.92rem] leading-7 text-(--th-body-copy)">{row.withHedgehog}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-(--border-light) bg-(--bg-soft) py-20 sm:py-24 lg:py-24">
        <div className={VS.widths.page}>
          <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">Product proof</p>
          <h2
            className={cn(
              "mt-3 max-w-[18ch] text-[2.12rem] font-semibold leading-[0.94] text-(--text-primary-light) sm:text-[2.72rem]",
              displaySerif.className,
            )}
          >
            Technical proof, not mock-up claims
          </h2>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            <article className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">Pack file structure</p>
              <pre className="mt-4 overflow-x-auto rounded-[0.75rem] border border-(--border-dark) bg-(--bg-canvas) p-4 text-[0.78rem] leading-6 text-(--text-primary-dark)">
{MJML_PACK_PROJECT_STRUCTURE.join("\n")}
{"\n"}compiled/
{"\n"}workflows/onboarding/
{"\n"}workflows/password-reset/
              </pre>
            </article>

            <article className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">MJML to compiled HTML</p>
              <div className="mt-4 space-y-3.5">
                <pre className="overflow-x-auto rounded-[0.75rem] border border-(--border-dark) bg-(--bg-canvas) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
{mjmlSnippet}
                </pre>
                <pre className="overflow-x-auto rounded-[0.75rem] border border-(--border-dark) bg-(--bg-canvas) p-4 text-[0.74rem] leading-6 text-(--text-primary-dark)">
{htmlSnippet}
                </pre>
              </div>
            </article>

            <article className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_18px_32px_rgba(15,23,42,0.08)]">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">Workflow mapping</p>
              <p className="mt-2 text-[0.9rem] leading-7 text-(--text-primary-light)">
                {mappingWorkflow ? mappingWorkflow.title : "Workflow"} maps directly to layout and component stack.
              </p>
              <ol className="mt-4 space-y-2.5 text-[0.82rem] leading-6 text-(--text-secondary-light)">
                {mappingSteps.map((step) => (
                  <li key={step} className="rounded-[0.6rem] border border-(--border-light) bg-(--bg-soft) px-3.5 py-2.5">
                    {step}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-(--surface-line) bg-(--surface-soft) py-20 sm:py-24 lg:py-24">
        <div className={VS.widths.page}>
          <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">Scope</p>
          <h2
            className={cn(
              "mt-3 max-w-[14ch] text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.5rem]",
              displaySerif.className,
            )}
          >
            What you get
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {includedBreakdown.map((item) => (
              <article key={item.title} className="surface-card-soft p-5">
                <h3 className="text-[1.06rem] font-semibold text-(--text-primary-dark)">{item.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-7 text-(--th-body-copy)">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={cn(VS.widths.page, "pb-24 sm:pb-28 lg:pb-28")}>
        <div className="rounded-[1.3rem] border border-(--surface-line) bg-(--hedgehog-core-navy) px-7 py-10 sm:px-9 sm:py-12 lg:px-11 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2
                className={cn(
                  "max-w-[17ch] text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.45rem]",
                  displaySerif.className,
                )}
              >
                Get Hedgehog Core - £79
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-(--dune-muted)">
                Less than one avoidable rebuild session
              </p>
            </div>
            <div className="flex flex-wrap gap-3.5 lg:justify-end">
              <Link href="/pricing" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_18px_36px_rgba(0,0,0,0.34)]")}>
                Get Hedgehog Core
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/workflows"
                className="inline-flex h-11 items-center rounded-[0.9rem] border border-(--surface-line) bg-(--surface-soft) px-5 text-[0.86rem] font-semibold text-(--text-primary-dark) transition duration-200 hover:border-(--accent-support) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
              >
                Explore workflows
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
