import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  CTASection,
  CatalogueCard,
  FeatureBlock,
  V2PageHero,
  V2Section,
  WorkflowAssembly,
} from "@/components/site/V2Primitives";
import { emailWorkflows, type EmailWorkflow } from "@/data/workflows";
import { STARTER_LAYOUT_SLUGS, WORKFLOW_COUNT } from "@/lib/pack";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Email workflows",
  description:
    "Workflow-first production email systems for onboarding, billing, launches, reporting, security, and lifecycle sends.",
  path: "/workflows",
  keywords: [
    "email workflows",
    "lifecycle email workflow",
    "transactional email workflow",
    "MJML workflow system",
  ],
});

const preferred = ["onboarding", "billing", "campaign-launch", "reporting", "notifications"];
const coreLayoutSlugs = new Set<string>(STARTER_LAYOUT_SLUGS);
const workflowSystemOrder: EmailWorkflow["system"][] = [
  "saas-lifecycle",
  "transactional",
  "campaigns",
  "newsletter",
];
const workflowSystemCopy: Record<EmailWorkflow["system"], {
  title: string;
  buyerJob: string;
  copy: string;
}> = {
  "saas-lifecycle": {
    title: "Lifecycle and activation",
    buyerJob: "Move users through product moments",
    copy: "Use these when the email should drive activation, retention, upgrade, or a clear next product action.",
  },
  transactional: {
    title: "Transactional confidence",
    buyerJob: "Reduce support risk around account and order events",
    copy: "Use these when clarity, tokens, fallback copy, and platform-safe handoff matter more than promotion.",
  },
  campaigns: {
    title: "Campaign and launch work",
    buyerJob: "Ship planned commercial messages faster",
    copy: "Use these for product launches, promotions, and conversion sends that still need source ownership and QA.",
  },
  newsletter: {
    title: "Digest and newsletter rhythm",
    buyerJob: "Make recurring editorial sends repeatable",
    copy: "Use these when a recurring send needs a stable content structure instead of a fresh rebuild each week.",
  },
};
const workflowCommercialProof = [
  {
    title: "Trigger",
    copy: "Anchor the email to the event, timing, or condition that causes the send.",
  },
  {
    title: "Production package",
    copy: "Move from workflow intent to linked layout, required fields, MJML source, compiled HTML, QA, and handoff context.",
  },
  {
    title: "Platform boundary",
    copy: "Prepare the reviewed artefact before upload. Your ESP still handles audiences, consent, automation, sending, unsubscribe, delivery, and reporting.",
  },
] as const;

function isEmailWorkflow(workflow: EmailWorkflow | undefined): workflow is EmailWorkflow {
  return Boolean(workflow);
}

function getWorkflowTierLabel(workflow: EmailWorkflow): "Core included" | "Pro archive" {
  return coreLayoutSlugs.has(workflow.linkedLayoutSlug) ? "Core included" : "Pro archive";
}

export default function WorkflowsPage() {
  const featured = preferred
    .map((slug) => emailWorkflows.find((workflow) => workflow.slug === slug))
    .filter(isEmailWorkflow)
    .slice(0, 5);
  const fallback = emailWorkflows.slice(0, 5);
  const workflows = featured.length === 5 ? featured : fallback;
  const heroWorkflow = workflows[0];
  const workflowGroups = workflowSystemOrder.map((system) => ({
    system,
    ...workflowSystemCopy[system],
    workflows: emailWorkflows.filter((workflow) => workflow.system === system),
  })).filter((group) => group.workflows.length > 0);

  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="workflows-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workflows", path: "/workflows" },
        ])}
      />

      <V2PageHero
        title="Find the right production email workflow."
        copy={`Use workflows to choose the send you are actually preparing: activation, transactional, launch, promotion, digest, or operational update. Core gives the essential foundations. Pro gives the full ${WORKFLOW_COUNT}-workflow operating set with source, output, QA, and handoff context.`}
        actions={[
          { href: "#workflow-coverage", label: "Browse workflow coverage", primary: true },
          { href: "/pricing#pro", label: "Compare editions" },
        ]}
        compact
      >
        <WorkflowAssembly />
      </V2PageHero>

      <V2Section
        title="The workflow proves the production job."
        copy="A useful email archive should show why the send exists, what needs to change, what must be checked, and what gets handed to the platform."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {workflowCommercialProof.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
      </V2Section>

      <V2Section
        title="Workflow coverage by production job."
        copy="This is the practical buying question: does the archive cover the email work your team keeps repeating?"
      >
        <div id="workflow-coverage" className="grid gap-8">
          {workflowGroups.map((group) => (
            <section key={group.system} className="grid gap-5 border-t border-[var(--border-subtle)] pt-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
              <div>
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                  {group.buyerJob}
                </p>
                <h2 className="mt-2 text-[1.55rem] font-semibold text-[var(--text-primary)]">
                  {group.title}
                </h2>
                <p className="mt-3 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
                  {group.copy}
                </p>
              </div>
              <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                {group.workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/workflows/${workflow.slug}`}
                    className="group grid gap-3 py-4 transition hover:bg-[var(--bg-surface)] sm:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] sm:px-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[1rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--identity-source)]">
                          {workflow.title}
                        </h3>
                        <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[0.68rem] font-semibold uppercase text-[var(--text-meta)]">
                          {getWorkflowTierLabel(workflow)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.84rem] leading-6 text-[var(--text-secondary)]">
                        {workflow.goal}
                      </p>
                    </div>
                    <p className="text-[0.88rem] leading-6 text-[var(--text-secondary)]">
                      {workflow.trigger}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </V2Section>

      <V2Section
        title="Featured workflows"
        copy="These are production-oriented journeys that map to real layout systems and reusable components."
        surface="surface"
      >
        <div id="featured-workflows">
        {heroWorkflow ? (
          <Link href={`/workflows/${heroWorkflow.slug}`} className="mb-7 block rounded-[1.1rem] bg-[var(--bg-structural)] p-5 transition hover:bg-[color-mix(in_srgb,var(--bg-structural)_90%,black)] sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-center">
              <div>
                <p className="text-[0.82rem] font-semibold uppercase !text-[var(--identity-source-on-dark)]">
                  Featured workflow / {getWorkflowTierLabel(heroWorkflow)}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[0.98] !text-[var(--colour-high-priority)]">
                  {heroWorkflow.title}
                </h3>
                <p className="mt-4 text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">{heroWorkflow.trigger}</p>
                <span className="mt-5 inline-flex items-center text-[0.92rem] font-semibold !text-[var(--colour-high-priority)]">
                  Open workflow
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <WorkflowAssembly compact />
            </div>
          </Link>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflows.slice(1).map((workflow) => (
            <CatalogueCard
              key={workflow.slug}
              href={`/workflows/${workflow.slug}`}
              title={workflow.title}
              copy={workflow.linkedLayoutDescription}
              image={workflow.previewImageUrl}
              meta={workflow.linkedLayoutTitle}
              badge={getWorkflowTierLabel(workflow)}
            />
          ))}
        </div>
        </div>
      </V2Section>

      <CTASection
        title="Core covers the foundations. Pro covers the operating rhythm."
        copy="Buy Core when onboarding, password reset, and order confirmation cover the immediate job. Buy Pro when lifecycle, transactional, campaign, newsletter, and operational sends are recurring work."
        href="/pricing#pro"
        label="Compare Pro"
      />

      <SiteFooter flush />
    </main>
  );
}
