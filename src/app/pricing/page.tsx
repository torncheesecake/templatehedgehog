import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Roboto_Serif } from "next/font/google";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { PricingOfferCard } from "@/components/pricing/PricingOfferCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_LICENSE_POINTS,
  MJML_PACK_NAME,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { getPackById, parseOwnedPackIds } from "@/lib/packCatalog";
import { isStripeConfigured } from "@/lib/stripe-server";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

const displaySerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: createPageTitle("Pricing"),
  description:
    `Pricing for ${TEMPLATE_CONFIG.productName}, the structured MJML toolkit behind the ${TEMPLATE_CONFIG.brandName} component library.`,
};

const heroBullets = [
  "Build campaign email faster without rebuilding the same code.",
  "Reduce avoidable QA regressions before send.",
  "Hand over cleaner output to ESP and CRM implementation teams.",
  "Keep a reusable system your team can ship with repeatedly.",
] as const;

const includedAssets = [
  {
    title: `${COMPONENT_COUNT} components`,
    detail: "Production-ready MJML blocks for common campaign, lifecycle, and transactional needs.",
  },
  {
    title: `${LAYOUT_COUNT} layouts`,
    detail: "Complete email structures composed from the same reusable component system.",
  },
  {
    title: `${WORKFLOW_COUNT} workflows`,
    detail: "Real-world workflow references for onboarding, billing, reporting, and operational sends.",
  },
  {
    title: "MJML + HTML",
    detail: "Editable source and compiled output together for safer handoff and delivery.",
  },
] as const;

const outcomePoints = [
  "Faster builds from brief to production-ready send.",
  "Fewer QA issues caused by ad-hoc email markup drift.",
  "Cleaner handoff between developers, QA, and delivery teams.",
] as const;

const compactFaq = [
  "Commercial use included for your own and client delivery work.",
  "No subscription. Single payment for this version.",
  "Download includes source files, compiled output, and implementation context.",
] as const;

function NoticeStrip({
  children,
}: {
  children: string;
}) {
  return (
    <p className="rounded-[0.88rem] bg-[#ffe0e0] px-4 py-3 text-[0.9rem] leading-6 text-[#460b03]">
      {children}
    </p>
  );
}

export default function PricingPage() {
  const isStaticExport = process.env.STATIC_EXPORT === "true";
  const stripeReady = !isStaticExport && isStripeConfigured();
  const ownedPackIds = parseOwnedPackIds(
    process.env.NEXT_PUBLIC_DEV_OWNED_PACK_IDS ?? "",
  );
  const hasCoreAccess = ownedPackIds.includes("pack-1");
  const corePack = getPackById("pack-1");
  const buyLabel = hasCoreAccess
    ? `Buy another ${MJML_PACK_NAME} licence`
    : `Buy ${MJML_PACK_NAME}`;

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <header className="border-b border-(--dune-muted) bg-(--surface-strong)">
        <div className={cn(visualSystem.widths.page, "flex items-center justify-between py-4")}>
          <Link href="/" className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2">
            <span className={cn("text-[1.22rem] font-semibold text-(--hedgehog-core-navy) sm:text-[1.34rem]", displaySerif.className)}>
              {TEMPLATE_CONFIG.brandName}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            <Link href="/components" className="text-[0.92rem] font-semibold text-(--th-body-copy) transition hover:text-(--hedgehog-core-navy)">
              Components
            </Link>
            <Link href="/layouts" className="text-[0.92rem] font-semibold text-(--th-body-copy) transition hover:text-(--hedgehog-core-navy)">
              Layouts
            </Link>
            <Link href="/workflows" className="text-[0.92rem] font-semibold text-(--th-body-copy) transition hover:text-(--hedgehog-core-navy)">
              Workflows
            </Link>
            <Link href="/docs" className="text-[0.92rem] font-semibold text-(--th-body-copy) transition hover:text-(--hedgehog-core-navy)">
              Docs
            </Link>
          </nav>

          <Link
            href="/components"
            className="inline-flex h-10 items-center rounded-[0.75rem] border border-(--accent-primary) bg-(--accent-primary) px-4 text-[0.85rem] font-semibold !text-(--surface-strong) transition hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
          >
            Browse components
          </Link>
        </div>
      </header>

      <section>
        <div className={cn(visualSystem.widths.page, "pb-20 pt-12 sm:pt-14 lg:pb-24 lg:pt-16")}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-start">
            <div className="max-w-[760px]">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--th-body-copy)">
                Premium MJML product
              </p>
              <h1 className={cn("mt-4 max-w-[14ch] text-[2.9rem] font-semibold leading-[0.9] text-(--hedgehog-core-navy) sm:text-[4rem] lg:text-[4.5rem]", displaySerif.className)}>
                Stop rebuilding email code. Ship production campaigns faster.
              </h1>
              <p className="mt-5 max-w-[58ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
                One decisive purchase for teams that need reliable email structure, cleaner handoff, and faster delivery.
                Built for real production use, not throwaway demos.
              </p>

              <ul className="mt-8 max-w-[62ch] space-y-3 text-[1rem] leading-7 text-(--hedgehog-core-navy)">
                {heroBullets.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <PricingOfferCard
              pricePence={corePack.oneOffPricePence}
              hasCoreAccess={hasCoreAccess}
              stripeReady={stripeReady}
              productId={corePack.productId}
              productName={MJML_PACK_NAME}
              inclusionPoints={[
                `${COMPONENT_COUNT} production-safe components`,
                `${LAYOUT_COUNT} complete layouts`,
                `${WORKFLOW_COUNT} practical workflows`,
                "MJML source plus compiled HTML output",
              ]}
            />
          </div>

          {!stripeReady ? (
            <div className="mt-8 space-y-3">
              <NoticeStrip>
                {isStaticExport
                  ? "Checkout is disabled on this GitHub Pages preview. Use your primary deployment for live purchase flow."
                  : "Checkout is not configured yet. Add STRIPE keys to enable purchases."}
              </NoticeStrip>
            </div>
          ) : null}
        </div>
      </section>

      <section className="pb-20 sm:pb-22 lg:pb-24">
        <div className={visualSystem.widths.page}>
          <figure className="overflow-hidden rounded-[1.3rem] bg-[#f7e9e3] p-4 shadow-[0_20px_44px_rgba(20, 19, 43,0.14)] sm:p-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[0.95rem] bg-[#ded2cc]">
              <Image
                src="/email-shots-v3/hero-overlay-modern.png"
                alt="Large product proof preview from the downloadable system"
                fill
                sizes="(max-width: 1024px) 94vw, 82vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="px-1 pt-4 text-[0.96rem] font-medium text-(--th-body-copy)">
              Built from the same system you download.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-(--dune-muted) py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--th-body-copy)">
                Included
              </p>
              <h2 className={cn("mt-3 max-w-[12ch] text-[2rem] font-semibold leading-[0.95] text-(--hedgehog-core-navy) sm:text-[2.45rem]", displaySerif.className)}>
                What you get
              </h2>
            </div>

            <dl className="divide-y divide-[#ded2cc]">
              {includedAssets.map((asset) => (
                <div key={asset.title} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(180px,0.32fr)_1fr] sm:gap-5">
                  <dt className={cn("text-[1.06rem] font-semibold text-(--hedgehog-core-navy)", displaySerif.className)}>{asset.title}</dt>
                  <dd className="text-[0.98rem] leading-7 text-(--th-body-copy)">{asset.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-18 lg:py-20">
        <div className={visualSystem.widths.page}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14">
            <div>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--th-body-copy)">
                Value
              </p>
              <h2 className={cn("mt-3 max-w-[14ch] text-[2rem] font-semibold leading-[0.95] text-(--hedgehog-core-navy) sm:text-[2.45rem]", displaySerif.className)}>
                Why it&apos;s worth it
              </h2>
              <ul className="mt-7 space-y-4">
                {outcomePoints.map((point) => (
                  <li key={point} className="border-b border-(--dune-muted) pb-4 text-[1.02rem] leading-8 text-(--hedgehog-core-navy) last:border-b-0 last:pb-0">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.05rem] bg-[#f7e9e3] p-6 sm:p-7">
              <h3 className={cn("text-[1.22rem] font-semibold text-(--hedgehog-core-navy)", displaySerif.className)}>Licence and buyer FAQ</h3>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-7 text-(--th-body-copy)">
                {MJML_PACK_LICENSE_POINTS.slice(0, 2).map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
                    <span>{item}</span>
                  </li>
                ))}
                {compactFaq.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(visualSystem.widths.page, "pb-20 sm:pb-22 lg:pb-24")}>
        <div className="rounded-[1.45rem] bg-(--hedgehog-core-navy) px-6 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className={cn("max-w-[18ch] text-[2.05rem] font-semibold leading-[0.95] text-[#ffffff] sm:text-[2.45rem]", displaySerif.className)}>
                Buy once. Ship faster on every campaign.
              </h2>
              <p className="mt-3 max-w-[56ch] text-[1rem] leading-8 text-(--dune-muted)">
                Make the next send easier, and keep that speed across every project after it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {stripeReady ? (
                <form action="/api/checkout" method="post">
                  <input type="hidden" name="productId" value={corePack.productId} />
                  <input type="hidden" name="billingCycle" value="one_off" />
                  <TrackableSubmitButton
                    label={buyLabel}
                    event="click_buy_now"
                    payload={{ source: "pricing_final_cta", packId: "pack-1", billingCycle: "one_off" }}
                    className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.92rem] font-semibold !text-(--surface-strong) transition hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
                  />
                </form>
              ) : (
                <Link
                  href="/support"
                  className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--accent-primary) bg-(--accent-primary) px-6 text-[0.92rem] font-semibold !text-(--surface-strong) transition hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
                >
                  Contact support
                </Link>
              )}

              <Link
                href="/components"
                className="inline-flex h-12 items-center rounded-[0.9rem] border border-(--dune-muted) px-6 text-[0.92rem] font-semibold text-(--surface-strong) transition hover:border-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
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
