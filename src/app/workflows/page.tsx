import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { emailLayoutSystems } from "@/data/email-layouts";
import {
  emailWorkflows,
  getEmailWorkflowsBySystem,
  getFeaturedEmailWorkflows,
} from "@/data/workflows";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  WorkflowFlowDiagram,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: createPageTitle("Workflows"),
  description:
    `Production-ready email workflows for ${TEMPLATE_CONFIG.brandName}. Start from real use cases, not a blank MJML file.`,
};

const workflowPipelineSteps = [
  {
    label: "Trigger",
    detail: "Lifecycle or account event starts the workflow.",
  },
  {
    label: "Layout",
    detail: "A linked layout recipe defines structural order.",
  },
  {
    label: "Components",
    detail: "Ordered reusable blocks carry copy and actions.",
  },
  {
    label: "Output",
    detail: "Compiled HTML is ready for QA and ESP delivery.",
  },
] as const;

export default function WorkflowsPage() {
  const VS = visualSystem;
  const featuredWorkflows = getFeaturedEmailWorkflows(5);
  const mappingWorkflow = featuredWorkflows[0];

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
    <main className={VS.templates.library.main}>
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <TrackEventOnMount event="view_workflow_index" payload={{ source: "workflow_index" }} />

      <section className={cn(VS.widths.page, VS.sections.types.hero)}>
        <div className={VS.sections.intros.wideSplit}>
          <header className={VS.sections.intros.fullWidth}>
            <p className={VS.eyebrow.light}>Workflow systems</p>
            <h1 className="mt-4 text-[2.45rem] font-semibold leading-[1.01] text-(--text-primary-dark) sm:text-[3.35rem]">
              Start from a workflow, not a blank email
            </h1>
            <p className="mt-5 max-w-[78ch] text-[1.05rem] leading-8 text-(--th-body-copy)">
              Build from production use cases that already define trigger, structure, merge variables, and handoff notes.
              This saves build time, reduces repeated QA effort, and keeps implementation decisions consistent across teams.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.94rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {emailWorkflows.length} workflow references
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Trigger, goal, and data contract mapped
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Layout and component stack linked
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <TrackableLink
                href="/pricing?source=workflow_index"
                event="workflow_to_pricing"
                payload={{ source: "workflow_index", target: "pricing" }}
                className={cn(VS.buttons.primaryLarge, "shadow-[0_18px_34px_rgba(0,0,0,0.28)]")}
              >
                Get Hedgehog Core - £79
              </TrackableLink>
              <Link href="/docs" className={VS.buttons.secondaryLight}>
                Read workflow docs
              </Link>
            </div>
          </header>

          <div className="grid gap-5">
            <WorkflowFlowDiagram
              title="Workflow pipeline"
              subtitle="Trigger to output in one mapped chain"
              steps={workflowPipelineSteps.map((item) => ({
                label: item.label,
                detail: item.detail,
              }))}
              className="shadow-[0_18px_34px_rgba(0,0,0,0.28)]"
            />

            <aside className="surface-card-soft p-6 sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
                Why this matters
              </p>
              <ul className="mt-4 space-y-3 text-[0.95rem] leading-7 text-(--th-body-copy)">
                <li>Use a proven flow for onboarding, billing, security, and reporting sends.</li>
                <li>Review implementation risks before your team edits production copy.</li>
                <li>Move from free reference pages to full downloadable workflow files in Hedgehog Core.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.grid)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.fullWidth}>
            <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">Featured workflows</p>
            <h2 className="mt-3 max-w-[20ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-light) sm:text-[2.45rem]">
              Production flows teams run repeatedly
            </h2>
            <p className="mt-4 max-w-[74ch] text-[1rem] leading-8 text-(--text-secondary-light)">
              Each workflow links directly to layout and component stack so developers can adapt quickly without rebuilding
              familiar sends.
            </p>
          </div>

          <div className={cn(VS.sections.intros.contentGap, VS.sections.layouts.cards3)}>
            {featuredWorkflows.map((workflow) => (
              <article
                key={workflow.slug}
                className="overflow-hidden rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-(--bg-soft)">
                  <Image
                    src={workflow.previewImageUrl}
                    alt={`${workflow.title} layout preview`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[1.2rem] font-semibold leading-7 text-(--text-primary-light)">
                    {workflow.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-(--text-secondary-light)">
                    {workflow.summary}
                  </p>
                  <p className="mt-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">
                    Linked layout: {workflow.linkedLayoutTitle}
                  </p>
                  <Link
                    href={`/workflows/${workflow.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-(--text-primary-light) transition hover:text-(--accent-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-soft-elevated)"
                  >
                    View workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("border-b border-(--surface-line) bg-(--surface-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.wideSplit}>
            <div>
              <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--accent-support)">System mapping</p>
              <h2 className="mt-3 max-w-[18ch] text-[1.96rem] font-semibold leading-[0.97] text-(--text-primary-dark) sm:text-[2.36rem]">
                Workflow, layout, and components stay connected
              </h2>
              <p className="mt-4 max-w-[66ch] text-[1rem] leading-8 text-(--th-body-copy)">
                The workflow layer anchors implementation decisions so teams avoid drifting structures between lifecycle,
                campaign, and transactional sends.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/layouts" className={VS.buttons.secondaryDark}>
                  Browse layouts
                </Link>
                <Link href="/components" className={VS.buttons.secondaryDark}>
                  Browse components
                </Link>
              </div>
            </div>

            <WorkflowStackVisual
              title="Workflow stack breakdown"
              description={`${mappingWorkflow?.title ?? "Workflow"} maps directly to layout and ordered component stack.`}
              steps={mappingSteps}
              imageUrl={mappingWorkflow?.previewImageUrl}
              imageAlt={`${mappingWorkflow?.title ?? "Workflow"} preview`}
              className="shadow-[0_18px_34px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </section>

      <section className={cn(VS.widths.page, VS.sections.types.grid)}>
        {emailLayoutSystems.map((system, index) => {
          const workflows = getEmailWorkflowsBySystem(system.slug);

          if (workflows.length === 0) {
            return null;
          }

          return (
            <section
              key={system.slug}
              className={cn(index === 0 ? "" : "mt-12 border-t border-(--surface-line) pt-12")}
            >
              <div className={VS.sections.intros.fullWidth}>
                <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
                  {system.title}
                </p>
                <h2 className="mt-2 text-[1.78rem] font-semibold leading-[1.04] text-(--text-primary-dark) sm:text-[2.06rem]">
                  {system.title} workflows
                </h2>
                <p className="mt-3 max-w-[72ch] text-[1rem] leading-7 text-(--th-body-copy)">
                  {system.description}
                </p>
              </div>

              <div className={cn(VS.sections.intros.contentGap, VS.sections.layouts.pair)}>
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/workflows/${workflow.slug}`}
                    className="group block overflow-hidden rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) transition duration-200 hover:border-(--accent-support) hover:shadow-[0_18px_32px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-[16/8] overflow-hidden border-b border-(--surface-line) bg-(--surface-strong)">
                      <Image
                        src={workflow.previewImageUrl}
                        alt={`${workflow.title} preview`}
                        fill
                        sizes="(max-width: 1280px) 90vw, 42vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.01]"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[1.12rem] font-semibold text-(--text-primary-dark)">
                            {workflow.title}
                          </h3>
                          <p className="mt-2 text-[0.95rem] leading-7 text-(--th-body-copy)">
                            {workflow.summary}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full border border-[hsl(var(--th-accent-support)/0.32)] bg-[hsl(var(--th-accent-support)/0.12)] px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.03em] text-(--accent-support)">
                          {workflow.componentStack.length} blocks
                        </span>
                      </div>
                      <p className="mt-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                        Linked layout: {workflow.linkedLayoutTitle}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--th-body-copy)">
                        View workflow
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <SiteFooter />
    </main>
  );
}
