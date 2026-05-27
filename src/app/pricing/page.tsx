import type { Metadata } from "next";
import {
  getPricingTierById,
  TEMPLATE_CONFIG,
  type PricingTierDefinition,
} from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { LeadCaptureForm } from "@/components/conversion/LeadCaptureForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { getPackByProductId } from "@/lib/packCatalog";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  createSeoMetadata,
} from "@/lib/seo";
import { isStripeConfigured } from "@/lib/stripe-server";
import { isDownloadTokenConfigured } from "@/lib/downloadToken";

export const metadata: Metadata = createSeoMetadata({
  title: "Pricing",
  description:
    "Starter, Pro, and Enterprise pricing for Template Hedgehog production-ready email systems.",
  path: "/pricing",
  keywords: [
    "Template Hedgehog pricing",
    "MJML email system pricing",
    "production email system licence",
    "commercial email system licence",
  ],
});

const starter = getPricingTierById("starter");
const pro = getPricingTierById("pro");
const enterprise = getPricingTierById("enterprise");

const pricingFaq = [
  {
    question: "Which tier is the primary commercial path?",
    answer:
      "Pro is the primary commercial path. It includes the full component library, layouts and workflows, lifecycle and transactional systems, token examples, advanced implementation guidance, and six months of updates.",
  },
  {
    question: "Is Starter deliberately limited?",
    answer:
      "Starter is useful for teams that need production-ready onboarding and transactional essentials quickly. It includes a curated starter system, three layouts, MJML, compiled HTML, and setup docs.",
  },
  {
    question: "When should a team buy Enterprise?",
    answer:
      "Enterprise is for commercial reuse, white-label or internal deployment, reusable generation framework access, priority support, and twelve months of updates.",
  },
  {
    question: "How does checkout map to downloads?",
    answer:
      "Each checkout uses the selected product ID, then the success route validates the Stripe session and shows the matching signed archive download.",
  },
];

function CheckoutAction({
  tier,
  source,
  className,
}: {
  tier: PricingTierDefinition;
  source: string;
  className: string;
}) {
  const isStaticExport = process.env.STATIC_EXPORT === "true";
  const checkoutReady = !isStaticExport && isStripeConfigured() && isDownloadTokenConfigured();
  const setupIssue = !isStripeConfigured()
    ? "Checkout activates when Stripe environment variables are configured."
    : "Checkout activates when signed download tokens are configured.";
  const pack = getPackByProductId(tier.stripeLookupKey);
  const label = tier.ctaLabel;

  if (checkoutReady && pack) {
    return (
      <form action="/api/checkout" method="post">
        <input type="hidden" name="productId" value={pack.productId} style={{ caretColor: "transparent" }} />
        <input type="hidden" name="billingCycle" value="one_off" style={{ caretColor: "transparent" }} />
        <TrackableSubmitButton
          label={label}
          event="checkout_start"
          payload={{ source, packId: pack.id, billingCycle: "one_off" }}
          className={className}
        />
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <button type="button" disabled className={className}>
        {isStaticExport ? "Checkout requires live deployment" : label}
      </button>
      {!checkoutReady ? (
        <p className="max-w-[18rem] text-[0.78rem] leading-5 text-[var(--th-text-muted)]">
          {isStaticExport ? "Checkout requires live deployment." : setupIssue}
        </p>
      ) : null}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="th-page">
      <SiteTopBar theme="hero" ctaHref="" />
      <JsonLd id="template-hedgehog-product" data={buildProductJsonLd()} />
      <JsonLd
        id="pricing-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      <section className="th-section th-section-roomy">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <p className="th-eyebrow">
            Pricing
          </p>
          <h1 className="th-heading-page mt-4">
            Buy the system that matches your shipping stage.
          </h1>
          <p className="th-lede">
            Serious teams buy this to remove rebuild cycles, standardise implementation handoff, and ship production-safe email faster.
          </p>
          <div className="mt-6 grid max-w-4xl gap-3 text-[0.88rem] font-semibold text-[var(--th-text-secondary)] sm:grid-cols-2 lg:grid-cols-4">
            <p className="border-l border-[var(--action-primary)] pl-3">Production email systems</p>
            <p className="border-l border-[var(--action-primary)] pl-3">Secure Stripe checkout</p>
            <p className="border-l border-[var(--action-primary)] pl-3">Signed download after payment</p>
            <p className="border-l border-[var(--action-primary)] pl-3">MJML and compiled HTML</p>
          </div>
        </div>
      </section>

      <section id="pro" className="th-section">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <article className="border-l border-[var(--border-subtle)] pl-4">
              <p className="th-eyebrow">Primary recommendation</p>
              <h2 className="th-heading-section mt-3">Pro is the default production path.</h2>
              <p className="th-copy">
                If your team ships recurring lifecycle or transactional email, Pro is the complete production email system and the strongest commercial choice.
              </p>
              <div className="mt-6">
                <CheckoutAction
                  tier={pro}
                  source="pricing_primary"
                  className="inline-flex h-12 items-center rounded-full bg-[var(--action-primary)] px-6 text-[0.95rem] font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)]"
                />
              </div>
            </article>

            <article className="th-card p-6 sm:p-7">
              <p className="text-[0.8rem] uppercase tracking-[0.09em] text-[var(--action-primary)]">Most popular</p>
              <h3 className="mt-2 text-[1.9rem] font-semibold text-white">Pro · £179</h3>
              <p className="th-copy">{pro.description}</p>
              <ul className="mt-5 space-y-2 text-[0.9rem] leading-7 text-[var(--th-text-secondary)]">
                {pro.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-5 text-[0.84rem] text-[var(--th-text-muted)]">
                One primary action on this page by design. If Pro is not the right fit, use the options below.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:px-12">
          <TierAside
            tier={starter}
            title="Starter"
            subtitle={starter.position}
            points={starter.includes}
            action={{
              kind: "checkout",
              source: "pricing_starter",
            }}
          />
          <TierAside
            tier={enterprise}
            title="Enterprise"
            subtitle={enterprise.position}
            points={enterprise.includes}
            action={{
              kind: "checkout",
              source: "pricing_enterprise",
            }}
          />
        </div>
      </section>

      <section className="th-section">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">
                Delivery after purchase
              </p>
              <h2 className="th-heading-section mt-3">
                The checkout flow maps directly to the archive you receive.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <TrustPoint title="Starter" body="A useful starter system for onboarding and transactional essentials, not a crippled sampler." />
              <TrustPoint title="Pro" body="The primary route for the complete component, layout, workflow, and guidance system archive." />
              <TrustPoint title="Enterprise" body="Commercial deployment rights, white-label or internal reuse, priority support, and 12 months updates." />
            </div>
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <h2 className="th-heading-section">
            One rebuild cycle usually costs more than a licence.
          </h2>
          <p className="th-copy">
            This is an operational speed purchase. The value is fewer rebuilds, faster QA, and production consistency across every send.
          </p>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">
                Not ready to buy?
              </p>
              <h2 className="th-heading-section mt-3">
                Compare your current QA process first.
              </h2>
              <p className="th-copy">
                Request the production QA checklist if your team wants to review handoff, rendering, and ESP import requirements before choosing a licence.
              </p>
            </div>
            <LeadCaptureForm source="pricing_checklist" />
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">
                Pricing questions
              </p>
              <h2 className="th-heading-section mt-3">
                Remove purchase ambiguity.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pricingFaq.map((item) => (
                <article key={item.question} className="border-l border-[var(--border-subtle)] pl-4">
                  <h3 className="text-[1rem] font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-[0.93rem] leading-7 text-[var(--th-text-secondary)]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter showPrimaryCta={false} />
    </main>
  );
}

function TrustPoint({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-l border-[var(--border-subtle)] pl-4">
      <p className="text-[0.82rem] uppercase tracking-[0.1em] text-[var(--action-primary)]">{title}</p>
      <p className="mt-2 text-[0.93rem] leading-7 text-[var(--th-text-secondary)]">{body}</p>
    </article>
  );
}

function TierAside({
  tier,
  title,
  subtitle,
  points,
  action,
}: {
  tier: PricingTierDefinition;
  title: string;
  subtitle: string;
  points: string[];
  action:
    | { kind: "checkout"; source: string }
    | { kind: "link"; href: string; source: string };
}) {
  return (
    <article id={tier.id} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5">
      <h3 className="text-[1.35rem] font-semibold text-white">{title} · £{tier.priceGbp}</h3>
      <p className="mt-1 text-[0.9rem] text-[var(--action-primary)]">{subtitle}</p>
      <ul className="mt-4 space-y-2 text-[0.88rem] leading-7 text-[var(--th-text-secondary)]">
        {points.map((point) => (
          <li key={point}>• {point}</li>
        ))}
      </ul>
      {tier.id === "enterprise" ? (
        <p className="mt-4 text-[0.84rem] leading-6 text-[var(--th-text-muted)]">
          Enterprise is a commercial deployment licence for reuse rights, white-label or internal rollout, reusable generation framework access, priority support, and 12 months updates.
        </p>
      ) : null}
      <div className="mt-5">
        {action.kind === "checkout" ? (
          <CheckoutAction
            tier={tier}
            source={action.source}
            className="inline-flex h-10 items-center rounded-[0.82rem] border border-[var(--border-subtle)] px-3.5 text-[0.84rem] font-semibold text-[var(--th-text-secondary)] transition hover:border-[var(--border-subtle)] hover:text-white"
          />
        ) : (
          <TrackableLink
            href={action.href}
            event="final_cta_click"
            payload={{ source: action.source, tier: tier.id }}
            className="inline-flex h-10 items-center rounded-[0.82rem] border border-[var(--border-subtle)] px-3.5 text-[0.84rem] font-semibold text-[var(--th-text-secondary)] transition hover:border-[var(--border-subtle)] hover:text-white"
          >
            {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
          </TrackableLink>
        )}
      </div>
    </article>
  );
}
