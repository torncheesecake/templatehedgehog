import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { createPageTitle } from "@/config/template";
import {
  emailComponents,
  getEmailComponentBySlug,
  getRelatedEmailComponents,
} from "@/data/email-components";
import { getEmailWorkflowsByComponentSlug } from "@/data/workflows";
import { compiledComponentsBySlug } from "@/data/email-components/compiled";
import { ComponentHtmlSourcePanel } from "@/components/email-components/ComponentHtmlSourcePanel";
import { ComponentMjmlSourcePanel } from "@/components/email-components/ComponentMjmlSourcePanel";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
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
      <h2 className="mt-2 font-serif text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
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

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-[0.98rem] leading-7 text-[var(--text-secondary)]">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--action-primary)]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getComponentRole(component: NonNullable<ReturnType<typeof getEmailComponentBySlug>>) {
  const tags = component.tags.map((tag) => tag.toLowerCase());
  const roles: Array<{ label: string; copy: string }> = [];

  if (component.category === "Transactional Components" || tags.includes("transactional")) {
    roles.push({
      label: "Transactional",
      copy: "For account, billing, support, and security sends where clarity matters more than decoration.",
    });
  }

  if (tags.some((tag) => ["password", "security", "verification", "account"].includes(tag))) {
    roles.push({
      label: "Account access",
      copy: "Useful when the recipient needs a direct, trusted route back into their account.",
    });
  }

  if (component.category === "Newsletter Layouts" || tags.some((tag) => tag.includes("newsletter") || tag.includes("digest") || tag === "editorial")) {
    roles.push({
      label: "Newsletter",
      copy: "For repeatable editorial sends, product updates, and digest sections that need a stable rhythm.",
    });
  }

  if (component.category === "Heroes" || tags.some((tag) => ["launch", "campaign", "announcement", "promotion", "feature"].includes(tag))) {
    roles.push({
      label: "Acquisition",
      copy: "For campaign intros and launch moments where the first screen needs a clear action.",
    });
  }

  if (tags.some((tag) => ["onboarding", "welcome", "activation", "trial"].includes(tag))) {
    roles.push({
      label: "Onboarding",
      copy: "For activation and lifecycle flows where the block needs to move users to the next step.",
    });
  }

  if (component.category === "Footers" || tags.some((tag) => ["legal", "privacy", "support"].includes(tag))) {
    roles.push({
      label: "Handoff support",
      copy: "For legal, support, and trust information that needs to survive ESP handoff cleanly.",
    });
  }

  if (roles.length === 0) {
    roles.push({
      label: "Lifecycle",
      copy: "For reusable email sections that support product, customer, and operational messages.",
    });
  }

  return roles.slice(0, 3);
}

function getPlacementSummary(component: NonNullable<ReturnType<typeof getEmailComponentBySlug>>) {
  switch (component.category) {
    case "Headers":
      return "At the start of the email, before the main message begins.";
    case "Heroes":
      return "At the top of a campaign, launch, onboarding, or announcement send.";
    case "Buttons":
      return "After the decision point, where the reader needs a clear next action.";
    case "Footers":
      return "At the close of the email, where support, legal, and brand trust need to be retained.";
    case "Product Sections":
      return "In the middle of the email, where features, products, or content need structured comparison.";
    case "Transactional Components":
      return "Inside account, security, billing, support, or operational messages.";
    case "Newsletter Layouts":
      return "Inside recurring editorial, digest, and update emails.";
    case "Content Blocks":
    default:
      return "Between the hero and close, where the message needs explanation, proof, or supporting detail.";
  }
}

function getReasonSummary(component: NonNullable<ReturnType<typeof getEmailComponentBySlug>>) {
  const tags = component.tags.map((tag) => tag.toLowerCase());

  if (tags.some((tag) => ["password", "security", "verification", "account"].includes(tag))) {
    return "To make account actions feel clear, trusted, and easy to complete.";
  }

  if (tags.some((tag) => ["newsletter", "digest", "editorial", "blog"].includes(tag))) {
    return "To keep recurring content sends consistent without rebuilding structure every week.";
  }

  if (tags.some((tag) => ["launch", "campaign", "announcement", "promotion", "feature"].includes(tag))) {
    return "To give campaign teams a reliable first block that can move from source to handoff quickly.";
  }

  if (tags.some((tag) => ["onboarding", "welcome", "activation", "trial"].includes(tag))) {
    return "To help lifecycle teams guide users towards the next meaningful action.";
  }

  return "To reuse a production-tested email section without starting from a blank file.";
}

function getDerivedWorkflowContexts(
  component: NonNullable<ReturnType<typeof getEmailComponentBySlug>>,
  linkedWorkflows: ReturnType<typeof getEmailWorkflowsByComponentSlug>,
) {
  const contexts = new Map<string, { label: string; href?: string; note: string }>();

  for (const workflow of linkedWorkflows) {
    contexts.set(workflow.title, {
      label: workflow.title,
      href: `/workflows/${workflow.slug}`,
      note: workflow.goal,
    });
  }

  const tags = component.tags.map((tag) => tag.toLowerCase());
  const addContext = (label: string, href: string, note: string) => {
    if (!contexts.has(label)) {
      contexts.set(label, { label, href, note });
    }
  };

  if (component.category === "Heroes" || tags.some((tag) => ["launch", "campaign", "announcement", "promotion", "feature"].includes(tag))) {
    addContext("Product launch", "/workflows/campaign-launch", "Lead with a clear announcement, supporting proof, and one primary CTA.");
  }

  if (tags.some((tag) => ["onboarding", "welcome", "activation", "trial", "app"].includes(tag))) {
    addContext("Onboarding", "/workflows/onboarding", "Guide a new or returning user to the next activation step.");
  }

  if (component.category === "Transactional Components" || tags.some((tag) => ["password", "security", "verification", "account", "support"].includes(tag))) {
    addContext("Password reset", "/workflows/password-reset", "Keep account-access copy direct, secure, and easy to verify.");
  }

  if (component.category === "Newsletter Layouts" || tags.some((tag) => tag.includes("newsletter") || tag.includes("digest") || tag === "editorial" || tag === "blog")) {
    addContext("Weekly digest", "/workflows/newsletter-digest", "Support repeatable content sections and link-heavy editorial sends.");
  }

  if (contexts.size === 0) {
    if (component.category === "Headers" || component.category === "Content Blocks") {
      addContext("Onboarding", "/workflows/onboarding", "Introduce the message clearly and guide the reader to the next step.");
    } else if (component.category === "Footers") {
      addContext("Weekly digest", "/workflows/newsletter-digest", "Close recurring sends with stable support, legal, and preference-management context.");
    } else {
      addContext("Product launch", "/workflows/campaign-launch", "Place the block inside a campaign structure with clear hierarchy and handoff checks.");
    }
  }

  return Array.from(contexts.values()).slice(0, 4);
}

function getImplementationNotes(
  component: NonNullable<ReturnType<typeof getEmailComponentBySlug>>,
  renderingNotes: string[],
) {
  const tags = component.tags.map((tag) => tag.toLowerCase());
  const notes = [
    "Review every CTA href after the ESP rewrites or tracks links.",
    "Confirm image assets are absolute HTTPS URLs before handoff.",
    "Check the mobile preview before placing this block into a full workflow.",
  ];

  if (component.category === "Footers" || tags.some((tag) => ["legal", "privacy", "support"].includes(tag))) {
    notes.push("Confirm footer, legal, unsubscribe, and support copy before send.");
  }

  if (component.category === "Transactional Components" || tags.some((tag) => ["password", "security", "verification", "account"].includes(tag))) {
    notes.push("Check token expiry, account-access wording, and plain fallback links.");
  }

  if (component.category === "Newsletter Layouts" || tags.some((tag) => tag.includes("newsletter") || tag.includes("digest"))) {
    notes.push("Review every content item, image alt text, and link destination before export.");
  }

  notes.push(...component.accessibilityNotes.slice(0, 2));
  notes.push(...renderingNotes.slice(0, 2));

  return Array.from(new Set(notes)).slice(0, 7);
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
  const productionRoles = getComponentRole(component);
  const workflowContexts = getDerivedWorkflowContexts(component, linkedWorkflows);
  const implementationNotes = getImplementationNotes(component, renderingNotes);
  const primaryUsage = component.usageGuidance.slice(0, 3);

  return (
    <main className="th-monochrome min-h-screen overflow-x-hidden bg-[var(--bg-canvas)] text-[var(--text-secondary)]">
      <SiteTopBar theme="hero" ctaTone="inverse" />
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

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-18">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--identity-source)]">
                Production block
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.6rem,5.8vw,5rem)] font-semibold leading-[0.94] text-[var(--text-primary)]">
                {component.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[1.08rem] leading-8 text-[var(--text-secondary)]">
                {component.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="border border-[var(--identity-source-border)] bg-[var(--bg-accent-soft)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--identity-source)]">
                  {component.category}
                </span>
                {productionRoles.map((role) => (
                  <span
                    key={role.label}
                    className="border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--text-primary)]"
                  >
                    {role.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Use this block when
                </h2>
                <p className="mt-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                  {primaryUsage[0] ?? getReasonSummary(component)}
                </p>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Typically appears in
                </h2>
                <p className="mt-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                  {getPlacementSummary(component)}
                </p>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Why it exists
                </h2>
                <p className="mt-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                  {getReasonSummary(component)}
                </p>
              </div>
            </div>
          </div>

          <figure className="mt-12 overflow-hidden border-y border-[var(--border-strong)] bg-white shadow-[0_34px_95px_rgba(49,59,114,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 sm:px-5">
              <figcaption>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                  Preview
                </p>
                <p className="mt-1 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
                  Rendered production artefact for workflow review before handoff.
                </p>
              </figcaption>
              <Link href="/pricing" className="th-btn th-btn-sm th-btn-primary">
                Get the production pack
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative aspect-[16/10] bg-white sm:aspect-[16/9]">
              <Image
                src={component.previewImageUrl}
                alt={`${component.title} rendered email block preview`}
                width={1440}
                height={900}
                unoptimized
                preload
                className="h-full w-full object-contain object-top"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <SectionIntro
            label="Production role"
            title="Where this block earns its place"
            copy="Treat the component as one production section inside a larger message system. It should support the send goal, survive handoff, and remain easy to review before compilation."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {productionRoles.map((role) => (
              <article key={role.label} className="border-t border-[var(--identity-source-border)] pt-5">
                <h3 className="text-[1.05rem] font-semibold text-[var(--text-primary)]">{role.label}</h3>
                <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">{role.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SectionIntro
              label="Workflow context"
              title="Typically used in"
              copy="These relationships help buyers understand the block as part of a send, not as an isolated catalogue item."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {workflowContexts.map((context) => {
                const content = (
                  <>
                    <h3 className="text-[1.05rem] font-semibold text-[var(--text-primary)]">{context.label}</h3>
                    <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">{context.note}</p>
                  </>
                );

                return context.href ? (
                  <Link
                    key={context.label}
                    href={context.href}
                    className="group border-t border-[var(--border-subtle)] pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                  >
                    {content}
                    <span className="mt-3 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-[var(--identity-source)] group-hover:text-[var(--action-primary)]">
                      View workflow
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                ) : (
                  <article key={context.label} className="border-t border-[var(--border-subtle)] pt-4">
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <SectionIntro
              label="Implementation"
              title="Practical QA before handoff"
              copy="Keep the checks short and action-oriented. The goal is to help teams decide whether this block is ready to enter a workflow."
            />
            <div>
              <CheckList items={implementationNotes} />
            </div>
          </div>
        </div>

        {relatedComponents.length > 0 ? (
          <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
              <SectionIntro
                label="Pairs well with"
                title="Build the next section around it"
                copy="A production email usually needs a stack of blocks. These nearby sections are a sensible next choice when assembling a full send."
              />
              <div className="grid gap-4 md:grid-cols-3">
                {relatedComponents.map((relatedComponent) => (
                  <Link
                    key={relatedComponent.slug}
                    href={`/components/${relatedComponent.slug}`}
                    className="group border-t border-[var(--border-subtle)] pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                  >
                    <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                      {relatedComponent.category}
                    </p>
                    <h3 className="mt-2 text-[1.05rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--action-primary)]">
                      {relatedComponent.title}
                    </h3>
                    <p className="mt-2 text-[0.94rem] leading-7 text-[var(--text-secondary)]">{relatedComponent.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
          <SectionIntro
            label="Source and output"
            title="MJML and HTML remain available"
            copy={`Source stays below the preview and workflow context. Copy MJML when assembling a system, or compiled HTML when preparing ESP handoff. ${MJML_PACK_NAME} includes the full offline archive for teams that need the complete system locally.`}
          />

          <div className="mt-7 grid gap-6 xl:grid-cols-2">
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
              <article className="overflow-hidden rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="border-b border-[var(--border-subtle)] px-5 py-4 sm:px-6">
                  <h3 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">Compiled HTML</h3>
                  <p className="mt-1 text-[0.9rem] text-[var(--text-secondary)]">
                    Final output for ESP handoff, QA review, or HTML-only integrations.
                  </p>
                </div>
                <div className="px-5 py-5 text-[1rem] leading-7 text-[var(--text-secondary)] sm:px-6">
                  Compiled HTML is unavailable for this component right now. Rebuild the compiled registry to repopulate
                  this panel.
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
