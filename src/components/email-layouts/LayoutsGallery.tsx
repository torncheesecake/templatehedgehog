import Link from "next/link";
import type { EmailLayoutRecipe, EmailLayoutSystem } from "@/data/email-layouts";
import { TEMPLATE_CONFIG } from "@/config/template";
import { LayoutPreviewStage } from "@/components/email-layouts/LayoutPreviewStage";
import { CatalogueCard, WorkflowAssembly } from "@/components/site/V2Primitives";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  STARTER_LAYOUT_COUNT,
  STARTER_WORKFLOW_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";

interface LayoutsGalleryProps {
  layouts: EmailLayoutRecipe[];
  systems: EmailLayoutSystem[];
}

function getLayoutsBySystem(layouts: EmailLayoutRecipe[], systemSlug: EmailLayoutSystem["slug"]) {
  return layouts.filter((layout) => layout.system === systemSlug);
}

export function LayoutsGallery({ layouts, systems }: LayoutsGalleryProps) {
  const featuredLayout = layouts.find((layout) => layout.slug === "product-launch-campaign")
    ?? layouts.find((layout) => layout.slug === "feature-announcement-system")
    ?? layouts[0];
  return (
    <>
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-serif text-[clamp(2.35rem,5.4vw,4.25rem)] font-semibold leading-[0.98] text-[var(--text-primary)]">
                Deployable email systems for real sends.
              </h1>
              <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-[var(--text-secondary)]">
                Start from complete message structures for lifecycle, transactional, campaign, support, and operational delivery. Core includes {STARTER_LAYOUT_COUNT} starter layouts and {STARTER_WORKFLOW_COUNT} workflows. Pro includes {LAYOUT_COUNT} layouts, {COMPONENT_COUNT} components, and {WORKFLOW_COUNT} workflows. Team changes reuse rights and support.
              </p>
              <p className="mt-4 text-[0.9rem] text-[var(--text-meta)]">{layouts.length} layouts across {systems.length} systems.</p>
            </div>
            <WorkflowAssembly compact />
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          {featuredLayout ? (
            <Link href={`/layouts/${featuredLayout.slug}`} className="group mb-12 block overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="relative h-[20rem] sm:h-[24rem]">
                  <LayoutPreviewStage
                    title={featuredLayout.title}
                    previewImageUrl={featuredLayout.previewImageUrl}
                    blockCount={featuredLayout.componentBlocks.length}
                    sectionCount={featuredLayout.layoutSections.length}
                    preload
                    className="h-full rounded-none border-0"
                  />
                </div>
                <div className="border-t border-[var(--border-subtle)] p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <p className="text-[0.82rem] font-semibold uppercase text-[var(--colour-emotional)]">Featured workflow system</p>
                  <h2 className="mt-3 font-serif text-[clamp(1.8rem,3.8vw,2.9rem)] font-semibold leading-[1] text-[var(--text-primary)]">{featuredLayout.title}</h2>
                  <p className="mt-3 text-[0.98rem] leading-8 text-[var(--text-secondary)]">{featuredLayout.description}</p>
                  <p className="mt-3 text-[0.88rem] leading-7 text-[var(--text-secondary)]">
                    Outcome: deployable message structure from trigger to component stack to final production output.
                  </p>
                </div>
              </div>
            </Link>
          ) : null}

          {systems.map((system, index) => {
            const systemLayouts = getLayoutsBySystem(layouts, system.slug);
            if (systemLayouts.length === 0) return null;
            return (
              <section key={system.slug} className={index === 0 ? "" : "mt-10 border-t border-[var(--border-subtle)] pt-10"}>
                <h2 className="text-[1.3rem] font-semibold text-[var(--text-primary)]">{system.title}</h2>
                <p className="mt-2 max-w-3xl text-[0.92rem] leading-7 text-[var(--text-secondary)]">{system.description}</p>
                <div className="mt-7 grid gap-x-6 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
                  {systemLayouts
                    .filter((layout) => layout.slug !== featuredLayout?.slug)
                    .map((layout) => (
                      <CatalogueCard
                        key={layout.slug}
                        href={`/layouts/${layout.slug}`}
                        title={layout.title}
                        copy={layout.description}
                        image={layout.previewImageUrl}
                        meta={`${layout.componentBlocks.length} blocks / ${layout.layoutSections.length} sections`}
                      />
                    ))}
                </div>
              </section>
            );
          })}

          <div className="mt-10 border-t border-[var(--border-subtle)] pt-7">
            <p className="text-[0.95rem] text-[var(--text-secondary)]">
              {TEMPLATE_CONFIG.brandName} gives your team complete workflow packages for offline handoff. Core provides archive essentials. Pro standardises recurring production with the full layout and workflow system. Team adds reuse rights, rollout support, and longer updates.
            </p>
            <Link href="/pricing" className="th-btn th-btn-sm th-btn-primary mt-4">
              See what&apos;s included
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
