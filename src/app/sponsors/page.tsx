import AppShell from "@/components/layout/AppShell";
import { SPONSORS } from "@/data/demoData";
import Link from "next/link";

export default function SponsorsPage() {
  return (
    <AppShell
      title="Sponsor Network"
      subtitle="Brand sponsors active across TROPTIONS zones with QR campaigns, concierge presence, and route activations."
      badges={["Demo data"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPONSORS.map((s) => (
          <div key={s.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{s.name}</div>
                <div className="text-xs text-slate-400">{s.industry} · Tier: {s.tier}</div>
              </div>
              <span className="wwai-chip wwai-chip-cyan">{s.status}</span>
            </div>
            <div className="text-sm text-slate-300 mt-3">
              Active campaigns: {s.activeCampaigns} · Monthly value: ${s.monthlyValue.toLocaleString()}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/proposals" className="wwai-btn-primary text-xs">Build Proposal</Link>
              <Link href="/campaigns" className="wwai-btn-ghost text-xs">View Campaigns</Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
