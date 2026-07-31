import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  CTASection,
  FeatureBlock,
  ProductPreview,
  V2PageHero,
  V2Section,
  WorkflowAssembly,
} from "@/components/site/V2Primitives";
import { emailWorkflows, getEmailWorkflowBySlug } from "@/data/workflows";
import { STARTER_LAYOUT_SLUGS } from "@/lib/pack";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

const coreLayoutSlugs = new Set<string>(STARTER_LAYOUT_SLUGS);

function getWorkflowTierLabel(linkedLayoutSlug: string): "Core included" | "Pro archive" {
  return coreLayoutSlugs.has(linkedLayoutSlug) ? "Core included" : "Pro archive";
}

function getWorkflowEditionCopy(linkedLayoutSlug: string): string {
  return coreLayoutSlugs.has(linkedLayoutSlug)
    ? "This workflow is part of Core and remains included in Pro. Use it as a starter production system, then move to Pro when recurring lifecycle, transactional, campaign, and newsletter work needs the full archive."
    : "This workflow is part of the Pro archive. Use it when this send is recurring enough that source ownership, QA notes, variants, and handoff context matter more than a one-off template.";
}

function getPackageAccessItems(workflow: NonNullable<ReturnType<typeof getEmailWorkflowBySlug>>): string[] {
  if (coreLayoutSlugs.has(workflow.linkedLayoutSlug)) {
    return [
      "Public workflow page: intent, trigger, required fields, variants, QA risks, handoff steps, and linked layout.",
      "Core archive: MJML source, compiled HTML, preview, and setup guidance for this starter workflow.",
      "Pro archive: this workflow plus the full recurring workflow set, QA notes, implementation guidance, and updates.",
    ];
  }

  return [
    "Public workflow page: intent, trigger, required fields, variants, QA risks, handoff steps, and linked layout.",
    ...workflow.proAccess,
  ];
}

function DetailListCard({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <article className="border-t border-[var(--border-subtle)] pt-5">
      <h3 className="text-[1.2rem] font-semibold text-[var(--text-primary)]">{title}</h3>
      <ul className="mt-3 grid gap-2.5 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
        {items.map((item) => (
          <li key={item} className="border-l border-[var(--identity-source-border)] pl-3">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function generateStaticParams() {
  return emailWorkflows.map((workflow) => ({ slug: workflow.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getEmailWorkflowBySlug(slug);
  if (!workflow) {
    return createSeoMetadata({
      title: "Workflow",
      description: "Template Hedgehog workflow detail.",
      path: "/workflows",
    });
  }

  return createSeoMetadata({
    title: workflow.title,
    description: workflow.summary,
    path: `/workflows/${workflow.slug}`,
  });
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { slug } = await params;
  const workflow = getEmailWorkflowBySlug(slug);
  if (!workflow) notFound();
  const tierLabel = getWorkflowTierLabel(workflow.linkedLayoutSlug);
  const pricingHref = tierLabel === "Core included" ? "/pricing#core" : "/pricing#pro";

  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="workflow-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workflows", path: "/workflows" },
          { name: workflow.title, path: `/workflows/${workflow.slug}` },
        ])}
      />
      <V2PageHero
        title={workflow.title}
        copy={workflow.summary}
        actions={[
          { href: `/layouts/${workflow.linkedLayoutSlug}`, label: "Open linked layout", primary: true },
          { href: pricingHref, label: tierLabel === "Core included" ? "View Core" : "View Pro" },
        ]}
        compact
      >
        <WorkflowAssembly />
      </V2PageHero>

      <V2Section title="Workflow structure" copy={workflow.trigger} surface="surface">
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureBlock title="Goal" copy={workflow.goal} />
            <FeatureBlock title="Layout" copy={workflow.linkedLayoutTitle} />
            <FeatureBlock title={tierLabel} copy={getWorkflowEditionCopy(workflow.linkedLayoutSlug)} />
          </div>
          <p className="max-w-4xl rounded-[0.9rem] border border-[var(--identity-source-border)] bg-[var(--identity-source-soft)] p-4 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
            Workflow pages expose the production shape before purchase: trigger, goal, required fields, variants, QA risks, handoff steps, and linked layout. The paid archive adds the editable source and compiled output for the workflows included in your tier.
          </p>
        </div>
      </V2Section>

      <V2Section
        title="What the production package needs."
        copy="A workflow is useful when the implementation contract is visible before anyone starts editing markup."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="grid gap-4">
            {workflow.requiredFields.map((field) => (
              <article key={field.field} className="grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                <div>
                  <p className="break-words font-mono text-[0.86rem] font-semibold text-[var(--identity-source)]">
                    {field.field}
                  </p>
                  <p className="mt-1 break-words text-[0.82rem] leading-6 text-[var(--text-meta)]">
                    Example: {field.example}
                  </p>
                </div>
                <p className="text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                  {field.description}
                </p>
              </article>
            ))}
          </div>
          <div className="grid gap-6">
            <DetailListCard title="Variant routes" items={workflow.variants.map((variant) => `${variant.title}: ${variant.description}`)} />
            <DetailListCard title="Package access" items={getPackageAccessItems(workflow)} />
          </div>
        </div>
      </V2Section>

      <V2Section title="Linked production layout">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <ProductPreview
            image={workflow.previewImageUrl}
            alt={`${workflow.linkedLayoutTitle} preview`}
            title={workflow.linkedLayoutTitle}
            copy={workflow.linkedLayoutDescription}
          />
          <div className="grid gap-6">
            <FeatureBlock title="Component stack" copy={workflow.componentStack.map((item) => item.componentTitle).join(", ")} />
            <FeatureBlock title="Source file" copy={workflow.sourceFile} />
            <Link href={`/layouts/${workflow.linkedLayoutSlug}`} className="th-btn th-btn-sm th-btn-primary w-fit">
              Open layout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </V2Section>

      <V2Section
        title="QA and handoff."
        copy="The value is not only the rendered email. It is knowing what has to be checked before the ESP takes over."
        surface="surface"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <DetailListCard title="QA risks to review" items={workflow.qaRisks} />
          <DetailListCard title="Handoff steps" items={workflow.handoffSteps} />
        </div>
        <p className="mt-7 max-w-4xl border-t border-[var(--border-subtle)] pt-5 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
          Template Hedgehog prepares the source, compiled output, preview, QA notes, and handoff context. Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or your ESP still handle audiences, consent, unsubscribe, automation, sending, delivery, and reporting.
        </p>
      </V2Section>

      <CTASection
        title={tierLabel === "Core included" ? "Start with this workflow in Core." : "Use this workflow inside Pro."}
        copy={tierLabel === "Core included"
          ? "Core is the essential starting system: the welcome, onboarding, reset, and confirmation emails every product needs, in the simplest production-ready inline dialect. Pro adds the full lifecycle, transactional, and campaign archive when the same source-to-handoff process becomes recurring work across more sends, authored in a more maintainable stylesheet architecture."
          : "Pro is the archive for teams that keep rebuilding production emails and need repeatable workflows, editable MJML, compiled HTML, QA notes, implementation guidance, and updates."}
        href={pricingHref}
        label={tierLabel === "Core included" ? "View Core" : "View Pro"}
      />

      <SiteFooter />
    </main>
  );
}
