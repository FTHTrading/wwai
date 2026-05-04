"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface QRCode { id: string; label: string | null; scans: number; redemptions: number; active: boolean; }
interface Campaign {
  id: string; name: string; status: string; type: string;
  impressions: number; clicks: number; redemptions: number;
  sponsor: { id: string; name: string } | null;
  qrCodes: QRCode[];
}
interface Lead { id: string; name: string; company: string | null; status: string; estimatedValue: number | null; }
interface Proposal {
  id: string; status: string; termMonths: number;
  sponsor: { name: string } | null;
  package: { name: string; monthlyFee: number } | null;
  createdAt: string;
}
interface Venue {
  id: string; name: string; city: string; address: string | null; category: string;
  capacity: number | null; lat: number | null; lng: number | null; status: string;
  description: string | null; createdAt: string;
  campaigns: Campaign[];
  leads:     Lead[];
  proposals: Proposal[];
}

const STATUS_C: Record<string, string> = {
  active:   "text-green-400 border-green-400/30 bg-green-400/10",
  inactive: "text-slate-400 border-slate-700 bg-slate-800",
  pending:  "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  draft:    "text-slate-400 border-slate-700 bg-slate-800",
  sent:     "text-blue-400 border-blue-400/30 bg-blue-400/10",
  accepted: "text-green-400 border-green-400/30 bg-green-400/10",
};

const CAT_ICON: Record<string, string> = {
  stadium:    "🏟",
  airport:    "✈",
  transit:    "🚇",
  hotel:      "🏨",
  university: "🎓",
  retail:     "🛍",
  restaurant: "🍽",
  bar:        "🍺",
  arena:      "🏀",
  mall:       "🏬",
};

const fmtK = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n/1_000).toFixed(0)}K` : `$${n}`;

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Venue | null>(null);
  const [tab, setTab]   = useState<"overview" | "campaigns" | "qr" | "proposals">("overview");

  useEffect(() => {
    fetch(`/api/venues/${id}`).then(r => r.json()).then(setData).catch(console.error);
  }, [id]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-2">
        <div className="troptions-hex-sm mx-auto">T</div>
        <p className="text-slate-400 text-sm">Loading venue…</p>
      </div>
    </div>
  );

  const icon           = CAT_ICON[data.category] ?? "📍";
  const allQrCodes     = data.campaigns.flatMap(c => c.qrCodes);
  const totalScans     = allQrCodes.reduce((s, q) => s + q.scans, 0);
  const totalRedeems   = allQrCodes.reduce((s, q) => s + q.redemptions, 0);
  const activeSponsors = new Set(data.campaigns.filter(c => c.status === "active" && c.sponsor).map(c => c.sponsor!.id)).size;

  const TABS = [
    { id: "overview",   label: "Overview" },
    { id: "campaigns",  label: `Campaigns (${data.campaigns.length})` },
    { id: "qr",         label: `QR Codes (${allQrCodes.length})` },
    { id: "proposals",  label: `Proposals (${data.proposals.length})` },
  ] as const;

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/map" className="hover:text-[#00d4ff] transition-colors">Venues</Link>
        <span>/</span>
        <span className="text-white">{data.name}</span>
      </div>

      {/* Header */}
      <section className="card-dark rounded-2xl p-6 flex flex-wrap items-start gap-5">
        <div className="w-16 h-16 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-3xl shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white">{data.name}</h1>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_C[data.status] ?? ""}`}>{data.status.toUpperCase()}</span>
            <span className="text-xs capitalize border border-[#162035] text-slate-400 px-2 py-0.5 rounded">{data.category}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>📍 {data.city}{data.address ? ` · ${data.address}` : ""}</span>
            {data.capacity && <span>👥 {data.capacity.toLocaleString()} capacity</span>}
            {data.lat != null && data.lng != null && <span className="font-mono">{data.lat.toFixed(4)}, {data.lng.toFixed(4)}</span>}
          </div>
          {data.description && <p className="text-slate-400 text-xs">{data.description}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/proposals?venue=${data.id}`} className="btn-troptions text-xs py-1.5">📋 Create Proposal</Link>
          <Link href="/map" className="px-3 py-1.5 border border-[#162035] text-slate-300 rounded-lg text-xs font-semibold hover:border-[#00d4ff]/40 transition-colors">
            🗺 View Map
          </Link>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Campaigns",       value: data.campaigns.length,         color: "text-[#00d4ff]" },
          { label: "Active Sponsors", value: activeSponsors,                 color: "text-[#d4a017]" },
          { label: "Total QR Scans",  value: totalScans.toLocaleString(),    color: "text-green-400" },
          { label: "Redemptions",     value: totalRedeems.toLocaleString(),  color: "text-purple-400" },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <p className={`stat-big ${k.color}`}>{k.value}</p>
            <p className="text-white text-xs font-semibold mt-1">{k.label}</p>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <div className="flex gap-1 border-b border-[#162035]">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? "border-[#00d4ff] text-[#00d4ff]" : "border-transparent text-slate-400 hover:text-white"
              }`}>{t.label}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card-dark p-5 space-y-3">
              <h3 className="text-[#d4a017] text-xs font-bold uppercase tracking-widest">Venue Info</h3>
              {[
                ["Category",  data.category],
                ["City",      data.city],
                ["Address",   data.address ?? "—"],
                ["Capacity",  data.capacity ? data.capacity.toLocaleString() : "—"],
                ["Status",    data.status],
                ["Added",     new Date(data.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-[#162035]/50 pb-1.5 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-medium capitalize">{v}</span>
                </div>
              ))}
            </div>
            <div className="card-dark p-5 space-y-3">
              <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest">Active Proposals</h3>
              {data.proposals.length === 0 && <p className="text-slate-500 text-xs">No proposals yet.</p>}
              {data.proposals.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs border-b border-[#162035]/50 pb-1.5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{p.sponsor?.name ?? "Unassigned"}</p>
                    <p className="text-slate-500">{p.package?.name ?? "Custom"} · {p.termMonths}mo</p>
                  </div>
                  <div className="text-right">
                    {p.package && <p className="text-green-400 font-bold">{fmtK(p.package.monthlyFee * p.termMonths)}</p>}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${STATUS_C[p.status] ?? ""}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns */}
        {tab === "campaigns" && (
          <div className="space-y-3">
            {data.campaigns.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No campaigns at this venue.</p>}
            {data.campaigns.map(c => (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="block card-dark rounded-xl p-4 hover:border-[#00d4ff]/30 border border-transparent transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm">{c.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${STATUS_C[c.status] ?? ""}`}>{c.status}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500">
                      {c.sponsor && <Link href={`/sponsors/${c.sponsor.id}`} className="text-[#00d4ff] hover:underline" onClick={e => e.stopPropagation()}>{c.sponsor.name}</Link>}
                      <span className="capitalize">🎯 {c.type}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div><p className="text-white font-bold">{c.impressions.toLocaleString()}</p><p className="text-slate-500">Impressions</p></div>
                    <div><p className="text-[#d4a017] font-bold">{c.redemptions.toLocaleString()}</p><p className="text-slate-500">Redeemed</p></div>
                    <div><p className="text-[#00d4ff] font-bold">{c.qrCodes.reduce((s, q) => s + q.scans, 0).toLocaleString()}</p><p className="text-slate-500">QR Scans</p></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* QR Codes */}
        {tab === "qr" && (
          <div className="overflow-x-auto">
            {allQrCodes.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No QR codes deployed at this venue.</p>}
            {allQrCodes.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                    <th className="text-left py-2 px-3">Label</th>
                    <th className="text-right py-2 px-3">Scans</th>
                    <th className="text-right py-2 px-3">Redemptions</th>
                    <th className="text-center py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allQrCodes.map(q => (
                    <tr key={q.id} className="border-b border-[#162035]/50">
                      <td className="py-2 px-3 text-white text-xs">{q.label ?? q.id.slice(0, 8)}</td>
                      <td className="py-2 px-3 text-right text-[#00d4ff] font-bold">{q.scans.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-[#d4a017] font-bold">{q.redemptions.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${q.active ? STATUS_C.active : STATUS_C.inactive}`}>
                          {q.active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Proposals */}
        {tab === "proposals" && (
          <div className="space-y-3">
            {data.proposals.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No proposals for this venue.</p>}
            {data.proposals.map(p => (
              <div key={p.id} className="card-dark rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-sm">{p.sponsor?.name ?? "Unassigned"}</p>
                  <p className="text-slate-500 text-xs">{p.package?.name ?? "Custom"} · {p.termMonths} months</p>
                </div>
                <div className="text-right">
                  {p.package && <p className="text-green-400 font-bold">{fmtK(p.package.monthlyFee * p.termMonths)}</p>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_C[p.status] ?? ""}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
