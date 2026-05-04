"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalSponsors: number;
  activeSponsors: number;
  totalVenues: number;
  activeVenues: number;
  totalLeads: number;
  newLeads: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRedemptions: number;
  totalScans: number;
  sponsorRevenue: number;
  totalDeals: number;
  totalCommissions: number;
  payoutsProcessed: number;
  totalVolume: number;
  activeTraders: number;
}

interface Lead { id: string; name: string; company: string | null; type: string; status: string; estimatedValue: number | null; createdAt: string; }
interface Sponsor { id: string; name: string; package: string; status: string; budget: number | null; }
interface Campaign { id: string; name: string; status: string; type: string; impressions: number; clicks: number; redemptions: number; sponsor: { name: string } | null; }

const fmt = (n: number) => n >= 1_000_000
  ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n.toFixed(0)}`;

const STATUS_COLOR: Record<string, string> = {
  new:        "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30",
  contacted:  "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  qualified:  "text-purple-400 bg-purple-400/10 border-purple-400/30",
  converted:  "text-green-400 bg-green-400/10 border-green-400/30",
  lost:       "text-red-400 bg-red-400/10 border-red-400/30",
  prospect:   "text-slate-400 bg-slate-800 border-slate-700",
  active:     "text-green-400 bg-green-400/10 border-green-400/30",
  paused:     "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  closed:     "text-red-400 bg-red-400/10 border-red-400/30",
  draft:      "text-slate-400 bg-slate-800 border-slate-700",
  completed:  "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

export default function AnalyticsPage() {
  const [stats,     setStats]     = useState<Stats | null>(null);
  const [leads,     setLeads]     = useState<Lead[]>([]);
  const [sponsors,  setSponsors]  = useState<Sponsor[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tab,       setTab]       = useState<"overview" | "leads" | "sponsors" | "campaigns">("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/leads?limit=50").then(r => r.json()),
      fetch("/api/sponsors").then(r => r.json()),
      fetch("/api/campaigns").then(r => r.json()),
    ]).then(([s, l, sp, c]) => {
      setStats(s);
      setLeads(Array.isArray(l) ? l : []);
      setSponsors(Array.isArray(sp) ? sp : []);
      setCampaigns(Array.isArray(c) ? c : []);
    }).catch(console.error);
  }, []);

  const pipelineValue = leads.reduce((acc, l) => acc + (l.estimatedValue ?? 0), 0);

  const KPIS = stats ? [
    { label: "Active Sponsors",   value: stats.activeSponsors,         sub: `${stats.totalSponsors} total`,  color: "text-[#d4a017]" },
    { label: "Sponsor Revenue",   value: fmt(stats.sponsorRevenue),    sub: "committed budget",              color: "text-[#FFD700]" },
    { label: "Active Venues",     value: stats.activeVenues,           sub: `${stats.totalVenues} total`,    color: "text-[#00d4ff]" },
    { label: "Open Leads",        value: stats.newLeads,               sub: `${stats.totalLeads} total`,     color: "text-purple-400" },
    { label: "Active Campaigns",  value: stats.activeCampaigns,        sub: `${stats.totalCampaigns} total`, color: "text-green-400" },
    { label: "QR Scans",          value: stats.totalScans,             sub: "all campaigns",                 color: "text-[#00d4ff]" },
    { label: "QR Redemptions",    value: stats.totalRedemptions,       sub: "all time",                      color: "text-[#d4a017]" },
    { label: "Pipeline Value",    value: fmt(pipelineValue),           sub: "est. from leads",               color: "text-purple-400" },
  ] : [];

  const TABS = [
    { id: "overview",   label: "Overview" },
    { id: "leads",      label: `Leads (${leads.length})` },
    { id: "sponsors",   label: `Sponsors (${sponsors.length})` },
    { id: "campaigns",  label: `Campaigns (${campaigns.length})` },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="pt-8 pb-2 space-y-3 text-center relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="pill-gold">TROPTIONS Analytics</span>
          <h1 className="troptions-hero-brand">Platform Intelligence</h1>
          <p className="troptions-hero-subtitle">Revenue · Pipeline · Engagement</p>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Real-time visibility into sponsors, venues, campaigns, redemptions, and sales pipeline.
          </p>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="stat-card">
            <p className={`stat-big ${k.color}`}>{typeof k.value === "number" ? k.value.toLocaleString() : k.value}</p>
            <p className="text-white text-sm font-semibold mt-1">{k.label}</p>
            <p className="text-slate-500 text-xs">{k.sub}</p>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <div className="flex gap-1 border-b border-[#162035] pb-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? "border-[#00d4ff] text-[#00d4ff]" : "border-transparent text-slate-400 hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && stats && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-dark p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#d4a017]">Sponsor Pipeline</h3>
              {(["prospect","active","paused","closed"] as const).map(s => {
                const count = sponsors.filter(x => x.status === s).length;
                const pct   = sponsors.length ? Math.round((count / sponsors.length) * 100) : 0;
                return (
                  <div key={s} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 capitalize">{s}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-[#162035] rounded-full">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[#d4a017] to-[#FFD700]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-dark p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#00d4ff]">Lead Pipeline</h3>
              {(["new","contacted","qualified","converted","lost"] as const).map(s => {
                const count = leads.filter(x => x.status === s).length;
                const pct   = leads.length ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={s} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 capitalize">{s}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-[#162035] rounded-full">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0ea5e9]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-dark p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-green-400">Campaign Performance</h3>
              {campaigns.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{c.name}</p>
                    <p className="text-slate-500">{c.sponsor?.name ?? "No sponsor"}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[#00d4ff] font-bold">{c.redemptions.toLocaleString()}</p>
                    <p className="text-slate-500">redeems</p>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && <p className="text-slate-500 text-xs">No campaigns yet. <Link href="/campaigns" className="text-[#00d4ff] hover:underline">Create one →</Link></p>}
            </div>

            <div className="card-dark p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-purple-400">Recent Leads</h3>
              {leads.slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{l.name}</p>
                    <p className="text-slate-500">{l.company ?? l.type}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_COLOR[l.status] ?? "text-slate-400"}`}>{l.status}</span>
                    {l.estimatedValue ? <p className="text-[#d4a017] font-bold mt-0.5">{fmt(l.estimatedValue)}</p> : null}
                  </div>
                </div>
              ))}
              {leads.length === 0 && <p className="text-slate-500 text-xs">No leads yet. <a href="/contact" className="text-[#00d4ff] hover:underline">Capture one →</a></p>}
            </div>
          </div>
        )}

        {/* Leads Table */}
        {tab === "leads" && (
          <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs">{leads.length} leads in pipeline</p>
            <button
              onClick={() => {
                const rows = [["Name","Company","Type","Status","Est. Value","Date"],
                  ...leads.map(l => [l.name, l.company ?? "", l.type, l.status, l.estimatedValue ? String(l.estimatedValue) : "", new Date(l.createdAt).toLocaleDateString()])];
                const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement("a"); a.href = url; a.download = "troptions-leads.csv"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="btn-troptions text-xs py-1.5">
              ⬇ Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                  <th className="text-left py-2 px-3">Name / Company</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-right py-2 px-3">Est. Value</th>
                  <th className="text-right py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l.id} className="border-b border-[#162035]/50 hover:bg-[#0a0f1e]/60 transition-colors">
                    <td className="py-2 px-3">
                      <p className="text-white font-medium">{l.name}</p>
                      {l.company && <p className="text-slate-500 text-xs">{l.company}</p>}
                    </td>
                    <td className="py-2 px-3 text-slate-400 capitalize">{l.type}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_COLOR[l.status] ?? "text-slate-400"}`}>{l.status}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-[#d4a017] font-semibold">{l.estimatedValue ? fmt(l.estimatedValue) : "—"}</td>
                    <td className="py-2 px-3 text-right text-slate-500 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">No leads in the system yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Sponsors Table */}
        {tab === "sponsors" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                  <th className="text-left py-2 px-3">Sponsor</th>
                  <th className="text-left py-2 px-3">Package</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-right py-2 px-3">Budget</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map(s => (
                  <tr key={s.id} className="border-b border-[#162035]/50 hover:bg-[#0a0f1e]/60 transition-colors">
                    <td className="py-2 px-3 text-white font-medium">{s.name}</td>
                    <td className="py-2 px-3 text-slate-400 capitalize">{s.package}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_COLOR[s.status] ?? "text-slate-400"}`}>{s.status}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-[#d4a017] font-semibold">{s.budget ? fmt(s.budget) : "—"}</td>
                  </tr>
                ))}
                {sponsors.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-500">No sponsors yet. <Link href="/sponsors" className="text-[#00d4ff] hover:underline">Add one →</Link></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Campaigns Table */}
        {tab === "campaigns" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                  <th className="text-left py-2 px-3">Campaign</th>
                  <th className="text-left py-2 px-3">Sponsor</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-right py-2 px-3">Impressions</th>
                  <th className="text-right py-2 px-3">Redemptions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-b border-[#162035]/50 hover:bg-[#0a0f1e]/60 transition-colors">
                    <td className="py-2 px-3">
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-slate-500 text-xs capitalize">{c.type}</p>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{c.sponsor?.name ?? "—"}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_COLOR[c.status] ?? "text-slate-400"}`}>{c.status}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">{c.impressions.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-[#d4a017] font-semibold">{c.redemptions.toLocaleString()}</td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">No campaigns yet. <Link href="/campaigns" className="text-[#00d4ff] hover:underline">Create one →</Link></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
