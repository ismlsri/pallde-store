export const MULTIPLIERS = {
  list: 6,
  sale: 5,
  wholesale: 3,
  bulk: 2.5,
} as const;

export const THRESHOLDS = {
  wholesale: 15000,
  bulk: 100000,
} as const;

export type PriceTier = "sale" | "wholesale" | "bulk";

export interface Prices {
  cost: number;
  listPrice: number;
  salePrice: number;
  wholesalePrice: number;
  bulkPrice: number;
}

export function getPrices(cost: number): Prices {
  return {
    cost,
    listPrice: Math.round(cost * MULTIPLIERS.list),
    salePrice: Math.round(cost * MULTIPLIERS.sale),
    wholesalePrice: Math.round(cost * MULTIPLIERS.wholesale),
    bulkPrice: Math.round(cost * MULTIPLIERS.bulk),
  };
}

export function getTier(cartTotal: number): PriceTier {
  if (cartTotal >= THRESHOLDS.bulk) return "bulk";
  if (cartTotal >= THRESHOLDS.wholesale) return "wholesale";
  return "sale";
}

export function getActivePrice(cost: number, tier: PriceTier): number {
  const p = getPrices(cost);
  if (tier === "bulk") return p.bulkPrice;
  if (tier === "wholesale") return p.wholesalePrice;
  return p.salePrice;
}

export function fmt(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

export const TIER_LABELS: Record<PriceTier, string> = {
  sale: "Standart Fiyat",
  wholesale: "Toptan Fiyat",
  bulk: "Toplu Sipariş (Tahmini)",
};

export const TIER_COLORS: Record<PriceTier, string> = {
  sale: "text-primary",
  wholesale: "text-blue-600",
  bulk: "text-purple-600",
};
