import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_PRODUCT_ID,
  WORKFLOW_COUNT,
  formatGbpFromPence,
  getMjmlPackPricePence,
} from "@/lib/pack";
import { TEMPLATE_CONFIG } from "@/config/template";

export type PackId = "pack-1";
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

export const PACK_CATALOG: readonly PackDefinition[] = [
  {
    id: "pack-1",
    productId: MJML_PACK_PRODUCT_ID,
    name: TEMPLATE_CONFIG.productName,
    shortDescription:
      "The complete downloadable MJML library for developers who want the whole system in one place.",
    status: "live",
    oneOffPricePence: getMjmlPackPricePence(),
    monthlyPricePence: null,
    componentCount: COMPONENT_COUNT,
    layoutCount: LAYOUT_COUNT,
    workflowCount: WORKFLOW_COUNT,
  },
] as const;

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
  return raw?.trim().toLowerCase() === "pack-1" ? "pack-1" : "pack-1";
}

export function parseOwnedPackIds(raw: string | null | undefined): PackId[] {
  if (!raw) {
    return [];
  }

  const parts = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return parts.includes("pack-1") ? ["pack-1"] : [];
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
