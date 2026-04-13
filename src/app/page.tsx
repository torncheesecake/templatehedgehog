import Image from "next/image";
import Link from "next/link";
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

const primaryWorkflowSlugs = [
  "onboarding",
  "password-reset",
  "billing",
  "reporting",
  "notifications",
] as const;

const comparisonPoints = [
  {
    label: "Build time",
    fromScratch: "Assemble and stabilise each flow manually, often over several hours.",
    withHedgehog: "Start from a mapped workflow and adapt quickly.",
  },
  {
    label: "QA passes",
    fromScratch: "More re-check cycles to catch client and layout regressions.",
    withHedgehog: "Fewer rounds because source and output are already aligned.",
  },
  {
    label: "System consistency",
    fromScratch: "Patterns drift across campaigns, lifecycle, and transactional sends.",
    withHedgehog: "Shared workflow and layout structure across projects.",
  },
  {
    label: "Handoff",
    fromScratch: "More manual interpretation between development, QA, and ESP teams.",
    withHedgehog: "Clear path from workflow to layout to compiled output.",
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
  const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
  const primaryButton =
    "inline-flex h-11 items-center rounded-[0.8rem] border border-[#d13d4c] bg-[#d13d4c] px-5 text-[0.86rem] font-semibold !text-white transition hover:bg-[#b93340] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d13d4c] focus-visible:ring-offset-2";
  const secondaryButton =
    "inline-flex h-11 items-center rounded-[0.8rem] border border-black/10 bg-white px-5 text-[0.86rem] font-semibold text-black transition hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d13d4c] focus-visible:ring-offset-2";
  const workflowShowcase = buildWorkflowShowcase();
  const primaryWorkflow = workflowShowcase[0];
  const supportingWorkflows = workflowShowcase.slice(1, 5);
  const mappingWorkflow = primaryWorkflow ?? getEmailWorkflowBySlug("onboarding");

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
    <main className="min-h-screen bg-white text-slate-600 [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-24">
        <div className={pageWidth}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="max-w-[38rem]">
              <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
                Hedgehog Core
              </p>
              <h1
                className={cn(
                  "mt-5 max-w-3xl text-[3rem] font-semibold leading-[0.88] text-slate-900 sm:text-[4.2rem] lg:text-[4.9rem]",
                )}
              >
                Stop rebuilding the same emails every project
              </h1>
              <p className="mt-6 max-w-3xl text-[1.1rem] leading-8 text-slate-900">
                Start from workflows, not blank MJML files, with structure and
                output mapped before your team edits copy.
              </p>

              <div className="mt-16 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/pricing"
                  className={cn(primaryButton, "gap-2")}
                >
                  Get Hedgehog Core - £79
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/workflows"
                  className={secondaryButton}
                >
                  Explore workflows
                </Link>
              </div>

              <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-slate-600">
                Workflow, layout, component stack, and compiled HTML stay
                connected so development, QA, and ESP handoff move in one
                direction.
              </p>
            </div>

            <div className="relative lg:pl-2">
              <div className="pointer-events-none absolute -inset-4 rounded-[1.8rem] bg-[radial-gradient(circle_at_28%_18%,hsl(var(--th-accent-support)/0.2),transparent_58%)]" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_88%,transparent)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    Product system
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    <FileCode2 className="h-3.5 w-3.5" />
                    MJML + HTML
                  </span>
                </div>

                <div className="mt-5 rounded-[0.9rem] border border-[color-mix(in_srgb,var(--surface-line)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_84%,transparent)] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <GitBranchPlus className="h-3.5 w-3.5 text-slate-900" />
                      workflow
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                    <span className="inline-flex items-center gap-1">
                      <Layers3 className="h-3.5 w-3.5 text-slate-900" />
                      layout
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                    <span>components</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                    <span>output</span>
                  </div>
                  <p className="mt-2 text-[0.84rem] leading-6 text-slate-900">
                    {mappingWorkflow?.slug ?? "onboarding"} mapped to{" "}
                    {mappingWorkflow?.linkedLayoutSlug ?? "saas-welcome-system"} with{" "}
                    {mappingWorkflow?.componentStack.length ?? 0} ordered blocks.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                      MJML source
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-slate-900">
                      {mjmlSnippet}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                      Compiled HTML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-slate-900">
                      {htmlSnippet}
                    </pre>
                  </div>
                </div>

                <p className="mt-5 text-[0.8rem] leading-6 text-slate-600">
                  {mappingPath}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
              Workflow entry
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.14rem] font-semibold leading-[0.94] text-slate-900 sm:text-[2.82rem]",
              )}
            >
              Start from a workflow, not a blank email
            </h2>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-slate-600">
              Each workflow carries trigger context, layout structure, component
              order, and output expectations so you spend time shipping, not
              rebuilding foundations.
            </p>
          </div>

          {primaryWorkflow ? (
            <div className="mt-16 grid gap-6">
              <article className="relative overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-8">
                <span className="absolute right-5 top-5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                  Featured workflow
                </span>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
                  <div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                      {primaryWorkflow.linkedLayoutTitle}
                    </p>
                    <h3
                      className={cn(
                        "mt-2 text-[1.62rem] leading-[1.02] text-slate-900",
                      )}
                    >
                      {primaryWorkflow.title}
                    </h3>
                    <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
                      {workflowOutcomeBySlug[primaryWorkflow.slug] ??
                        primaryWorkflow.goal}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {primaryWorkflow.componentStack
                        .slice(0, 4)
                        .map((item) => (
                          <span
                            key={`${primaryWorkflow.slug}-${item.componentSlug}`}
                            className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.78rem] font-medium text-slate-600"
                          >
                            {item.componentTitle}
                          </span>
                        ))}
                    </div>
                    <Link
                      href={`/workflows/${primaryWorkflow.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-slate-900 transition hover:text-slate-900"
                    >
                      View workflow
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50">
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
                    className="rounded-[1.05rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                      {workflow.linkedLayoutTitle}
                    </p>
                    <h3 className="mt-2 text-[1.08rem] font-semibold leading-7 text-slate-900">
                      {workflow.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-slate-600">
                      {workflowOutcomeBySlug[workflow.slug] ?? workflow.goal}
                    </p>
                    <Link
                      href={`/workflows/${workflow.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-slate-900 transition hover:text-slate-900"
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
            <Link href="/workflows" className={cn(primaryButton, "gap-2")}>
              View all workflows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
              Core selling section
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-slate-900 sm:text-[2.72rem]",
              )}
            >
              Build it yourself vs Hedgehog
            </h2>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-slate-600">
              Same output required. One path is manual and repetitive, the
              other starts from production-ready workflow structure.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <article className="rounded-[1.15rem] border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-500">
                Build from scratch
              </p>
              <p className="mt-2 text-[0.9rem] leading-7 text-slate-600">
                More manual effort before a workflow is stable in production.
              </p>
              <div className="mt-5 space-y-4">
                {comparisonPoints.map((item) => (
                  <div key={`from-${item.label}`} className="rounded-[0.8rem] border border-slate-200 p-3.5">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[0.88rem] leading-6 text-slate-600">
                      {item.fromScratch}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.15rem] border border-slate-300 bg-white p-6 sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-900">
                Using Hedgehog
              </p>
              <h3 className="mt-2 text-[1.35rem] leading-tight text-slate-900">
                Resolve the workflow first
              </h3>
              <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">
                Start from structure, then adapt copy and data for delivery.
              </p>
              <div className="mt-6 space-y-4">
                {comparisonPoints.map((item) => (
                  <div key={`with-${item.label}`} className="rounded-[0.8rem] border border-slate-300 p-4">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-slate-900">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[0.9rem] leading-6 text-slate-600">
                      {item.withHedgehog}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[0.9rem] font-medium leading-7 text-slate-900">
                Start from structure, not from scratch.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
              Technical proof
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-slate-900 sm:text-[2.72rem]",
              )}
            >
              Inspect the system before you buy
            </h2>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-slate-600">
              Real source, compiled output, and workflow mapping from the same
              structure shipped in Hedgehog Core.
            </p>
          </div>

          <article className="mt-16 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[color-mix(in_srgb,var(--surface-soft)_94%,transparent)]">
            <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                  MJML to compiled HTML
                </p>
                <div className="mt-5 rounded-[1.05rem] border border-[color-mix(in_srgb,var(--surface-line)_68%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] p-4 sm:p-5">
                  <div className="inline-flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    <span>Source</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                    <span>Compile</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                    <span>Output</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-[0.88rem] border border-[color-mix(in_srgb,var(--surface-line)_64%,transparent)]">
                      <p className="border-b border-[color-mix(in_srgb,var(--surface-line)_58%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                        MJML source
                      </p>
                      <pre className="overflow-x-auto bg-[color-mix(in_srgb,var(--surface-strong)_88%,transparent)] p-3 text-[0.72rem] leading-6 text-slate-900">
                        {mjmlSnippet}
                      </pre>
                    </div>
                    <div className="overflow-hidden rounded-[0.88rem] border border-[color-mix(in_srgb,var(--surface-line)_64%,transparent)]">
                      <p className="border-b border-[color-mix(in_srgb,var(--surface-line)_58%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                        Compiled HTML
                      </p>
                      <pre className="overflow-x-auto bg-[color-mix(in_srgb,var(--surface-strong)_88%,transparent)] p-3 text-[0.72rem] leading-6 text-slate-900">
                        {htmlSnippet}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                  Pack structure and workflow mapping
                </p>

                <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  File tree excerpt
                </p>
                <pre className="mt-2 overflow-x-auto text-[0.76rem] leading-7 text-slate-900">
{`workflows/
layouts/
components/
compiled/*.html
docs/
mjml.config`}
                </pre>

                <p className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  Mapping path
                </p>
                <ol className="mt-2 space-y-1.5 text-[0.86rem] leading-6 text-slate-900">
                  <li>{`workflow/${mappingWorkflow?.slug ?? "onboarding"}`}</li>
                  <li>{`layout/${mappingWorkflow?.linkedLayoutSlug ?? "saas-welcome-system"}`}</li>
                  <li>{`component/${mappingWorkflow?.componentStack[0]?.componentSlug ?? "header-brand-row"}`}</li>
                  <li>{`compiled/${mappingWorkflow?.slug ?? "onboarding"}.html`}</li>
                </ol>
                <p className="mt-3 text-[0.8rem] leading-6 text-slate-600">
                  {mappingPath}
                </p>

                {mappingWorkflow ? (
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[0.95rem] border border-[color-mix(in_srgb,var(--surface-line)_68%,transparent)]">
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

      <section className="border-y border-slate-200 bg-slate-50 py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
              Pack value
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-slate-900 sm:text-[2.72rem]",
              )}
            >
              What you get in Hedgehog Core
            </h2>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-slate-600">
              A complete development system that covers build, proof, and
              handoff in one workflow-focused pack.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
            <article className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_20px_36px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Core build layers
              </p>
              <div className="mt-5 divide-y divide-(--border-light)">
                {buildLayers.map((item) => (
                  <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                    <p
                      className={cn(
                        "text-[1.24rem] font-semibold leading-8 text-slate-900",
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.94rem] leading-7 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_20px_36px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Delivery and handoff
              </p>
              <div className="mt-5 space-y-4">
                {deliveryLayers.map((item) => (
                  <div key={item.title}>
                    <p className="text-[1.04rem] font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-7 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 space-y-3.5 text-[0.92rem] leading-7 text-slate-600">
                {coreDeliveryHighlights.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-24">
        <div className={pageWidth}>
          <div className="mx-auto max-w-[45rem] text-center">
            <h2
              className={cn(
                "text-[2.25rem] font-semibold leading-[0.96] text-slate-900 sm:text-[2.95rem]",
              )}
            >
              Get Hedgehog Core - £79
            </h2>
            <p className="mt-6 mx-auto max-w-3xl text-[1rem] leading-8 text-slate-600">
              One payment. Use it across every project and ship faster with less QA overhead.
            </p>

            <div className="mt-16 flex flex-wrap justify-center gap-2.5">
              <Link href="/pricing" className={cn(primaryButton, "gap-2")}>
                Get Hedgehog Core - £79
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/workflows"
                className={secondaryButton}
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
