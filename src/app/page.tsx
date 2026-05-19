import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { LeadCaptureForm } from "@/components/conversion/LeadCaptureForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { getPricingTierById, TEMPLATE_CONFIG } from "@/config/template";
import { emailLayouts } from "@/data/email-layouts";
import { getEmailWorkflowBySlug, getFeaturedEmailWorkflows } from "@/data/workflows";
import { createSeoMetadata, DEFAULT_SEO_DESCRIPTION } from "@/lib/seo";

const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

const homepageFaq = [
  {
    question: "Is Template Hedgehog a template marketplace?",
    answer:
      "No. Template Hedgehog is a production email system with MJML source, compiled HTML, layouts, lifecycle workflows, transactional patterns, and implementation guidance.",
  },
  {
    question: "Who should buy Pro?",
    answer:
      "Pro is the primary path for teams that ship recurring lifecycle or transactional email and need the full component library, layouts, workflows, token examples, guidance, and six months of updates.",
  },
  {
    question: "What happens after checkout?",
    answer:
      "Stripe returns the buyer to a gated success page that validates the session and shows the matching signed archive download with version and implementation details.",
  },
  {
    question: "What does Enterprise add?",
    answer:
      "Enterprise adds commercial reuse rights, white-label or internal deployment rights, the reusable generation framework, priority support, and twelve months of updates.",
  },
];

export const metadata: Metadata = createSeoMetadata({
  title: `${TEMPLATE_CONFIG.brandName} | Production-ready email systems`,
  description: DEFAULT_SEO_DESCRIPTION,
  path: "/",
  keywords: [
    "production-ready email systems",
    "MJML source",
    "compiled HTML email",
    "lifecycle email workflows",
    "transactional email templates",
    "Artifexa",
  ],
});

export default function Home() {
  const proTier = getPricingTierById("pro");
  const starterTier = getPricingTierById("starter");
  const enterpriseTier = getPricingTierById("enterprise");
  const leadWorkflow =
    getEmailWorkflowBySlug("reporting")
    ?? getEmailWorkflowBySlug("campaign-launch")
    ?? getFeaturedEmailWorkflows(1)[0];
  const leadLayouts = emailLayouts.slice(0, 2);

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--th-text-primary)]">
      <SiteTopBar theme="hero" heroTone="neutral" />
      <TrackEventOnMount event="homepage_view" payload={{ source: "homepage" }} />

      <section className="border-b border-[var(--border-subtle)] py-10 sm:py-12">
        <div className={pageWidth}>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-[var(--action-primary)]">
            Production Email System
          </p>
          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
            <div>
              <h1 className="max-w-[13ch] font-serif text-[3rem] font-semibold leading-[0.9] tracking-normal text-white sm:text-[3.75rem] lg:text-[3.9rem] 2xl:max-w-[14ch] 2xl:text-[4.6rem]">
                Ship lifecycle and transactional email faster.
              </h1>
              <p className="mt-5 max-w-[34rem] text-[1.03rem] leading-7 text-[var(--th-text-secondary)]">
                {TEMPLATE_CONFIG.brandName} is an {TEMPLATE_CONFIG.owner.name} product for teams who need predictable source, cleaner handoff, and production-safe compiled HTML.
              </p>
              <div className="mt-5 grid max-w-[38rem] gap-2 text-[0.86rem] font-semibold text-[var(--th-text-secondary)] sm:grid-cols-2">
                <p className="border-l border-[var(--action-primary)] pl-3">MJML source and compiled HTML</p>
                <p className="border-l border-[var(--action-primary)] pl-3">Lifecycle and transactional systems</p>
                <p className="border-l border-[var(--action-primary)] pl-3">Secure Stripe checkout</p>
                <p className="border-l border-[var(--action-primary)] pl-3">{TEMPLATE_CONFIG.owner.name} owned product</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TrackableLink
                  href="/pricing"
                  event="hero_primary_cta_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-12 items-center rounded-full bg-[var(--action-primary)] px-6 text-[0.94rem] font-semibold !text-[var(--action-text)]"
                >
                  View pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TrackableLink>
                <TrackableLink
                  href="/layouts"
                  event="hero_secondary_cta_click"
                  payload={{ source: "hero" }}
                  className="inline-flex h-12 items-center rounded-full border border-[var(--border-subtle)] px-6 text-[0.92rem] font-semibold text-white"
                >
                  View layouts
                </TrackableLink>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-[var(--border-subtle)]">
                {leadWorkflow ? (
                  <Image
                    src={leadWorkflow.previewImageUrl}
                    alt={`${leadWorkflow.title} preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 55vw"
                    unoptimized
                    priority
                    className="bg-white object-cover object-top"
                  />
                ) : null}
              </div>
              {leadWorkflow ? (
                <div className="grid gap-3 sm:grid-cols-3 text-[0.82rem] text-[var(--th-text-secondary)]">
                  <p><span className="block text-[var(--action-primary)]">Trigger</span>{leadWorkflow.trigger}</p>
                  <p><span className="block text-[var(--action-primary)]">Output</span>{leadWorkflow.linkedLayoutTitle}</p>
                  <p><span className="block text-[var(--action-primary)]">Handoff</span>MJML + compiled HTML</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-surface)] py-16 sm:py-18">
        <div className={pageWidth}>
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <h2 className="max-w-[18ch] font-serif text-[2.2rem] font-semibold leading-[0.95] text-white sm:text-[2.8rem]">
                Fewer rebuilds. Faster QA. Cleaner release handoff.
              </h2>
              <p className="mt-4 max-w-[34rem] text-[1rem] leading-8 text-[var(--th-text-secondary)]">
                The product is structured around operational workflows, not isolated template fragments. Start from real triggers, adapt safely, and ship with less production churn.
              </p>
            </div>
            <div className="space-y-6">
              <Metric title="Starter" body="Get production-ready quickly with curated onboarding and transactional essentials." />
                <Metric title="Pro" body="Complete production email system for lifecycle and transactional coverage." highlight />
              <Metric title="Enterprise" body="Deploy commercially with reuse rights, white-label operation, and priority support." />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-[var(--action-primary)]">
                Built for production use
              </p>
              <h2 className="mt-3 max-w-[20ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                A system purchase, not a template browse.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric title="Operations" body="Use layouts and workflows around real triggers, owner states, and handoff requirements." />
              <Metric title="Implementation" body="Edit MJML, compile once, then move final HTML into your ESP or review process." />
              <Metric title="Commerce" body="Pick Starter, Pro, or Enterprise with one clear checkout path and tier mapping." />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-[var(--action-primary)]">
                Revenue path
              </p>
              <h2 className="mt-3 max-w-[20ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                Built to convert serious email implementation demand.
              </h2>
              <p className="mt-4 max-w-[35rem] text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">
                The page directs buyers to Pro, gives Starter a credible entry point, and positions Enterprise around reuse rights and deployment value. Visitors who are not ready to buy can still enter the product funnel.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric title="56 Pro sales" body="At £179, fifty-six Pro purchases reaches roughly £10k gross monthly revenue." highlight />
              <Metric title="29 Enterprise sales" body="Enterprise is the fastest revenue path when teams need commercial deployment rights." />
              <Metric title="Lead capture" body="Non-buyers can request the QA checklist, preserving demand for product updates and launch offers." />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] py-16 sm:py-18">
        <div className={pageWidth}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[22ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
              Production artefacts your team can trust before purchase.
            </h2>
            <TrackableLink
              href="/layouts"
              event="hero_tertiary_cta_click"
              payload={{ source: "homepage_artefacts" }}
              className="inline-flex h-11 items-center rounded-[0.85rem] border border-[var(--border-subtle)] px-5 text-[0.9rem] font-semibold text-white"
            >
              Open layout archive
            </TrackableLink>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {leadLayouts.map((layout) => (
              <article key={layout.slug} className="overflow-hidden rounded-[1rem] border border-[var(--border-subtle)]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={layout.previewImageUrl}
                    alt={`${layout.title} preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 45vw"
                    unoptimized
                    className="bg-white object-cover object-top"
                  />
                </div>
                <div className="px-4 py-4">
                  <p className="text-[1rem] font-semibold text-white">{layout.title}</p>
                  <p className="mt-2 text-[0.9rem] leading-7 text-[var(--th-text-secondary)]">{layout.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-18">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_auto] lg:items-center">
            <div>
              <h2 className="max-w-[22ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                {`Start at £${starterTier.priceGbp}. Standardise with Pro at £${proTier.priceGbp}. Scale with Enterprise at £${enterpriseTier.priceGbp}.`}
              </h2>
              <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">
                Choose the tier that matches your current operational maturity, then move up without changing your workflow model.
              </p>
            </div>
            <TrackableLink
              href="/pricing"
              event="final_cta_click"
              payload={{ source: "final_cta" }}
              className="inline-flex h-12 items-center rounded-full bg-[var(--action-primary)] px-6 text-[0.94rem] font-semibold !text-[var(--action-text)]"
            >
              {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
            </TrackableLink>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start">
            <div>
              <h2 className="max-w-[22ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                What happens after checkout.
              </h2>
              <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">
                Payment returns you to a gated success page with the matching pack download, archive metadata, version details, and implementation docs.
              </p>
            </div>
            <div className="space-y-4">
              <Metric title="1. Download" body="The success page validates the Stripe session before showing the signed archive link." />
              <Metric title="2. Inspect" body="Open source folders for components, layouts, workflows, docs, MJML, and compiled HTML." />
              <Metric title="3. Ship" body="Customise source, compile, QA across clients, then hand off production-ready HTML." />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-[var(--action-primary)]">
                Implementation checklist
              </p>
              <h2 className="mt-3 max-w-[20ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                Capture teams before they are ready to purchase.
              </h2>
              <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">
                The checklist offer gives evaluators a concrete next step while keeping the commercial path focused on Pro checkout.
              </p>
            </div>
            <LeadCaptureForm source="homepage_checklist" />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-[var(--action-primary)]">
                Buyer questions
              </p>
              <h2 className="mt-3 max-w-[18ch] font-serif text-[2rem] font-semibold leading-tight text-white sm:text-[2.45rem]">
                Clear answers before checkout.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {homepageFaq.map((item) => (
                <article key={item.question} className="border-l border-[var(--border-subtle)] pl-4">
                  <h3 className="text-[1rem] font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-[0.93rem] leading-7 text-[var(--th-text-secondary)]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter flush theme="dark" />
    </main>
  );
}

function Metric({
  title,
  body,
  highlight = false,
}: {
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <article className={`border-l pl-4 ${highlight ? "border-[var(--action-primary)]" : "border-[var(--border-subtle)]"}`}>
      <p className={`text-[0.82rem] uppercase tracking-[0.1em] ${highlight ? "text-[var(--action-primary)]" : "text-[var(--th-text-muted)]"}`}>
        {title}
      </p>
      <p className="mt-2 text-[0.96rem] leading-7 text-[var(--th-text-secondary)]">{body}</p>
    </article>
  );
}
