// Proposal helpers
import { ADDON_PRICES, calcContractValue, formatUSD } from "./calculations";
import type { PackageItem, Proposal } from "./types";

export function buildProposalSummary(
  pkg: PackageItem | undefined,
  addonIds: string[],
  termMonths: number
) {
  const calc = calcContractValue({ pkg, addonIds, termMonths });
  return {
    ...calc,
    formatted: {
      setup:  formatUSD(calc.setup),
      annual: formatUSD(calc.annual),
      addons: formatUSD(calc.addons),
      total:  formatUSD(calc.total),
    },
    addonLabels: addonIds.map((id) => ADDON_PRICES[id]?.label || id),
  };
}

export function proposalToText(p: Proposal, pkg?: PackageItem): string {
  return [
    `TROPTIONS Proposal`,
    `------------------`,
    `Customer:     ${p.businessName} (${p.customerType})`,
    `Contact:      ${p.contactName}`,
    `Package:      ${pkg?.name || p.packageId}`,
    `Term:         ${p.termMonths} months`,
    `Setup Fee:    ${formatUSD(p.setupFee)}`,
    `Annual Fee:   ${formatUSD(p.annualFee)}`,
    `Add-ons:      ${p.addons.join(", ") || "none"}`,
    `Total Value:  ${formatUSD(p.totalContractValue)}`,
    ``,
    `Demo proposal — production export requires PDF integration.`,
  ].join("\n");
}
