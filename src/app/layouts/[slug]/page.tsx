import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Layers3, Workflow } from "lucide-react";
import { createPageTitle } from "@/config/template";
import {
  emailLayouts,
  getEmailLayoutBySlug,
  getEmailLayoutSystemBySlug,
} from "@/data/email-layouts";
import { getEmailComponentBySlug } from "@/data/email-components";
import { compiledLayoutHtmlBySlug } from "@/data/email-layouts/compiled";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { HtmlPreviewFrame } from "@/components/ui/HtmlPreviewFrame";
import { MjmlSourcePanel } from "@/components/ui/MjmlSourcePanel";
import { MJML_PACK_NAME } from "@/lib/pack";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailLayouts.map((layout) => ({ slug: layout.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const layout = getEmailLayoutBySlug(slug);

  if (!layout) {
    return {
      title: createPageTitle("Layout not found"),
    };
  }

  return {
    title: createPageTitle(layout.title),
    description: layout.description,
    openGraph: {
      title: createPageTitle(layout.title),
      description: layout.description,
      type: "article",
    },
  };
}

export default async function LayoutDetailPage({ params }: Props) {
  const { slug } = await params;
  const layout = getEmailLayoutBySlug(slug);

  if (!layout) {
    notFound();
  }

  const resolvedComponentBlocks = layout.componentBlocks
    .map((block, index) => {
      const component = getEmailComponentBySlug(block.componentSlug);
      if (!component) return null;

      return {
        order: index + 1,
        notes: block.notes,
        component,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const missingComponentSlugs = layout.componentBlocks
    .filter((block) => !getEmailComponentBySlug(block.componentSlug))
    .map((block) => block.componentSlug);

  const compiledHtml = compiledLayoutHtmlBySlug[layout.slug] ?? null;
  const layoutSystem = getEmailLayoutSystemBySlug(layout.system);

  return (
    <main className="min-h-screen text-(--th-body-copy)">
      <SiteTopBar />
      <TrackEventOnMount
        event="view_layout_detail"
        payload={{ layoutSlug: layout.slug }}
      />

      <section className="relative isolate mx-auto w-full max-w-[1840px] overflow-hidden rounded-[1.3rem] border border-(--surface-line) bg-(--surface-strong) px-5 pb-20 pt-10 shadow-[0_18px_36px_rgba(0,0,0,0.38)] sm:px-8 lg:px-14 lg:pb-24 lg:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[22rem] bg-[radial-gradient(circle_at_20%_20%,hsl(var(--th-accent)/0.26),transparent_50%),radial-gradient(circle_at_78%_16%,hsl(var(--th-accent-support)/0.14),transparent_46%)]" />
        <article className="grid gap-10 pb-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:items-start">
          <div>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--th-body-copy)">
              {layoutSystem?.title ?? "Layout recipe"}
            </p>
            <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] text-(--text-primary-dark) sm:text-[3.2rem]">
              {layout.title}
            </h1>
            <p className="mt-4 max-w-[64ch] text-[1.14rem] leading-8 text-(--th-body-copy)">
              {layout.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.03rem] text-(--th-body-copy)">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                  {layout.componentBlocks.length} reusable blocks
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                  Part of the {layoutSystem?.title ?? "core"} system
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                  Copyable MJML and compiled HTML
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Built from the public component library
              </span>
            </div>

            <div className="mt-7">
              {compiledHtml ? (
                <HtmlPreviewFrame
                  html={compiledHtml}
                  title={`${layout.title} rendered layout preview`}
                  className="max-w-none"
                />
              ) : (
                <div className="rounded-[0.9rem] border border-[rgba(234,88,12,0.35)] bg-[rgba(234,88,12,0.14)] px-4 py-4 text-[1rem] leading-7 text-(--text-primary-dark)">
                  Layout HTML is currently unavailable for this recipe. Rebuild the layout output to restore the rendered preview.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <article className="surface-card-soft relative overflow-hidden p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.42),transparent)]" />
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                What this recipe covers
              </p>
              <h2 className="mt-2 text-[1.4rem] font-semibold text-(--text-primary-dark)">Sections in sequence</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-(--th-body-copy)">
                {layout.layoutSections.map((section) => (
                  <li key={`${layout.slug}-${section.title}`} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                    <span>
                      <strong className="font-semibold text-(--text-primary-dark)">{section.title}.</strong>{" "}
                      {section.description}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card-soft relative overflow-hidden p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.42),transparent)]" />
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                Implementation guidance
              </p>
              <h2 className="mt-2 text-[1.4rem] font-semibold text-(--text-primary-dark)">How developers usually use it</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-(--th-body-copy)">
                <li className="flex items-start gap-3">
                  <Workflow className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  <span>Edit the MJML recipe when you want to adjust structure, copy order, imagery, or CTA destinations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Workflow className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  <span>Use the compiled HTML when your ESP, QA handoff, or review process needs final delivery markup.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Workflow className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  <span>Review the block order below before customising so the message hierarchy stays intact across clients.</span>
                </li>
              </ul>
            </article>

            <article className="surface-card-soft relative overflow-hidden p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.42),transparent)]" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">
                    Stack map
                  </p>
                  <h2 className="mt-2 text-[1.54rem] font-semibold text-(--text-primary-dark)">Component breakdown</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--th-accent-support)/0.14)] px-2.5 py-1 text-[0.86rem] font-semibold text-(--accent-support)">
                  <Layers3 className="h-4 w-4" />
                  {resolvedComponentBlocks.length}
                </span>
              </div>
              <p className="mt-3 text-[0.98rem] leading-7 text-(--th-body-copy)">
                Each layout is assembled from reusable blocks. You can inspect the recipe as a whole here, then drop into each component page for single-block edits.
              </p>

              <ol className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {resolvedComponentBlocks.map((entry) => (
                  <li
                    key={`${layout.slug}-${entry.component.slug}`}
                    className="surface-card-muted p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--hedgehog-core-blue-deep) text-[0.82rem] font-bold text-(--text-primary-dark)">
                        {entry.order}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/components/${entry.component.slug}`}
                          className="text-[1rem] font-semibold text-(--text-primary-dark) underline-offset-2 transition hover:text-(--accent-support) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                        >
                          {entry.component.title}
                        </Link>
                        <p className="mt-1 text-[1rem] uppercase tracking-[0.08em] text-(--th-body-copy)">
                          {entry.component.category}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-[0.98rem] leading-7 text-(--th-body-copy)">{entry.notes}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </article>

        {missingComponentSlugs.length > 0 ? (
          <div className="mt-1 rounded-xl border border-[rgba(220,38,38,0.42)] bg-[rgba(220,38,38,0.14)] px-4 py-3 text-[1rem] leading-7 text-(--text-primary-dark)">
            Stack mismatch detected. Missing component definitions: {missingComponentSlugs.join(", ")}.
          </div>
        ) : null}

        <div className="mt-8 border-t border-(--surface-line)" />

        <section className="section-breath grid gap-7 xl:grid-cols-2">
          <MjmlSourcePanel
            source={layout.mjmlSource}
            title="Layout MJML"
            description="Editable recipe source for adjusting block order, copy, imagery, and destination URLs."
            copyButtonLabel="Copy MJML"
            successMessage="Layout MJML copied to clipboard"
            analyticsPayload={{ layoutSlug: layout.slug, sourceType: "mjml" }}
          />

          {compiledHtml ? (
            <MjmlSourcePanel
              source={compiledHtml}
              language="html"
              title="Compiled HTML"
              description="Final output for ESP handoff, QA review, and HTML-only delivery workflows."
              copyButtonLabel="Copy HTML"
              successMessage="Layout HTML copied to clipboard"
              analyticsPayload={{ layoutSlug: layout.slug, sourceType: "html" }}
            />
          ) : (
            <article className="dune-strip overflow-hidden">
              <div className="border-b border-(--surface-line) px-5 py-4 sm:px-6">
                <h3 className="text-[1.1rem] font-semibold text-(--text-primary-dark)">Compiled HTML</h3>
                <p className="mt-1 text-[0.9rem] text-(--dune-muted)">
                  Final output for ESP handoff, QA review, and HTML-only delivery workflows.
                </p>
              </div>
              <div className="px-5 py-5 text-[1rem] leading-7 text-(--dune-muted) sm:px-6">
                Compiled HTML is unavailable for this layout right now. Rebuild the compiled layout registry to repopulate this panel.
              </div>
            </article>
          )}
        </section>
      </section>

      <section className="relative overflow-hidden bg-(--hedgehog-core-navy) py-10 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_5%,hsl(var(--th-accent)/0.24),transparent_36%),radial-gradient(circle_at_86%_8%,hsl(var(--th-accent)/0.24),transparent_40%)]" />
        <div className="relative mx-auto w-full max-w-[1840px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--dune-muted)">Layout workflow</p>
              <h2 className="mt-3 text-[1.7rem] font-semibold leading-[1.08] text-(--text-primary-dark) sm:text-[2.05rem]">
                Use layouts as reference architecture, then edit the underlying blocks
              </h2>
              <p className="mt-4 max-w-[58ch] text-[1.06rem] leading-8 text-(--text-primary-dark)">
                These public layout pages exist to show message order, block stacking, and the relationship between a full
                email and the underlying component library. {MJML_PACK_NAME} is there when your team wants the complete archive
                locally for faster assembly and handoff.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-[0.8rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[1rem] font-semibold tracking-[0.01em] !text-(--text-primary-dark) transition duration-200 hover:-translate-y-0.5 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                >
                  {`View ${MJML_PACK_NAME}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-(--surface-line) bg-(--surface-soft) px-5 text-[1rem] font-semibold tracking-[0.01em] !text-(--text-primary-dark) transition duration-200 hover:-translate-y-0.5 hover:border-(--accent-support) hover:!text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                >
                  Read docs
                </Link>
              </div>
            </div>

            <div className="surface-card-soft rounded-[0.96rem] bg-(--dune-deep) p-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--dune-muted)">
                This page helps you
              </p>
              <ul className="mt-4 space-y-3 text-[1rem] leading-8 text-(--text-primary-dark)">
                <li className="border-b border-(--surface-line) pb-2">See the full compiled email before editing</li>
                <li className="border-b border-(--surface-line) pb-2">Understand which component blocks form the stack</li>
                <li>Move from recipe-level structure to block-level customisation cleanly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
