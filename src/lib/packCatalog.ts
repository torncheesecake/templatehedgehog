import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  STARTER_COMPONENT_COUNT,
  STARTER_LAYOUT_COUNT,
  STARTER_WORKFLOW_COUNT,
  WORKFLOW_COUNT,
  formatGbpFromPence,
} from "@/lib/pack";
import { PRICING_TIERS, type PricingTierDefinition } from "@/config/template";

export type PackId = "starter" | "pro" | "enterprise";
export type BillingCycle = "one_off" | "monthly";
export type PackStatus = "live";
export type VatDisplayMode = "ex_vat" | "inc_vat";

export type PackDefinition = {
  id: PackId;
  productId: string;
  name: string;
  shortDescription: string;
  status: PackStatus;
  oneOffPricePence: number;
  monthlyPricePence: number | null;
  componentCount: number;
  layoutCount: number;
  workflowCount: number;
};

export const UK_VAT_RATE = 0.2;

function buildPackDefinition(tier: PricingTierDefinition): PackDefinition {
  const isStarter = tier.id === "starter";

  return {
    id: tier.id,
    productId: tier.stripeLookupKey,
    name: tier.name,
    shortDescription: tier.position,
    status: "live",
    oneOffPricePence: tier.priceGbp * 100,
    monthlyPricePence: null,
    componentCount: isStarter ? STARTER_COMPONENT_COUNT : COMPONENT_COUNT,
    layoutCount: isStarter ? STARTER_LAYOUT_COUNT : LAYOUT_COUNT,
    workflowCount: isStarter ? STARTER_WORKFLOW_COUNT : WORKFLOW_COUNT,
  };
}

export const PACK_CATALOG: readonly PackDefinition[] = PRICING_TIERS.map(buildPackDefinition);

export function getPackById(packId: PackId): PackDefinition {
  const pack = PACK_CATALOG.find((entry) => entry.id === packId);
  if (!pack) {
    throw new Error(`[pack-catalog] Unknown pack id: ${packId}`);
  }
  return pack;
}

export function getPackByProductId(productId: string): PackDefinition | null {
  return PACK_CATALOG.find((entry) => entry.productId === productId) ?? null;
}

export function isPackPurchasable(pack: PackDefinition, billingCycle: BillingCycle): boolean {
  if (billingCycle === "one_off") {
    return typeof pack.oneOffPricePence === "number";
  }

  return typeof pack.monthlyPricePence === "number";
}

function applyVat(pence: number, vatDisplayMode: VatDisplayMode): number {
  if (vatDisplayMode === "inc_vat") {
    return Math.round(pence * (1 + UK_VAT_RATE));
  }

  return pence;
}

export function formatPackPrice(
  pack: PackDefinition,
  billingCycle: BillingCycle,
  vatDisplayMode: VatDisplayMode = "ex_vat",
): string {
  const amount = billingCycle === "one_off" ? pack.oneOffPricePence : pack.monthlyPricePence;

  if (typeof amount !== "number") {
    return "TBC";
  }

  const formatted = formatGbpFromPence(applyVat(amount, vatDisplayMode));
  return billingCycle === "monthly" ? `${formatted}/month` : formatted;
}

export function parseBillingCycle(raw: string | null | undefined): BillingCycle {
  return raw === "monthly" ? "monthly" : "one_off";
}

export function parseVatDisplayMode(raw: string | null | undefined): VatDisplayMode {
  return raw === "inc" ? "inc_vat" : "ex_vat";
}

export function parsePackId(raw: string | null | undefined): PackId {
  const normalised = raw?.trim().toLowerCase();
  if (normalised === "starter" || normalised === "pro" || normalised === "enterprise") {
    return normalised;
  }
  return "pro";
}

export function parseOwnedPackIds(raw: string | null | undefined): PackId[] {
  if (!raw) {
    return [];
  }

  const parts = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const ids: PackId[] = [];
  if (parts.includes("starter")) ids.push("starter");
  if (parts.includes("pro")) ids.push("pro");
  if (parts.includes("enterprise")) ids.push("enterprise");
  return ids;
}

function assertLivePackHasCheckoutTarget(catalogue: readonly PackDefinition[]): void {
  for (const pack of catalogue) {
    if (!pack.productId) {
      throw new Error(`[pack-catalog] Live pack ${pack.id} must define a productId.`);
    }

    if (typeof pack.oneOffPricePence !== "number") {
      throw new Error(`[pack-catalog] Live pack ${pack.id} must define a one-off price.`);
    }
  }
}

assertLivePackHasCheckoutTarget(PACK_CATALOG);
