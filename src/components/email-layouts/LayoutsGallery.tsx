import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandSignature } from "@/components/site/BrandSignature";
import type { EmailLayoutRecipe, EmailLayoutSystem } from "@/data/email-layouts";
import { TEMPLATE_CONFIG } from "@/config/template";
import { LayoutPreviewStage } from "@/components/email-layouts/LayoutPreviewStage";

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
      <section className="border-b border-[var(--th-border-dark)] bg-[var(--bg-canvas)] py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <BrandSignature index="04" label="Layouts" />
          <h1 className="mt-3 text-[2rem] font-semibold leading-tight text-white sm:text-[2.3rem]">Production email layouts</h1>
          <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
            Complete MJML structures for lifecycle, transactional, campaign, support, and operational email delivery.
          </p>
          <p className="mt-4 text-[0.88rem] text-[var(--th-text-secondary)]">{layouts.length} layouts across {systems.length} systems.</p>
        </div>
      </section>

      <section className="bg-[var(--bg-surface)] py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          {featuredLayout ? (
            <Link href={`/layouts/${featuredLayout.slug}`} className="group block mb-10 overflow-hidden rounded-[1.2rem]">
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
                <div className="bg-[var(--bg-canvas)] p-6 sm:p-8">
                  <p className="text-[0.82rem] text-[var(--th-text-secondary)]">Featured deployable layout</p>
                  <h2 className="mt-2 text-[1.65rem] font-semibold leading-tight text-white">{featuredLayout.title}</h2>
                  <p className="mt-3 text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">{featuredLayout.description}</p>
                  <p className="mt-3 text-[0.88rem] leading-7 text-[var(--th-text-secondary)]">
                    Outcome: deployable message structure for launch-grade delivery, from hero narrative to compliance close.
                  </p>
                </div>
              </div>
            </Link>
          ) : null}

          {systems.map((system, index) => {
            const systemLayouts = getLayoutsBySystem(layouts, system.slug);
            if (systemLayouts.length === 0) return null;
            return (
              <section key={system.slug} className={index === 0 ? "" : "mt-10 border-t border-[var(--th-border-dark)] pt-10"}>
                <h2 className="text-[1.3rem] font-semibold text-white">{system.title}</h2>
                <p className="mt-2 max-w-3xl text-[0.92rem] leading-7 text-[var(--th-text-secondary)]">{system.description}</p>
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {systemLayouts
                    .filter((layout) => layout.slug !== featuredLayout?.slug)
                    .map((layout) => (
                    <Link key={layout.slug} href={`/layouts/${layout.slug}`} className="group block rounded-[0.95rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)] p-4 transition hover:border-[var(--border-subtle)]">
                      <LayoutPreviewStage
                        title={layout.title}
                        previewImageUrl={layout.previewImageUrl}
                        blockCount={layout.componentBlocks.length}
                        sectionCount={layout.layoutSections.length}
                        className="sm:h-[19.4rem]"
                      />
                      <div className="mt-4">
                        <h3 className="text-[1.1rem] font-semibold text-white">{layout.title}</h3>
                        <p className="mt-2 text-[0.93rem] leading-7 text-[var(--th-text-secondary)]">{layout.description}</p>
                        <p className="mt-2 text-[0.82rem] text-[var(--th-text-secondary)]">{layout.componentBlocks.length} blocks · {layout.layoutSections.length} sections · MJML + HTML</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-white">
                          Open layout
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                    ))}
                </div>
              </section>
            );
          })}

          <div className="mt-10 border-t border-[var(--th-border-dark)] pt-7">
            <p className="text-[0.95rem] text-[var(--th-text-secondary)]">
              {TEMPLATE_CONFIG.productName} gives your team the complete offline archive for faster delivery.
            </p>
            <Link href="/pricing" className="mt-4 inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.92rem] font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)]">
              {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
