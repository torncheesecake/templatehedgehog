import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EmailLayoutRecipe, EmailLayoutSystem } from "@/data/email-layouts";
import { TEMPLATE_CONFIG } from "@/config/template";
import { cn } from "@/lib/utils";
import {
  WorkflowFlowDiagram,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import { visualSystem } from "@/components/site/visualSystem";
import { LayoutPreviewStage } from "@/components/email-layouts/LayoutPreviewStage";

interface LayoutsGalleryProps {
  layouts: EmailLayoutRecipe[];
  systems: EmailLayoutSystem[];
}

function getLayoutsBySystem(layouts: EmailLayoutRecipe[], systemSlug: EmailLayoutSystem["slug"]) {
  return layouts.filter((layout) => layout.system === systemSlug);
}

const layoutPipelineSteps = [
  {
    label: "Workflow",
    detail: "Use case and trigger determine message intent.",
  },
  {
    label: "Layout",
    detail: "Choose the right structure before editing blocks.",
  },
  {
    label: "Components",
    detail: "Adjust individual blocks without breaking hierarchy.",
  },
  {
    label: "Output",
    detail: "Compile to HTML for client QA and ESP delivery.",
  },
] as const;

export function LayoutsGallery({ layouts, systems }: LayoutsGalleryProps) {
  const VS = visualSystem;
  const firstLayout = layouts[0];

  const mappingSteps = firstLayout
    ? [
        `layout/${firstLayout.slug}`,
        ...firstLayout.componentBlocks.slice(0, 3).map((block) => `component/${block.componentSlug}`),
      ]
    : [];

  return (
    <>
      <section className={cn(VS.widths.page, VS.sections.types.hero)}>
        <div className={VS.sections.intros.wideSplit}>
          <header className={VS.sections.intros.fullWidth}>
            <p className={VS.eyebrow.light}>Layout systems</p>
            <h1 className={cn("mt-4 text-[2.22rem] sm:text-[2.96rem]", VS.headings.page)}>
              Full email layouts you can use straight away
            </h1>
            <p className={cn("mt-4 max-w-[78ch] text-[1.04rem] leading-7", VS.body.compact)}>
              Start with a complete structure, then adjust each block in components. Every layout includes preview,
              section order, and source context.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.92rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {layouts.length} complete layout recipes
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {systems.length} named systems
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Full preview captures for each layout
              </span>
            </div>
          </header>

          <aside className={VS.templates.library.railCard}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
              System coverage
            </p>
            <ul className="mt-3 divide-y divide-(--surface-line)">
              {systems.map((system) => {
                const count = getLayoutsBySystem(layouts, system.slug).length;

                return (
                  <li key={system.slug} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-[0.9rem] font-semibold text-(--text-primary-dark)">{system.title}</p>
                      <p className="text-[0.82rem] leading-6 text-(--th-body-copy)">{system.description}</p>
                    </div>
                    <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-[hsl(var(--th-accent-support)/0.34)] bg-[hsl(var(--th-accent-support)/0.14)] px-2.5 py-1 text-[0.78rem] font-semibold text-(--text-primary-dark)">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.wideSplit}>
            <div>
              <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">
                Layout role in the system
              </p>
              <h2 className="mt-3 max-w-[18ch] text-[1.96rem] font-semibold leading-[0.97] text-(--text-primary-light) sm:text-[2.36rem]">
                Layouts keep every workflow structurally consistent
              </h2>
              <p className="mt-4 max-w-[68ch] text-[1rem] leading-8 text-(--text-secondary-light)">
                Choose a base structure first, then adjust blocks with confidence. This keeps campaigns, lifecycle sends,
                and transactional updates aligned across teams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/workflows" className={VS.buttons.secondaryLight}>
                  Browse workflows
                </Link>
                <Link href="/components" className={VS.buttons.secondaryLight}>
                  Browse components
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              <WorkflowFlowDiagram
                title="Layout pipeline"
                subtitle="Workflow to output"
                steps={layoutPipelineSteps.map((item) => ({
                  label: item.label,
                  detail: item.detail,
                }))}
                className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              />
              <WorkflowStackVisual
                title="Sample layout mapping"
                description={`${firstLayout?.title ?? "Layout"} links to an ordered component stack.`}
                steps={mappingSteps}
                imageUrl={firstLayout?.previewImageUrl}
                imageAlt={`${firstLayout?.title ?? "Layout"} preview`}
                className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={cn(VS.widths.page, VS.sections.types.grid)}>
        {systems.map((system, index) => {
          const systemLayouts = getLayoutsBySystem(layouts, system.slug);

          if (systemLayouts.length === 0) {
            return null;
          }

          return (
            <section key={system.slug} className={cn(index === 0 ? "" : "mt-12 border-t border-(--surface-line) pt-12")}>
              <div className={VS.sections.intros.fullWidth}>
                <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)">
                  {system.title}
                </p>
                <h2 className="mt-2 text-[1.64rem] font-semibold leading-[1.1] text-(--text-primary-dark) sm:text-[1.95rem]">
                  {system.title} layouts
                </h2>
                <p className="mt-3 max-w-[72ch] text-[1rem] leading-7 text-(--th-body-copy)">
                  {system.description}
                </p>
              </div>

              <div className={cn("mt-9 grid gap-x-10 gap-y-12 lg:grid-cols-2")}>
                {systemLayouts.map((layout) => (
                  <Link
                    key={layout.slug}
                    href={`/layouts/${layout.slug}`}
                    className="group block rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 shadow-[0_14px_28px_rgba(0,0,0,0.3)] transition duration-200 hover:-translate-y-[1px] hover:border-(--accent-support) hover:shadow-[0_20px_34px_rgba(0,0,0,0.36)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  >
                    <LayoutPreviewStage
                      title={layout.title}
                      previewImageUrl={layout.previewImageUrl}
                      blockCount={layout.componentBlocks.length}
                      sectionCount={layout.layoutSections.length}
                      className="sm:h-[21.2rem]"
                    />

                    <div className="mt-5">
                      <h3 className="text-[1.28rem] font-semibold leading-8 text-(--text-primary-dark) group-hover:text-(--text-primary-dark)">
                        {layout.title}
                      </h3>
                      <p className="mt-2 text-[0.98rem] leading-7 text-(--th-body-copy)">
                        {layout.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-[hsl(var(--th-accent-support)/0.34)] bg-[hsl(var(--th-accent-support)/0.14)] px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.03em] text-(--text-primary-dark)">
                          {layout.componentBlocks.length} blocks
                        </span>
                        <span className="inline-flex rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.03em] text-(--text-primary-dark)">
                          {layout.layoutSections.length} sections
                        </span>
                        <span className="inline-flex rounded-full border border-(--surface-line) bg-(--surface-strong) px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.03em] text-(--th-body-copy)">
                          MJML + HTML
                        </span>
                      </div>

                      <p className="mt-3 text-[0.85rem] leading-6 text-(--th-body-copy)">
                        Preview, structure, and source context in one clear reference page.
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--th-body-copy)">
                        Open layout
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className={cn("section-breath border-t pt-10", VS.dividers.strong)}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className={VS.eyebrow.light}>Next step</p>
              <h2 className={cn("mt-3 text-[1.7rem] sm:text-[2.1rem]", VS.headings.subsection)}>
                Start from full systems, then edit individual blocks
              </h2>
              <p className={cn("mt-3 max-w-[60ch] text-[0.98rem] leading-7", VS.body.compact)}>
                Layout pages help you verify full structure first. Component pages handle precise block edits. {TEMPLATE_CONFIG.productName}
                gives your team the whole system in one local archive.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/components" className={VS.buttons.secondaryDark}>
                Browse components
              </Link>
              <Link href="/pricing" className={VS.buttons.primary}>
                Get Hedgehog Core - £79
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
