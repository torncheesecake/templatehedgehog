import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EmailLayoutRecipe, EmailLayoutSystem } from "@/data/email-layouts";
import { TEMPLATE_CONFIG } from "@/config/template";
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
import {
  SystemArchitectureVisual,
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
      <SectionShell spacing="hero" tone="canvas" width="content">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-start">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">Layout systems</p>
            <h1 className="mt-4 max-w-[14ch] text-[2.85rem] font-semibold leading-[0.9] text-(--text-primary-dark) sm:text-[4rem] lg:text-[4.5rem]">
              Full email layouts you can use straight away
            </h1>
            <p className="mt-6 max-w-[62ch] text-[1.04rem] leading-8 text-(--th-body-copy)">
              Start with complete structure, then adjust blocks where required. Each layout includes preview, section
              order, and source context tied back to workflows.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.92rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {layouts.length} layout recipes
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {systems.length} systems covered
              </span>
            </div>
          </div>

          <div className="grid gap-5">
            <VisualPanel>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
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
            </VisualPanel>

            <SystemArchitectureVisual
              title="Layout role"
              subtitle="Workflow to layout to components"
              workflowLabel="onboarding"
              layoutLabel={firstLayout?.slug ?? "onboarding-step-system"}
              componentLabels={firstLayout?.componentBlocks.slice(0, 3).map((block) => block.componentSlug) ?? []}
              imageUrl={firstLayout?.previewImageUrl}
              imageAlt={`${firstLayout?.title ?? "Layout"} preview`}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="feature" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="split"
          tone="light"
          eyebrow="Layout role in the system"
          title="Layouts keep every workflow structurally consistent"
          description="Choose a base structure first, then adjust individual blocks with confidence while keeping message hierarchy stable."
          aside={
            <div className="grid gap-5">
              <WorkflowFlowDiagram
                title="Layout pipeline"
                subtitle="Workflow to output"
                steps={layoutPipelineSteps.map((item) => ({
                  label: item.label,
                  detail: item.detail,
                }))}
                tone="soft"
              />
              <WorkflowStackVisual
                title="Sample layout mapping"
                description={`${firstLayout?.title ?? "Layout"} links to an ordered component stack.`}
                steps={mappingSteps}
                imageUrl={firstLayout?.previewImageUrl}
                imageAlt={`${firstLayout?.title ?? "Layout"} preview`}
                tone="soft"
              />
            </div>
          }
        />
      </SectionShell>

      <SectionShell spacing="grid" tone="canvas" width="content">
        {systems.map((system, index) => {
          const systemLayouts = getLayoutsBySystem(layouts, system.slug);

          if (systemLayouts.length === 0) {
            return null;
          }

          return (
            <section key={system.slug} className={index === 0 ? "" : "section-breath border-t border-(--surface-line) pt-10"}>
              <SectionIntro
                pattern="full"
                eyebrow={system.title}
                title={`${system.title} layouts`}
                titleClassName="text-[1.74rem] sm:text-[2.04rem]"
                description={system.description}
              />

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {systemLayouts.map((layout) => (
                  <Link
                    key={layout.slug}
                    href={`/layouts/${layout.slug}`}
                    className="group block rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 shadow-[0_16px_30px_rgba(0,0,0,0.3)] transition duration-200 hover:border-(--accent-support) hover:shadow-[0_22px_36px_rgba(0,0,0,0.36)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  >
                    <LayoutPreviewStage
                      title={layout.title}
                      previewImageUrl={layout.previewImageUrl}
                      blockCount={layout.componentBlocks.length}
                      sectionCount={layout.layoutSections.length}
                      className="sm:h-[21.2rem]"
                    />

                    <div className="mt-5">
                      <h3 className="text-[1.24rem] font-semibold leading-8 text-(--text-primary-dark)">
                        {layout.title}
                      </h3>
                      <p className="mt-2 text-[0.96rem] leading-7 text-(--th-body-copy)">
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

        <div className="section-breath border-t border-(--surface-line) pt-10">
          <VisualPanel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">Next step</p>
                <h2 className="mt-3 max-w-[18ch] text-[1.9rem] font-semibold leading-[0.96] text-(--text-primary-dark)">
                  Start from full structure, then tune blocks
                </h2>
                <p className="mt-4 max-w-[60ch] text-[0.98rem] leading-7 text-(--th-body-copy)">
                  Layout pages help you verify complete message composition first. Component pages handle precise block
                  edits. {TEMPLATE_CONFIG.productName} gives your team the whole system in one local archive.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/components" className={VS.buttons.secondaryDark}>
                  Browse components
                </Link>
                <Link href="/pricing" className={VS.buttons.primaryLarge}>
                  Get Hedgehog Core - £79
                </Link>
              </div>
            </div>
          </VisualPanel>
        </div>
      </SectionShell>
    </>
  );
}
