"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface QrEvent { id: string; eventType: string; createdAt: string; }
interface QRCode   { id: string; label: string | null; scans: number; redemptions: number; active: boolean; events: QrEvent[]; }
interface Campaign {
  id: string; name: string; type: string; status: string;
  startDate: string | null; endDate: string | null;
  impressions: number; clicks: number; redemptions: number;
  budget: number | null; description: string | null; createdAt: string;
  sponsor: { id: string; name: string; industry: string | null } | null;
  venue:   { id: string; name: string; city: string; category: string } | null;
  qrCodes: QRCode[];
}

const STATUS_C: Record<string, string> = {
  active:   "text-green-400 border-green-400/30 bg-green-400/10",
  inactive: "text-slate-400 border-slate-700 bg-slate-800",
  pending:  "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  paused:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  completed:"text-blue-400 border-blue-400/30 bg-blue-400/10",
  draft:    "text-slate-400 border-slate-700 bg-slate-800",
};

const TYPE_BADGE: Record<string, string> = {
  qr:      "border-[#00d4ff]/30 text-[#00d4ff] bg-[#00d4ff]/5",
  offer:   "border-[#d4a017]/30 text-[#d4a017] bg-[#d4a017]/5",
  event:   "border-purple-400/30 text-purple-400 bg-purple-400/5",
  digital: "border-blue-400/30 text-blue-400 bg-blue-400/5",
};

const fmtK = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n/1_000).toFixed(0)}K` : `$${n}`;

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Campaign | null>(null);
  const [tab, setTab]   = useState<"overview" | "qr" | "performance">("overview");

  useEffect(() => {
    fetch(`/api/campaigns/${id}`).then(r => r.json()).then(setData).catch(console.error);
  }, [id]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-2">
        <div className="troptions-hex-sm mx-auto">T</div>
        <p className="text-slate-400 text-sm">Loading campaign…</p>
      </div>
    </div>
  );

  const totalScans   = data.qrCodes.reduce((s, q) => s + q.scans, 0);
  const convRate     = data.impressions > 0 ? ((data.redemptions / data.impressions) * 100).toFixed(1) : "0.0";
  const sortedByQr   = [...data.qrCodes].sort((a, b) => b.scans - a.scans);

  const TABS = [
    { id: "overview",    label: "Overview" },
    { id: "qr",         label: `QR Codes (${data.qrCodes.length})` },
    { id: "performance", label: "Performance" },
  ] as const;

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/options" className="hover:text-[#00d4ff] transition-colors">Campaigns</Link>
        <span>/</span>
        <span className="text-white">{data.name}</span>
      </div>

      {/* Header */}
      <section className="card-dark rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-white">{data.name}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_BADGE[data.type] ?? ""}`}>{data.type.toUpperCase()}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_C[data.status] ?? ""}`}>{data.status.toUpperCase()}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {data.sponsor && (
                <Link href={`/sponsors/${data.sponsor.id}`} className="text-[#00d4ff] hover:underline">
                  🏢 {data.sponsor.name}
                </Link>
              )}
              {data.venue && (
                <Link href={`/venues/${data.venue.id}`} className="hover:text-[#00d4ff] transition-colors">
                  📍 {data.venue.name}, {data.venue.city}
                </Link>
              )}
              {data.startDate && <span>📅 {new Date(data.startDate).toLocaleDateString()}{data.endDate ? ` – ${new Date(data.endDate).toLocaleDateString()}` : " →"}</span>}
              {data.budget    && <span>💰 {fmtK(data.budget)} budget</span>}
            </div>
            {data.description && <p className="text-slate-400 text-xs">{data.description}</p>}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Impressions",   value: data.impressions.toLocaleString(),  color: "text-slate-300" },
          { label: "Clicks",        value: data.clicks.toLocaleString(),       color: "text-[#00d4ff]" },
          { label: "Redemptions",   value: data.redemptions.toLocaleString(),  color: "text-[#d4a017]" },
          { label: "QR Scans",      value: totalScans.toLocaleString(),        color: "text-green-400" },
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
              <h3 className="text-[#d4a017] text-xs font-bold uppercase tracking-widest">Campaign Details</h3>
              {[
                ["Type",         data.type],
                ["Status",       data.status],
                ["Start",        data.startDate ? new Date(data.startDate).toLocaleDateString() : "—"],
                ["End",          data.endDate   ? new Date(data.endDate).toLocaleDateString()   : "Ongoing"],
                ["Budget",       data.budget ? fmtK(data.budget) : "Not set"],
                ["Conversion",   `${convRate}%`],
                ["Created",      new Date(data.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-[#162035]/50 pb-1.5 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-medium capitalize">{v}</span>
                </div>
              ))}
            </div>
            <div className="card-dark p-5 space-y-3">
              <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest">Linked Entities</h3>
              {data.sponsor && (
                <Link href={`/sponsors/${data.sponsor.id}`} className="flex items-center gap-3 hover:bg-[#050810] rounded-lg p-2 transition-colors">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{data.sponsor.name}</p>
                    <p className="text-slate-500 text-xs">{data.sponsor.industry ?? "Sponsor"}</p>
                  </div>
                </Link>
              )}
              {data.venue && (
                <Link href={`/venues/${data.venue.id}`} className="flex items-center gap-3 hover:bg-[#050810] rounded-lg p-2 transition-colors">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{data.venue.name}</p>
                    <p className="text-slate-500 text-xs">{data.venue.city} · {data.venue.category}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* QR Codes */}
        {tab === "qr" && (
          <div className="overflow-x-auto">
            {data.qrCodes.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No QR codes in this campaign.</p>}
            {data.qrCodes.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                    <th className="text-left py-2 px-3">Label</th>
                    <th className="text-right py-2 px-3">Scans</th>
                    <th className="text-right py-2 px-3">Redeemed</th>
                    <th className="text-center py-2 px-3">Status</th>
                    <th className="text-right py-2 px-3">Recent Events</th>
                  </tr>
                </thead>
                <tbody>
                  {data.qrCodes.map(q => (
                    <tr key={q.id} className="border-b border-[#162035]/50">
                      <td className="py-2 px-3 text-white text-xs font-medium">{q.label ?? q.id.slice(0, 8)}</td>
                      <td className="py-2 px-3 text-right text-[#00d4ff] font-bold">{q.scans.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-[#d4a017] font-bold">{q.redemptions.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${q.active ? STATUS_C.active : STATUS_C.inactive}`}>
                          {q.active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 text-xs">{q.events.length} logged</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Performance */}
        {tab === "performance" && (
          <div className="space-y-5">
            {/* Conversion bar */}
            <div className="card-dark rounded-xl p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm">Conversion Rate</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#050810] rounded-full h-3 overflow-hidden border border-[#162035]">
                  <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#d4a017] rounded-full transition-all"
                    style={{ width: `${Math.min(100, parseFloat(convRate))}%` }} />
                </div>
                <span className="text-white font-bold text-lg w-16 text-right">{convRate}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-center pt-1">
                <div><p className="text-slate-300 font-bold">{data.impressions.toLocaleString()}</p><p className="text-slate-500">Impressions</p></div>
                <div><p className="text-[#00d4ff] font-bold">{data.clicks.toLocaleString()}</p><p className="text-slate-500">Clicks</p></div>
                <div><p className="text-[#d4a017] font-bold">{data.redemptions.toLocaleString()}</p><p className="text-slate-500">Conversions</p></div>
              </div>
            </div>

            {/* Top QR by scans */}
            <div className="card-dark rounded-xl p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm">Top QR Codes by Activity</h3>
              {sortedByQr.length === 0 && <p className="text-slate-500 text-xs">No data.</p>}
              {sortedByQr.slice(0, 5).map((q, i) => {
                const pct = totalScans > 0 ? (q.scans / totalScans) * 100 : 0;
                return (
                  <div key={q.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">#{i + 1} {q.label ?? q.id.slice(0, 10)}</span>
                      <span className="text-[#00d4ff] font-bold">{q.scans.toLocaleString()} scans</span>
                    </div>
                    <div className="bg-[#050810] rounded-full h-1.5 overflow-hidden border border-[#162035]">
                      <div className="h-full bg-[#00d4ff]/60 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
