import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCode2,
  Layers3,
  MonitorCheck,
  PackageOpen,
} from "lucide-react";
import { createPageTitle } from "@/config/template";
import {
  emailLayouts,
  getEmailLayoutBySlug,
} from "@/data/email-layouts";
import { getEmailComponentBySlug } from "@/data/email-components";
import { compiledLayoutHtmlBySlug } from "@/data/email-layouts/compiled";
import { getEmailWorkflowsBySystem } from "@/data/workflows";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { MjmlSourcePanel } from "@/components/ui/MjmlSourcePanel";
import { MJML_PACK_NAME } from "@/lib/pack";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

function getDevZedFileName(fileName: string): string | undefined {
  if (process.env.NODE_ENV !== "development") {
    return undefined;
  }

  return fileName;
}

export function generateStaticParams() {
  return emailLayouts.map((layout) => ({ slug: layout.slug }));
}

function SectionIntro({
  label,
  title,
  copy,
}: {
  label?: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-3xl">
      {label ? (
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
          {label}
        </p>
      ) : null}
      <h2 className="mt-2 font-serif text-[clamp(1.85rem,4vw,3.15rem)] font-semibold leading-[1] text-[var(--text-primary)]">
        {title}
      </h2>
      {copy ? (
        <p className="mt-3 text-[1rem] leading-8 text-[var(--text-secondary)]">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

function getWorkflowPurpose(system: string) {
  switch (system) {
    case "saas-lifecycle":
      return {
        label: "Lifecycle workflow",
        when:
          "Use it when a product or SaaS team needs an onboarding, activation, retention, or upgrade email that is ready to adapt.",
        supports: "Supports customer lifecycle journeys from trigger to handoff.",
      };
    case "transactional":
      return {
        label: "Transactional workflow",
        when:
          "Use it when the send needs account, billing, security, support, or operational clarity more than campaign decoration.",
        supports:
          "Supports high-trust operational sends with source, output, QA, and handoff boundaries attached.",
      };
    case "newsletter":
      return {
        label: "Newsletter workflow",
        when:
          "Use it when recurring content, digest, update, or editorial sends need a stable repeatable structure.",
        supports:
          "Supports repeatable editorial production with reusable blocks and reviewable content sections.",
      };
    case "campaigns":
    default:
      return {
        label: "Campaign workflow",
        when:
          "Use it when a launch, announcement, promotion, or conversion send needs a complete structure quickly.",
        supports: "Supports planned campaign production from editable source to compiled handoff.",
      };
  }
}

function getLayoutQaNotes(system: string): string[] {
  const shared = [
    "Review every CTA href after tracking or ESP link wrapping.",
    "Review image assets and alt text before export or ESP upload.",
    "Check the mobile stack so the message order still makes sense on narrow screens.",
    "Confirm footer, legal, preference, and support copy before handoff.",
    "Confirm platform-specific merge fields, personalisation tokens, and fallback values.",
  ];

  if (system === "transactional") {
    return [
      ...shared,
      "Check account, billing, security, or support wording against the triggering product event.",
      "Keep unsubscribe handling aligned with the sending platform and local transactional email rules.",
    ];
  }

  if (system === "newsletter") {
    return [
      ...shared,
      "Review every article, digest item, and secondary link before scheduling.",
      "Confirm unsubscribe, consent, and preference handling remains the sending platform's responsibility.",
    ];
  }

  if (system === "saas-lifecycle") {
    return [
      ...shared,
      "Check lifecycle timing, user state assumptions, and activation links before automation setup.",
      "Confirm audience rules and journey triggers are handled inside the sending platform.",
    ];
  }

  return [
    ...shared,
    "Check offer dates, campaign destinations, and product claims before upload.",
    "Confirm audience selection, consent, automation, unsubscribe, and sending are handled by the platform.",
  ];
}

const productionPackageItems = [
  {
    title: "MJML source",
    copy: "Editable layout source for adapting copy, block order, imagery, and CTA destinations.",
    icon: FileCode2,
  },
  {
    title: "Compiled HTML",
    copy: "Production output for ESP upload, QA review, or developer handoff.",
    icon: Code2,
  },
  {
    title: "Rendered preview",
    copy: "Visual proof of the complete email before it moves into a sending platform.",
    icon: MonitorCheck,
  },
  {
    title: "QA notes",
    copy: "Practical checks for links, images, mobile stacking, footer/legal copy, and platform tokens.",
    icon: ClipboardCheck,
  },
  {
    title: "Implementation guidance",
    copy: "How to move from editable source to compiled output and final platform handoff.",
    icon: PackageOpen,
  },
  {
    title: "Component breakdown",
    copy: "The reusable production blocks that make up the workflow package.",
    icon: Layers3,
  },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const layout = getEmailLayoutBySlug(slug);

  if (!layout) {
    return {
      title: createPageTitle("Layout not found"),
    };
  }

  return createSeoMetadata({
    title: layout.title,
    description: layout.description,
    path: `/layouts/${layout.slug}`,
    type: "article",
    image: layout.previewImageUrl,
    keywords: [
      layout.title,
      "MJML layout",
      "compiled HTML email",
      "production email layout",
      "email workflow",
    ],
  });
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
  const workflowPurpose = getWorkflowPurpose(layout.system);
  const relatedWorkflows = getEmailWorkflowsBySystem(layout.system);
  const primaryWorkflow =
    relatedWorkflows.find((workflow) => workflow.linkedLayoutSlug === layout.slug) ??
    relatedWorkflows[0];
  const qaNotes = getLayoutQaNotes(layout.system);

  return (
    <main className="th-monochrome min-h-screen bg-[var(--bg-canvas)] text-[var(--text-secondary)]">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="layout-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Layouts", path: "/layouts" },
          { name: layout.title, path: `/layouts/${layout.slug}` },
        ])}
      />
      <TrackEventOnMount
        event="view_layout_detail"
        payload={{ layoutSlug: layout.slug }}
      />

      <section className="relative isolate overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-px bg-[linear-gradient(90deg,transparent,var(--identity-source),transparent)]" />
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--identity-source)]">
                Deployable workflow package
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.65rem,5.8vw,5rem)] font-semibold leading-[0.94] text-[var(--text-primary)]">
                {layout.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[1.08rem] leading-8 text-[var(--text-secondary)]">
                {layout.description}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <h2 className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    Workflow type
                  </h2>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                    {workflowPurpose.label}
                  </p>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <h2 className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    When to use it
                  </h2>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                    {workflowPurpose.when}
                  </p>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <h2 className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    What you receive
                  </h2>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                    Source, compiled HTML, rendered preview, QA notes, component structure, and handoff context.
                  </p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={primaryWorkflow ? `/workflows/${primaryWorkflow.slug}` : "/workflows"}
                  className="th-btn th-btn-primary"
                >
                  View workflow context
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#production-package" className="th-btn th-btn-secondary text-[var(--text-primary)]">
                  See package contents
                </Link>
              </div>
            </div>

            <div className="border-y border-[var(--border-subtle)] py-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                Source to handoff
              </p>
              <p className="mt-2 text-[1rem] leading-8 text-[var(--text-secondary)]">
                {workflowPurpose.supports} Template Hedgehog prepares the artefact. The sending platform handles audiences, consent, automation, unsubscribe, reporting, and delivery.
              </p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Source", "MJML available"],
                  ["Output", compiledHtml ? "Compiled HTML available" : "Compiled HTML pending"],
                  ["Preview", "Rendered layout proof"],
                  ["Handoff", "QA and implementation notes"],
                ].map(([label, value]) => (
                  <div key={label} className="border-l border-[var(--border-subtle)] pl-3">
                    <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-[0.92rem] font-semibold text-[var(--text-primary)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <figure className="mt-12 overflow-hidden border-y border-[var(--border-strong)] bg-white shadow-[0_34px_95px_rgba(49,59,114,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 sm:px-5">
              <figcaption>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                  Rendered preview
                </p>
                <p className="mt-1 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
                  Complete production package preview before upload, QA, and handoff.
                </p>
              </figcaption>
              <span className="text-[0.84rem] font-semibold text-[var(--text-primary)]">
                {layout.componentBlocks.length} production blocks
              </span>
            </div>
            <div className="relative min-h-[34rem] bg-white sm:min-h-[44rem]">
              <Image
                src={layout.previewImageUrl}
                alt={`${layout.title} rendered workflow package preview`}
                fill
                sizes="(max-width: 1280px) 94vw, 1120px"
                unoptimized
                priority
                className="object-contain object-top"
              />
            </div>
          </figure>
        </div>
      </section>

      <section id="production-package" className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SectionIntro
              label="Production package"
              title="What arrives after purchase"
              copy={`This is the full workflow package framing: editable source, compiled output, rendered proof, QA guidance, implementation notes, and a component stack your team can inspect. ${MJML_PACK_NAME} keeps the archive local for teams that want source and handoff files together.`}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {productionPackageItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="border-t border-[var(--border-subtle)] pt-4">
                    <Icon className="h-5 w-5 text-[var(--identity-source)]" aria-hidden="true" />
                    <h3 className="mt-3 text-[1.05rem] font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">
                      {item.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SectionIntro
              label="Component structure"
              title="Assembled from reusable production blocks"
              copy="The layout is not a static screenshot. It is a workflow-ready stack of reusable blocks that can be inspected together or opened individually when a section needs source-level adjustment."
            />

            <div>
              <ol className="grid gap-4 md:grid-cols-2">
                {resolvedComponentBlocks.map((entry) => (
                  <li
                    key={`${layout.slug}-${entry.component.slug}`}
                    className="border-t border-[var(--border-subtle)] pt-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--identity-source)] text-[0.82rem] font-bold text-[var(--identity-source-on-dark)]">
                        {entry.order}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/components/${entry.component.slug}`}
                          className="text-[1.05rem] font-semibold text-[var(--text-primary)] underline-offset-2 transition hover:text-[var(--identity-source)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                        >
                          {entry.component.title}
                        </Link>
                        <p className="mt-1 text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                          {entry.component.category}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                      {entry.notes}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-[var(--border-subtle)] pt-5">
                <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">Message order</h3>
                <ul className="mt-4 space-y-3 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
                  {layout.layoutSections.map((section) => (
                    <li key={`${layout.slug}-${section.title}`} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--identity-source)]" aria-hidden="true" />
                      <span>
                        <strong className="font-semibold text-[var(--text-primary)]">{section.title}.</strong>{" "}
                        {section.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {missingComponentSlugs.length > 0 ? (
                <div className="mt-6 border-y border-[var(--border-strong)] bg-[var(--bg-accent-soft)] px-4 py-3 text-[0.95rem] leading-7 text-[var(--text-primary)]">
                  Stack mismatch detected. Missing component definitions: {missingComponentSlugs.join(", ")}.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SectionIntro
              label="QA and handoff"
              title="Ready to prepare, not ready to send by itself"
              copy="Template Hedgehog prepares the artefact. Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or your ESP still handle audiences, consent, automation, unsubscribe, reporting, and sending."
            />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <div>
                <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">
                  Layout QA checks
                </h3>
                <ul className="mt-4 space-y-3 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
                  {qaNotes.map((note) => (
                    <li key={note} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--identity-source)]" aria-hidden="true" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-y border-[var(--border-subtle)] bg-white px-4 py-5">
                <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">
                  Platform boundary
                </h3>
                <dl className="mt-4 space-y-4">
                  <div className="border-l border-[var(--identity-source-border)] pl-3">
                    <dt className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                      Template Hedgehog prepares
                    </dt>
                    <dd className="mt-1 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                      MJML source, compiled HTML, preview, QA guidance, component structure, and handoff context.
                    </dd>
                  </div>
                  <div className="border-l border-[var(--border-subtle)] pl-3">
                    <dt className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                      Sending platform handles
                    </dt>
                    <dd className="mt-1 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                      Audiences, segmentation, consent, automation, unsubscribe, personalisation merge fields, scheduling, sending, and reporting.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <SectionIntro
          label="Source and output"
          title="Copy source after the workflow is understood"
          copy="MJML and HTML remain available for implementation, but the package value is the complete production workflow: preview, structure, QA, handoff, and source together."
        />

        <div className="mt-8 grid gap-7 xl:grid-cols-2">
          <MjmlSourcePanel
            source={layout.mjmlSource}
            title="Layout MJML"
            description="Editable workflow source for adjusting message order, copy, imagery, and destination URLs."
            zedFileName={getDevZedFileName(`${layout.slug}-layout.mjml`)}
            copyButtonLabel="Copy MJML"
            successMessage="Layout MJML copied to clipboard"
            analyticsPayload={{ layoutSlug: layout.slug, sourceType: "mjml" }}
          />

          {compiledHtml ? (
            <MjmlSourcePanel
              source={compiledHtml}
              language="html"
              title="Compiled HTML"
              description="Final output for ESP upload, QA review, and handoff workflows."
              zedFileName={getDevZedFileName(`${layout.slug}-compiled.html`)}
              copyButtonLabel="Copy HTML"
              successMessage="Layout HTML copied to clipboard"
              analyticsPayload={{ layoutSlug: layout.slug, sourceType: "html" }}
            />
          ) : (
            <article className="overflow-hidden rounded-[1rem] border border-[var(--identity-output-border)] bg-[var(--bg-surface)]">
              <div className="border-b border-[var(--identity-output-border)] bg-[var(--identity-output-soft)] px-5 py-4 sm:px-6">
                <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">Compiled HTML</h3>
                <p className="mt-1 text-[0.9rem] text-[var(--text-secondary)]">
                  Final output for ESP upload, QA review, and handoff workflows.
                </p>
              </div>
              <div className="px-5 py-5 text-[1rem] leading-7 text-[var(--text-secondary)] sm:px-6">
                Compiled HTML is unavailable for this layout right now. Rebuild the compiled layout registry to repopulate this panel.
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-10 sm:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--identity-source),transparent)]" />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--identity-source)]">
                Workflow package
              </p>
              <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] text-[var(--text-primary)]">
                Move from source to handoff with the complete system attached.
              </h2>
              <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--text-secondary)]">
                Layout pages show the deployable artefact, the underlying blocks, and the handoff boundary before your team moves into an ESP.
              </p>
            </div>
            <Link href="/layouts" className="th-btn th-btn-primary w-fit">
              Explore layouts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
