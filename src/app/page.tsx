import Image from "next/image";
import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  GitBranchPlus,
  Layers3,
} from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  getEmailWorkflowBySlug,
  getFeaturedEmailWorkflows,
} from "@/data/workflows";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
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
    fromScratch: "4 to 8 hours to assemble and stabilise a single production flow.",
    withHedgehog: "Start from a mapped workflow and adapt in under an hour.",
  },
  {
    label: "QA passes",
    fromScratch: "Multiple rounds to catch layout drift and client breakage.",
    withHedgehog: "Fewer passes because structure and output are production-oriented.",
  },
  {
    label: "Consistency",
    fromScratch: "Patterns diverge between campaigns and lifecycle sends over time.",
    withHedgehog: "Shared workflow, layout, and component structure across every send.",
  },
  {
    label: "Handoff friction",
    fromScratch: "Manual interpretation between development, QA, and ESP delivery.",
    withHedgehog: "MJML source and compiled HTML aligned in one system.",
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

const workflowOutcomeBySlug: Record<string, string> = {
  onboarding:
    "Move new users to first-session activation with stable message sequencing.",
  "password-reset":
    "Recover account access quickly with security-safe structure and copy.",
  billing:
    "Confirm charges clearly and reduce finance and support back-and-forth.",
  reporting:
    "Ship recurring KPI updates in a digest that stays consistent each week.",
  notifications: "Deliver urgent account alerts with clear next-step actions.",
};

const fromScratchEffort = [92, 86, 82, 84] as const;
const withHedgehogEffort = [34, 38, 30, 32] as const;

const coreDeliveryHighlights = [
  "Versioned updates with changelog context for safe adoption.",
  "Workflow, layout, and component mapping kept in one registry-driven system.",
  "Built for developer, QA, and ESP handoff without duplicate work.",
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
  const primaryWorkflow = workflowShowcase[0];
  const supportingWorkflows = workflowShowcase.slice(1, 5);
  const mappingWorkflow = primaryWorkflow ?? getEmailWorkflowBySlug("onboarding");

  const comparisonItems = comparisonRows.map((row, index) => ({
    ...row,
    fromScratchScore: fromScratchEffort[index] ?? 82,
    withHedgehogScore: withHedgehogEffort[index] ?? 34,
  }));

  const buildLayers = [
    {
      title: `${COMPONENT_COUNT} components`,
      detail:
        "Reusable MJML building blocks for campaign, lifecycle, and transactional sends.",
    },
    {
      title: `${LAYOUT_COUNT} layouts`,
      detail:
        "Full email structures grouped by system so teams stop rebuilding shell markup.",
    },
    {
      title: `${WORKFLOW_COUNT} workflows`,
      detail:
        "Real triggers mapped to layout and component stack so implementation starts with structure.",
    },
  ] as const;

  const deliveryLayers = [
    {
      title: "Technical documentation",
      detail:
        "Client behaviour notes, safe customisation guidance, and handoff instructions.",
    },
    {
      title: "Compiled HTML outputs",
      detail:
        "Final delivery markup paired with MJML source for QA and ESP import.",
    },
  ] as const;

  const mappingPath = mappingWorkflow
    ? `workflow/${mappingWorkflow.slug} -> layout/${mappingWorkflow.linkedLayoutSlug} -> component/${mappingWorkflow.componentStack[0]?.componentSlug ?? "hero-overlay-modern"} -> compiled/${mappingWorkflow.slug}.html`
    : "workflow/onboarding -> layout/saas-welcome-system -> component/header-brand-row -> compiled/onboarding.html";

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />

      <section className="relative overflow-hidden border-b border-(--surface-line) bg-(--bg-elevated) py-20 sm:py-24 lg:py-28">
        <div className={VS.widths.page}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="max-w-[38rem]">
              <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">
                Hedgehog Core
              </p>
              <h1
                className={cn(
                  "mt-4 max-w-[16ch] text-[3rem] font-semibold leading-[0.88] text-(--text-primary-dark) sm:text-[4.2rem] lg:text-[4.9rem]",
                  displaySerif.className,
                )}
              >
                Stop rebuilding the same emails every project
              </h1>
              <p className="mt-6 max-w-[45ch] text-[1.1rem] leading-8 text-(--text-primary-dark)">
                Start from workflows, not blank MJML files, with structure and
                output mapped before your team edits copy.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/pricing"
                  className={cn(
                    VS.buttons.primaryLarge,
                    "gap-2 shadow-[0_20px_38px_rgba(0,0,0,0.34)]",
                  )}
                >
                  Get Hedgehog Core - £79
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/workflows"
                  className={cn(
                    VS.buttons.secondaryLight,
                    "h-11 border-(--surface-line) bg-(--surface-soft)",
                  )}
                >
                  Explore workflows
                </Link>
              </div>

              <p className="mt-6 max-w-[55ch] text-[0.95rem] leading-7 text-(--th-body-copy)">
                Workflow, layout, component stack, and compiled HTML stay
                connected so development, QA, and ESP handoff move in one
                direction.
              </p>
            </div>

            <div className="relative lg:pl-2">
              <div className="pointer-events-none absolute -inset-4 rounded-[1.8rem] bg-[radial-gradient(circle_at_28%_18%,hsl(var(--th-accent-support)/0.2),transparent_58%)]" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_88%,transparent)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                    Product system
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                    <FileCode2 className="h-3.5 w-3.5" />
                    MJML + HTML
                  </span>
                </div>

                <div className="mt-5 rounded-[0.9rem] border border-[color-mix(in_srgb,var(--surface-line)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_84%,transparent)] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                    <span className="inline-flex items-center gap-1">
                      <GitBranchPlus className="h-3.5 w-3.5 text-(--accent-support)" />
                      workflow
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-(--accent-support)" />
                    <span className="inline-flex items-center gap-1">
                      <Layers3 className="h-3.5 w-3.5 text-(--accent-support)" />
                      layout
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-(--accent-support)" />
                    <span>components</span>
                    <ArrowRight className="h-3.5 w-3.5 text-(--accent-support)" />
                    <span>output</span>
                  </div>
                  <p className="mt-2 text-[0.84rem] leading-6 text-(--text-primary-dark)">
                    {mappingWorkflow?.slug ?? "onboarding"} mapped to{" "}
                    {mappingWorkflow?.linkedLayoutSlug ?? "saas-welcome-system"} with{" "}
                    {mappingWorkflow?.componentStack.length ?? 0} ordered blocks.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                      MJML source
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">
                      {mjmlSnippet}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                      Compiled HTML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">
                      {htmlSnippet}
                    </pre>
                  </div>
                </div>

                <p className="mt-5 text-[0.8rem] leading-6 text-(--th-body-copy)">
                  {mappingPath}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-(--border-light) bg-(--bg-soft) py-24 sm:py-28 lg:py-30">
        <div className={VS.widths.page}>
          <div className="max-w-[74ch]">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--text-secondary-light)">
              Workflow entry
            </p>
            <h2
              className={cn(
                "mt-4 text-[2.14rem] font-semibold leading-[0.94] text-(--text-primary-light) sm:text-[2.82rem]",
                displaySerif.className,
              )}
            >
              Start from a workflow, not a blank email
            </h2>
            <p className="mt-5 max-w-[68ch] text-[1rem] leading-8 text-(--text-secondary-light)">
              Each workflow carries trigger context, layout structure, component
              order, and output expectations so you spend time shipping, not
              rebuilding foundations.
            </p>
          </div>

          {primaryWorkflow ? (
            <div className="mt-12 grid gap-6">
              <article className="relative overflow-hidden rounded-[1.25rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-8">
                <span className="absolute right-5 top-5 rounded-full border border-(--border-light) bg-(--bg-soft) px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                  Featured workflow
                </span>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
                  <div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                      {primaryWorkflow.linkedLayoutTitle}
                    </p>
                    <h3
                      className={cn(
                        "mt-2 text-[1.62rem] leading-[1.02] text-(--text-primary-light)",
                        displaySerif.className,
                      )}
                    >
                      {primaryWorkflow.title}
                    </h3>
                    <p className="mt-3 text-[0.98rem] leading-7 text-(--text-secondary-light)">
                      {workflowOutcomeBySlug[primaryWorkflow.slug] ??
                        primaryWorkflow.goal}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {primaryWorkflow.componentStack
                        .slice(0, 4)
                        .map((item) => (
                          <span
                            key={`${primaryWorkflow.slug}-${item.componentSlug}`}
                            className="inline-flex rounded-full border border-(--border-light) bg-(--bg-soft) px-3 py-1 text-[0.78rem] font-medium text-(--text-secondary-light)"
                          >
                            {item.componentTitle}
                          </span>
                        ))}
                    </div>
                    <Link
                      href={`/workflows/${primaryWorkflow.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-support)"
                    >
                      View workflow
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] border border-(--border-light) bg-(--bg-soft)">
                    <Image
                      src={primaryWorkflow.previewImageUrl}
                      alt={`${primaryWorkflow.title} workflow preview`}
                      fill
                      sizes="(max-width: 1280px) 90vw, 42vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </article>

              <div className="grid gap-5 sm:grid-cols-2">
                {supportingWorkflows.map((workflow) => (
                  <article
                    key={workflow.slug}
                    className="rounded-[1.05rem] border border-(--border-light) bg-(--bg-soft-elevated) p-5 shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                      {workflow.linkedLayoutTitle}
                    </p>
                    <h3 className="mt-2 text-[1.08rem] font-semibold leading-7 text-(--text-primary-light)">
                      {workflow.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-(--text-secondary-light)">
                      {workflowOutcomeBySlug[workflow.slug] ?? workflow.goal}
                    </p>
                    <Link
                      href={`/workflows/${workflow.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-support)"
                    >
                      View workflow
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <Link href="/workflows" className={cn(VS.buttons.primaryLarge, "gap-2")}>
              View all workflows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-(--surface-line) bg-(--surface-soft) py-24 sm:py-28 lg:py-30">
        <div className={VS.widths.page}>
          <div className="max-w-[74ch]">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">
              Core selling section
            </p>
            <h2
              className={cn(
                "mt-4 text-[2.08rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.72rem]",
                displaySerif.className,
              )}
            >
              Build it yourself vs Hedgehog
            </h2>
            <p className="mt-5 max-w-[66ch] text-[1rem] leading-8 text-(--th-body-copy)">
              Same requirement, two very different levels of effort across
              delivery.
            </p>
          </div>

          <div className="mt-12 rounded-[1.3rem] border border-(--surface-line) bg-(--surface-strong) p-6 sm:p-8 lg:p-9">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[1rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_88%,transparent)] p-5 sm:p-6">
                <h3
                  className={cn(
                    "text-[1.3rem] font-semibold leading-8 text-(--text-primary-dark)",
                    displaySerif.className,
                  )}
                >
                  Build from scratch
                </h3>
                <ul className="mt-5 space-y-4">
                  {comparisonItems.map((item) => (
                    <li key={`scratch-${item.label}`}>
                      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[0.9rem] leading-7 text-(--th-body-copy)">
                        {item.fromScratch}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--surface-line)_76%,transparent)]">
                        <span
                          className="block h-1.5 rounded-full bg-[color-mix(in_srgb,var(--th-accent)_70%,black)]"
                          style={{ width: `${item.fromScratchScore}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="relative rounded-[1rem] border border-(--accent-support) bg-(--dune-deep) p-5 shadow-[0_18px_34px_rgba(0,0,0,0.34)] sm:p-6">
                <span className="absolute right-4 top-4 rounded-full border border-[hsl(var(--th-accent-support)/0.35)] bg-[hsl(var(--th-accent-support)/0.12)] px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.09em] text-(--text-primary-dark)">
                  Stronger path
                </span>
                <h3
                  className={cn(
                    "text-[1.3rem] font-semibold leading-8 text-(--text-primary-dark)",
                    displaySerif.className,
                  )}
                >
                  Using Hedgehog
                </h3>
                <ul className="mt-5 space-y-4">
                  {comparisonItems.map((item) => (
                    <li key={`hedgehog-${item.label}`}>
                      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[0.9rem] leading-7 text-(--text-primary-dark)">
                        {item.withHedgehog}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--surface-line)_80%,transparent)]">
                        <span
                          className="block h-1.5 rounded-full bg-(--accent-support)"
                          style={{ width: `${item.withHedgehogScore}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-(--surface-line) bg-(--surface-strong) py-24 sm:py-28 lg:py-30">
        <div className={VS.widths.page}>
          <div className="max-w-[74ch]">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">
              Technical proof
            </p>
            <h2
              className={cn(
                "mt-4 text-[2.08rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.72rem]",
                displaySerif.className,
              )}
            >
              Inspect the system before you buy
            </h2>
            <p className="mt-5 max-w-[66ch] text-[1rem] leading-8 text-(--th-body-copy)">
              Real source, compiled output, and workflow mapping from the same
              structure shipped in Hedgehog Core.
            </p>
          </div>

          <article className="mt-12 overflow-hidden rounded-[1.35rem] border border-(--surface-line) bg-(--surface-soft)">
            <div className="grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
              <div className="p-6 sm:p-8 lg:p-9">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                  MJML to compiled HTML
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                      MJML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_76%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_84%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">
                      {mjmlSnippet}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                      HTML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_76%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_84%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">
                      {htmlSnippet}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-(--surface-line) p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                  Pack structure and mapping
                </p>
                <pre className="mt-4 overflow-x-auto text-[0.76rem] leading-7 text-(--text-primary-dark)">
{`src/workflows/
src/layouts/
src/components/
compiled/*.html
docs/
mjml.config`}
                </pre>

                <p className="mt-5 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                  Workflow mapping path
                </p>
                <p className="mt-2 text-[0.86rem] leading-6 text-(--text-primary-dark)">
                  {mappingPath}
                </p>

                {mappingWorkflow ? (
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[0.92rem] border border-[color-mix(in_srgb,var(--surface-line)_78%,transparent)]">
                    <Image
                      src={mappingWorkflow.previewImageUrl}
                      alt={`${mappingWorkflow.title} technical preview`}
                      fill
                      sizes="(max-width: 1280px) 90vw, 36vw"
                      className="object-cover object-top"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-(--border-light) bg-(--bg-soft) py-24 sm:py-28 lg:py-30">
        <div className={VS.widths.page}>
          <div className="max-w-[74ch]">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--text-secondary-light)">
              Pack value
            </p>
            <h2
              className={cn(
                "mt-4 text-[2.08rem] font-semibold leading-[0.95] text-(--text-primary-light) sm:text-[2.72rem]",
                displaySerif.className,
              )}
            >
              What you get in Hedgehog Core
            </h2>
            <p className="mt-5 max-w-[66ch] text-[1rem] leading-8 text-(--text-secondary-light)">
              A complete development system that covers build, proof, and
              handoff in one workflow-focused pack.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
            <article className="rounded-[1.2rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_20px_36px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                Core build layers
              </p>
              <div className="mt-5 divide-y divide-(--border-light)">
                {buildLayers.map((item) => (
                  <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                    <p
                      className={cn(
                        "text-[1.24rem] font-semibold leading-8 text-(--text-primary-light)",
                        displaySerif.className,
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.94rem] leading-7 text-(--text-secondary-light)">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.2rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_20px_36px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                Delivery and handoff
              </p>
              <div className="mt-5 space-y-4">
                {deliveryLayers.map((item) => (
                  <div key={item.title}>
                    <p className="text-[1.04rem] font-semibold text-(--text-primary-light)">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-7 text-(--text-secondary-light)">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 space-y-3.5 text-[0.92rem] leading-7 text-(--text-secondary-light)">
                {coreDeliveryHighlights.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-(--surface-line) bg-(--surface-strong) py-24 sm:py-28 lg:py-30">
        <div className={VS.widths.page}>
          <div className="relative mx-auto max-w-[50rem] overflow-hidden rounded-[1.58rem] border border-(--surface-line) bg-(--hedgehog-core-navy) px-8 py-12 text-center shadow-[0_28px_56px_rgba(0,0,0,0.38)] sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--th-accent-support)/0.2),transparent_60%)]" />
            <div className="relative">
              <h2
                className={cn(
                  "text-[2.08rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.68rem]",
                  displaySerif.className,
                )}
              >
                Get Hedgehog Core - £79
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-(--dune-muted)">
                Less than one avoidable rebuild session.
              </p>
              <p className="mt-2 text-[0.9rem] leading-7 text-(--th-body-copy)">
                One payment, commercial use, instant access on the primary
                deployment.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <Link
                  href="/pricing"
                  className={cn(
                    VS.buttons.primaryLarge,
                    "gap-2 shadow-[0_18px_34px_rgba(0,0,0,0.34)]",
                  )}
                >
                  Get Hedgehog Core - £79
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
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
