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
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
import {
  SystemArchitectureVisual,
  WorkflowFlowDiagram,
} from "@/components/site/ProductVisuals";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";

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
  const leadWorkflow = featuredWorkflows[0];
  const secondaryWorkflows = featuredWorkflows.slice(1);

  return (
    <main className={VS.templates.library.main}>
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <TrackEventOnMount event="view_workflow_index" payload={{ source: "workflow_index" }} />

      <SectionShell spacing="hero" tone="canvas" width="content">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">Workflow systems</p>
            <h1 className="mt-4 max-w-3xl text-[2.9rem] font-semibold leading-[0.9] text-slate-900 sm:text-[4rem] lg:text-[4.45rem]">
              Start from a workflow, not a blank email
            </h1>
            <p className="mt-6 max-w-3xl text-[1.06rem] leading-8 text-slate-600">
              Build from practical production flows that already map trigger, structure, merge variables, and handoff
              notes. This removes repeated build work and keeps implementation decisions consistent.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.94rem] text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                {emailWorkflows.length} workflow references
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                Trigger, data contract, and QA notes included
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <TrackableLink
                href="/pricing?source=workflow_index"
                event="workflow_to_pricing"
                payload={{ source: "workflow_index", target: "pricing" }}
                className="inline-flex h-12 items-center rounded-[0.9rem] border border-rose-600 bg-rose-600 px-6 text-[0.92rem] font-semibold !text-slate-900 shadow-[0_18px_36px_rgba(0,0,0,0.34)] transition hover:bg-rose-700"
              >
                Get Hedgehog Core - £79
              </TrackableLink>
              <Link href="/docs" className={VS.buttons.secondaryLight}>
                Read workflow docs
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <WorkflowFlowDiagram
              title="Workflow pipeline"
              subtitle="Trigger to output in one mapped chain"
              steps={workflowPipelineSteps.map((item) => ({
                label: item.label,
                detail: item.detail,
              }))}
            />

            <SystemArchitectureVisual
              title="System mapping"
              subtitle="How workflows connect to the product"
              workflowLabel={leadWorkflow?.slug ?? "onboarding"}
              layoutLabel={leadWorkflow?.linkedLayoutSlug ?? "onboarding-step-system"}
              componentLabels={leadWorkflow?.componentStack.slice(0, 4).map((item) => item.componentSlug) ?? []}
              imageUrl={leadWorkflow?.previewImageUrl}
              imageAlt={`${leadWorkflow?.title ?? "Workflow"} preview`}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="grid" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Featured workflows"
          title="Production flows teams run repeatedly"
          description="Use these as the default starting points, then adapt for your delivery rules and ESP setup."
        />

        {leadWorkflow ? (
          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <article className="relative overflow-hidden rounded-[1.15rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
                <div>
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    Lead workflow
                  </p>
                  <h2 className="mt-2 text-[1.5rem] font-semibold leading-[1.02] text-slate-900">
                    {leadWorkflow.title}
                  </h2>
                  <p className="mt-3 text-[0.94rem] leading-7 text-slate-600">
                    {leadWorkflow.summary}
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[0.84rem] leading-6 text-slate-600">
                    {leadWorkflow.componentStack.slice(0, 3).map((item) => (
                      <li key={`${leadWorkflow.slug}-${item.componentSlug}`} className="rounded-[0.66rem] border border-slate-200 bg-slate-50 px-3 py-2">
                        {item.componentTitle}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/workflows/${leadWorkflow.slug}`}
                      className="inline-flex h-10 items-center rounded-[0.74rem] border border-slate-200 bg-white px-4 text-[0.8rem] font-semibold text-slate-900 transition hover:border-slate-300"
                    >
                      View workflow
                    </Link>
                    <Link
                      href={`/layouts/${leadWorkflow.linkedLayoutSlug}`}
                      className="inline-flex h-10 items-center rounded-[0.74rem] border border-slate-200 bg-slate-50 px-4 text-[0.8rem] font-semibold text-slate-600 transition hover:border-slate-300"
                    >
                      View linked layout
                    </Link>
                  </div>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[0.92rem] border border-slate-200 bg-slate-50">
                  <Image
                    src={leadWorkflow.previewImageUrl}
                    alt={`${leadWorkflow.title} preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 36vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryWorkflows.map((workflow) => (
                <article
                  key={workflow.slug}
                  className="rounded-[0.96rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    {workflow.linkedLayoutTitle}
                  </p>
                  <h3 className="mt-2 text-[1.04rem] font-semibold leading-7 text-slate-900">
                    {workflow.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-6 text-slate-600">{workflow.goal}</p>
                  <Link
                    href={`/workflows/${workflow.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-slate-900 transition hover:text-slate-900"
                  >
                    View workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </SectionShell>

      <SectionShell spacing="feature" tone="canvas" border="bottom" width="content">
        {emailLayoutSystems.map((system, index) => {
          const workflows = getEmailWorkflowsBySystem(system.slug);

          if (workflows.length === 0) {
            return null;
          }

          return (
            <section key={system.slug} className={index === 0 ? "" : "mt-14 border-t border-slate-200 pt-10"}>
              <SectionIntro
                pattern="full"
                eyebrow={system.title}
                title={`${system.title} workflows`}
                description={system.description}
                titleClassName="text-[1.72rem] sm:text-[2.02rem]"
              />

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/workflows/${workflow.slug}`}
                    className="group block rounded-[1rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_16px_30px_rgba(0,0,0,0.3)] transition duration-200 hover:border-slate-300 hover:shadow-[0_20px_34px_rgba(0,0,0,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-[16/8] overflow-hidden rounded-[0.82rem] border border-slate-200 bg-white">
                      <Image
                        src={workflow.previewImageUrl}
                        alt={`${workflow.title} preview`}
                        fill
                        sizes="(max-width: 1280px) 90vw, 44vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.01]"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                        {workflow.linkedLayoutTitle}
                      </p>
                      <h3 className="mt-2 text-[1.16rem] font-semibold leading-7 text-slate-900">
                        {workflow.title}
                      </h3>
                      <p className="mt-2 text-[0.93rem] leading-7 text-slate-600">{workflow.summary}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-slate-600">
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

        <div className="mt-14 border-t border-slate-200 pt-10">
          <VisualPanel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">Next step</p>
                <h2 className="mt-3 max-w-3xl text-[1.92rem] font-semibold leading-[0.96] text-slate-900">
                  Need the full workflow system available offline
                </h2>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-slate-600">
                  Use the free reference pages for discovery. Use Hedgehog Core when your team needs full source files,
                  compiled HTML, and versioned workflow packs in one download.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/pricing" className={VS.buttons.primaryLarge}>
                  Get Hedgehog Core - £79
                </Link>
                <Link href="/components" className={VS.buttons.secondaryDark}>
                  Browse components
                </Link>
              </div>
            </div>
          </VisualPanel>
        </div>
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
