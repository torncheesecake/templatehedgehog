"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";

const VAT_RATE = 0.2;

type VatMode = "ex_vat" | "inc_vat";

interface PricingOfferCardProps {
  pricePence: number;
  hasCoreAccess: boolean;
  stripeReady: boolean;
  productId: string;
  productName: string;
  inclusionPoints: string[];
}

function formatHeadlinePriceFromPence(pence: number): string {
  if (pence % 100 === 0) {
    return `£${pence / 100}`;
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

export function PricingOfferCard({
  pricePence,
  hasCoreAccess,
  stripeReady,
  productId,
  productName,
  inclusionPoints,
}: PricingOfferCardProps) {
  const [vatMode, setVatMode] = useState<VatMode>("ex_vat");

  const displayedPrice = useMemo(() => {
    if (vatMode === "inc_vat") {
      return Math.round(pricePence * (1 + VAT_RATE));
    }
    return pricePence;
  }, [pricePence, vatMode]);

  const ctaLabel = hasCoreAccess
    ? `Buy another ${productName} licence`
    : `Get ${productName}`;

  return (
    <aside className="rounded-[1.4rem] bg-(--hedgehog-core-navy) p-6 shadow-[0_30px_56px_rgba(4,3,30,0.35)] sm:p-7">
      <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--dune-muted)">
        One-time licence
      </p>

      <div
        className="mt-4 inline-flex rounded-[0.8rem] bg-(--hedgehog-core-navy) p-1"
        role="group"
        aria-label="VAT display mode"
      >
        <button
          type="button"
          onClick={() => setVatMode("ex_vat")}
          aria-pressed={vatMode === "ex_vat"}
          className={`h-8 rounded-[0.58rem] px-3 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "ex_vat"
              ? "bg-(--accent-primary) text-(--surface-strong)"
              : "text-(--dune-muted) hover:text-[#ffffff]"
          }`}
        >
          Ex VAT
        </button>
        <button
          type="button"
          onClick={() => setVatMode("inc_vat")}
          aria-pressed={vatMode === "inc_vat"}
          className={`h-8 rounded-[0.58rem] px-3 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "inc_vat"
              ? "bg-(--accent-primary) text-(--surface-strong)"
              : "text-(--dune-muted) hover:text-[#ffffff]"
          }`}
        >
          Inc VAT
        </button>
      </div>

      <div className="mt-6 flex items-end gap-2.5">
        <p className="text-[3.9rem] font-semibold leading-[0.86] text-(--surface-strong) sm:text-[4.4rem]">
          {formatHeadlinePriceFromPence(displayedPrice)}
        </p>
        <p className="pb-2 text-[1rem] font-semibold uppercase tracking-[0.08em] text-[#ada39f]">
          {vatMode === "inc_vat" ? "inc VAT" : "ex VAT"}
        </p>
      </div>

      <p className="mt-2 text-[0.9rem] leading-7 text-(--dune-muted)">
        Pay once. Keep this version for ongoing commercial delivery.
      </p>

      <ul className="mt-6 space-y-2.5 text-[0.95rem] leading-7 text-[#f7e9e3]">
        {inclusionPoints.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {stripeReady ? (
        <form action="/api/checkout" method="post" className="mt-7">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="billingCycle" value="one_off" />
          <TrackableSubmitButton
            label={ctaLabel}
            event="click_buy_now"
            payload={{ source: "pricing_page", packId: "pack-1", billingCycle: "one_off" }}
            className="inline-flex h-12 w-full items-center justify-center rounded-[0.88rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.94rem] font-semibold !text-(--surface-strong) transition hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
          />
        </form>
      ) : (
        <p className="mt-7 rounded-[0.8rem] bg-[#460b03] px-4 py-3 text-[0.88rem] leading-6 text-[#ffe0e0]">
          Checkout is not configured in this environment.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem] font-semibold text-(--dune-muted)">
        <Link href="/components" className="underline-offset-2 hover:text-[#ffffff] hover:underline">
          Browse library
        </Link>
        <Link href="/docs" className="underline-offset-2 hover:text-[#ffffff] hover:underline">
          Read docs
        </Link>
      </div>
    </aside>
  );
}
