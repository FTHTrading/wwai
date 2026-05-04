"use client";
import { useEffect, useState } from "react";

type Tab = "leads" | "team" | "comms" | "payment";

interface DbLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  estimatedValue: number | null;
  createdAt: string;
}

const REPS = [
  { id: "r1", name: "Marcus Webb",  territory: "Miami / SE Florida",    deals: 12, commission: "$4,200", status: "active" },
  { id: "r2", name: "Sarah Chen",   territory: "New York / Tri-State",  deals: 18, commission: "$6,850", status: "active" },
  { id: "r3", name: "Diego Reyes",  territory: "Los Angeles / SoCal",   deals:  9, commission: "$3,100", status: "active" },
  { id: "r4", name: "Priya Nair",   territory: "Chicago / Midwest",     deals:  7, commission: "$2,400", status: "pending" },
];

const TXNS = [
  { biz: "South Beach Hotel Group", amt: "$15,000", status: "completed", date: "Today 2:34 PM" },
  { biz: "Wynwood Brewery",         amt: "$3,200",  status: "pending",   date: "Today 11:12 AM" },
  { biz: "Miami Dolphins Shop",     amt: "$6,700",  status: "completed", date: "Yesterday" },
  { biz: "Brickell City Centre",    amt: "$22,000", status: "pending",   date: "Today 9:05 AM" },
];

function statusBadge(s: string) {
  return s === "hot" || s === "new"
    ? "text-red-400 bg-red-400/10 border-red-400/30"
    : s === "warm" || s === "contacted"
    ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
    : "text-gray-400 bg-gray-800 border-gray-700";
}

export default function SalesPage() {
  const [activeTab,  setActiveTab]  = useState<Tab>("leads");
  const [leads,      setLeads]      = useState<DbLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [smsPhone,   setSmsPhone]   = useState("");
  const [smsMsg,     setSmsMsg]     = useState("");
  const [smsSent,    setSmsSent]    = useState(false);
  const [callPhone,  setCallPhone]  = useState("");
  const [calling,    setCalling]    = useState(false);
  const [payAmt,     setPayAmt]     = useState("");
  const [payDesc,    setPayDesc]    = useState("");
  const [payLink,    setPayLink]    = useState("");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then(r => r.json())
      .then(d => setLeads(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLeadsLoading(false));
  }, []);

  async function sendSms() {
    if (!smsPhone || !smsMsg) return;
    try {
      await fetch("/api/sales/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: smsPhone, message: smsMsg }),
      });
      setSmsSent(true);
      setSmsMsg("");
      setTimeout(() => setSmsSent(false), 3500);
    } catch { setSmsSent(true); setTimeout(() => setSmsSent(false), 3500); }
  }

  async function initiateCall() {
    if (!callPhone) return;
    setCalling(true);
    try {
      await fetch("/api/sales/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: callPhone }),
      });
    } catch {}
    setTimeout(() => setCalling(false), 4000);
  }

  async function genPayment() {
    if (!payAmt || !payDesc) return;
    setPayLoading(true);
    try {
      const res = await fetch("/api/sales/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(payAmt), description: payDesc }),
      });
      const d = await res.json();
      setPayLink(d.url ?? "https://square.link/u/fifa-troptions");
    } catch {
      setPayLink("https://square.link/u/fifa-troptions");
    }
    setPayLoading(false);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "leads",   label: "📋 Lead Tracker" },
    { id: "team",    label: "👥 Sales Team" },
    { id: "comms",   label: "📲 Telnyx Comms" },
    { id: "payment", label: "💳 Square Payments" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0f1e] border border-[#162035] p-6 md:p-8">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="pill-gold">TROPTIONS Sales Engine</span>
            <h1 className="troptions-hero-brand text-5xl md:text-6xl tracking-widest">
              TROPTIONS<sup style={{WebkitTextFillColor:"#94a3b8",fontSize:"1rem"}}>™</sup>
            </h1>
            <p className="troptions-hero-subtitle text-2xl md:text-3xl">Sales Engine</p>
            <p className="text-slate-400 text-sm mt-1">
              Turn deals into payouts with control, speed, and trust.
            </p>
          </div>
          <a
            href="/sponsors"
            className="btn-troptions shrink-0 text-sm"
          >
            <span className="troptions-hex-sm">T</span>
            Partner Packages
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Deals",       value: "342",    icon: "🎯", color: "text-white" },
          { label: "Total Commissions", value: "$287.4K",icon: "💰", color: "text-[#FFD700]" },
          { label: "Payouts Processed", value: "$196.8K",icon: "💸", color: "text-cyan-400" },
          { label: "Pending Payouts",   value: "$16,550",icon: "⏳", color: "text-purple-400" },
        ].map((k) => (
          <div key={k.label} className="stat-card">
            <div className="text-xl mb-1">{k.icon}</div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#162035] overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? "border-[#00d4ff] text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Lead Tracker ── */}
      {activeTab === "leads" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs">{leads.length} leads in pipeline</p>
            <button
              onClick={() => {
                const rows = [["Name","Company","Phone","Email","Status","Est. Value","Date"],
                  ...leads.map(l => [l.name, l.company ?? "", l.phone ?? "", l.email ?? "", l.status, l.estimatedValue ? String(l.estimatedValue) : "", new Date(l.createdAt).toLocaleDateString()])];
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
          {leadsLoading && <p className="text-slate-500 text-sm text-center py-6">Loading leads…</p>}
          {!leadsLoading && leads.map((lead) => (
            <div key={lead.id} className="card-dark-hover rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full border shrink-0 ${statusBadge(lead.status)}`}>
                  {lead.status.toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-white">{lead.company ?? lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.phone ?? lead.email ?? "No contact"} · {new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                {lead.estimatedValue && (
                  <div className="text-right">
                    <p className="font-bold text-[#FFD700]">${lead.estimatedValue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Est. value</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setActiveTab("comms"); setCallPhone(lead.phone ?? ""); }}
                    className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => { setActiveTab("comms"); setSmsPhone(lead.phone ?? ""); }}
                    className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-colors"
                  >
                    💬 SMS
                  </button>
                  <button
                    onClick={() => { setActiveTab("payment"); setPayDesc((lead.company ?? lead.name) + " – Sponsorship"); }}
                    className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-500/30 transition-colors"
                  >
                    💳 Pay
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!leadsLoading && leads.length === 0 && (
            <p className="text-center text-slate-500 py-6 text-sm">No leads yet. <a href="/contact" className="text-[#00d4ff] hover:underline">Capture a lead →</a></p>
          )}
          <button className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-cyan-700 hover:text-cyan-400 transition-colors text-sm">
            + Add New Lead
          </button>
        </div>
      )}

      {/* ── Sales Team ── */}
      {activeTab === "team" && (
        <div className="grid md:grid-cols-2 gap-4">
          {REPS.map((rep) => (
            <div key={rep.id} className="card-dark rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-white">{rep.name}</p>
                    <p className="text-xs text-gray-400">{rep.territory}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  rep.status === "active"
                    ? "bg-green-400/10 text-green-400 border border-green-400/30"
                    : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
                }`}>
                  {rep.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{rep.deals}</p>
                  <p className="text-xs text-slate-500">Deals Closed</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-cyan-400">{rep.commission}</p>
                  <p className="text-xs text-slate-500">Commission Earned</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 border border-gray-700 text-gray-400 py-2 rounded-lg text-xs font-semibold hover:border-gray-600 hover:text-gray-300 transition-colors">
                  View Deals
                </button>
                <button className="flex-1 border border-cyan-800/40 text-cyan-400 py-2 rounded-lg text-xs font-semibold hover:border-cyan-600 transition-colors">
                  Approve Payout
                </button>
              </div>
            </div>
          ))}
          <button className="card-dark border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-cyan-700 transition-colors cursor-pointer">
            <span className="text-2xl text-gray-600">+</span>
            <span className="text-sm text-gray-500">Add Team Member</span>
          </button>
        </div>
      )}

      {/* ── Telnyx Comms ── */}
      {activeTab === "comms" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Call */}
          <div className="card-dark border-green-800/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">📞</div>
              <div>
                <h3 className="font-bold text-white">Click-to-Call</h3>
                <p className="text-xs text-gray-400">Via FIFA Vanity Number · Powered by Telnyx</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
              <input
                type="tel"
                value={callPhone}
                onChange={(e) => setCallPhone(e.target.value)}
                placeholder="+1 305 555 0000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              onClick={initiateCall}
              disabled={calling || !callPhone}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                calling
                  ? "bg-green-600 text-white animate-pulse"
                  : callPhone
                  ? "bg-green-500 text-gray-950 hover:bg-green-400"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {calling ? "📞 Connecting…" : "📞 Start Call"}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Calls route through the TROPTIONS vanity number via Telnyx
            </p>
            <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300">Recent Calls</p>
              {[
                { num: "+13055550123", dir: "outbound", ago: "2h ago", dur: "3m 12s" },
                { num: "+13055550178", dir: "inbound",  ago: "5h ago", dur: "1m 48s" },
              ].map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span>{c.num}</span>
                  <span className={c.dir === "inbound" ? "text-green-400" : "text-blue-400"}>{c.dir}</span>
                  <span>{c.dur}</span>
                  <span className="text-gray-600">{c.ago}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SMS */}
          <div className="card-dark border-blue-800/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">💬</div>
              <div>
                <h3 className="font-bold text-white">Send SMS</h3>
                <p className="text-xs text-gray-400">Individual or bulk · Telnyx powered</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">To</label>
              <input
                type="tel"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                placeholder="+1 305 555 0000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center justify-between">
                <span>Message</span>
                <span className="text-gray-600">{smsMsg.length}/160</span>
              </label>
              <textarea
                value={smsMsg}
                onChange={(e) => setSmsMsg(e.target.value)}
                placeholder={"Hi! This is the TROPTIONS team. We have an exclusive sponsorship activation package ready for your brand. Reply YES to learn more!"}
                rows={4}
                maxLength={160}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <button
              onClick={sendSms}
              disabled={!smsPhone || !smsMsg}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                smsSent
                  ? "bg-green-500 text-gray-950"
                  : smsPhone && smsMsg
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {smsSent ? "✓ Message Sent!" : "Send SMS"}
            </button>
          </div>
        </div>
      )}

      {/* ── Square Payments ── */}
      {activeTab === "payment" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Generator */}
          <div className="bg-gray-900 border border-yellow-800/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl">💳</div>
              <div>
                <h3 className="font-bold text-white">Generate Payment Link</h3>
                <p className="text-xs text-gray-400">Square powered · instant checkout</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Amount (USD)</label>
              <input
                type="number"
                value={payAmt}
                onChange={(e) => setPayAmt(e.target.value)}
                placeholder="0.00"
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Description</label>
              <input
                type="text"
                value={payDesc}
                onChange={(e) => setPayDesc(e.target.value)}
                placeholder="TROPTIONS Sponsorship Activation Package"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button
              onClick={genPayment}
              disabled={!payAmt || !payDesc || payLoading}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                payLoading
                  ? "bg-yellow-500 text-gray-950 animate-pulse"
                  : payAmt && payDesc
                  ? "bg-yellow-400 text-gray-950 hover:bg-yellow-300"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {payLoading ? "Generating…" : "Generate Payment Link"}
            </button>
            {payLink && (
              <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-400">Payment Link Ready:</p>
                <a
                  href={payLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 text-sm break-all hover:underline block"
                >
                  {payLink}
                </a>
                <button
                  onClick={() => navigator.clipboard?.writeText(payLink)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  📋 Copy to clipboard
                </button>
              </div>
            )}
            <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500">
              Configure <code className="text-cyan-400">SQUARE_ACCESS_TOKEN</code> and{" "}
              <code className="text-cyan-400">SQUARE_LOCATION_ID</code> in <code>.env</code> to activate live payments.
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white">Recent Transactions</h3>
            <div className="space-y-0 divide-y divide-gray-800">
              {TXNS.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white font-medium">{tx.biz}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">{tx.amt}</p>
                    <span className={`text-xs font-medium ${
                      tx.status === "completed" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-800 grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-400">$24,700</p>
                <p className="text-xs text-gray-500">Collected</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-yellow-400">$25,200</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
