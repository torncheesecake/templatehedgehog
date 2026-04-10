import Image from "next/image";
import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import { ArrowRight, CheckCircle2, FileCode2, GitBranchPlus, Layers3 } from "lucide-react";
import { ComparisonSection } from "@/components/site/ComparisonSection";
import {
  MjmlHtmlSplitView,
  PackFileTreePreview,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
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

const workflowOutcomeBySlug: Record<string, string> = {
  onboarding: "Move new users to first-session activation with stable message sequencing.",
  "password-reset": "Recover account access quickly with security-safe structure and copy.",
  billing: "Confirm charges clearly and reduce finance and support back-and-forth.",
  reporting: "Ship recurring KPI updates in a digest that stays consistent each week.",
  notifications: "Deliver urgent account alerts with clear next-step actions.",
};

const fromScratchEffort = [92, 86, 82, 84] as const;
const withHedgehogEffort = [34, 38, 30, 32] as const;

const includedBreakdown = [
  {
    title: `${COMPONENT_COUNT} components`,
    detail: "Reusable MJML blocks for campaign, lifecycle, and transactional email builds.",
  },
  {
    title: `${LAYOUT_COUNT} layouts`,
    detail: "Full structures grouped by system so teams stop rebuilding shell markup.",
  },
  {
    title: `${WORKFLOW_COUNT} workflows`,
    detail: "Trigger-based implementations for onboarding, security, billing, reporting, and notifications.",
  },
  {
    title: "Technical documentation",
    detail: "Implementation notes, client behaviour guidance, and safe handoff instructions.",
  },
  {
    title: "Compiled HTML outputs",
    detail: "Final delivery markup paired with MJML source for QA and ESP import.",
  },
] as const;

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
  const supportingWorkflows = workflowShowcase.slice(1);

  const mappingWorkflow = primaryWorkflow ?? getEmailWorkflowBySlug("onboarding");

  const leftEffortItems = comparisonRows.map((row, index) => ({
    label: row.label,
    note: row.fromScratch,
    value: fromScratchEffort[index] ?? 80,
  }));
  const rightEffortItems = comparisonRows.map((row, index) => ({
    label: row.label,
    note: row.withHedgehog,
    value: withHedgehogEffort[index] ?? 32,
  }));

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />

      <SectionShell
        spacing="hero"
        tone="canvas"
        width="content"
        className="pb-24 pt-10 sm:pb-26 sm:pt-12 lg:pb-28 lg:pt-14"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">
              Hedgehog Core
            </p>
            <h1
              className={cn(
                "mt-4 max-w-[16ch] text-[3rem] font-semibold leading-[0.88] text-(--text-primary-dark) sm:text-[4.15rem] lg:text-[4.8rem]",
                displaySerif.className,
              )}
            >
              Stop rebuilding the same emails every project
            </h1>
            <p className="mt-6 max-w-[46ch] text-[1.12rem] leading-8 text-(--text-primary-dark)">
              Start from workflows, not blank MJML files, with structure and output mapped before your team edits copy.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link href="/pricing" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_20px_38px_rgba(0,0,0,0.34)]")}>
                Get Hedgehog Core - £79
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/workflows" className={cn(VS.buttons.secondaryLight, "h-11 border-(--surface-line) bg-(--surface-soft)")}>
                Explore workflows
              </Link>
            </div>

            <p className="mt-6 max-w-[56ch] text-[0.95rem] leading-7 text-(--th-body-copy)">
              Workflow, layout, component stack, and compiled HTML stay connected so development, QA, and ESP handoff move in one direction.
            </p>
          </div>

          <article className="relative overflow-hidden rounded-[1.35rem] border border-[color-mix(in_srgb,var(--surface-line)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface-soft)_86%,transparent)] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.32)] backdrop-blur-[2px] sm:p-8 lg:-mr-2 lg:p-9">
            <span className="pointer-events-none absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                  Product system
                </p>
                <h2 className={cn("mt-1 text-[1.26rem] font-semibold leading-7 text-(--text-primary-dark)", displaySerif.className)}>
                  Workflow to layout to components to output
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                <FileCode2 className="h-3.5 w-3.5" />
                MJML + HTML
              </span>
            </div>

            <ol className="mt-5 grid gap-3 sm:grid-cols-4">
              <li className="rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] px-3 py-3">
                <GitBranchPlus className="h-4 w-4 text-(--accent-support)" />
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Workflow</p>
                <p className="mt-1 text-[0.82rem] leading-6 text-(--text-primary-dark)">{mappingWorkflow?.slug ?? "onboarding"}</p>
              </li>
              <li className="rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] px-3 py-3">
                <Layers3 className="h-4 w-4 text-(--accent-support)" />
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Layout</p>
                <p className="mt-1 text-[0.82rem] leading-6 text-(--text-primary-dark)">{mappingWorkflow?.linkedLayoutSlug ?? "onboarding-step-system"}</p>
              </li>
              <li className="rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] px-3 py-3">
                <Layers3 className="h-4 w-4 text-(--accent-support)" />
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Components</p>
                <p className="mt-1 text-[0.82rem] leading-6 text-(--text-primary-dark)">
                  {mappingWorkflow?.componentStack.length ?? 0} mapped blocks
                </p>
              </li>
              <li className="rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_80%,transparent)] bg-[hsl(var(--th-accent-support)/0.14)] px-3 py-3">
                <FileCode2 className="h-4 w-4 text-(--accent-support)" />
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Output</p>
                <p className="mt-1 text-[0.82rem] leading-6 text-(--text-primary-dark)">compiled/html</p>
              </li>
            </ol>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">MJML source</p>
                <pre className="mt-2 overflow-x-auto rounded-[0.74rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">{`<mj-text>{{user.first_name}}</mj-text>
<mj-button href="{{action.url}}">
  Continue
</mj-button>`}</pre>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Compiled HTML</p>
                <pre className="mt-2 overflow-x-auto rounded-[0.74rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] p-3 text-[0.72rem] leading-6 text-(--text-primary-dark)">{`<td style="padding:24px;">
  <a href="{{action.url}}">
    Continue
  </a>
</td>`}</pre>
              </div>
            </div>

            <div className="mt-5 rounded-[0.82rem] border border-[color-mix(in_srgb,var(--surface-line)_74%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_82%,transparent)] px-4 py-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Mapped delivery path</p>
              <p className="mt-1 text-[0.84rem] leading-6 text-(--text-primary-dark)">
                workflow/{mappingWorkflow?.slug ?? "onboarding"} / layout/{mappingWorkflow?.linkedLayoutSlug ?? "onboarding-step-system"} / component/{mappingWorkflow?.componentStack[0]?.componentSlug ?? "hero-overlay-modern"} / compiled/{mappingWorkflow?.slug ?? "onboarding"}.html
              </p>
            </div>
          </article>
        </div>
      </SectionShell>

      <SectionShell spacing="grid" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Primary feature"
          title="Start from a workflow, not a blank email"
          description="Each workflow combines trigger, structure, component order, and output so implementation starts from proven architecture, not guesswork."
        />

        {primaryWorkflow ? (
          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="relative overflow-hidden rounded-[1.18rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_24px_42px_rgba(15,23,42,0.12)] sm:p-7">
              <span className="absolute right-4 top-4 rounded-full border border-(--border-light) bg-(--bg-soft) px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                Featured workflow
              </span>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                    {primaryWorkflow.linkedLayoutTitle}
                  </p>
                  <h3 className={cn("mt-2 text-[1.52rem] leading-[1.04] text-(--text-primary-light)", displaySerif.className)}>
                    {primaryWorkflow.title}
                  </h3>
                  <p className="mt-3 text-[0.96rem] leading-7 text-(--text-secondary-light)">
                    {workflowOutcomeBySlug[primaryWorkflow.slug] ?? primaryWorkflow.goal}
                  </p>

                  <ul className="mt-4 space-y-2.5 text-[0.84rem] leading-6 text-(--text-secondary-light)">
                    {primaryWorkflow.componentStack.slice(0, 3).map((item) => (
                      <li key={`${primaryWorkflow.slug}-${item.componentSlug}`} className="rounded-[0.68rem] border border-(--border-light) bg-(--bg-soft) px-3 py-2">
                        {item.componentTitle}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/workflows/${primaryWorkflow.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-primary)"
                  >
                    View workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[0.96rem] border border-(--border-light) bg-(--bg-soft)">
                  <Image
                    src={primaryWorkflow.previewImageUrl}
                    alt={`${primaryWorkflow.title} workflow preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 38vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2">
              {supportingWorkflows.map((workflow) => (
                <article
                  key={workflow.slug}
                  className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-5 shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
                    {workflow.linkedLayoutTitle}
                  </p>
                  <h3 className="mt-2 text-[1.06rem] font-semibold leading-7 text-(--text-primary-light)">
                    {workflow.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-7 text-(--text-secondary-light)">
                    {workflowOutcomeBySlug[workflow.slug] ?? workflow.goal}
                  </p>
                  <Link
                    href={`/workflows/${workflow.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-primary)"
                  >
                    View workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-9">
          <Link href="/workflows" className={cn(VS.buttons.primaryLarge, "gap-2")}> 
            View all workflows
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionShell>

      <ComparisonSection
        sectionClassName="border-y border-(--surface-line) bg-(--surface-soft)"
        eyebrow="Common objection"
        title="Build it yourself vs Hedgehog"
        description="Same requirement, two very different levels of effort."
        leftTitle="Build from scratch"
        rightTitle="Using Hedgehog"
        leftItems={leftEffortItems}
        rightItems={rightEffortItems}
      />

      <SectionShell spacing="proof" tone="canvas" border="both" width="content">
        <SectionIntro
          pattern="split"
          tone="dark"
          eyebrow="Technical proof"
          title="Real implementation proof, not brochure claims"
          description="Inspect source, output, and mapping exactly as the pack is delivered."
          aside={
            <div className="rounded-[0.92rem] border border-(--surface-line) bg-(--surface-soft) p-4 text-[0.9rem] leading-7 text-(--th-body-copy)">
              Workflow to layout to components is mapped in the same registry used by the public reference and paid pack.
            </div>
          }
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)]">
          <MjmlHtmlSplitView
            title="MJML to compiled HTML"
            mjml={mjmlSnippet}
            html={htmlSnippet}
          />

          <div className="grid gap-6">
            <PackFileTreePreview
              title="Pack file structure"
              lines={[
                ...MJML_PACK_PROJECT_STRUCTURE,
                "compiled/",
                "workflows/onboarding/",
                "workflows/password-reset/",
              ]}
            />
            <WorkflowStackVisual
              title="Workflow mapping"
              description={`${mappingWorkflow?.title ?? "Workflow"} links directly to layout and ordered component stack.`}
              steps={
                mappingWorkflow
                  ? [
                      `workflow/${mappingWorkflow.slug}`,
                      `layout/${mappingWorkflow.linkedLayoutSlug}`,
                      ...mappingWorkflow.componentStack
                        .slice(0, 3)
                        .map((item) => `component/${item.componentSlug}`),
                    ]
                  : []
              }
              imageUrl={mappingWorkflow?.previewImageUrl}
              imageAlt={`${mappingWorkflow?.title ?? "Workflow"} mapping preview`}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="grid" tone="soft" border="softBottom" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Pack contents"
          title="What you get in Hedgehog Core"
          description="Everything needed to move from editable MJML to deployment-ready output without rebuilding standard flows."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <dl className="space-y-4">
            {includedBreakdown.map((item) => (
              <div
                key={item.title}
                className="rounded-[0.92rem] border border-(--border-light) bg-(--bg-soft-elevated) px-5 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]"
              >
                <dt className={cn("text-[1.08rem] font-semibold text-(--text-primary-light)", displaySerif.className)}>
                  {item.title}
                </dt>
                <dd className="mt-1 text-[0.94rem] leading-7 text-(--text-secondary-light)">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <VisualPanel tone="soft" className="h-full">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">
              Why teams use it
            </p>
            <ul className="mt-4 space-y-3.5 text-[0.95rem] leading-7 text-(--text-secondary-light)">
              {coreDeliveryHighlights.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[0.78rem] border border-(--border-light) bg-(--bg-soft) px-4 py-3 text-[0.86rem] leading-6 text-(--text-secondary-light)">
              Less than one avoidable rebuild session.
            </div>
          </VisualPanel>
        </div>
      </SectionShell>

      <SectionShell spacing="cta" tone="canvas" width="content" className="th-cta-zone">
        <div className="th-cta-island rounded-[1.42rem] border border-(--surface-line) bg-(--hedgehog-core-navy) px-8 py-12 text-center sm:px-11 sm:py-14 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-[42rem]">
            <h2
              className={cn(
                "text-[2.02rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.52rem]",
                displaySerif.className,
              )}
            >
              Get Hedgehog Core - £79
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-(--dune-muted)">
              Less than one avoidable rebuild session.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link href="/pricing" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_18px_34px_rgba(0,0,0,0.34)]")}>
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
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
