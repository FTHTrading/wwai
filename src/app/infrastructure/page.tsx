import BrandDisclaimer from "@/components/BrandDisclaimer";

const LAYERS = [
  { icon: "🦀", title: "Troptions Settlement Network (TSN)", color: "text-orange-400", desc: "TROPTIONS' own Rust Layer 1 — the Troptions Settlement Network. TSN anchors .troptions namespace records, NIL athlete deal protocols, NFT receipts, compliance gates, and trustlines. Crates: consensus, state, namespaces, nil, nft, rwa, stablecoin, bridge-xrpl, bridge-stellar. Chain ID: tsn-devnet." },
  { icon: "🏷", title: ".troptions Namespace Registry", color: "text-yellow-400", desc: "15 official namespaces on TSN: troptions.root (active), troptions.org (brand), troptions.nil (NIL protocol), troptions.tv (media), troptions.university (education), troptions.pay / troptions.xchange (blocked — evidence-gated), troptions.gold / troptions.aus (commodity, evidence-required), and more." },
  { icon: "⛓", title: "XRPL + Stellar Settlement Rails", color: "text-cyan-400", desc: "TSN ships built-in bridge crates for XRP Ledger and Stellar. Once live, these provide near-instant, low-cost cross-rail settlement for sponsor payments, POS receipts, and commission payouts with immutable audit records." },
  { icon: "🪪", title: "NIL Protocol (troptions.nil)", color: "text-purple-400", desc: "TSN NIL is a first-class L1 primitive for Name, Image, and Likeness deals. FIFA player card options are routed through the NIL protocol — each exercise generates a pseudonymous SHA-256 deal receipt anchored to TSN. Simulation-only until Control Hub approval." },
  { icon: "🧾", title: "NFT Receipts on TSN", color: "text-green-400", desc: "Every listing fill and option exercise generates a TSN NFT receipt — a SHA-256 hash record of the canonical transaction payload. Receipts are simulation-only on devnet; production issuance targets XRPL, Stellar, or Polygon via Web3ReceiptTemplate." },
  { icon: "🤖", title: "Clawd AI Operating Layer", color: "text-purple-400", desc: "Clawd AI agents handle navigation, sponsor discovery, sales guidance, support escalation, and audit event logging. Agents operate within approved data boundaries." },
  { icon: "🧠", title: "Local AI Inference (NIM + Ollama)", color: "text-purple-400", desc: "NVIDIA NIM primary inference endpoint at :8800 (Nemotron Nano 8B, TensorRT-LLM BF16, RTX 5090) with Ollama fallback at :11434. All inference is local — no data leaves the machine. Dashboard: /infrastructure/ai." },
  { icon: "📋", title: "Audit Logs & Compliance", color: "text-blue-400", desc: "All key system events — payouts, sponsor activations, POS fills, NIL deal receipts — are logged to the audit trail. TSN compliance crate enforces payout approval and KYC/KYB gates before settlement." },
];

const TSN_NAMESPACES = [
  { ns: "troptions.root",       kind: "Root",        status: "active",            color: "text-green-400" },
  { ns: "troptions.org",        kind: "Brand",       status: "active",            color: "text-green-400" },
  { ns: "troptions.nil",        kind: "NIL",         status: "active",            color: "text-green-400" },
  { ns: "troptions.tv",         kind: "Media",       status: "active",            color: "text-green-400" },
  { ns: "troptions.university", kind: "Education",   status: "active",            color: "text-green-400" },
  { ns: "troptions.compliance", kind: "Compliance",  status: "active",            color: "text-green-400" },
  { ns: "troptions.rwa",        kind: "RWA",         status: "reserved",          color: "text-yellow-400" },
  { ns: "troptions.merchant",   kind: "Merchant",    status: "reserved",          color: "text-yellow-400" },
  { ns: "troptions.givbux",     kind: "Charity",     status: "reserved",          color: "text-yellow-400" },
  { ns: "troptions.gold",       kind: "Commodity",   status: "evidence_required", color: "text-amber-400" },
  { ns: "troptions.aus",        kind: "Commodity",   status: "evidence_required", color: "text-amber-400" },
  { ns: "troptions.pay",        kind: "Payment",     status: "blocked",           color: "text-red-400" },
  { ns: "troptions.unity",      kind: "Payment",     status: "blocked",           color: "text-red-400" },
  { ns: "troptions.xchange",    kind: "Token",       status: "blocked",           color: "text-red-400" },
  { ns: "troptions.settlement", kind: "Settlement",  status: "blocked",           color: "text-red-400" },
];

const BOUNDARIES = [
  { label: "TSN live execution",        status: "DEVNET only",          note: "Set TSN_NODE_URL in .env.local when HTTP node is live" },
  { label: "NIL deal settlement",       status: "Simulation only",      note: "Requires Control Hub approval + legal review" },
  { label: "TSN NFT minting",           status: "Simulation only",      note: "Receipts are SHA-256 hash records until live" },
  { label: "Square live card capture",  status: "DISABLED by default",  note: "Requires ENABLE_LIVE_CARD_CAPTURE=true" },
  { label: "Telnyx live calls/SMS",     status: "DISABLED by default",  note: "Requires ENABLE_LIVE_TELNYX=true" },
  { label: "XRPL/Stellar settlement",   status: "MOCK by default",      note: "TSN bridge crates active on devnet" },
  { label: "Payout processing",         status: "Approval required",    note: "REQUIRE_PAYOUT_APPROVAL=true enforced" },
];

const statusColor: Record<string, string> = {
  active:            "bg-green-400/10 text-green-400 border-green-400/30",
  reserved:          "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  evidence_required: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  blocked:           "bg-red-400/10 text-red-400 border-red-400/30",
};

export default function InfrastructurePage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-block bg-orange-400/10 border border-orange-400/30 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Infrastructure · TSN · Devnet
        </div>
        <h1 className="text-3xl font-extrabold text-white">Tap <span className="text-cyan-400">FIFA</span> Infrastructure</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Settlement Network (TSN) · XRPL/Stellar bridges · NIL protocol · NFT receipts · AI inference · Audit-ready settlement.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {LAYERS.map((l) => (
          <div key={l.title} className="card-dark rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{l.icon}</span>
              <h2 className={`font-bold ${l.color}`}>{l.title}</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>

      {/* TSN Namespace Registry */}
      <div className="card-dark border-orange-700/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏷</span>
          <h2 className="text-lg font-bold text-white">.troptions Namespace Registry</h2>
          <span className="text-xs text-orange-400 border border-orange-400/30 bg-orange-400/10 rounded-full px-2 py-0.5 font-bold">TSN devnet</span>
        </div>
        <p className="text-xs text-gray-500">Source: <code className="text-orange-300">troptions-rust-l1/crates/namespaces/src/lib.rs</code> · NamespaceRegistry::initialize()</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {TSN_NAMESPACES.map((n) => (
            <div key={n.ns} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2 text-sm">
              <div>
                <span className="font-mono text-white">{n.ns}</span>
                <span className="text-xs text-gray-500 ml-2">{n.kind}</span>
              </div>
              <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${statusColor[n.status]}`}>
                {n.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mock/Live boundaries */}
      <div className="card-dark border-amber-700/40 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Mock / Live Boundaries</h2>
        <p className="text-sm text-gray-400">All live rails are disabled by default. Explicit environment flags or Control Hub approval required.</p>
        <div className="space-y-3">
          {BOUNDARIES.map((b) => (
            <div key={b.label} className="flex items-start justify-between gap-4 text-sm border-b border-gray-800 pb-3 last:border-0 last:pb-0">
              <span className="text-gray-300">{b.label}</span>
              <div className="text-right shrink-0">
                <span className="text-amber-400 font-bold block">{b.status}</span>
                <span className="text-gray-600 text-xs">{b.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Infrastructure quick-access card */}
      <div className="bg-gray-900 border border-purple-700/40 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <h2 className="font-bold text-white">AI Infrastructure</h2>
              <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/30 rounded-full px-2 py-0.5 font-bold">Local GPU · RTX 5090</span>
            </div>
            <p className="text-sm text-gray-400">
              GPU-backed local inference — NIM primary (Nemotron Nano 8B, TensorRT-LLM) with Ollama fallback.
              No data leaves the machine.
            </p>
          </div>
          <a href="/infrastructure/ai" className="shrink-0 border border-purple-500 text-purple-400 font-bold px-5 py-2.5 rounded-lg hover:bg-purple-500/10 transition-colors text-sm whitespace-nowrap">
            AI Dashboard →
          </a>
        </div>

        {/* Provider breakdown */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-gray-800/60 border border-green-800/30 rounded-xl px-4 py-3 space-y-1">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Primary — NIM</p>
            <p className="text-sm text-white font-mono">nvidia/llama-3.1-nemotron-nano-8b-v1</p>
            <p className="text-xs text-gray-500">TensorRT-LLM BF16 · port :8800 · RTX 5090</p>
          </div>
          <div className="bg-gray-800/60 border border-blue-800/30 rounded-xl px-4 py-3 space-y-1">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Fallback — Ollama</p>
            <p className="text-sm text-white font-mono">qwen2.5:7b</p>
            <p className="text-xs text-gray-500">Windows host · port :11434 · 16 models available</p>
          </div>
        </div>

        {/* API routes */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">API Routes</p>
          <div className="grid sm:grid-cols-3 gap-2 text-xs">
            {[
              { method: "GET",  path: "/api/ai/health",  desc: "Provider health check" },
              { method: "POST", path: "/api/ai/chat",    desc: "NIM → Ollama router" },
              { method: "GET",  path: "/api/ai/presets", desc: "Prompt preset catalog" },
            ].map((r) => (
              <div key={r.path} className="bg-gray-800 rounded-lg px-3 py-2 flex items-start gap-2">
                <span className={`font-bold shrink-0 ${r.method === "GET" ? "text-cyan-400" : "text-yellow-400"}`}>{r.method}</span>
                <div>
                  <p className="font-mono text-white">{r.path}</p>
                  <p className="text-gray-500">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <a href="/dashboard" className="bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors">View Dashboard</a>
        <a href="/map"       className="border border-cyan-500 text-cyan-400 font-bold px-6 py-3 rounded-lg hover:bg-cyan-500/10 transition-colors">View Map OS</a>
      </div>

      <BrandDisclaimer />
    </div>
  );
}
