"use client";

import { useEffect, useState } from "react";
import { getProposals } from "@/lib/demoStorage";
import { ALL_PACKAGES } from "@/data/demoData";
import { formatUSD } from "@/lib/calculations";

const PROVIDERS = [
  { id: "square",  label: "Square",         status: "Not configured" as const },
  { id: "stripe",  label: "Stripe",         status: "Not configured" as const },
  { id: "manual",  label: "Manual invoice", status: "Active"         as const },
];

export default function BillingConsole() {
  const [proposalCount, setProposalCount] = useState(0);
  const [mrr, setMrr] = useState(0);
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    const p = getProposals();
    const monthly = p.reduce((sum, x) => sum + (x.annualFee || 0) / 12, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProposalCount(p.length);
    setMrr(monthly);
    setPaid(Math.round(monthly * 0.6));
  }, []);

  const baseMrr = ALL_PACKAGES.slice(0, 6).reduce((s, p) => s + p.price / 12, 0);
  const totalMrr = mrr + baseMrr;
  const pending = Math.round(totalMrr * 0.25);
  const overdue = Math.round(totalMrr * 0.1);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile label="Demo Invoices" value={proposalCount + 6} />
        <Tile label="Paid (demo)"   value={formatUSD(paid + Math.round(baseMrr * 0.5))} tone="green" />
        <Tile label="Pending"       value={formatUSD(pending)} tone="amber" />
        <Tile label="Overdue"       value={formatUSD(overdue)} tone="red" />
        <Tile label="MRR"           value={formatUSD(totalMrr)} tone="cyan" />
        <Tile label="Annualized"    value={formatUSD(totalMrr * 12)} tone="gold" />
        <Tile label="Setup Fees YTD" value={formatUSD(12500)} />
        <Tile label="Open Proposals" value={proposalCount} tone="cyan" />
      </div>

      <div className="wwai-panel p-5">
        <h3 className="font-bold text-white mb-3">Payment Provider Readiness</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {PROVIDERS.map((p) => {
            const active = p.status === "Active";
            return (
              <div key={p.id} className="wwai-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">{p.label}</div>
                  <span className={`wwai-chip ${active ? "wwai-chip-green" : "wwai-chip-amber"}`}>{p.status}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={!active}
                    className={active ? "wwai-btn-primary text-xs" : "wwai-btn-disabled text-xs"}
                    title={active ? "" : "Provider integration required"}
                  >
                    Create Payment Link
                  </button>
                  <button className="wwai-btn-ghost text-xs">Record Manual Payment</button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="disclaimer-bar mt-3">No real payments are processed in demo mode. Configure Square/Stripe to enable production billing.</p>
      </div>
    </div>
  );
}

function Tile({ label, value, tone = "cyan" }: { label: string; value: string | number; tone?: "cyan"|"gold"|"green"|"amber"|"red" }) {
  const map = { cyan: "text-cyan-400", gold: "text-amber-300", green: "text-emerald-400", amber: "text-amber-400", red: "text-rose-400" };
  return (
    <div className="wwai-card p-4">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-xl font-extrabold mt-1 ${map[tone]}`}>{value}</div>
    </div>
  );
}
