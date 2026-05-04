import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/cards/StatCard";
import { CAMPAIGNS } from "@/data/demoData";
import { conversionRate, formatPct } from "@/lib/calculations";

export default function CampaignsPage() {
  const totalScans = CAMPAIGNS.reduce((s, c) => s + c.scans, 0);
  const totalRedemptions = CAMPAIGNS.reduce((s, c) => s + c.redemptions, 0);
  const avgConv = formatPct(totalScans > 0 ? totalRedemptions / totalScans : 0);

  return (
    <AppShell
      title="Active Campaigns"
      subtitle="Live and scheduled campaigns across QR offers, citywide activations, hotel routes, and audience segments."
      badges={["Demo data"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active campaigns" value={CAMPAIGNS.filter((c) => c.status === "live").length} />
        <StatCard label="Total scans" value={totalScans.toLocaleString()} />
        <StatCard label="Redemptions" value={totalRedemptions.toLocaleString()} />
        <StatCard label="Avg conversion" value={avgConv} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMPAIGNS.map((c) => (
          <div key={c.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-xs text-slate-400">{c.type} · {c.zone}</div>
              </div>
              <span className={`wwai-chip ${c.status === "live" ? "wwai-chip-cyan" : c.status === "scheduled" ? "wwai-chip-gold" : ""}`}>{c.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-3 text-center">
              <Mini label="Scans" value={c.scans} />
              <Mini label="Redeem" value={c.redemptions} />
              <Mini label="Conv" value={formatPct(conversionRate(c.scans, c.redemptions))} />
            </div>
            <div className="text-xs text-slate-400 mt-3">Sponsor: {c.sponsorId}</div>
            <div className="text-xs text-amber-300 mt-1">Est. value: ${c.estimatedValue.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-[#0a1220] border border-[#162035] py-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}
