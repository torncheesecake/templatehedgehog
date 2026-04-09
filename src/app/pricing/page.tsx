import type { Metadata } from "next";
import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { getFeaturedEmailWorkflows } from "@/data/workflows";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { PricingOfferCard } from "@/components/pricing/PricingOfferCard";
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
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

const displaySerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const PAID_CTA_LABEL = "Get Hedgehog Core - £79";

export const metadata: Metadata = {
  title: createPageTitle("Pricing"),
  description:
    `Pricing for ${TEMPLATE_CONFIG.productName}, the workflow-first MJML system behind ${TEMPLATE_CONFIG.brandName}.`,
};

const heroBullets = [
  "Start from production workflows instead of rebuilding from a blank file.",
  "Ship faster with layout and component mapping already done.",
  "Cut avoidable QA/debug loops before handoff to ESP delivery.",
  "Keep a reusable system your team can run across projects.",
] as const;

const comparisonRows = [
  {
    label: "Build time",
    fromScratch: "4 to 8 hours to assemble and stabilise one production flow.",
    withHedgehog: "Start from a mapped workflow and adapt in under an hour.",
  },
  {
    label: "QA/debug",
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
  const mappingSteps = proofWorkflow
    ? [
        `workflow/${proofWorkflow.slug}`,
        `layout/${proofWorkflow.linkedLayoutSlug}`,
        ...proofWorkflow.componentStack
          .slice(0, 3)
          .map((item) => `component/${item.componentSlug}`),
      ]
    : [];

  const previewNotice = isStaticExport
    ? "GitHub Pages preview: checkout is disabled here. Live purchase and instant download run on the primary deployment."
    : !stripeReady
      ? "Checkout is currently unavailable in this environment."
      : null;

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="#buy-core" ctaLabel={PAID_CTA_LABEL} />

      <section>
        <div className={cn(visualSystem.widths.page, "pb-20 pt-12 sm:pt-14 lg:pb-24 lg:pt-16")}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-start">
            <div className="max-w-[780px]">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
                Workflow-first MJML system
              </p>
              <h1 className={cn("mt-4 max-w-[15ch] text-[2.9rem] font-semibold leading-[0.9] text-(--text-primary-dark) sm:text-[4rem] lg:text-[4.5rem]", displaySerif.className)}>
                Stop rebuilding the same emails every project
              </h1>
              <p className="mt-5 max-w-[58ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
                Hedgehog Core gives your team production-ready workflows, layouts, and components in one download so you
                can ship faster with fewer regressions.
              </p>

              <ul className="mt-8 max-w-[66ch] space-y-3 text-[1rem] leading-7 text-(--text-primary-dark)">
                {heroBullets.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {previewNotice ? (
                <p className="mt-6 max-w-[64ch] rounded-[0.88rem] border border-[hsl(var(--th-accent-support)/0.42)] bg-[hsl(var(--th-accent-support)/0.16)] px-4 py-3 text-[0.9rem] leading-6 text-(--text-primary-dark)">
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
        </div>
      </section>

      <section className="border-y border-(--surface-line) py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
            Core value driver
          </p>
          <h2 className={cn("mt-3 max-w-[18ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.45rem]", displaySerif.className)}>
            Start from a workflow, not a blank email
          </h2>
          <p className="mt-4 max-w-[74ch] text-[1rem] leading-8 text-(--th-body-copy)">
            {WORKFLOW_COUNT} production workflows mapped to {COMPONENT_COUNT} components and {LAYOUT_COUNT} layouts.
            Real onboarding, billing, reporting, password reset, and notification flows are included.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {featuredWorkflows.map((workflow) => (
              <article key={workflow.slug} className="surface-card-soft p-4">
                <h3 className="text-[1.05rem] font-semibold leading-7 text-(--text-primary-dark)">
                  {workflow.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-(--th-body-copy)">{workflow.goal}</p>
                <p className="mt-3 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                  {workflow.linkedLayoutTitle}
                </p>
                <Link
                  href={`/workflows/${workflow.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-(--th-body-copy) transition hover:text-(--text-primary-dark)"
                >
                  View workflow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
            Technical proof
          </p>
          <h2 className={cn("mt-3 max-w-[16ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.45rem]", displaySerif.className)}>
            What you actually get in the pack
          </h2>
          <p className="mt-4 max-w-[74ch] text-[1rem] leading-8 text-(--th-body-copy)">
            Real source structure, real output pairing, and a traceable workflow mapping from trigger to delivery.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="rounded-[1rem] border border-(--surface-line) bg-(--dune-deep) p-4">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">File tree excerpt</p>
              <pre className="mt-3 overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-3 text-[0.78rem] leading-6 text-(--text-primary-dark)">
{MJML_PACK_PROJECT_STRUCTURE.join("\n")}
{"\n"}compiled/
{"\n"}workflows/onboarding/
{"\n"}workflows/password-reset/
              </pre>
            </article>

            <article className="rounded-[1rem] border border-(--surface-line) bg-(--dune-deep) p-4">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">MJML to compiled HTML</p>
              <div className="mt-3 space-y-3">
                <pre className="overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-3 text-[0.74rem] leading-6 text-(--text-primary-dark)">
{mjmlSnippet}
                </pre>
                <pre className="overflow-x-auto rounded-[0.75rem] border border-(--surface-line) bg-(--surface-strong) p-3 text-[0.74rem] leading-6 text-(--text-primary-dark)">
{htmlSnippet}
                </pre>
              </div>
            </article>

            <article className="rounded-[1rem] border border-(--surface-line) bg-(--dune-deep) p-4">
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">Workflow mapping</p>
              <p className="mt-2 text-[0.9rem] leading-7 text-(--text-primary-dark)">
                {proofWorkflow ? proofWorkflow.title : "Workflow"} maps directly to layout and component stack.
              </p>
              <ol className="mt-3 space-y-2 text-[0.82rem] leading-6 text-(--dune-muted)">
                {mappingSteps.map((step) => (
                  <li key={step} className="rounded-[0.6rem] border border-(--surface-line) bg-(--surface-strong) px-3 py-2">
                    {step}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-(--surface-line) py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
            Objection handling
          </p>
          <h2 className={cn("mt-3 max-w-[14ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.45rem]", displaySerif.className)}>
            Why it is worth £79
          </h2>
          <p className="mt-4 max-w-[72ch] text-[1rem] leading-8 text-(--th-body-copy)">
            If you build this yourself, you pay with repeated build hours and QA churn. Hedgehog Core removes that repetition.
          </p>

          <div className="mt-7 overflow-hidden rounded-[1rem] border border-(--surface-line) bg-(--surface-soft)">
            <div className="grid grid-cols-[minmax(120px,0.3fr)_1fr_1fr] border-b border-(--surface-line) bg-(--dune-deep)">
              <p className="px-4 py-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Area</p>
              <p className="px-4 py-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Build it yourself</p>
              <p className="px-4 py-3 text-[0.84rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Hedgehog Core</p>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(120px,0.3fr)_1fr_1fr] border-b border-(--surface-line) last:border-b-0"
              >
                <p className="px-4 py-3 text-[0.95rem] font-semibold text-(--text-primary-dark)">{row.label}</p>
                <p className="px-4 py-3 text-[0.92rem] leading-7 text-(--th-body-copy)">{row.fromScratch}</p>
                <p className="px-4 py-3 text-[0.92rem] leading-7 text-(--th-body-copy)">{row.withHedgehog}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
                Included
              </p>
              <h2 className={cn("mt-3 max-w-[12ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.45rem]", displaySerif.className)}>
                What you get
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)]">
              <dl className="divide-y divide-(--surface-line)">
                {includedAssets.map((asset) => (
                  <div key={asset.title} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(180px,0.34fr)_1fr] sm:gap-5">
                    <dt className={cn("text-[1.06rem] font-semibold text-(--text-primary-dark)", displaySerif.className)}>{asset.title}</dt>
                    <dd className="text-[0.98rem] leading-7 text-(--th-body-copy)">{asset.detail}</dd>
                  </div>
                ))}
              </dl>

              <aside className="rounded-[1.05rem] border border-(--surface-line) bg-(--dune-deep) p-6 sm:p-7">
                <h3 className={cn("text-[1.22rem] font-semibold text-(--text-primary-dark)", displaySerif.className)}>
                  Licence clarity
                </h3>
                <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-7 text-(--th-body-copy)">
                  {MJML_PACK_LICENSE_POINTS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="buy-core" className={cn(visualSystem.widths.page, "pb-20 sm:pb-22 lg:pb-24")}>
        <div className="rounded-[1.45rem] border border-(--surface-line) bg-(--hedgehog-core-navy) px-6 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className={cn("max-w-[18ch] text-[2.05rem] font-semibold leading-[0.95] text-(--text-primary-dark) sm:text-[2.45rem]", displaySerif.className)}>
                Buy once. Ship faster on every campaign.
              </h2>
              <p className="mt-3 max-w-[56ch] text-[1rem] leading-8 text-(--dune-muted)">
                Less than one avoidable rebuild and QA pass.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {stripeReady ? (
                <form action="/api/checkout" method="post">
                  <input type="hidden" name="productId" value={corePack.productId} />
                  <input type="hidden" name="billingCycle" value="one_off" />
                  <TrackableSubmitButton
                    label={PAID_CTA_LABEL}
                    event="click_buy_now"
                    payload={{ source: "pricing_final_cta", packId: "pack-1", billingCycle: "one_off" }}
                    className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.92rem] font-semibold !text-(--text-primary-dark) transition hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.92rem] font-semibold !text-(--text-primary-dark) opacity-80"
                >
                  {PAID_CTA_LABEL}
                </button>
              )}

              <Link
                href="/components"
                className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--surface-line) px-6 text-[0.92rem] font-semibold text-(--text-primary-dark) transition hover:border-(--accent-support) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
              >
                Browse free library
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
