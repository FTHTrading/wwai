"use client";
import { useEffect, useState } from "react";

interface Stats {
  cardsListed: number;
  openOptions: number;
  totalVolume: number;
  activeTraders: number;
  totalDeals: number;
  totalCommissions: number;
  payoutsProcessed: number;
}

interface Deal {
  id: string;
  price: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  card: { name: string; rating: number; position: string; rarity: string };
  seller: { displayName: string | null; address: string };
}

interface Option {
  id: string;
  contractType: string;
  strikePrice: number;
  premium: number;
  currency: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  card: { name: string; rating: number };
  seller: { displayName: string | null; address: string };
}

type AiProvider = "nim" | "ollama" | "none" | "loading";

interface PresetMeta {
  id:             string;
  label:          string;
  defaultMessage: string;
}

const PANEL_PRESETS: PresetMeta[] = [
  { id: "TAPFIFA_SALES_ASSISTANT",      label: "Sales",       defaultMessage: "What sales opportunities exist with the current open listings and options pipeline?" },
  { id: "SPONSOR_CAMPAIGN_ASSISTANT",     label: "Sponsors",    defaultMessage: "Suggest a sponsor campaign strategy for maximizing map zone visibility." },
  { id: "MAP_PLACEMENT_ASSISTANT",        label: "Map & Zones", defaultMessage: "What map placement and zone activation strategies would maximize event engagement?" },
  { id: "WALLET_INFRASTRUCTURE_ASSISTANT",label: "Wallet/Infra",defaultMessage: "Review the wallet and infrastructure setup for any issues or optimizations." },
  { id: "EVENT_OPERATIONS_ASSISTANT",     label: "Events",      defaultMessage: "What event operations and FIFA card options should I prioritize this week?" },
];

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : String(n);

const statusColor: Record<string, string> = {
  open:      "bg-blue-800/60 text-blue-300",
  filled:    "bg-green-800/60 text-green-300",
  cancelled: "bg-gray-700 text-gray-400",
  exercised: "bg-purple-800/60 text-purple-300",
  expired:   "bg-red-900/60 text-red-400",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [dealFilter, setDealFilter] = useState<"all" | "open" | "filled">("all");
  const [loading, setLoading] = useState(true);
  const [aiProvider, setAiProvider] = useState<AiProvider>("loading");

  // AI assistant panel state
  const [aiInput,          setAiInput]          = useState("");
  const [aiPresetId,       setAiPresetId]        = useState<string | null>(null);
  const [aiLoading,        setAiLoading]         = useState(false);
  const [aiText,           setAiText]            = useState<string | null>(null);
  const [aiError,          setAiError]           = useState<string | null>(null);
  const [aiRespProvider,   setAiRespProvider]    = useState<string>("");
  const [aiRespModel,      setAiRespModel]       = useState<string>("");
  const [aiRespLatency,    setAiRespLatency]     = useState<number>(0);

  async function handleAiSubmit() {
    const msg = aiInput.trim();
    if (!msg || aiLoading) return;
    setAiLoading(true);
    setAiText(null);
    setAiError(null);
    try {
      const body: Record<string, unknown> = {
        messages: [{ role: "user", content: msg }],
      };
      if (aiPresetId) body.preset = aiPresetId;
      const res = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setAiText(data.text ?? "");
        setAiRespProvider(data.provider ?? "");
        setAiRespModel(data.model ?? "");
        setAiRespLatency(data.latencyMs ?? 0);
      } else {
        setAiError(data.error ?? "AI request failed");
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Network error");
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    fetch("/api/ai/health")
      .then((r) => r.json())
      .then((d) => setAiProvider(d.recommendedProvider ?? "none"))
      .catch(() => setAiProvider("none"));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [sRes, lOpen, lFilled, oAll] = await Promise.all([
        fetch("/api/stats").then((r) => r.json()),
        fetch("/api/listings?status=open").then((r) => r.json()),
        fetch("/api/listings?status=filled").then((r) => r.json()),
        fetch("/api/options").then((r) => r.json()),
      ]);
      setStats(sRes);
      const allDeals = [
        ...(Array.isArray(lOpen)   ? lOpen   : []),
        ...(Array.isArray(lFilled) ? lFilled : []),
      ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setDeals(allDeals);
      setOptions(Array.isArray(oAll) ? oAll : []);
      setLoading(false);
    }
    load();
  }, []);

  const visibleDeals =
    dealFilter === "all"
      ? deals
      : deals.filter((d) => d.status === dealFilter);

  const commission = stats?.totalCommissions ?? 0;
  const paidOut    = stats?.payoutsProcessed ?? 0;
  const pendingPay = Math.max(0, commission - paidOut * 0.02);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="pill-gold">TROPTIONS Command Center</span>
          <h1 className="text-3xl font-black text-white mt-2">
            <span className="gradient-cyan">TROPTIONS</span>™ Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            AI assistant · Deal pipeline · Settlement · Commission tracking
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/market/list"
            className="bg-cyan-500 text-gray-950 font-bold px-4 py-2 rounded-xl hover:bg-cyan-400 text-sm transition-colors"
          >
            + New Listing
          </a>
          <a
            href="/options/write"
            className="border border-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl hover:border-cyan-500/50 text-sm transition-colors"
          >
            + Write Option
          </a>
        </div>
      </div>

      {/* AI Provider Status Badge */}
      <a href="/infrastructure/ai" className="block">
        <div className={`rounded-xl border px-4 py-2.5 flex items-center justify-between text-xs transition-colors hover:opacity-90 ${
          aiProvider === "nim"     ? "bg-green-400/5 border-green-700/40"   :
          aiProvider === "ollama"  ? "bg-blue-400/5 border-blue-700/40"     :
          aiProvider === "loading" ? "bg-[#0f1629] border-[#1a2540]"          :
                                     "bg-red-400/5 border-red-700/40"
        }`}>
          <div className="flex items-center gap-2">
            <span>🧠</span>
            <span className="text-gray-400">Local AI:</span>
            {aiProvider === "loading" && <span className="text-gray-500">checking…</span>}
            {aiProvider === "nim"     && <span className="font-bold text-green-400">NIM LIVE</span>}
            {aiProvider === "ollama"  && <span className="font-bold text-blue-400">OLLAMA FALLBACK</span>}
            {aiProvider === "none"    && <span className="font-bold text-red-400">AI OFFLINE</span>}
            {aiProvider === "nim"    && <span className="text-gray-600">nvidia/llama-3.1-nemotron-nano-8b-v1 · :8800</span>}
            {aiProvider === "ollama" && <span className="text-gray-600">qwen2.5:7b · :11434</span>}
          </div>
          <span className={`font-semibold ${
            aiProvider === "nim" ? "text-green-400" : aiProvider === "ollama" ? "text-blue-400" : "text-gray-500"
          }`}>AI Dashboard →</span>
        </div>
      </a>

      {/* AI Assistant Panel */}
      <section className="card-dark border-purple-800/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🤖</span>
          <h2 className="text-lg font-bold text-white">AI Assistant</h2>
          {aiProvider !== "loading" && aiProvider !== "none" && (
            <span className={`text-xs border rounded-full px-2 py-0.5 font-bold ${
              aiProvider === "nim"
                ? "bg-green-400/10 text-green-400 border-green-400/30"
                : "bg-blue-400/10 text-blue-400 border-blue-400/30"
            }`}>
              {aiProvider === "nim" ? "NIM LIVE" : "OLLAMA"}
            </span>
          )}
          {aiProvider === "none" && (
            <span className="text-xs border border-red-400/30 bg-red-400/10 text-red-400 rounded-full px-2 py-0.5 font-bold">OFFLINE</span>
          )}
        </div>

        {/* Preset quick-select */}
        <div className="flex flex-wrap gap-2">
          {PANEL_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setAiPresetId(p.id); setAiInput(p.defaultMessage); setAiText(null); setAiError(null); }}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                aiPresetId === p.id
                  ? "bg-purple-500/20 border-purple-500 text-purple-300"
                  : "border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              {p.label}
            </button>
          ))}
          {aiPresetId && (
            <button
              onClick={() => { setAiPresetId(null); setAiInput(""); setAiText(null); setAiError(null); }}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-600 hover:text-gray-400 transition-colors"
            >
              ✕ clear
            </button>
          )}
        </div>

        {/* Input */}
        <div className="space-y-2">
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAiSubmit(); }}
            placeholder="Ask about sales, sponsors, maps, wallets, events, or infrastructure… (Ctrl+Enter to send)"
            rows={3}
            disabled={aiProvider === "none" || aiProvider === "loading"}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none disabled:opacity-40"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleAiSubmit}
              disabled={aiLoading || !aiInput.trim() || aiProvider === "none" || aiProvider === "loading"}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {aiLoading ? "Thinking…" : "Ask AI"}
            </button>
            {aiProvider === "none" && (
              <span className="text-red-400 text-xs">All AI providers offline — check /infrastructure/ai</span>
            )}
            {aiProvider === "loading" && (
              <span className="text-gray-500 text-xs">Checking AI status…</span>
            )}
          </div>
        </div>

        {/* Response */}
        {(aiText !== null || aiError) && (
          <div className={`rounded-xl p-4 text-sm space-y-2 ${
            aiError ? "bg-red-900/20 border border-red-700/40" : "bg-gray-800 border border-gray-700"
          }`}>
            {aiError ? (
              <p className="text-red-400">{aiError}</p>
            ) : (
              <>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className={aiRespProvider === "nim" ? "text-green-400 font-bold" : "text-blue-400 font-bold"}>
                    {aiRespProvider === "nim" ? "NIM LIVE" : "OLLAMA FALLBACK"}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{aiRespModel}</span>
                  <span>·</span>
                  <span>{aiRespLatency}ms</span>
                  {aiPresetId && <><span>·</span><span className="text-purple-400">{PANEL_PRESETS.find(p => p.id === aiPresetId)?.label ?? aiPresetId}</span></>}
                </div>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{aiText}</p>
              </>
            )}
          </div>
        )}
      </section>

      {/* KPI row */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-dark rounded-xl p-6 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total Deals" value={fmt(stats?.totalDeals ?? 0)} sub="all-time listings" accent="yellow" />
          <KpiCard label="Total Volume" value={`${fmt(stats?.totalVolume ?? 0)} ATP`} sub="filled value" accent="yellow" />
          <KpiCard label="Commissions Earned" value={`${fmt(commission)} ATP`} sub="2% fee on fills" accent="cyan" />
          <KpiCard label="Active Traders" value={fmt(stats?.activeTraders ?? 0)} sub="registered wallets" accent="cyan" />
        </div>
      )}

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          label="Open Listings"
          value={fmt(stats?.cardsListed ?? 0)}
          desc="Cards available on the spot market"
          color="border-yellow-800/50"
        />
        <InfoCard
          label="Open Options"
          value={fmt(stats?.openOptions ?? 0)}
          desc="Active CALL / PUT contracts"
          color="border-purple-800/50"
        />
        <InfoCard
          label="Payouts Processed"
          value={`${fmt(paidOut)} ATP`}
          desc="Settled deal volume paid out"
          color="border-green-800/50"
        />
      </div>

      {/* Commission meter */}
      <section className="card-dark border-cyan-800/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Commission Pipeline</h2>
          <span className="text-xs text-gray-500">2% fee model · ATP</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-cyan-400">{fmt(commission)} ATP</p>
            <p className="text-xs text-gray-400 mt-1">Total Earned</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-green-400">{fmt(paidOut)} ATP</p>
            <p className="text-xs text-gray-400 mt-1">Processed</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-yellow-400">{fmt(pendingPay)} ATP</p>
            <p className="text-xs text-gray-400 mt-1">Pending Payout</p>
          </div>
        </div>
        {commission > 0 && (
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (paidOut / commission) * 100)}%` }}
            />
          </div>
        )}
      </section>

      {/* Deals table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-white">Deal Ledger</h2>
          <div className="flex gap-2">
            {(["all", "open", "filled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDealFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  dealFilter === f
                    ? "bg-cyan-500 text-gray-950 border-cyan-500"
                    : "border-gray-700 text-gray-400 hover:border-cyan-400 hover:text-cyan-400"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading deals…</p>
        ) : visibleDeals.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No {dealFilter !== "all" ? dealFilter : ""} deals yet.</p>
            <p className="text-xs mt-2">
              <a href="/market/list" className="text-cyan-400 underline">List a card</a> to start.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="px-4 py-3">Card</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Commission</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2540] bg-[#0a0e1a]">
                {visibleDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-[#0f1629] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{d.card.name}</p>
                      <p className="text-xs text-gray-500">{d.card.position} · OVR {d.card.rating}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono truncate max-w-[140px]">
                      {d.seller.displayName ?? d.seller.address.slice(0, 12) + "…"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-cyan-400">
                      {d.price.toLocaleString()} {d.currency}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-cyan-400">
                      {(d.price * 0.02).toLocaleString(undefined, { maximumFractionDigits: 0 })} {d.currency}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor[d.status] ?? "bg-gray-700 text-gray-400"}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {new Date(d.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Options pipeline */}
      {options.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Options Pipeline</h2>
          <div className="overflow-x-auto rounded-xl border border-[#1a2540]">
            <table className="w-full text-sm">
              <thead className="bg-[#0f1629]">
                <tr className="border-b border-[#1a2540] text-slate-400 text-left">
                  <th className="px-4 py-3">Card</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Strike</th>
                  <th className="px-4 py-3 text-right">Premium</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2540] bg-[#0a0e1a]">
                {options.slice(0, 20).map((o) => (
                  <tr key={o.id} className="hover:bg-[#0f1629] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{o.card.name}</p>
                      <p className="text-xs text-gray-500">OVR {o.card.rating}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        o.contractType === "call" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"
                      }`}>
                        {o.contractType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-cyan-400">
                      {o.strikePrice.toLocaleString()} {o.currency}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-300">
                      {o.premium.toLocaleString()} {o.currency}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor[o.status] ?? "bg-gray-700 text-gray-400"}`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {new Date(o.expiresAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function KpiCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string; accent: "yellow" | "cyan";
}) {
  const color = accent === "yellow" ? "text-cyan-400" : "text-cyan-400";
  return (
    <div className="stat-card">
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function InfoCard({
  label, value, desc, color,
}: {
  label: string; value: string; desc: string; color: string;
}) {
  return (
    <div className={`bg-[#0f1629] border ${color} rounded-xl p-5 space-y-2`}>
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
