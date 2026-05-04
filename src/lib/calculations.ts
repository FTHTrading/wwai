// Pricing + analytics helpers (demo math)
import type { PackageItem } from "./types";

export const ADDON_PRICES: Record<string, { label: string; annual: number }> = {
  qr_offer:           { label: "QR Offer Campaign",        annual: 1200 },
  premium_map:        { label: "Premium Map Placement",    annual: 1800 },
  multilingual:       { label: "Multilingual Profile",     annual: 600 },
  safety_route:       { label: "Safety Route Inclusion",   annual: 950 },
  ai_concierge:       { label: "AI Concierge Placement",   annual: 1500 },
  analytics_report:   { label: "Analytics Reporting",      annual: 800 },
};

export function calcAddonTotal(addonIds: string[]): number {
  return addonIds.reduce((sum, id) => sum + (ADDON_PRICES[id]?.annual || 0), 0);
}

export function calcContractValue(opts: {
  pkg?: PackageItem;
  addonIds: string[];
  termMonths: number;
}): { setup: number; annual: number; addons: number; total: number } {
  const setup  = opts.pkg?.setupFee || 0;
  const annual = opts.pkg?.price || 0;
  const addons = calcAddonTotal(opts.addonIds);
  const years  = Math.max(1, opts.termMonths) / 12;
  const total  = setup + annual * years + addons * years;
  return { setup, annual, addons, total };
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function conversionRate(scans: number, redemptions: number): number {
  if (!scans) return 0;
  return redemptions / scans;
}
