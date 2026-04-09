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
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";

export const metadata: Metadata = {
  title: createPageTitle("Workflows"),
  description:
    `Production-ready email workflows for ${TEMPLATE_CONFIG.brandName}. Start from real use cases, not a blank MJML file.`,
};

export default function WorkflowsPage() {
  const VS = visualSystem;
  const featuredWorkflows = getFeaturedEmailWorkflows(5);

  return (
    <main className={VS.templates.library.main}>
      <SiteTopBar theme="hero" />
      <TrackEventOnMount event="view_workflow_index" payload={{ source: "workflow_index" }} />

      <section className={VS.templates.library.frame}>
        <div className={VS.templates.library.heroGrid}>
          <header className={VS.templates.library.heroLead}>
            <p className={VS.eyebrow.light}>Workflow systems</p>
            <h1 className="mt-4 text-[2.2rem] font-semibold leading-[1.03] text-(--text-primary-dark) sm:text-[2.95rem]">
              Start from a workflow, not a blank email
            </h1>
            <p className="mt-4 max-w-[78ch] text-[1.04rem] leading-8 text-(--th-body-copy)">
              Build from production use cases that already define trigger, structure, merge variables, and handoff notes.
              This saves build time, reduces repeated QA effort, and keeps implementation decisions consistent across teams.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.94rem] text-(--th-body-copy)">
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
          </header>

          <aside className={VS.templates.library.railCard}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
              Why this matters
            </p>
            <ul className="mt-3 space-y-2.5 text-[0.95rem] leading-7 text-(--th-body-copy)">
              <li>Use a proven flow for onboarding, billing, security, and reporting sends.</li>
              <li>Review implementation risks before your team edits production copy.</li>
              <li>Move from free reference pages to full downloadable workflow files in Hedgehog Core.</li>
            </ul>
            <TrackableLink
              href="/pricing?source=workflow_index"
              event="workflow_to_pricing"
              payload={{ source: "workflow_index", target: "pricing" }}
              className={`
                mt-4 inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary)
                bg-(--accent-primary) px-4 text-[0.9rem] font-semibold tracking-[0.01em]
                !text-(--text-primary-dark) transition duration-200 hover:bg-(--accent-secondary)
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2
              `}
            >
              Get the full workflow system
            </TrackableLink>
          </aside>
        </div>

        <section className={VS.templates.library.sectionSplit}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
            Featured workflows
          </p>
          <h2 className="mt-2 text-[1.64rem] font-semibold leading-[1.1] text-(--text-primary-dark) sm:text-[1.95rem]">
            Production flows teams ship repeatedly
          </h2>
          <p className="mt-3 max-w-[72ch] text-[1rem] leading-7 text-(--th-body-copy)">
            Each workflow links directly to its underlying layout and ordered component stack so developers can edit with
            confidence and avoid rebuilding familiar sends.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredWorkflows.map((workflow) => (
              <article
                key={workflow.slug}
                className="overflow-hidden rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) shadow-[0_14px_28px_rgba(0,0,0,0.3)]"
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
                <div className="p-4">
                  <h3 className="text-[1.2rem] font-semibold leading-7 text-(--text-primary-dark)">
                    {workflow.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-(--th-body-copy)">
                    {workflow.summary}
                  </p>
                  <p className="mt-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                    Linked layout: {workflow.linkedLayoutTitle}
                  </p>
                  <Link
                    href={`/workflows/${workflow.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-(--th-body-copy) transition hover:text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  >
                    View workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {emailLayoutSystems.map((system) => {
          const workflows = getEmailWorkflowsBySystem(system.slug);

          if (workflows.length === 0) {
            return null;
          }

          return (
            <section key={system.slug} className={VS.templates.library.sectionSplit}>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
                {system.title}
              </p>
              <h2 className="mt-2 text-[1.64rem] font-semibold leading-[1.1] text-(--text-primary-dark) sm:text-[1.95rem]">
                {system.title} workflows
              </h2>
              <p className="mt-3 max-w-[72ch] text-[1rem] leading-7 text-(--th-body-copy)">
                {system.description}
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/workflows/${workflow.slug}`}
                    className="group block rounded-[0.95rem] border border-(--surface-line) bg-(--surface-soft) p-4 transition duration-200 hover:border-(--accent-support) hover:shadow-[0_16px_30px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[1.1rem] font-semibold text-(--text-primary-dark)">
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
