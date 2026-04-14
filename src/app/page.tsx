import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  GitBranchPlus,
  Layers3,
} from "lucide-react";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { TrackEventOnVisible } from "@/components/analytics/TrackEventOnVisible";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { HomeObjectionBlock } from "@/components/home/HomeObjectionBlock";
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

const heroTrustPoints = [
  "One payment",
  "Instant download",
  `${COMPONENT_COUNT} components`,
  `${LAYOUT_COUNT} layouts`,
  `${WORKFLOW_COUNT} workflows`,
  "MJML + compiled HTML",
  "Docs included",
  "Updated regularly",
] as const;

const coreIncludedSummary = [
  `${COMPONENT_COUNT} components`,
  `${LAYOUT_COUNT} layouts`,
  `${WORKFLOW_COUNT} workflows`,
  "MJML source + compiled HTML",
  "Docs and changelog",
] as const;

const quickNavLinks = [
  { href: "#workflows", label: "Workflows" },
  { href: "#technical-proof", label: "Technical proof" },
  { href: "#included", label: "What's included" },
  { href: "#pricing-cta", label: "Pricing" },
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
    "inline-flex h-11 items-center rounded-[0.8rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.86rem] font-semibold !text-[var(--action-text)] shadow-[0_12px_34px_rgba(201,167,77,0.3)] transition hover:-translate-y-0.5 hover:bg-[var(--action-primary-hover)] hover:shadow-[0_18px_44px_rgba(201,167,77,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const secondaryButton =
    "inline-flex h-11 items-center rounded-[0.8rem] border border-slate-700 bg-slate-900 px-5 text-[0.86rem] font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
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
    <main className="min-h-screen bg-[#07111f] text-slate-300 [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" heroTone="neutral" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <TrackEventOnMount event="homepage_view" payload={{ source: "homepage" }} />
      <TrackEventOnVisible
        targetId="workflows"
        event="workflows_section_view"
        payload={{ source: "homepage" }}
      />
      <TrackEventOnVisible
        targetId="technical-proof"
        event="technical_proof_view"
        payload={{ source: "homepage" }}
      />
      <TrackEventOnVisible
        targetId="pricing-cta"
        event="pricing_section_view"
        payload={{ source: "homepage" }}
      />

      <section className="relative overflow-hidden border-b border-slate-800/70 bg-[radial-gradient(circle_at_76%_18%,rgba(59,130,246,0.24),transparent_38%),radial-gradient(circle_at_18%_84%,rgba(30,64,175,0.14),transparent_34%),#07111f] py-24">
        <div className={pageWidth}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="max-w-[38rem]">
              <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
                Hedgehog Core
              </p>
              <h1
                className={cn(
                  "mt-5 max-w-3xl text-[3rem] font-semibold leading-[0.88] text-white sm:text-[4.2rem] lg:text-[4.9rem]",
                )}
              >
                Stop rebuilding the same emails every project
              </h1>
              <p className="mt-3 max-w-3xl text-[1.1rem] leading-8 text-slate-300">
                Start from workflows, not blank MJML files, with structure and
                output mapped before your team edits copy.
              </p>

              <div className="mt-16 flex flex-wrap items-center gap-2.5">
                <TrackableLink
                  href="/pricing"
                  event="hero_primary_cta_click"
                  payload={{ source: "hero" }}
                  className={cn(primaryButton, "gap-2")}
                >
                  Get Hedgehog Core - £79
                  <ArrowRight className="h-4 w-4" />
                </TrackableLink>
                <TrackableLink
                  href="/workflows"
                  event="hero_secondary_cta_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-slate-700 bg-slate-900 px-5 text-[0.86rem] font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                >
                  Explore workflows
                </TrackableLink>
                <TrackableLink
                  href="#technical-proof"
                  event="hero_tertiary_cta_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-slate-700 bg-[#07111f] px-5 text-[0.86rem] font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                >
                  Inspect the files
                </TrackableLink>
              </div>

              <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-slate-400">
                Workflow, layout, component stack, and compiled HTML stay
                connected so development, QA, and ESP handoff move in one
                direction.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {heroTrustPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[0.76rem] font-semibold tracking-[0.03em] text-slate-200"
                  >
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[0.84rem] font-semibold">
                <TrackableLink
                  href="/docs"
                  event="docs_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Documentation
                </TrackableLink>
                <TrackableLink
                  href="/changelog"
                  event="changelog_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Changelog
                </TrackableLink>
                <TrackableLink
                  href="/pricing"
                  event="licence_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Licence and pricing
                </TrackableLink>
                <Link
                  href="/support"
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Support
                </Link>
              </div>

              <div className="mt-5 rounded-[0.9rem] border border-slate-700 bg-slate-900 px-4 py-3">
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  Included in Hedgehog Core
                </p>
                <p className="mt-2 text-[0.9rem] leading-7 text-slate-200">
                  {coreIncludedSummary.join(" • ")}
                </p>
              </div>
            </div>

            <div className="relative lg:pl-2">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-600/80 bg-slate-900 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.08),0_34px_100px_rgba(37,99,235,0.24),0_28px_82px_rgba(0,0,0,0.58)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                    Product system
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                    <FileCode2 className="h-3.5 w-3.5 text-blue-400" />
                    MJML + HTML
                  </span>
                </div>

                <div className="mt-5 rounded-[0.9rem] border border-slate-700 bg-slate-800 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <GitBranchPlus className="h-3.5 w-3.5 text-blue-400" />
                      workflow
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                    <span className="inline-flex items-center gap-1">
                      <Layers3 className="h-3.5 w-3.5 text-blue-400" />
                      layout
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                    <span>components</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-slate-100">output</span>
                  </div>
                  <p className="mt-2 text-[0.84rem] leading-6 text-slate-300">
                    {mappingWorkflow?.slug ?? "onboarding"} mapped to{" "}
                    {mappingWorkflow?.linkedLayoutSlug ?? "saas-welcome-system"} with{" "}
                    {mappingWorkflow?.componentStack.length ?? 0} ordered blocks.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                      MJML source
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-slate-700 bg-slate-900 p-3 text-[0.72rem] leading-6 text-slate-300">
                      {mjmlSnippet}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                      Compiled HTML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[0.8rem] border border-slate-700 bg-slate-900 p-3 text-[0.72rem] leading-6 text-slate-300">
                      {htmlSnippet}
                    </pre>
                  </div>
                </div>

                <p className="mt-5 text-[0.8rem] leading-6 text-slate-400">
                  {mappingPath}
                </p>
              </div>
            </div>
          </div>

          <nav
            aria-label="Homepage quick navigation"
            className="mt-12 flex flex-wrap items-center gap-2.5"
          >
            {quickNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-[0.82rem] font-semibold text-slate-100 transition hover:border-slate-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section id="workflows" className="border-y border-slate-800 bg-[#0b1728] py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
              Workflow entry
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.14rem] font-semibold leading-[0.94] text-white sm:text-[2.82rem]",
              )}
            >
              Start from a workflow, not a blank email
            </h2>
            <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-300">
              Each workflow carries trigger context, layout structure, component
              order, and output expectations so you spend time shipping, not
              rebuilding foundations.
            </p>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-7 text-slate-400">
              Workflow means a real send type such as onboarding or billing. Layout is the reusable email shell.
            </p>
          </div>

          {primaryWorkflow ? (
            <div className="mt-16 grid gap-6">
              <article className="relative overflow-hidden rounded-[1.25rem] border border-slate-600/80 bg-slate-900 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.07),0_28px_86px_rgba(37,99,235,0.18),0_24px_64px_rgba(0,0,0,0.5)] sm:p-8">
                <span className="absolute right-5 top-5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  Featured workflow
                </span>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
                  <div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-400">
                      {primaryWorkflow.linkedLayoutTitle}
                    </p>
                    <h3
                      className={cn(
                        "mt-2 text-[1.62rem] leading-[1.02] text-white",
                      )}
                    >
                      {primaryWorkflow.title}
                    </h3>
                    <p className="mt-3 text-[0.98rem] leading-7 text-slate-300">
                      {workflowOutcomeBySlug[primaryWorkflow.slug] ??
                        primaryWorkflow.goal}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {primaryWorkflow.componentStack
                        .slice(0, 4)
                        .map((item) => (
                          <span
                            key={`${primaryWorkflow.slug}-${item.componentSlug}`}
                            className="inline-flex rounded-full border border-slate-700 bg-[#07111f] px-3 py-1 text-[0.78rem] font-medium text-slate-300"
                          >
                            {item.componentTitle}
                          </span>
                        ))}
                    </div>
                    <TrackableLink
                      href={`/workflows/${primaryWorkflow.slug}`}
                      event="workflow_card_click"
                      payload={{ source: "workflows_section", workflowSlug: primaryWorkflow.slug }}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-slate-100 transition hover:text-white"
                    >
                      View workflow
                      <ArrowRight className="h-4 w-4" />
                    </TrackableLink>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] border border-slate-700 bg-[#07111f]">
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
                    className="rounded-[1.05rem] border border-slate-700 bg-slate-900 p-5"
                  >
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-slate-400">
                      {workflow.linkedLayoutTitle}
                    </p>
                    <h3 className="mt-2 text-[1.08rem] font-semibold leading-7 text-white">
                      {workflow.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-slate-300">
                      {workflowOutcomeBySlug[workflow.slug] ?? workflow.goal}
                    </p>
                    <TrackableLink
                      href={`/workflows/${workflow.slug}`}
                      event="workflow_card_click"
                      payload={{ source: "workflows_section", workflowSlug: workflow.slug }}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-slate-100 transition hover:text-white"
                    >
                      View workflow
                      <ArrowRight className="h-4 w-4" />
                    </TrackableLink>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <TrackableLink
              href="/workflows"
              event="hero_secondary_cta_click"
              payload={{ source: "workflows_section" }}
              className={cn(primaryButton, "gap-2")}
            >
              View all workflows
              <ArrowRight className="h-4 w-4" />
            </TrackableLink>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-[#07111f] py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
              Core selling section
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-white sm:text-[2.72rem]",
              )}
            >
              Build it yourself vs Hedgehog
            </h2>
            <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-300">
              Same output required. One path is manual and repetitive, the
              other starts from production-ready workflow structure.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <article className="rounded-[1.15rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-400">
                Build from scratch
              </p>
              <p className="mt-2 text-[0.9rem] leading-7 text-slate-400">
                More manual effort before a workflow is stable in production.
              </p>
              <div className="mt-5 space-y-4">
                {comparisonPoints.map((item) => (
                  <div key={`from-${item.label}`} className="rounded-[0.8rem] border border-slate-800 p-3.5">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[0.88rem] leading-6 text-slate-400">
                      {item.fromScratch}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.15rem] border border-slate-700 bg-slate-900 p-6 sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-white">
                Using Hedgehog
              </p>
              <h3 className="mt-2 text-[1.35rem] leading-tight text-white">
                Resolve the workflow first
              </h3>
              <p className="mt-2 text-[0.94rem] leading-7 text-slate-300">
                Start from structure, then adapt copy and data for delivery.
              </p>
              <div className="mt-6 space-y-4">
                {comparisonPoints.map((item) => (
                  <div key={`with-${item.label}`} className="rounded-[0.8rem] border border-slate-700 bg-slate-800 p-4">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-slate-100">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[0.9rem] leading-6 text-slate-300">
                      {item.withHedgehog}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.9rem] font-medium leading-7 text-slate-100">
                Start from structure, not from scratch.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="technical-proof" className="border-y border-slate-800 bg-[#0b1728] py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
              Technical proof
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-white sm:text-[2.72rem]",
              )}
            >
              Inspect the system before you buy
            </h2>
            <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-300">
              Real source, compiled output, and workflow mapping from the same
              structure shipped in Hedgehog Core.
            </p>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-7 text-slate-400">
              Component means a reusable content block. Compiled HTML means output ready for QA and ESP import.
            </p>
          </div>

          <article className="mt-16 overflow-hidden rounded-[1.5rem] border border-slate-700 bg-slate-900">
            <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  MJML to compiled HTML
                </p>
                <div className="mt-5 rounded-[1.05rem] border border-slate-700 bg-slate-900 p-4 sm:p-5">
                  <div className="inline-flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                    <span>Source</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    <span>Compile</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    <span>Output</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-[0.88rem] border border-slate-700">
                      <p className="border-b border-slate-700 bg-slate-800 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                        MJML source
                      </p>
                      <pre className="overflow-x-auto bg-slate-900 p-3 text-[0.72rem] leading-6 text-slate-100">
                        {mjmlSnippet}
                      </pre>
                    </div>
                    <div className="overflow-hidden rounded-[0.88rem] border border-slate-700">
                      <p className="border-b border-slate-700 bg-slate-800 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                        Compiled HTML
                      </p>
                      <pre className="overflow-x-auto bg-slate-900 p-3 text-[0.72rem] leading-6 text-slate-100">
                        {htmlSnippet}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:border-l-slate-700 lg:p-10">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  Pack structure and workflow mapping
                </p>

                <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  File tree excerpt
                </p>
                <pre className="mt-2 overflow-x-auto text-[0.76rem] leading-7 text-slate-100">
{`workflows/
layouts/
components/
compiled/*.html
docs/
mjml.config`}
                </pre>

                <p className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Mapping path
                </p>
                <ol className="mt-2 space-y-1.5 text-[0.86rem] leading-6 text-slate-100">
                  <li>{`workflow/${mappingWorkflow?.slug ?? "onboarding"}`}</li>
                  <li>{`layout/${mappingWorkflow?.linkedLayoutSlug ?? "saas-welcome-system"}`}</li>
                  <li>{`component/${mappingWorkflow?.componentStack[0]?.componentSlug ?? "header-brand-row"}`}</li>
                  <li>{`compiled/${mappingWorkflow?.slug ?? "onboarding"}.html`}</li>
                </ol>
                <p className="mt-3 text-[0.8rem] leading-6 text-slate-400">
                  {mappingPath}
                </p>

                <div className="mt-5 rounded-[0.9rem] border border-slate-700 bg-[#07111f] px-4 py-3">
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                    What changes after purchase
                  </p>
                  <p className="mt-2 text-[0.9rem] leading-7 text-slate-200">
                    Download the full pack, edit MJML locally, compile to HTML, and hand off with workflow context intact.
                  </p>
                </div>

                {mappingWorkflow ? (
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[0.95rem] border border-slate-700">
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

          <div className="mt-8 flex flex-wrap gap-2.5 text-[0.84rem] font-semibold">
            <TrackableLink
              href="/docs"
              event="docs_click"
              payload={{ source: "technical_proof" }}
              className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
            >
              Documentation
            </TrackableLink>
            <TrackableLink
              href="/changelog"
              event="changelog_click"
              payload={{ source: "technical_proof" }}
              className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
            >
              Changelog
            </TrackableLink>
            <TrackableLink
              href="/pricing"
              event="licence_click"
              payload={{ source: "technical_proof" }}
              className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
            >
              Licence and pricing
            </TrackableLink>
            <Link
              href="/support"
              className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
            >
              Support
            </Link>
          </div>
        </div>
      </section>

      <section id="included" className="border-y border-slate-800 bg-[#07111f] py-24">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
              Pack value
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.08rem] font-semibold leading-[0.95] text-white sm:text-[2.72rem]",
              )}
            >
              What you get in Hedgehog Core
            </h2>
            <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-300">
              A complete development system that covers build, proof, and
              handoff in one workflow-focused pack.
            </p>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-7 text-slate-400">
              What you get: reusable source, ready HTML output, and practical implementation guidance.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
            <article className="rounded-[1.2rem] border border-slate-700 bg-slate-900 p-6 sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-400">
                Core build layers
              </p>
              <div className="mt-5 divide-y divide-slate-700">
                {buildLayers.map((item) => (
                  <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                    <p
                      className={cn(
                        "text-[1.24rem] font-semibold leading-8 text-white",
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.94rem] leading-7 text-slate-300">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.2rem] border border-slate-800 bg-transparent p-6 sm:p-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-400">
                Delivery and handoff
              </p>
              <div className="mt-5 space-y-4">
                {deliveryLayers.map((item) => (
                  <div key={item.title}>
                    <p className="text-[1.04rem] font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-7 text-slate-300">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 space-y-3.5 text-[0.92rem] leading-7 text-slate-300">
                {coreDeliveryHighlights.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-blue-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-[#07111f] py-24">
        <div className={pageWidth}>
          <HomeObjectionBlock />
        </div>
      </section>

      <section id="pricing-cta" className="border-t border-slate-800 bg-[#0b1728] py-24">
        <div className={pageWidth}>
          <div className="mx-auto max-w-[45rem] text-center">
            <h2
              className={cn(
                "text-[2.25rem] font-semibold leading-[0.96] text-white sm:text-[2.95rem]",
              )}
            >
              Get Hedgehog Core - £79
            </h2>
            <p className="mt-3 mx-auto max-w-3xl text-[1rem] leading-8 text-slate-300">
              One payment. Use it across every project and ship faster with less QA overhead.
            </p>
            <p className="mt-3 mx-auto max-w-3xl text-[0.92rem] leading-7 text-slate-400">
              Included in Hedgehog Core: {coreIncludedSummary.join(" • ")}
            </p>

            <div className="mt-16 flex flex-wrap justify-center gap-2.5">
              <TrackableLink
                href="/pricing"
                event="final_cta_click"
                payload={{ source: "final_cta" }}
                className={cn(primaryButton, "gap-2")}
              >
                Get Hedgehog Core - £79
                <ArrowRight className="h-4 w-4" />
              </TrackableLink>
              <TrackableLink
                href="/workflows"
                event="hero_secondary_cta_click"
                payload={{ source: "final_cta" }}
                className={secondaryButton}
              >
                Explore workflows
              </TrackableLink>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5 text-[0.84rem] font-semibold">
              <TrackableLink
                href="/docs"
                event="docs_click"
                payload={{ source: "final_cta" }}
                className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
              >
                Documentation
              </TrackableLink>
              <TrackableLink
                href="/changelog"
                event="changelog_click"
                payload={{ source: "final_cta" }}
                className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
              >
                Changelog
              </TrackableLink>
              <TrackableLink
                href="/pricing"
                event="licence_click"
                payload={{ source: "final_cta" }}
                className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
              >
                Licence and pricing
              </TrackableLink>
              <Link
                href="/support"
                className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900 px-4 text-slate-100 transition hover:border-slate-600"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter flush theme="dark" />
    </main>
  );
}
