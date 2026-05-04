"use client";

import { useEffect, useState } from "react";
import { CAMPAIGNS, HOTELS, RESTAURANTS, SPONSORS, ZONES, ALL_PACKAGES } from "@/data/demoData";
import { getLeads, getSubmissions } from "@/lib/demoStorage";
import { conversionRate, formatPct, formatUSD } from "@/lib/calculations";
import StatCard from "@/components/cards/StatCard";

export default function AnalyticsDashboard() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);

  useEffect(() => {
    const subs = getSubmissions();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmissionCount(subs.length);
    setPendingCount(subs.filter((s) => s.status === "pending").length);
    setLeadsCount(getLeads().length);
  }, []);

  const totalScans = CAMPAIGNS.reduce((s, c) => s + c.scans, 0);
  const totalRedemptions = CAMPAIGNS.reduce((s, c) => s + c.redemptions, 0);
  const sponsorRevenue = SPONSORS.reduce((s, x) => s + x.monthlyValue * 12, 0);
  const activeCampaigns = CAMPAIGNS.filter((c) => c.status === "live").length;

  // Pseudo trend (8 buckets)
  const trend = Array.from({ length: 8 }, (_, i) => 30 + Math.round(Math.sin(i / 1.7) * 25 + i * 4 + 10));
  const max = Math.max(...trend);

  const zoneRouteRequests = ZONES.map((z, i) => ({ zone: z, n: 40 - i * 5 + (i % 2 ? 7 : 0) }));

  const pkgDist = ALL_PACKAGES.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Sponsors"          value={SPONSORS.length} hint="active in demo" />
        <StatCard label="Registered Restaurants"  value={RESTAURANTS.length} tone="green" />
        <StatCard label="Registered Hotels"       value={HOTELS.length} tone="cyan" />
        <StatCard label="Active Campaigns"        value={activeCampaigns} tone="gold" />
        <StatCard label="QR Scans"                value={totalScans.toLocaleString()} tone="cyan" />
        <StatCard label="Redemptions"             value={totalRedemptions.toLocaleString()} tone="green" />
        <StatCard label="Conversion Rate"         value={formatPct(conversionRate(totalScans, totalRedemptions))} tone="amber" />
        <StatCard label="Est. Sponsor Revenue"    value={formatUSD(sponsorRevenue)} tone="gold" />
        <StatCard label="Open Leads"              value={leadsCount} tone="cyan" />
        <StatCard label="Pending Registrations"   value={pendingCount} tone="amber" />
        <StatCard label="Total Submissions"       value={submissionCount} />
        <StatCard label="Safety Route Requests"   value={"218 (demo)"} tone="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="wwai-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Revenue Trend</h3>
            <span className="wwai-chip">demo</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {trend.map((v, i) => (
              <div key={i} className="flex-1 bg-cyan-400/30 hover:bg-cyan-400/60 rounded-t" style={{ height: `${(v / max) * 100}%` }} title={`${v}`} />
            ))}
          </div>
        </div>

        <div className="wwai-panel p-5">
          <h3 className="font-bold text-white mb-3">Campaign Performance</h3>
          <div className="space-y-2">
            {CAMPAIGNS.slice(0, 5).map((c) => {
              const pct = c.scans ? Math.min(100, (c.redemptions / c.scans) * 100) : 0;
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{c.name}</span>
                    <span>{c.redemptions}/{c.scans} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-[#0a1220] rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wwai-panel p-5">
          <h3 className="font-bold text-white mb-3">Top Zones — Route Requests</h3>
          <div className="space-y-2">
            {zoneRouteRequests.map((z) => (
              <div key={z.zone}>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{z.zone}</span>
                  <span>{z.n} req</span>
                </div>
                <div className="h-2 bg-[#0a1220] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${(z.n / 47) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wwai-panel p-5">
          <h3 className="font-bold text-white mb-3">Sponsor Package Distribution</h3>
          <div className="space-y-1.5">
            {Object.entries(pkgDist).map(([cat, n]) => (
              <div key={cat} className="flex items-center justify-between text-sm border-b border-[#0d1626] py-1">
                <span className="text-slate-300 capitalize">{cat}</span>
                <span className="text-cyan-300 font-bold">{n} packages</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="disclaimer-bar">All metrics are demo data — production values require live event, CRM, and campaign data.</p>
    </div>
  );
}
