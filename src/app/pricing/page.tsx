import type { Metadata } from "next";
import Link from "next/link";
import {
  getPricingTierById,
  TEMPLATE_CONFIG,
  type PricingTierDefinition,
} from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  ArchiveStructureProof,
  FeatureBlock,
  LicenceMatrix,
  PostPurchaseProof,
  PricingTierCard,
  SupportRefundPanel,
  TestingProofPanel,
  ValueReceipt,
  type ValueReceiptWorkflowExample,
  V2PageHero,
  V2Section,
  WorkflowAssembly,
} from "@/components/site/V2Primitives";
import { emailLayouts } from "@/data/email-layouts";
import { getEmailWorkflowBySlug } from "@/data/workflows";
import { getPackByProductId } from "@/lib/packCatalog";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildProductJsonLd,
  createSeoMetadata,
} from "@/lib/seo";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";

export const metadata: Metadata = createSeoMetadata({
  title: "Pricing for Core, Pro, and Team",
  description:
    "Core, Pro, and Team pricing for Template Hedgehog production-ready email systems.",
  path: "/pricing",
  keywords: [
    "Template Hedgehog pricing",
    "MJML email system pricing",
    "production email system licence",
    "commercial email system licence",
  ],
});

const core = getPricingTierById("starter");
const pro = getPricingTierById("pro");
const team = getPricingTierById("enterprise");

const receiptWorkflowSlugs = [
  "onboarding",
  "password-reset",
  "campaign-launch",
  "reporting",
] as const;

const buyerJourneys = [
  {
    buyer: "Lifecycle marketer",
    problem: "You own onboarding, launches, digests, and lifecycle sends, but every campaign still becomes a copy, review, QA, and handoff scramble.",
    outcome: "Start from workflow-ready email systems with source, preview, QA notes, and handoff context already attached.",
    workflows: [
      { label: "Onboarding activation", href: "/workflows/onboarding" },
      { label: "Campaign launch", href: "/workflows/campaign-launch" },
      { label: "Newsletter digest", href: "/workflows/newsletter-digest" },
    ],
    layouts: [
      { label: "Onboarding Activation Flow", href: "/layouts/onboarding-activation-flow" },
      { label: "Product Launch Campaign", href: "/layouts/product-launch-campaign" },
      { label: "Weekly Digest System", href: "/layouts/weekly-digest-system" },
    ],
    components: [
      { label: "Welcome Email Hero", href: "/components/welcome-email-hero" },
      { label: "Product Update Digest", href: "/components/product-update-digest" },
      { label: "Weekly Digest List", href: "/components/weekly-digest-list" },
    ],
    edition: "Pro",
    editionHref: "#pro",
    primaryCta: "View lifecycle workflows",
    primaryHref: "/workflows?view=product",
  },
  {
    buyer: "Email developer",
    problem: "You need reusable MJML, compiled HTML, QA notes, and predictable handoff, not another visual-only template library.",
    outcome: "Use the archive as a source-owned production system: inspect components, assemble layouts, compile, QA, then hand off clean HTML.",
    workflows: [
      { label: "Password reset", href: "/workflows/password-reset" },
      { label: "Billing receipt", href: "/workflows/billing" },
      { label: "Security notification", href: "/workflows/notifications" },
    ],
    layouts: [
      { label: "Password Reset System", href: "/layouts/password-reset-system" },
      { label: "Receipt System", href: "/layouts/receipt-system" },
      { label: "Security Alert System", href: "/layouts/security-alert-system" },
    ],
    components: [
      { label: "Password Reset Card", href: "/components/password-reset-card" },
      { label: "Receipt Line Items", href: "/components/receipt-line-items-table" },
      { label: "Security Alert Card", href: "/components/security-alert-card" },
    ],
    edition: "Pro, or Team for client reuse",
    editionHref: "#pro",
    primaryCta: "Inspect source-ready layouts",
    primaryHref: "/layouts",
  },
  {
    buyer: "SaaS founder",
    problem: "You need credible product emails before a full lifecycle or email engineering function exists, and you cannot afford fragile one-off sends.",
    outcome: "Start with the essential customer journeys, then upgrade when email production becomes a recurring operating system.",
    workflows: [
      { label: "Onboarding activation", href: "/workflows/onboarding" },
      { label: "Password reset", href: "/workflows/password-reset" },
      { label: "Campaign launch", href: "/workflows/campaign-launch" },
    ],
    layouts: [
      { label: "SaaS Welcome System", href: "/layouts/saas-welcome-system" },
      { label: "Password Reset System", href: "/layouts/password-reset-system" },
      { label: "Product Launch Campaign", href: "/layouts/product-launch-campaign" },
    ],
    components: [
      { label: "Header Brand Row", href: "/components/header-brand-row" },
      { label: "Welcome Email Hero", href: "/components/welcome-email-hero" },
      { label: "Primary CTA Button", href: "/components/accent-cta-button" },
    ],
    edition: "Core first, Pro when recurring",
    editionHref: "#core",
    primaryCta: "Start with Core",
    primaryHref: "#core",
  },
] as const;

const proProductionReasons = [
  {
    title: "More workflows, fewer rebuilds",
    copy: "Pro is for teams who keep rebuilding onboarding, launch, digest, transactional, and lifecycle sends from scratch. The full workflow set gives you repeatable starting points instead of one-off templates.",
  },
  {
    title: "Source, output, and QA stay together",
    copy: "Every production package keeps MJML source, compiled HTML, previews, QA notes, and handoff guidance connected, so review does not depend on tribal memory or screenshots in chat.",
  },
  {
    title: "A safer handoff to your ESP",
    copy: "Pro helps you catch copy, link, mobile, image, footer, token, and platform-boundary issues before the email reaches Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, or Customer.io.",
  },
] as const;

const teamCommercialReasons = [
  {
    title: "Client and multi-brand reuse",
    copy: "Team is for agencies, consultants, and internal platform teams who need to reuse the Pro archive across clients, business units, brands, or implementation programmes without renegotiating every project.",
  },
  {
    title: "Onboarding for real production use",
    copy: "Team adds a practical implementation conversation around workflow fit, archive structure, source ownership, update handling, and how the package should move into your team or client handoff process.",
  },
  {
    title: "Support when email is operational",
    copy: "When production email is part of your operating rhythm, the value is not more templates. It is permission, support priority, a longer update window, and confidence that the system can be reused cleanly.",
  },
] as const;

const retentionReasons = [
  {
    title: "Owned archive, not SaaS lock-in",
    copy: "The files you buy remain yours inside the licence terms. Update access improves the archive over time, but the source and compiled output do not disappear when an update window ends.",
  },
  {
    title: "Versioned updates protect production work",
    copy: "Updates are tied to source, compiled output, workflow guidance, QA notes, docs, and archive structure, so buyers can see what changed before pulling a newer package into production.",
  },
  {
    title: "A renewal path for serious teams",
    copy: "When an included update window ends, teams can keep using the owned archive, renew update access, or move to Team when reuse rights, onboarding, and priority support become commercially safer.",
  },
] as const;

const pricingFaqs = [
  {
    question: "What do I receive when I buy Template Hedgehog?",
    answer:
      "Each edition is a downloadable archive of production email systems: editable MJML source, compiled HTML, rendered previews, QA notes, implementation guidance, and workflow examples, kept together so the first implementation is not a blank rebuild.",
  },
  {
    question: "Does Template Hedgehog work with Mailchimp, HubSpot, and other platforms?",
    answer:
      "Yes, as a source-to-handoff system. Template Hedgehog prepares reviewed MJML source, compiled HTML, previews, and QA notes for upload into Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or another ESP. Your sending platform still handles audiences, consent, unsubscribe, automation, sending, delivery, and reporting.",
  },
  {
    question: "What is the difference between Core, Pro, and Team?",
    answer:
      `Core (£${core.priceGbp}) is the starter archive: welcome, password reset, and order confirmation systems with 11 components, 3 layouts, MJML source, compiled HTML, previews, and setup docs. Pro (£${pro.priceGbp}) is the complete production system: ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, ${WORKFLOW_COUNT} workflows, QA notes, implementation guidance, and 6 months of updates. Team (£${team.priceGbp}+) is Pro plus commercial reuse rights, white-label or internal deployment, onboarding, priority support, and 12 months of updates.`,
  },
  {
    question: "Do I need to know MJML to use Template Hedgehog?",
    answer:
      "Familiarity with markup helps, but every edition also ships compiled, delivery-ready HTML. You can hand the compiled HTML straight to your sending platform for QA or import, or edit the MJML source when you want a maintainable, reusable starting point.",
  },
  {
    question: "Is Template Hedgehog Studio included in any tier?",
    answer:
      "No. Template Hedgehog Studio is a planned future workspace on the roadmap. It is in development, not part of the live product, and not included in any current tier. The paid archive is complete and usable today without it.",
  },
  {
    question: "What is the refund cover if delivery fails?",
    answer:
      "If the paid archive cannot be delivered, is inaccessible, or materially differs from the described tier contents, support will resolve the issue or refund the purchase.",
  },
] as const;

function buildReceiptWorkflowExamples(): ValueReceiptWorkflowExample[] {
  return receiptWorkflowSlugs.flatMap((slug) => {
    const workflow = getEmailWorkflowBySlug(slug);
    if (!workflow) {
      return [];
    }

    return [{
      title: workflow.title,
      summary: workflow.summary,
      trigger: workflow.trigger,
      href: `/workflows/${workflow.slug}`,
      deliverables: [
        "MJML source",
        "Compiled HTML",
        `${workflow.componentStack.length} blocks`,
        `${workflow.requiredFields.length} fields`,
      ],
    }];
  });
}

function CheckoutAction({
  tier,
  source,
  tone = "primary",
}: {
  tier: PricingTierDefinition;
  source: string;
  tone?: "primary" | "onDark";
}) {
  const isStaticExport = process.env.STATIC_EXPORT === "true";
  const checkoutReady = !isStaticExport;
  const pack = getPackByProductId(tier.stripeLookupKey);
  const label = tier.ctaLabel;
  const buttonClassName = tone === "onDark"
    ? "th-btn th-btn-sm th-btn-primary-on-dark w-full"
    : "th-btn th-btn-sm th-btn-primary w-full";

  if (checkoutReady && pack) {
    return (
      <form action="/api/checkout" method="post">
        <input type="hidden" name="productId" value={pack.productId} style={{ caretColor: "transparent" }} />
        <input type="hidden" name="billingCycle" value="one_off" style={{ caretColor: "transparent" }} />
        <TrackableSubmitButton
          label={label}
          event="checkout_start"
          payload={{ source, packId: pack.id, billingCycle: "one_off" }}
          className={buttonClassName}
        />
      </form>
    );
  }

  return (
    <Link
      href={`mailto:${TEMPLATE_CONFIG.supportEmail}?subject=${encodeURIComponent(`${TEMPLATE_CONFIG.brandName} ${tier.name} purchase`)}`}
      className={buttonClassName}
    >
      {isStaticExport ? `Email to buy ${tier.name}` : label}
    </Link>
  );
}

function TeamContactAction() {
  const subject = "Template Hedgehog Team licence";

  return (
    <Link
      href={`mailto:${TEMPLATE_CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}`}
      className="th-btn th-btn-sm th-btn-secondary w-full"
    >
      Discuss Team
    </Link>
  );
}

export default function PricingPage() {
  const receiptWorkflowExamples = buildReceiptWorkflowExamples();
  const receiptPreview =
    emailLayouts.find((layout) => layout.slug === "product-launch-campaign")
    ?? emailLayouts[0];

  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd id="template-hedgehog-product" data={buildProductJsonLd()} />
      <JsonLd
        id="pricing-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd
        id="pricing-faq"
        data={buildFaqJsonLd(
          pricingFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        )}
      />

      <V2PageHero
        title="Buy the right email system."
        copy="Core is the £59 archive essentials pack. Pro is the £179 production system for recurring source-to-handoff work. Team is Pro with commercial reuse rights, onboarding, priority support, and longer updates."
        actions={[
          { href: "#pro", label: "Buy Pro - £179", primary: true },
          { href: "#buyer-pathways", label: "Find your path" },
        ]}
        compact
      >
        <WorkflowAssembly compact />
      </V2PageHero>

      <V2Section
        title="The price buys production artefacts."
        copy="Before comparing counts, inspect the actual handoff: editable MJML, compiled HTML, previews, QA notes, implementation guidance, and workflow examples."
      >
        <ValueReceipt
          image={receiptPreview?.previewImageUrl}
          alt={receiptPreview ? `${receiptPreview.title} preview included in Template Hedgehog` : undefined}
          previewHref={receiptPreview?.previewImageUrl}
          workflowExamples={receiptWorkflowExamples}
          compact
        />
      </V2Section>

      <V2Section
        title="Choose by the job you need done."
        copy="The archive stays the same product. These paths simply help lifecycle, technical, and founder buyers find the workflows that match their first use case."
        surface="surface"
      >
        <div id="buyer-pathways" className="grid gap-5 lg:grid-cols-3">
          {buyerJourneys.map((journey) => (
            <article key={journey.buyer} className="flex min-h-full flex-col border border-[var(--border-subtle)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                Buyer path
              </p>
              <h3 className="mt-2 text-[1.45rem] font-semibold text-[var(--text-primary)]">
                {journey.buyer}
              </h3>
              <p className="mt-3 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
                {journey.problem}
              </p>
              <p className="mt-3 text-[0.94rem] font-semibold leading-7 text-[var(--text-primary)]">
                Desired outcome: {journey.outcome}
              </p>

              <div className="mt-5 grid gap-4">
                {[
                  ["Relevant workflows", journey.workflows],
                  ["Useful layouts", journey.layouts],
                  ["Useful components", journey.components],
                ].map(([label, items]) => (
                  <div key={label as string} className="border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                      {label as string}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(items as readonly { label: string; href: string }[]).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] transition hover:border-[var(--identity-source-border)] hover:text-[var(--identity-source)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-1 flex-col justify-end gap-3 border-t border-[var(--border-subtle)] pt-5">
                <p className="text-[0.9rem] leading-6 text-[var(--text-secondary)]">
                  Recommended edition: <Link href={journey.editionHref} className="font-semibold text-[var(--action-primary)]">{journey.edition}</Link>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href={journey.primaryHref} className="th-btn th-btn-sm th-btn-primary">
                    {journey.primaryCta}
                  </Link>
                  <Link href={journey.editionHref} className="th-btn th-btn-sm th-btn-secondary">
                    Compare edition
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </V2Section>

      <V2Section
        title="What arrives after purchase."
        copy="The paid archive is delivered as a tier-matched zip with source, output, previews, workflow context, documentation, version metadata, and licence guidance."
        surface="surface"
      >
        <div className="grid gap-6">
          <ArchiveStructureProof />
          <PostPurchaseProof />
          <TestingProofPanel />
        </div>
      </V2Section>

      <V2Section
        title="Why pay for this at all?"
        copy="It is a fair question, and it is worth answering before any price."
      >
        <div className="max-w-3xl border-t border-[var(--border-subtle)] pt-6">
          <p className="text-[1.02rem] leading-8 text-[var(--text-secondary)]">
            Free MJML and the MJML app give you a compiler, not a system. Your ESP&apos;s template builder, in Mailchimp or anywhere else, locks the work to one platform and hands back no portable source. Marketplace templates give you visual HTML with no workflow context, no QA notes, and no updates when a client breaks something six months later.
          </p>
          <p className="mt-4 text-[1.02rem] leading-8 text-[var(--text-secondary)]">
            Template Hedgehog is the production system behind the send: editable MJML source, compiled HTML, QA notes, and handoff guidance kept together, with versioned updates as the archive improves. For recurring email work, the Pro archive removes the rebuild loop for less than the cost of one avoidable handoff scramble.
          </p>
        </div>
      </V2Section>

      <V2Section
        title="Core ships first journeys. Pro standardises. Team scales."
        copy={`Core is the essential archive starter: three complete workflows with source files, compiled HTML, previews, and setup docs. Pro is the main buying path for recurring email production: the complete archive, ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, ${WORKFLOW_COUNT} workflows, QA, handoff guidance, and updates. Team keeps Pro, then adds permission, onboarding, support, and a longer update window.`}
        surface="surface"
      >
        <div id="editions" className="grid gap-5 lg:grid-cols-3">
          <div id="core">
            <PricingTierCard
              name="Core"
              price={`£${core.priceGbp}`}
              outcome="Start shipping."
              copy="Best when you need the first production journeys covered cleanly: welcome, password reset, and order confirmation systems with 11 components, 3 layouts, 3 workflows, MJML source, compiled HTML, previews, and setup docs."
              points={[
                "SaaS welcome, password reset, and order confirmation systems",
                "Editable MJML and compiled HTML outputs",
                "Setup docs for first implementation",
              ]}
              badge="3 workflows"
              action={<CheckoutAction tier={core} source="pricing_core" />}
              tone="neutral"
            />
          </div>
          <div id="pro">
            <PricingTierCard
              name="Pro"
              price={`£${pro.priceGbp}`}
              outcome="Standardise delivery."
              copy="Best when email production is recurring and you need a repeatable source-to-handoff system: 82 components, 18 layouts, 13 workflows, editable source, compiled HTML, previews, QA notes, implementation guidance, and 6 months of updates."
              points={[
                "Full source and output archive across lifecycle, transactional, and campaign email",
                "Token examples, QA notes, and implementation guidance",
                "Versioned workflow updates for 6 months",
              ]}
              badge="13 workflows"
              action={<CheckoutAction tier={pro} source="pricing_pro" tone="onDark" />}
              highlighted
              tone="amethyst"
            />
          </div>
          <PricingTierCard
            name="Team"
            price={`£${team.priceGbp}+`}
            outcome="Scale operations."
            copy="Best when the same production artefacts will be reused across clients, teams, or internal systems: Pro archive, commercial reuse rights, onboarding, white-label/internal deployment, priority support, and 12 months of updates."
            points={[
              "Commercial reuse rights for the Pro archive",
              "White-label or internal deployment",
              "Reusable generation framework",
              "Priority support and 12 months of updates",
            ]}
            badge="Reuse rights"
            action={<TeamContactAction />}
            tone="indigo"
          />
        </div>
        <div className="mt-5 border-y border-[var(--border-strong)] bg-white px-5 py-4 sm:px-6">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
            Refund cover
          </p>
          <p className="mt-2 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
            Buy with confidence. If the paid archive cannot be delivered, is inaccessible, or does not match the tier described on this page, email <a href={`mailto:${TEMPLATE_CONFIG.supportEmail}`} className="font-semibold text-[var(--action-primary)]">{TEMPLATE_CONFIG.supportEmail}</a> with your purchase email or Stripe receipt and we will resolve it or refund you. Full <Link href="/support" className="font-semibold text-[var(--action-primary)]">refund and support terms</Link> are on the support page.
          </p>
        </div>
      </V2Section>

      <V2Section
        title="Why Pro becomes the default production choice."
        copy="Core is useful when the first workflows are enough. Pro is the commercial choice when email production is recurring and mistakes in source, QA, or handoff cost more than the licence."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {proProductionReasons.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-5">
          <Link href="#pro" className="th-btn th-btn-sm th-btn-primary">
            Buy Pro - £{pro.priceGbp}
          </Link>
          <Link href="/workflows?view=product" className="th-btn th-btn-sm th-btn-secondary">
            Inspect workflows
          </Link>
        </div>
      </V2Section>

      <V2Section title="On the roadmap">
        <div className="max-w-3xl border-t border-[var(--border-subtle)] pt-6">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
            Not included in any tier
          </p>
          <p className="mt-3 text-[1.02rem] leading-8 text-[var(--text-secondary)]">
            Template Hedgehog Studio is a planned future workspace for preparing email packages before send. It is in development, not part of the live product, and not included in any current tier. The paid archive is complete and usable today without it. You can register interest on the <Link href="/studio" className="font-semibold text-[var(--action-primary)]">Studio roadmap page</Link>.
          </p>
        </div>
      </V2Section>

      <V2Section
        title="When Team is the commercially safer choice."
        copy="Team is not a bigger template pack. It is the route for reuse rights, onboarding, support, and operating confidence when Template Hedgehog becomes part of client delivery or internal email infrastructure."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {teamCommercialReasons.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-5">
          <div className="w-full max-w-[220px]">
            <TeamContactAction />
          </div>
          <Link href="/support" className="th-btn th-btn-sm th-btn-secondary">
            Review support
          </Link>
        </div>
      </V2Section>

      <V2Section
        title="Licence, updates, and support."
        copy="The hesitation point is usually not the files. It is whether the licence fits, how updates are accessed, and what happens if delivery fails."
      >
        <div className="grid gap-6">
          <LicenceMatrix />
          <SupportRefundPanel />
        </div>
      </V2Section>

      <V2Section
        title="What happens after the first purchase."
        copy="Template Hedgehog should feel like an owned production system with a clear update path, not a file dump that quietly goes stale."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {retentionReasons.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-5">
          <Link href="/changelog" className="th-btn th-btn-sm th-btn-secondary">
            Review changelog
          </Link>
          <Link href="/support" className="th-btn th-btn-sm th-btn-secondary">
            Ask about updates
          </Link>
        </div>
      </V2Section>

      <V2Section title="Why upgrade?" copy="The upgrade path is about archive depth first, then reuse rights and support. Pro changes what you receive. Team changes what you are allowed and supported to do with it.">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureBlock title="Core to Pro" copy="Move to Pro when the 3 Core workflows are not enough and you need the full set of lifecycle, transactional, and campaign systems." />
          <FeatureBlock title="Pro to Team" copy="Move to Team when reuse rights, white-label delivery, priority support, or a longer update window matter." />
          <FeatureBlock title="Team difference" copy="Team does not add more templates than Pro. It adds permission, support, and operational cover." />
        </div>
      </V2Section>

      <V2Section surface="gradient">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl font-serif text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.98] !text-[var(--colour-high-priority)]">
              Start small if the workflow is still being proven.
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">
              Buy Core when the first three production journeys are enough. Buy Pro when you need the full archive. Discuss Team when reuse rights, white-label use, or priority support matter.
            </p>
          </div>
          <Link
            href="#pro"
            className="th-btn th-btn-primary-on-dark w-fit !border-white !bg-white !text-black shadow-[0_18px_42px_rgba(255,255,255,0.18)]"
          >
            Buy Pro - £179
          </Link>
        </div>
      </V2Section>

      <SiteFooter flush showPrimaryCta={false} />
    </main>
  );
}
