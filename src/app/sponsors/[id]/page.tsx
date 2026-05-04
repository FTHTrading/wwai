"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Campaign {
  id: string; name: string; status: string; type: string;
  impressions: number; clicks: number; redemptions: number;
  venue: { id: string; name: string } | null;
  qrCodes: { id: string; label: string | null; scans: number; redemptions: number }[];
}
interface Lead {
  id: string; name: string; company: string | null; status: string; estimatedValue: number | null; createdAt: string;
}
interface Proposal {
  id: string; status: string; termMonths: number; customBudget: number | null;
  package: { name: string; monthlyFee: number } | null;
  createdAt: string;
}
interface Invoice {
  id: string; invoiceNumber: string; amount: number; status: string; dueDate: string | null; paidAt: string | null;
}
interface Sponsor {
  id: string; name: string; contactName: string | null; contactEmail: string | null; contactPhone: string | null;
  package: string; status: string; budget: number | null; industry: string | null; website: string | null; notes: string | null;
  createdAt: string;
  campaigns: Campaign[];
  leads:     Lead[];
  proposals: Proposal[];
  invoices:  Invoice[];
  _count: { campaigns: number; leads: number };
}

const STATUS_C: Record<string, string> = {
  prospect:  "text-slate-400 border-slate-700 bg-slate-800",
  active:    "text-green-400 border-green-400/30 bg-green-400/10",
  onboarded: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  paused:    "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  closed:    "text-red-400 border-red-400/30 bg-red-400/10",
  paid:      "text-green-400 border-green-400/30 bg-green-400/10",
  sent:      "text-blue-400 border-blue-400/30 bg-blue-400/10",
  draft:     "text-slate-400 border-slate-700 bg-slate-800",
  accepted:  "text-green-400 border-green-400/30 bg-green-400/10",
};

const fmt  = (n: number) => `$${n.toLocaleString()}`;
const fmtK = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n/1_000).toFixed(0)}K` : `$${n}`;

export default function SponsorDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const [data, setData] = useState<Sponsor | null>(null);
  const [tab, setTab]   = useState<"overview" | "campaigns" | "leads" | "billing">("overview");

  useEffect(() => {
    fetch(`/api/sponsors/${id}`).then(r => r.json()).then(setData).catch(console.error);
  }, [id]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-2">
        <div className="troptions-hex-sm mx-auto">T</div>
        <p className="text-slate-400 text-sm">Loading sponsor…</p>
      </div>
    </div>
  );

  const totalQrScans     = data.campaigns.reduce((s, c) => s + c.qrCodes.reduce((q, r) => q + r.scans, 0), 0);
  const totalRedemptions = data.campaigns.reduce((s, c) => s + c.redemptions, 0);
  const totalRevenue     = data.invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPipeline    = data.proposals.reduce((s, p) => {
    const monthly = p.package?.monthlyFee ?? 0;
    return s + monthly * p.termMonths;
  }, 0);

  const TABS = [
    { id: "overview",  label: `Overview` },
    { id: "campaigns", label: `Campaigns (${data.campaigns.length})` },
    { id: "leads",     label: `Leads (${data.leads.length})` },
    { id: "billing",   label: `Billing (${data.invoices.length})` },
  ] as const;

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/sponsors" className="hover:text-[#00d4ff] transition-colors">Partners</Link>
        <span>/</span>
        <span className="text-white">{data.name}</span>
      </div>

      {/* Profile Header */}
      <section className="card-dark rounded-2xl p-6 flex flex-wrap items-start gap-6">
        <div className="w-16 h-16 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-2xl font-black text-[#00d4ff] shrink-0">
          {data.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white">{data.name}</h1>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_C[data.status] ?? ""}`}>
              {data.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 capitalize border border-[#162035] px-2 py-0.5 rounded">{data.package}</span>
          </div>
          {data.industry && <p className="text-slate-400 text-sm">{data.industry}</p>}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {data.contactName  && <span>👤 {data.contactName}</span>}
            {data.contactEmail && <a href={`mailto:${data.contactEmail}`} className="hover:text-[#00d4ff] transition-colors">✉ {data.contactEmail}</a>}
            {data.contactPhone && <a href={`tel:${data.contactPhone}`}   className="hover:text-[#00d4ff] transition-colors">📞 {data.contactPhone}</a>}
            {data.website      && <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4ff] transition-colors">🌐 {data.website}</a>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/sales?lead=${data.id}`} className="btn-troptions text-xs py-1.5">📞 Contact</Link>
          <Link href={`/proposals?sponsor=${data.id}`} className="px-3 py-1.5 border border-[#162035] text-slate-300 rounded-lg text-xs font-semibold hover:border-[#00d4ff]/40 transition-colors">
            📋 Proposal
          </Link>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "QR Scans",      value: totalQrScans.toLocaleString(),   color: "text-[#00d4ff]" },
          { label: "Redemptions",   value: totalRedemptions.toLocaleString(), color: "text-[#d4a017]" },
          { label: "Revenue Paid",  value: fmtK(totalRevenue),              color: "text-green-400" },
          { label: "Pipeline",      value: fmtK(totalPipeline),             color: "text-purple-400" },
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
              <h3 className="text-[#d4a017] text-xs font-bold uppercase tracking-widest">Sponsor Details</h3>
              {[
                ["Budget",    data.budget ? fmt(data.budget) : "Not set"],
                ["Package",   data.package],
                ["Status",    data.status],
                ["Industry",  data.industry  ?? "—"],
                ["Since",     new Date(data.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-[#162035]/50 pb-1.5 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-medium capitalize">{v}</span>
                </div>
              ))}
              {data.notes && (
                <div className="pt-1">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-slate-300 text-xs">{data.notes}</p>
                </div>
              )}
            </div>
            <div className="card-dark p-5 space-y-3">
              <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest">Proposals</h3>
              {data.proposals.length === 0 && <p className="text-slate-500 text-xs">No proposals yet.</p>}
              {data.proposals.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs border-b border-[#162035]/50 pb-1.5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{p.package?.name ?? "Custom"}</p>
                    <p className="text-slate-500">{p.termMonths} months · {new Date(p.createdAt).toLocaleDateString()}</p>
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
            {data.campaigns.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No campaigns yet.</p>}
            {data.campaigns.map(c => (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="block card-dark rounded-xl p-4 hover:border-[#00d4ff]/30 border border-transparent transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm">{c.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${STATUS_C[c.status] ?? ""}`}>{c.status}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500">
                      {c.venue && <span>📍 {c.venue.name}</span>}
                      <span className="capitalize">🎯 {c.type}</span>
                      <span>📟 {c.qrCodes.length} QR codes</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { label: "Impressions",  value: c.impressions.toLocaleString(),  color: "text-slate-300" },
                      { label: "Redemptions",  value: c.redemptions.toLocaleString(),  color: "text-[#d4a017]" },
                      { label: "QR Scans",     value: c.qrCodes.reduce((s, q) => s + q.scans, 0).toLocaleString(), color: "text-[#00d4ff]" },
                    ].map(s => (
                      <div key={s.label}>
                        <p className={`font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-[10px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Leads */}
        {tab === "leads" && (
          <div className="space-y-2">
            {data.leads.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No leads linked to this sponsor.</p>}
            {data.leads.map(l => (
              <div key={l.id} className="card-dark rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-semibold text-sm">{l.name}</p>
                  <p className="text-slate-500 text-xs">{l.company ?? "—"} · {new Date(l.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {l.estimatedValue && <span className="text-[#d4a017] font-bold text-sm">{fmtK(l.estimatedValue)}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_C[l.status] ?? ""}`}>{l.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Billing */}
        {tab === "billing" && (
          <div className="overflow-x-auto">
            {data.invoices.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No invoices yet.</p>}
            {data.invoices.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                    <th className="text-left py-2 px-3">Invoice #</th>
                    <th className="text-right py-2 px-3">Amount</th>
                    <th className="text-center py-2 px-3">Status</th>
                    <th className="text-right py-2 px-3">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map(i => (
                    <tr key={i.id} className="border-b border-[#162035]/50">
                      <td className="py-2 px-3 font-mono text-[#00d4ff] text-xs">{i.invoiceNumber}</td>
                      <td className="py-2 px-3 text-right font-bold text-white">{fmt(i.amount)}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_C[i.status] ?? ""}`}>{i.status}</span>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 text-xs">
                        {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#162035]">
                    <td colSpan={2} className="py-2 px-3 text-slate-500 text-xs">Total</td>
                    <td className="py-2 px-3 text-right font-bold text-white">
                      {fmt(data.invoices.reduce((s, i) => s + i.amount, 0))}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
