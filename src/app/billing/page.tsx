"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Invoice {
  id:              string;
  invoiceNumber:   string;
  amount:          number;
  currency:        string;
  description:     string | null;
  status:          string;
  dueDate:         string | null;
  paidAt:          string | null;
  paymentProvider: string | null;
  createdAt:       string;
  sponsor:  { id: string; name: string } | null;
  proposal: { id: string; campaignType: string; termMonths: number } | null;
}

const STATUS_COLOR: Record<string, string> = {
  draft:   "text-slate-400 border-slate-700 bg-slate-800",
  sent:    "text-blue-400  border-blue-400/30  bg-blue-400/10",
  paid:    "text-green-400 border-green-400/30 bg-green-400/10",
  overdue: "text-red-400   border-red-400/30   bg-red-400/10",
  void:    "text-slate-600 border-slate-800    bg-slate-900",
};

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BillingPage() {
  const [invoices,    setInvoices]    = useState<Invoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api/invoices")
      .then(r => r.json())
      .then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered   = filterStatus === "all" ? invoices : invoices.filter(i => i.status === filterStatus);
  const totalPaid  = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalSent  = invoices.filter(i => i.status === "sent").reduce((sum, i) => sum + i.amount, 0);
  const totalAll   = invoices.reduce((sum, i) => sum + i.amount, 0);

  const isPaymentConfigured = false; // flip to true when SQUARE_ACCESS_TOKEN or STRIPE_SECRET_KEY is set

  return (
    <div className="space-y-8">

      {/* Header */}
      <section className="pt-8 pb-2 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="pill-gold">Billing & Invoicing</span>
            <h1 className="text-3xl font-black text-white">
              <span className="gradient-cyan">Revenue</span> Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Track sponsor invoices, payment status, and collected revenue.</p>
          </div>
          <Link href="/proposals" className="btn-troptions">+ New Invoice via Proposal</Link>
        </div>
      </section>

      {/* Payment Provider Notice */}
      {!isPaymentConfigured && (
        <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
          <span className="text-yellow-400 text-xl shrink-0 mt-0.5">⚠</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Payment provider not configured</p>
            <p className="text-yellow-500/80 text-xs mt-0.5">
              Set <code className="bg-yellow-500/10 px-1 rounded">SQUARE_ACCESS_TOKEN</code> or{" "}
              <code className="bg-yellow-500/10 px-1 rounded">STRIPE_SECRET_KEY</code> in <code className="bg-yellow-500/10 px-1 rounded">.env.local</code> to enable
              live payments. Invoice tracking and manual status updates are fully functional.
            </p>
          </div>
        </section>
      )}

      {/* KPI Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoiced",    value: fmt(totalAll),          color: "text-white" },
          { label: "Collected",         value: fmt(totalPaid),         color: "text-green-400" },
          { label: "Awaiting Payment",  value: fmt(totalSent),         color: "text-[#00d4ff]" },
          { label: "Total Invoices",    value: invoices.length,        color: "text-[#d4a017]" },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <p className={`stat-big ${k.color}`}>{typeof k.value === "number" ? k.value : k.value}</p>
            <p className="text-slate-400 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </section>

      {/* Filter Bar */}
      <section className="flex items-center gap-2 flex-wrap">
        {["all", "draft", "sent", "paid", "overdue", "void"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
              filterStatus === s
                ? "bg-[#00d4ff] text-[#050810]"
                : "bg-[#0a0f1e] border border-[#162035] text-slate-400 hover:text-white"
            }`}>{s === "all" ? `All (${invoices.length})` : s}</button>
        ))}
        <button
          onClick={() => {
            const rows = [["Invoice #","Sponsor","Amount","Status","Due Date","Paid At"],
              ...invoices.map(i => [i.invoiceNumber, i.sponsor?.name ?? "", fmt(i.amount), i.status,
                i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "",
                i.paidAt  ? new Date(i.paidAt).toLocaleDateString()  : ""])];
            const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a"); a.href = url; a.download = "troptions-invoices.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
          className="ml-auto px-3 py-1.5 border border-[#162035] text-slate-400 rounded-lg text-xs font-semibold hover:text-white hover:border-slate-600 transition-colors">
          ⬇ Export CSV
        </button>
      </section>

      {/* Invoice Table */}
      <section className="card-dark rounded-2xl overflow-hidden">
        {loading && <p className="text-center text-slate-500 py-10 text-sm">Loading invoices…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-500 py-10 text-sm">No invoices in this status.</p>
        )}
        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#162035] text-slate-500 text-xs uppercase tracking-widest">
                  <th className="text-left py-3 px-4">Invoice #</th>
                  <th className="text-left py-3 px-4">Sponsor</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Description</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4 hidden md:table-cell">Due</th>
                  <th className="text-right py-3 px-4 hidden lg:table-cell">Paid</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} className="border-b border-[#162035]/50 hover:bg-[#0a0f1e]/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#00d4ff]">{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      {inv.sponsor ? (
                        <Link href={`/sponsors/${inv.sponsor.id}`} className="text-white hover:text-[#00d4ff] transition-colors">
                          {inv.sponsor.name}
                        </Link>
                      ) : <span className="text-slate-500">—</span>}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-slate-400 text-xs max-w-xs truncate">
                      {inv.description ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">{fmt(inv.amount)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLOR[inv.status] ?? ""}`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell text-slate-500 text-xs">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-4 text-right hidden lg:table-cell text-xs">
                      {inv.paidAt
                        ? <span className="text-green-400">{new Date(inv.paidAt).toLocaleDateString()}</span>
                        : <span className="text-slate-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#162035]">
                  <td colSpan={3} className="py-3 px-4 text-slate-500 text-xs">
                    Showing {filtered.length} of {invoices.length} invoices
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    {fmt(filtered.reduce((s, i) => s + i.amount, 0))}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {/* Payment Methods */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: "◼", name: "Square",
            desc: "Accept cards and ACH via Square. Set SQUARE_ACCESS_TOKEN in .env.local.",
            status: "Not configured", color: "border-slate-700",
          },
          {
            icon: "⚡", name: "Stripe",
            desc: "Invoicing, subscriptions, and card payments via Stripe. Set STRIPE_SECRET_KEY.",
            status: "Not configured", color: "border-slate-700",
          },
          {
            icon: "📋", name: "Manual",
            desc: "Track manual payments, checks, and wire transfers. Always available.",
            status: "Active", color: "border-green-500/40",
          },
        ].map(m => (
          <div key={m.name} className={`card-dark rounded-xl p-4 border ${m.color} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{m.icon}</span>
              <span className="text-white font-semibold text-sm">{m.name}</span>
              <span className={`ml-auto text-[10px] font-bold ${m.status === "Active" ? "text-green-400" : "text-slate-500"}`}>{m.status}</span>
            </div>
            <p className="text-slate-500 text-xs">{m.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
