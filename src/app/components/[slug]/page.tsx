import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { CompatibilityTable } from "@/components/ui/CompatibilityTable";
import { HtmlPreviewFrame } from "@/components/ui/HtmlPreviewFrame";
import { MJML_PACK_NAME } from "@/lib/pack";
import {
  extractComponentHtmlSnippet,
  extractComponentMjmlSnippet,
} from "@/lib/html-snippets";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

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

  return createSeoMetadata({
    title: component.title,
    description: component.description,
    path: `/components/${component.slug}`,
    keywords: [
      component.title,
      component.category,
      ...component.tags,
      "MJML component",
      "HTML email component",
    ],
    type: "article",
    image: component.previewImageUrl,
  });
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
  const mjmlSnippet = extractComponentMjmlSnippet(component.mjmlSource);
  const htmlSnippet = compiledHtml ? extractComponentHtmlSnippet(compiledHtml) : "";
  const renderingNotes = compatibility
    .filter((entry) => Boolean(entry.notes))
    .map((entry) => `${entry.client}: ${entry.notes}`);

  return (
    <main className="min-h-screen text-[var(--th-text-secondary)]">
      <SiteTopBar theme="hero" />
      <JsonLd
        id="component-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Components", path: "/components" },
          { name: component.title, path: `/components/${component.slug}` },
        ])}
      />
      <TrackEventOnMount
        event="view_component_detail"
        payload={{ componentSlug: component.slug }}
      />

      <section className="mx-auto w-full max-w-7xl bg-[var(--bg-canvas)] px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-10">
        <article className="grid gap-8 border-b border-[var(--th-border-dark)] pb-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-[var(--th-text-secondary)]">
                Developer reference
              </p>
              <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] text-white sm:text-[3.1rem]">
                {component.title}
              </h1>
              <p className="mt-4 max-w-3xl text-[1.14rem] leading-8 text-[var(--th-text-secondary)]">
                {component.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.01rem] text-[var(--th-text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
                  {component.category} block
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
                  Production documentation page
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
                  Source file: {component.sourceFile}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
                  Copyable MJML and compiled HTML
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/components"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)] px-4 text-[1rem] font-semibold text-[var(--th-text-secondary)] transition duration-200 hover:border-[var(--border-subtle)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                >
                  All components
                </Link>
                <Link
                  href="/layouts"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)] px-4 text-[1rem] font-semibold text-[var(--th-text-secondary)] transition duration-200 hover:border-[var(--border-subtle)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                >
                  See layouts
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-[0.8rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[1rem] font-semibold tracking-[0.01em] !text-[var(--action-text)] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                >
                  {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
                Tags: {component.tags.join(" · ")}
              </p>
            </div>

            <div className="rounded-[1.15rem] border border-[var(--th-border-dark)] bg-[#111933] p-4 sm:p-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
                Rendering screenshot
              </p>
              <div className="relative mt-2 aspect-[15/11] overflow-hidden rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)]">
                <Image
                  src={component.previewImageUrl}
                  alt={`${component.title} rendering screenshot`}
                  width={980}
                  height={760}
                  unoptimized
                  preload
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <p className="mt-3 text-[0.96rem] leading-7 text-[var(--th-text-secondary)]">
                Preview frame reflects current component rendering and real spacing proportions for production email QA.
              </p>
            </div>
          </article>

        <section className="mt-10 grid gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <article className="overflow-hidden rounded-[1rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                Live preview
              </p>
              <h2 className="mt-2 text-[1.54rem] font-semibold text-white">Rendered component preview</h2>
              <p className="mt-3 max-w-3xl text-[1.08rem] leading-8 text-[var(--th-text-secondary)]">
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
              <div className="mt-5 rounded-[0.9rem] border border-[var(--border-strong)] bg-[var(--bg-accent-soft)] px-4 py-4 text-[1rem] leading-7 text-white">
                Compiled HTML is currently unavailable for this component. The screenshot above is still available as a
                visual reference while the build output is refreshed.
              </div>
            )}
          </article>

          <aside className="overflow-hidden rounded-[1rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-4 sm:p-5">
            <section>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                Usage guidance
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-white">When to use this block</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
                {component.usageGuidance.map((guidance) => (
                  <li key={guidance} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                    <span>{guidance}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5 border-t border-[var(--th-border-dark)] pt-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                Developer notes
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-white">Edit MJML, ship HTML</h2>
              <p className="mt-3 text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
                Use MJML as the editable source of truth. The compiled HTML panel is included for ESP handoff, QA,
                or integration points that only accept raw HTML.
              </p>
              <ul className="mt-3 space-y-2.5 text-[0.96rem] leading-7 text-[var(--th-text-secondary)]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                  <span>{`Also included in ${MJML_PACK_NAME} for teams that want the full component system offline.`}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                  <span>Source file name: {component.sourceFile}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                  <span>{compatibility.length} client notes currently documented for this block.</span>
                </li>
              </ul>
            </section>

            <section className="mt-5 border-t border-[var(--th-border-dark)] pt-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                Accessibility
              </p>
              <h2 className="mt-2 text-[1.35rem] font-semibold text-white">Accessibility notes</h2>
              <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
                {component.accessibilityNotes.map((note) => (
                  <li key={note} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            {renderingNotes.length > 0 ? (
              <section className="mt-5 border-t border-[var(--th-border-dark)] pt-5">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                  Rendering notes
                </p>
                <h2 className="mt-2 text-[1.35rem] font-semibold text-white">Client-specific guidance</h2>
                <ul className="mt-3 space-y-2.5 text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
                  {renderingNotes.map((note) => (
                    <li key={note} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-white" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </section>

        <section className="mt-14 border-t border-[var(--th-border-dark)] pt-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
                Client support
              </p>
              <h2 className="mt-2 text-[1.54rem] font-semibold text-white">Compatibility</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-accent-soft)] px-2.5 py-1 text-[0.86rem] font-semibold text-white">
              <ShieldCheck className="h-4 w-4" />
              {compatibility.length > 0 ? `${compatibility.length} clients` : "Pending"}
            </span>
          </div>
          <p className="mt-3 text-[1.04rem] leading-8 text-[var(--th-text-secondary)]">
            Rendering support notes across major email clients.
          </p>
          {compatibility.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-[0.95rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-4 sm:p-5">
              <CompatibilityTable
                compatibility={compatibility}
                caption={`${component.title} compatibility matrix`}
              />
            </div>
          ) : (
            <p className="mt-3 text-[1.04rem] leading-8 text-[var(--th-text-secondary)]">
              Additional compatibility notes for this component will be added as the documentation library expands.
            </p>
          )}
        </section>

        {linkedWorkflows.length > 0 ? (
          <section className="mt-14 border-t border-[var(--th-border-dark)] pt-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">Used in layouts</p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-white">
              Where this block appears in production layout systems
            </h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-[var(--th-text-secondary)]">
              These layout pages include this component in context, with block order, message structure, and QA guidance alongside
              the rendered email.
            </p>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {linkedWorkflows.map((workflow) => {
                const mappedLayout = getEmailLayoutBySlug(workflow.linkedLayoutSlug);
                const metaLabel = mappedLayout ? mappedLayout.title : "Layout recipe";

                return (
                  <li key={workflow.slug}>
                    <Link
                      href={`/layouts/${workflow.linkedLayoutSlug}`}
                      className="block rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-4 transition duration-200 hover:border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                    >
                      <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
                        {metaLabel}
                      </p>
                      <h3 className="mt-2 text-[1.05rem] font-semibold text-white">
                        {workflow.title}
                      </h3>
                      <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">{workflow.summary}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {relatedComponents.length > 0 ? (
          <section className="mt-14 border-t border-[var(--th-border-dark)] pt-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
              Related blocks
            </p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-white">Continue building</h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-[var(--th-text-secondary)]">
              These components are closely related by category or usage pattern and are useful when assembling a full email flow.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedComponents.map((relatedComponent) => (
                <Link
                  key={relatedComponent.slug}
                  href={`/components/${relatedComponent.slug}`}
                  className="rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-4 transition duration-200 hover:border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                >
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
                    {relatedComponent.category}
                  </p>
                  <h3 className="mt-2 text-[1.05rem] font-semibold text-white">{relatedComponent.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">{relatedComponent.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 border-t border-[var(--th-border-dark)] pt-8">
          <div className="mb-4">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-[var(--th-text-secondary)]">
              Source code
            </p>
            <h2 className="mt-2 text-[1.54rem] font-semibold text-white">Copy the code you need</h2>
            <p className="mt-3 max-w-3xl text-[1.04rem] leading-8 text-[var(--th-text-secondary)]">
              The source and compiled HTML shown below map directly to the rendered preview above.
              This keeps preview, MJML, and HTML handoff output aligned.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ComponentMjmlSourcePanel
              snippetSource={mjmlSnippet}
              standaloneSource={component.mjmlSource}
              componentSlug={component.slug}
            />

            {compiledHtml ? (
              <ComponentHtmlSourcePanel
                snippetSource={htmlSnippet}
                standaloneSource={compiledHtml}
                componentSlug={component.slug}
              />
            ) : (
              <article className="overflow-hidden rounded-[1rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)]">
                <div className="border-b border-[var(--th-border-dark)] px-5 py-4 sm:px-6">
                  <h3 className="text-[1.1rem] font-semibold text-white">Compiled HTML</h3>
                  <p className="mt-1 text-[0.9rem] text-[var(--th-text-secondary)]">
                    Final output for ESP handoff, QA review, or HTML-only integrations.
                  </p>
                </div>
                <div className="px-5 py-5 text-[1rem] leading-7 text-[var(--th-text-secondary)] sm:px-6">
                  Compiled HTML is unavailable for this component right now. Rebuild the compiled registry to repopulate
                  this panel.
                </div>
              </article>
            )}
          </div>
        </section>
      </section>

      <section className="bg-[var(--bg-canvas)] py-10 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-[var(--th-text-secondary)]">Full library</p>
              <h2 className="mt-3 text-[1.7rem] font-semibold leading-[1.08] text-white sm:text-[2.05rem]">
                Need the entire system available offline?
              </h2>
              <p className="mt-4 max-w-3xl text-[1.06rem] leading-8 text-white">
                Public component pages are there for reference and one-off use. {MJML_PACK_NAME} is for teams that want the
                full system archive, local source files, compiled HTML, and a quicker implementation handoff.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center gap-2 rounded-[0.8rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[1rem] font-semibold tracking-[0.01em] !text-[var(--action-text)] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                >
                  {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-5 text-[1rem] font-semibold tracking-[0.01em] text-white transition duration-200 hover:border-[var(--border-subtle)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                >
                  Read docs
                </Link>
              </div>
            </div>

            <div className="rounded-[0.96rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)] p-5">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-[var(--th-text-secondary)]">
                Why teams upgrade
              </p>
              <ul className="mt-4 space-y-3 text-[1rem] leading-8 text-white">
                <li className="border-b border-[var(--th-border-dark)] pb-2">Stop collecting blocks one page at a time</li>
                <li className="border-b border-[var(--th-border-dark)] pb-2">Keep the full MJML and compiled HTML system locally</li>
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
