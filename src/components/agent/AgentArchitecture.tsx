import { AGENTS, MCP_TOOLS, RAG_SOURCES } from "@/data/demoData";

const STATUS_TONE: Record<string, string> = {
  online: "wwai-chip-green",
  ready: "wwai-chip-cyan",
  "needs-config": "wwai-chip-amber",
};

export default function AgentArchitecture() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="wwai-panel p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">AI Agents</h3>
          <span className="wwai-chip">Architecture-ready</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {AGENTS.map((a) => (
            <div key={a.id} className="wwai-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white">{a.name}</div>
                  <div className="text-xs text-slate-400">{a.role}</div>
                </div>
                <span className={`wwai-chip ${STATUS_TONE[a.status] || ""}`}>{a.status}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.capabilities.map((c) => (
                  <span key={c} className="text-[10px] text-slate-400 border border-[#162035] rounded px-1.5 py-0.5">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="wwai-panel p-5">
          <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">RAG Sources</div>
          <ul className="text-sm text-slate-300 space-y-1.5">
            {RAG_SOURCES.map((s) => <li key={s} className="flex items-center gap-2"><span className="text-cyan-400">●</span>{s}</li>)}
          </ul>
        </div>
        <div className="wwai-panel p-5">
          <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">MCP Tools</div>
          <ul className="text-sm text-slate-300 space-y-1.5">
            {MCP_TOOLS.map((s) => <li key={s} className="flex items-center gap-2"><span className="text-amber-400">●</span>{s}</li>)}
          </ul>
        </div>
        <p className="disclaimer-bar">Live integrations require API keys, data sources, and approval gates.</p>
      </div>
    </div>
  );
}
