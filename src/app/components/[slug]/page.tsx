import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { createPageTitle } from "@/config/template";
import {
  emailComponents,
  getEmailComponentBySlug,
  getRelatedEmailComponents,
} from "@/data/email-components";
import { getEmailLayoutBySlug } from "@/data/email-layouts";
import { getEmailWorkflowsByComponentSlug } from "@/data/workflows";
import { compiledComponentsBySlug } from "@/data/email-components/compiled";
import { ComponentHtmlSourcePanel } from "@/components/email-components/ComponentHtmlSourcePanel";
import { ComponentMjmlSourcePanel } from "@/components/email-components/ComponentMjmlSourcePanel";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { CompatibilityTable } from "@/components/ui/CompatibilityTable";
import { HtmlPreviewFrame } from "@/components/ui/HtmlPreviewFrame";
import { MJML_PACK_NAME } from "@/lib/pack";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailComponents.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = getEmailComponentBySlug(slug);

  if (!component) {
    return {
      title: createPageTitle("Component not found"),
    };
  }

  return {
    title: createPageTitle(component.title),
    description: component.description,
    keywords: [
      component.title,
      component.category,
      ...component.tags,
      "MJML component",
      "HTML email component",
    ],
    openGraph: {
      title: createPageTitle(component.title),
      description: component.description,
      type: "article",
      images: [
        {
          url: component.previewImageUrl,
          alt: `${component.title} preview`,
        },
      ],
    },
  };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const component = getEmailComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const compatibility = component.compatibility ?? [];
  const relatedComponents = getRelatedEmailComponents(component.slug);
  const linkedWorkflows = getEmailWorkflowsByComponentSlug(component.slug);
  const compiledHtml = compiledComponentsBySlug[component.slug] ?? null;
  const renderingNotes = compatibility
    .filter((entry) => Boolean(entry.notes))
    .map((entry) => `${entry.client}: ${entry.notes}`);

  return (
    <main className="min-h-screen text-slate-600">
      <SiteTopBar theme="hero" />
      <TrackEventOnMount
        event="view_component_detail"
        payload={{ componentSlug: component.slug }}
      />

      <section className="mx-auto w-full max-w-7xl rounded-[1.3rem] border border-slate-200 bg-white px-5 pb-20 pt-8 shadow-[0_18px_36px_rgba(0,0,0,0.38)] sm:px-8 lg:px-12 lg:pb-24 lg:pt-10">
        <div className="rounded-[1.45rem] border border-slate-200 bg-slate-50 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <article className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-slate-600">
                Developer reference
              </p>
              <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] text-slate-900 sm:text-[3.1rem]">
                {component.title}
              </h1>
              <p className="mt-4 max-w-3xl text-[1.14rem] leading-8 text-slate-600">
                {component.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.01rem] text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  {component.category} block
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  Registry-driven component page
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  Source file: {component.sourceFile}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  Copyable MJML and compiled HTML
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/components"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-slate-200 bg-white px-4 text-[1rem] font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  All components
                </Link>
                <Link
                  href="/layouts"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-slate-200 bg-white px-4 text-[1rem] font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  See layouts
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-[0.8rem] border border-rose-600 bg-rose-600 px-5 text-[1rem] font-semibold tracking-[0.01em] !text-white transition duration-200 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {`View ${MJML_PACK_NAME}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Tags: {component.tags.join(" · ")}
              </p>
            </div>

            <div className="rounded-[1.15rem] border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Rendering screenshot
              </p>
              <div className="relative mt-2 aspect-[15/11] overflow-hidden rounded-[0.9rem] border border-slate-200 bg-slate-50">
                <Image
                  src={component.previewImageUrl}
                  alt={`${component.title} rendering screenshot`}
                  width={980}
                  height={760}
                  unoptimized
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <p className="mt-3 text-[0.96rem] leading-7 text-slate-600">
                Preview frame reflects current component rendering and real spacing proportions.
              </p>
            </div>
          </article>
        </div>

        <section className="mt-14 grid gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <article className="overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Live preview
              </p>
              <h2 className="mt-2 text-[1.54rem] font-semibold text-slate-900">Rendered component preview</h2>
              <p className="mt-3 max-w-3xl text-[1.08rem] leading-8 text-slate-600">
                This preview is rendered from compiled HTML output so you can inspect the actual email structure, not
                a static mock-up.
              </p>
            </div>

            {compiledHtml ? (
              <div className="mt-5">
                <HtmlPreviewFrame
                  html={compiledHtml}
                  title={`${component.title} rendered preview`}
                  variant="component"
                />
              </div>
            ) : (
              <div className="mt-5 rounded-[0.9rem] border border-[rgba(234,88,12,0.35)] bg-[rgba(234,88,12,0.14)] px-4 py-4 text-[1rem] leading-7 text-slate-900">
                Compiled HTML is currently unavailable for this component. The screenshot above is still available as a
                visual reference while the build output is refreshed.
              </div>
            )}
          </article>

          <aside className="overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <section>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Usage guidance
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-slate-900">When to use this block</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-slate-600">
                {component.usageGuidance.map((guidance) => (
                  <li key={guidance} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                    <span>{guidance}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Developer notes
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-slate-900">Edit MJML, ship HTML</h2>
              <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
                Use MJML as the editable source of truth. The compiled HTML panel is included for ESP handoff, QA,
                or integration points that only accept raw HTML.
              </p>
              <ul className="mt-3 space-y-2.5 text-[0.96rem] leading-7 text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                  <span>{`Also included in ${MJML_PACK_NAME} for teams that want the full component archive offline.`}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                  <span>Source file name: {component.sourceFile}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                  <span>{compatibility.length} client notes currently documented for this block.</span>
                </li>
              </ul>
            </section>

            <section className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Accessibility
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-slate-900">Accessibility notes</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-slate-600">
                {component.accessibilityNotes.map((note) => (
                  <li key={note} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            {renderingNotes.length > 0 ? (
              <section className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                  Rendering notes
                </p>
                <h2 className="mt-2 text-[1.35rem] font-semibold text-slate-900">Client-specific guidance</h2>
                <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-slate-600">
                  {renderingNotes.map((note) => (
                    <li key={note} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                Client support
              </p>
              <h2 className="mt-2 text-[1.54rem] font-semibold text-slate-900">Compatibility</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--th-accent-support)/0.14)] px-2.5 py-1 text-[0.86rem] font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4" />
              {compatibility.length > 0 ? `${compatibility.length} clients` : "Pending"}
            </span>
          </div>
          <p className="mt-3 text-[1.04rem] leading-8 text-slate-600">
            Rendering support notes across major email clients.
          </p>
          {compatibility.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-[0.95rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <CompatibilityTable
                compatibility={compatibility}
                caption={`${component.title} compatibility matrix`}
              />
            </div>
          ) : (
            <p className="mt-3 text-[1.04rem] leading-8 text-slate-600">
              Additional compatibility notes for this component will be added as the documentation library expands.
            </p>
          )}
        </section>

        {linkedWorkflows.length > 0 ? (
          <section className="mt-14 border-t border-slate-200 pt-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">Used in workflows</p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-slate-900">
              Where this block appears in production workflow stacks
            </h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-slate-600">
              These workflow pages include this component in context, with trigger, data contract, and QA notes alongside
              the linked layout structure.
            </p>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {linkedWorkflows.map((workflow) => {
                const mappedLayout = getEmailLayoutBySlug(workflow.linkedLayoutSlug);
                const metaLabel = mappedLayout ? mappedLayout.title : "Layout recipe";

                return (
                  <li key={workflow.slug}>
                    <Link
                      href={`/workflows/${workflow.slug}`}
                      className="block rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                    >
                      <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                        {metaLabel}
                      </p>
                      <h3 className="mt-2 text-[1.05rem] font-semibold text-slate-900">
                        {workflow.title}
                      </h3>
                      <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">{workflow.summary}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {relatedComponents.length > 0 ? (
          <section className="mt-14 border-t border-slate-200 pt-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
              Related blocks
            </p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-slate-900">Continue building</h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-slate-600">
              These components are closely related by category or usage pattern and are useful when assembling a full email flow.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedComponents.map((relatedComponent) => (
                <Link
                  key={relatedComponent.slug}
                  href={`/components/${relatedComponent.slug}`}
                  className="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                >
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                    {relatedComponent.category}
                  </p>
                  <h3 className="mt-2 text-[1.05rem] font-semibold text-slate-900">{relatedComponent.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">{relatedComponent.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 border-t border-slate-200 pt-8">
          <div className="mb-4">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
              Source code
            </p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-slate-900">Copy the code you need</h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-slate-600">
              The source and compiled HTML shown below map directly to the rendered preview above.
              This keeps preview, MJML, and HTML handoff output aligned.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ComponentMjmlSourcePanel
              snippetSource={component.mjmlSource}
              standaloneSource={component.mjmlSource}
              componentSlug={component.slug}
            />

            {compiledHtml ? (
              <ComponentHtmlSourcePanel
                snippetSource={compiledHtml}
                standaloneSource={compiledHtml}
                componentSlug={component.slug}
              />
            ) : (
              <article className="overflow-hidden rounded-[1rem] border border-black/10 bg-white">
                <div className="border-b border-black/10 px-5 py-4 sm:px-6">
                  <h3 className="text-[1.1rem] font-semibold text-slate-900">Compiled HTML</h3>
                  <p className="mt-1 text-[0.9rem] text-slate-500">
                    Final output for ESP handoff, QA review, or HTML-only integrations.
                  </p>
                </div>
                <div className="px-5 py-5 text-[1rem] leading-7 text-slate-500 sm:px-6">
                  Compiled HTML is unavailable for this component right now. Rebuild the compiled registry to repopulate
                  this panel.
                </div>
              </article>
            )}
          </div>
        </section>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-slate-500">Full library</p>
              <h2 className="mt-3 text-[1.7rem] font-semibold leading-[1.08] text-slate-900 sm:text-[2.05rem]">
                Need the entire system available offline
              </h2>
              <p className="mt-4 max-w-3xl text-[1.06rem] leading-8 text-slate-900">
                Public component pages are there for reference and one-off use. {MJML_PACK_NAME} is for teams that want the
                full archive, local source files, compiled HTML, and a quicker implementation handoff.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-[0.8rem] border border-rose-600 bg-rose-600 px-5 text-[1rem] font-semibold tracking-[0.01em] !text-white transition duration-200 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {`View ${MJML_PACK_NAME}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-slate-200 bg-slate-50 px-5 text-[1rem] font-semibold tracking-[0.01em] text-white transition duration-200 hover:border-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Read docs
                </Link>
              </div>
            </div>

            <div className="rounded-[0.96rem] border border-slate-200 bg-white p-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Why teams upgrade
              </p>
              <ul className="mt-4 space-y-3 text-[1rem] leading-8 text-slate-900">
                <li className="border-b border-slate-200 pb-2">Stop collecting blocks one page at a time</li>
                <li className="border-b border-slate-200 pb-2">Keep the full MJML and compiled HTML archive locally</li>
                <li>Speed up implementation, review, and delivery across projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
