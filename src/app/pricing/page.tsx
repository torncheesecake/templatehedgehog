import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComparisonSection } from "@/components/site/ComparisonSection";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { getFeaturedEmailWorkflows } from "@/data/workflows";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { PricingOfferCard } from "@/components/pricing/PricingOfferCard";
import {
  MjmlHtmlSplitView,
  PackFileTreePreview,
  SystemArchitectureVisual,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_LICENSE_POINTS,
  MJML_PACK_PROJECT_STRUCTURE,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { getPackById } from "@/lib/packCatalog";
import { isStripeConfigured } from "@/lib/stripe-server";
import { PACK_LAST_UPDATED, PACK_VERSION, formatVersionDate } from "@/lib/versioning";

const PAID_CTA_LABEL = "Get Hedgehog Core - £79";

export const metadata: Metadata = {
  title: createPageTitle("Pricing"),
  description:
    `Pricing for ${TEMPLATE_CONFIG.productName}, the workflow-first MJML system behind ${TEMPLATE_CONFIG.brandName}.`,
};

const heroBullets = [
  "Start from production workflows instead of rebuilding from a blank file.",
  "Ship faster with layout and component mapping already done.",
  "Cut avoidable QA and debug loops before handoff to ESP delivery.",
  "Use across projects under one straightforward licence.",
] as const;

const comparisonRows = [
  {
    label: "Time",
    fromScratch: "4 to 8 hours to assemble and stabilise one production flow.",
    withHedgehog: "Start from a mapped workflow and adapt in under an hour.",
  },
  {
    label: "QA passes",
    fromScratch: "Repeated rendering fixes across Outlook, Gmail, and mobile clients.",
    withHedgehog: "Fewer QA passes because structure and compiled output are already production-ready.",
  },
  {
    label: "Consistency",
    fromScratch: "Patterns drift between campaigns and lifecycle sends over time.",
    withHedgehog: "Workflow, layout, and component structure stays consistent across sends.",
  },
  {
    label: "Handoff",
    fromScratch: "Manual interpretation between developer, QA, and ESP teams.",
    withHedgehog: "MJML source and compiled HTML shipped together with implementation context.",
  },
] as const;

const fromScratchEffort = [92, 84, 80, 86] as const;
const withHedgehogEffort = [35, 36, 30, 34] as const;

const includedAssets = [
  {
    title: `${COMPONENT_COUNT} components`,
    detail: "Reusable MJML building blocks for campaign, lifecycle, and transactional sends.",
  },
  {
    title: `${LAYOUT_COUNT} layouts`,
    detail: "Complete structures grouped by system so teams stop rebuilding shell markup.",
  },
  {
    title: `${WORKFLOW_COUNT} workflows`,
    detail: "Production workflows for onboarding, password reset, billing, reporting, and notifications.",
  },
  {
    title: "MJML + compiled HTML",
    detail: "Editable source and handoff-ready output paired side by side.",
  },
  {
    title: "Versioning + changelog",
    detail: "Clear release metadata so teams can track updates safely.",
  },
] as const;

const mjmlSnippet = `<mj-section padding="24px">
  <mj-column>
    <mj-text>Password reset requested</mj-text>
    <mj-button href="{{auth.reset_url}}">Reset password</mj-button>
  </mj-column>
</mj-section>`;

const htmlSnippet = `<table role="presentation" width="100%">
  <tr>
    <td style="padding:24px;">
      <a href="{{auth.reset_url}}">Reset password</a>
    </td>
  </tr>
</table>`;

export default function PricingPage() {
  const isStaticExport = process.env.STATIC_EXPORT === "true";
  const stripeReady = !isStaticExport && isStripeConfigured();
  const corePack = getPackById("pack-1");
  const featuredWorkflows = getFeaturedEmailWorkflows(5);
  const lastUpdatedLabel = formatVersionDate(PACK_LAST_UPDATED);

  const proofWorkflow = featuredWorkflows[0];

  const previewNotice = isStaticExport
    ? "GitHub Pages preview: checkout is disabled here. Live purchase and instant download run on the primary deployment."
    : !stripeReady
      ? "Checkout is currently unavailable in this environment."
      : null;

  const leftEffortItems = comparisonRows.map((row, index) => ({
    label: row.label,
    note: row.fromScratch,
    value: fromScratchEffort[index] ?? 88,
  }));

  const rightEffortItems = comparisonRows.map((row, index) => ({
    label: row.label,
    note: row.withHedgehog,
    value: withHedgehogEffort[index] ?? 34,
  }));

  return (
    <main className="min-h-screen bg-white text-slate-600 [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="#buy-core" ctaLabel={PAID_CTA_LABEL} />

      <SectionShell spacing="hero" tone="canvas" width="content">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)] lg:items-start">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">
              Workflow-first MJML system
            </p>
            <h1 className="mt-4 max-w-3xl text-[3rem] font-semibold leading-[0.88] text-slate-900 sm:text-[4.2rem] lg:text-[4.85rem]">
              Stop rebuilding the same emails every project
            </h1>
            <p className="mt-6 max-w-3xl text-[1.08rem] leading-8 text-slate-600">
              Hedgehog Core gives your team production-ready workflows, layouts, and components in one download so you
              can ship faster with fewer regressions.
            </p>

            <ul className="mt-8 max-w-3xl space-y-3.5 text-[1rem] leading-7 text-slate-600">
              {heroBullets.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {previewNotice ? (
              <p className="mt-6 max-w-3xl rounded-[0.82rem] border border-[hsl(var(--th-accent-support)/0.34)] bg-[hsl(var(--th-accent-support)/0.14)] px-4 py-3 text-[0.86rem] leading-6 text-slate-900">
                {previewNotice}
              </p>
            ) : null}
          </div>

          <PricingOfferCard
            pricePence={corePack.oneOffPricePence}
            stripeReady={stripeReady}
            productId={corePack.productId}
            inclusionPoints={[
              `${COMPONENT_COUNT} production-safe components`,
              `${LAYOUT_COUNT} complete layouts`,
              `${WORKFLOW_COUNT} practical workflows`,
              "MJML source plus compiled HTML output",
            ]}
            ctaLabel={PAID_CTA_LABEL}
            versionLabel={`v${PACK_VERSION}`}
            lastUpdatedLabel={lastUpdatedLabel}
            isStaticPreview={isStaticExport}
          />
        </div>
      </SectionShell>

      <SectionShell spacing="grid" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Core value driver"
          title="Start from a workflow, not a blank email"
          description={`${WORKFLOW_COUNT} production workflows mapped to ${COMPONENT_COUNT} components and ${LAYOUT_COUNT} layouts, covering onboarding, billing, reporting, password reset, and notification flows.`}
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          <SystemArchitectureVisual
            tone="soft"
            title="Workflow chain"
            subtitle="Mapped implementation path"
            workflowLabel={proofWorkflow?.slug ?? "onboarding"}
            layoutLabel={proofWorkflow?.linkedLayoutSlug ?? "onboarding-step-system"}
            componentLabels={proofWorkflow?.componentStack.slice(0, 4).map((item) => item.componentSlug) ?? []}
            imageUrl={proofWorkflow?.previewImageUrl}
            imageAlt={`${proofWorkflow?.title ?? "Workflow"} preview`}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredWorkflows.map((workflow) => (
              <article
                key={workflow.slug}
                className="rounded-[0.96rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                  {workflow.linkedLayoutTitle}
                </p>
                <h3 className="mt-2 text-[1.04rem] font-semibold leading-7 text-slate-900">
                  {workflow.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-6 text-slate-600">{workflow.goal}</p>
                <Link
                  href={`/workflows/${workflow.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-slate-900 transition hover:text-slate-900"
                >
                  View workflow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <ComparisonSection
        sectionClassName="border-y border-slate-200 bg-slate-50"
        eyebrow="Objection handling"
        title="Why it is worth £79"
        description="Building this yourself costs repeated build hours and QA churn. Hedgehog Core removes that repetition."
        leftTitle="Build from scratch"
        rightTitle="With Hedgehog Core"
        leftItems={leftEffortItems}
        rightItems={rightEffortItems}
      />

      <SectionShell spacing="proof" tone="canvas" border="both" width="content">
        <SectionIntro
          pattern="split"
          tone="dark"
          eyebrow="Technical proof"
          title="What you actually get in the pack"
          description="Real source structure, output pairing, and traceable mapping from workflow trigger to delivery HTML."
          aside={
            <div className="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 text-[0.9rem] leading-7 text-slate-600">
              This is the same structure your team downloads after checkout, not a marketing mock-up.
            </div>
          }
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)]">
          <MjmlHtmlSplitView title="MJML to compiled HTML" mjml={mjmlSnippet} html={htmlSnippet} />

          <div className="grid gap-6">
            <PackFileTreePreview
              title="Pack file tree excerpt"
              lines={[
                ...MJML_PACK_PROJECT_STRUCTURE,
                "compiled/",
                "workflows/onboarding/",
                "workflows/password-reset/",
              ]}
            />
            <WorkflowStackVisual
              title="Workflow mapping"
              description={`${proofWorkflow ? proofWorkflow.title : "Workflow"} maps directly to layout and component stack.`}
              steps={
                proofWorkflow
                  ? [
                      `workflow/${proofWorkflow.slug}`,
                      `layout/${proofWorkflow.linkedLayoutSlug}`,
                      ...proofWorkflow.componentStack
                        .slice(0, 3)
                        .map((item) => `component/${item.componentSlug}`),
                    ]
                  : []
              }
              imageUrl={proofWorkflow?.previewImageUrl}
              imageAlt={`${proofWorkflow?.title ?? "Workflow"} mapping preview`}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="feature" tone="soft" border="softBottom" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Included"
          title="What you get"
          description="A complete system you can reuse across projects with clear licensing and release metadata."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          <dl className="space-y-4">
            {includedAssets.map((asset) => (
              <div
                key={asset.title}
                className="rounded-[0.92rem] border border-slate-200 bg-slate-50 px-5 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]"
              >
                <dt className="text-[1.08rem] font-semibold text-slate-900">{asset.title}</dt>
                <dd className="mt-1 text-[0.94rem] leading-7 text-slate-600">{asset.detail}</dd>
              </div>
            ))}
          </dl>

          <VisualPanel tone="soft">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
              Licence clarity
            </p>
            <ul className="mt-4 space-y-2.5 text-[0.94rem] leading-7 text-slate-600">
              {MJML_PACK_LICENSE_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </VisualPanel>
        </div>
      </SectionShell>

      <SectionShell spacing="cta" tone="canvas" width="content" className="scroll-mt-24 th-cta-zone">
        <div id="buy-core" className="th-cta-island rounded-[1.45rem] border border-slate-200 bg-white px-8 py-12 sm:px-11 sm:py-14 lg:px-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-[2.05rem] font-semibold leading-[0.95] text-slate-900 sm:text-[2.45rem]">
                Buy once. Ship faster on every campaign.
              </h2>
              <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-slate-500">
                Less than one avoidable rebuild and QA pass.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 lg:justify-end">
              {stripeReady ? (
                <form action="/api/checkout" method="post">
                  <input type="hidden" name="productId" value={corePack.productId} />
                  <input type="hidden" name="billingCycle" value="one_off" />
                  <TrackableSubmitButton
                    label={PAID_CTA_LABEL}
                    event="click_buy_now"
                    payload={{ source: "pricing_final_cta", packId: "pack-1", billingCycle: "one_off" }}
                    className="inline-flex h-12 items-center rounded-[0.9rem] border border-rose-600 bg-rose-600 px-6 text-[0.92rem] font-semibold text-white shadow-[0_18px_36px_rgba(0,0,0,0.34)] transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 items-center rounded-[0.9rem] border border-rose-600 bg-rose-600 px-6 text-[0.92rem] font-semibold text-white shadow-[0_18px_36px_rgba(0,0,0,0.34)] opacity-80"
                >
                  {PAID_CTA_LABEL}
                </button>
              )}

              <Link
                href="/workflows"
                className="inline-flex h-11 items-center rounded-[0.9rem] border border-slate-200 bg-slate-50 px-5 text-[0.86rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Explore workflows
              </Link>
            </div>
          </div>
        </div>
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
