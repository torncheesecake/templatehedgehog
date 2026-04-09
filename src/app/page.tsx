import Image from "next/image";
import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ComparisonSection } from "@/components/site/ComparisonSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  MjmlHtmlSplitView,
  PackFileTreePreview,
  WorkflowFlowDiagram,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
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
  onboarding: "Drive first-session activation without rebuilding a welcome flow.",
  "password-reset": "Recover account access with security-safe structure and copy.",
  billing: "Confirm charges clearly and reduce billing support tickets.",
  reporting: "Send recurring KPI summaries in a repeatable digest format.",
  notifications: "Ship urgent account alerts with clear next-step actions.",
};

const pipelineSteps = [
  {
    stage: "Trigger",
    detail: "Account event or lifecycle condition starts the send.",
  },
  {
    stage: "Layout",
    detail: "Workflow links to a layout recipe with the right structure.",
  },
  {
    stage: "Components",
    detail: "Ordered reusable blocks define message hierarchy.",
  },
  {
    stage: "Output",
    detail: "Compiled HTML is ready for QA and ESP import.",
  },
] as const;

const fromScratchEffort = [92, 86, 82, 84] as const;
const withHedgehogEffort = [34, 38, 30, 32] as const;

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

      <section className={cn(VS.widths.content, VS.sections.types.hero)}>
        <div className={VS.sections.intros.wideSplit}>
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
            <p className="mt-6 max-w-[60ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
              Production workflows, reusable layouts, and delivery-safe output in one system so teams ship faster with less QA churn.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/pricing" className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_20px_38px_rgba(0,0,0,0.32)]")}>
                Get Hedgehog Core - £79
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

          <WorkflowFlowDiagram
            title="Workflow pipeline"
            subtitle="Trigger to output in one mapped chain"
            steps={pipelineSteps.map((item) => ({ label: item.stage, detail: item.detail }))}
            className="shadow-[0_18px_34px_rgba(0,0,0,0.24)]"
          />
        </div>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.grid)}>
        <div className={VS.widths.content}>
          <div className={VS.sections.intros.fullWidth}>
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
              Each flow links trigger, layout, component stack, and output so implementation starts from structure instead of guesswork.
            </p>
          </div>

          <div className={cn(VS.sections.intros.contentGap, VS.sections.layouts.cards3)}>
            {workflowShowcase.map((workflow) => (
              <article
                key={workflow.slug}
                className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              >
                <div className="relative -mx-1 mb-4 aspect-[16/10] overflow-hidden rounded-[0.8rem] border border-(--border-light) bg-(--bg-soft)">
                  <Image
                    src={workflow.previewImageUrl}
                    alt={`${workflow.title} workflow preview`}
                    fill
                    sizes="(max-width: 1280px) 45vw, 19vw"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="text-[1.08rem] font-semibold leading-7 text-(--text-primary-light)">
                  {workflow.title}
                </h3>
                <p className="mt-2 text-[0.94rem] leading-7 text-(--text-secondary-light)">
                  {workflowOutcomeBySlug[workflow.slug] ?? workflow.goal}
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
              View all workflows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ComparisonSection
        sectionClassName="border-b border-(--surface-line) bg-(--surface-soft)"
        eyebrow="Common objection"
        title="Build it yourself vs Hedgehog"
        description="Same requirement, two very different levels of effort."
        leftTitle="Build from scratch"
        rightTitle="Using Hedgehog"
        leftItems={leftEffortItems}
        rightItems={rightEffortItems}
      />

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.proof)}>
        <div className={VS.widths.content}>
          <div className={VS.sections.intros.wideSplit}>
            <div>
              <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">Product proof</p>
              <h2
                className={cn(
                  "mt-3 max-w-[18ch] text-[2.12rem] font-semibold leading-[0.94] text-(--text-primary-light) sm:text-[2.72rem]",
                  displaySerif.className,
                )}
              >
                Technical proof, not mock-up claims
              </h2>
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-8 text-(--text-secondary-light)">
                Source, output, and mapping shown exactly as the pack is structured.
              </p>

              <MjmlHtmlSplitView
                title="MJML to compiled HTML"
                mjml={mjmlSnippet}
                html={htmlSnippet}
                className="mt-8 border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              />
            </div>

            <div className="grid gap-6">
              <PackFileTreePreview
                title="Pack file structure"
                lines={[
                  ...MJML_PACK_PROJECT_STRUCTURE,
                  "compiled/",
                  "workflows/onboarding/",
                  "workflows/password-reset/",
                ]}
                className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              />
              <WorkflowStackVisual
                title="Workflow stack breakdown"
                description={`${mappingWorkflow ? mappingWorkflow.title : "Workflow"} links directly to layout and ordered component stack.`}
                steps={mappingSteps}
                imageUrl={mappingWorkflow?.previewImageUrl}
                imageAlt={`${mappingWorkflow?.title ?? "Workflow"} mapping preview`}
                className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={cn("border-b border-(--surface-line) bg-(--surface-soft)", VS.sections.types.grid)}>
        <div className={VS.widths.content}>
          <div className={VS.sections.intros.fullWidth}>
            <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">What is included</p>
            <h2
              className={cn(
                "mt-3 max-w-[14ch] text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.5rem]",
                displaySerif.className,
              )}
            >
              What you get
            </h2>
            <p className="mt-4 max-w-[70ch] text-[1rem] leading-8 text-(--th-body-copy)">
              Everything needed to move from editable MJML to deployment-ready output without rebuilding standard flows.
            </p>
          </div>

          <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", VS.sections.intros.contentGap)}>
            {includedBreakdown.map((item) => (
              <article key={item.title} className="surface-card-soft h-full p-6 sm:p-7">
                <h3 className={cn("text-[1.12rem] font-semibold text-(--text-primary-dark)", displaySerif.className)}>
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-7 text-(--th-body-copy)">{item.detail}</p>
              </article>
            ))}

            <article className="surface-card-soft h-full p-6 sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Core delivery</p>
              <ul className="mt-4 space-y-3.5 text-[0.95rem] leading-7 text-(--th-body-copy)">
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

      <section className={cn(VS.widths.content, "pb-24 sm:pb-28 lg:pb-28")}>
        <div className="rounded-[1.3rem] border border-(--surface-line) bg-(--hedgehog-core-navy) px-7 py-10 text-center sm:px-9 sm:py-12 lg:px-11 lg:py-14">
          <div className="mx-auto max-w-[40rem]">
            <h2
              className={cn(
                "text-[2rem] font-semibold leading-[0.96] text-(--text-primary-dark) sm:text-[2.45rem]",
                displaySerif.className,
              )}
            >
              Get Hedgehog Core - £79
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-(--dune-muted)">
              Less than one avoidable rebuild session
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
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
      </section>

      <SiteFooter />
    </main>
  );
}
