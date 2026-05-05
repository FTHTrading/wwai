"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGES, WWAI_PRESETS } from "@/data/demoData";
import type { WWAIChatResponse, WWAIAction } from "@/app/api/wwai/chat/route";

interface Msg {
  role: "user" | "wwai";
  text: string;
  response?: WWAIChatResponse;
}

const PROVIDER_LABELS: Record<string, string> = {
  openai:        "OpenAI",
  ollama:        "Ollama",
  deterministic: "Demo",
};

const PROVIDER_COLORS: Record<string, string> = {
  openai:        "wwai-chip-green",
  ollama:        "wwai-chip-cyan",
  deterministic: "wwai-chip-slate",
};

/** Convert markdown-style **bold** and newlines to simple HTML */
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

export default function WWAIConcierge() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "wwai",
      text: "Hi — I'm WWAI. Nowhere to go? I know. Ask about food, hotels, pickup, sponsor offers, or routes.",
    },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function askAPI(question: string): Promise<void> {
    if (!question.trim() || loading) return;
    const userMsg = question.trim();

    setMessages((arr) => [...arr, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wwai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, language }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as Record<string, string>).error ?? `HTTP ${res.status}`);
      }

      const data: WWAIChatResponse = await res.json();
      setMessages((arr) => [...arr, { role: "wwai", text: data.answer, response: data }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setMessages((arr) => [
        ...arr,
        { role: "wwai", text: "Sorry, I had trouble getting a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="wwai-panel p-4 flex flex-col" style={{ minHeight: 460 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">W</div>
            <div>
              <div className="font-bold text-white">WhichWay AI</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Demo concierge · {LANGUAGES.find((l) => l.code === language)?.label}</div>
            </div>
          </div>
          <span className="wwai-chip wwai-chip-cyan">Online (demo)</span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i}>
              <div className={`max-w-[90%] p-3 rounded-xl text-sm ${
                m.role === "wwai"
                  ? "bg-cyan-400/5 border border-cyan-400/30 text-slate-100"
                  : "bg-[#0a1220] border border-[#162035] text-slate-300 ml-auto"
              }`}>
                {m.role === "wwai"
                  ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
                  : m.text}
              </div>

              {m.response && (
                <div className="mt-1.5 space-y-1.5">
                  {m.response.safetyNotice && (
                    <div className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-400/30 rounded-lg px-3 py-1.5">
                      ⚠️ {m.response.safetyNotice}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`wwai-chip ${PROVIDER_COLORS[m.response.provider] ?? "wwai-chip-slate"} text-[10px]`}>
                      {PROVIDER_LABELS[m.response.provider] ?? m.response.provider}
                    </span>
                    <span className="wwai-chip wwai-chip-slate text-[10px]">
                      {m.response.intent.replace(/_/g, " ")}
                    </span>
                    {m.response.demoOnly && (
                      <span className="wwai-chip wwai-chip-amber text-[10px]">Demo data</span>
                    )}
                    {m.response.sources?.map((s) => (
                      <span key={s} className="wwai-chip wwai-chip-slate text-[10px]">{s}</span>
                    ))}
                    {m.response.latencyMs != null && (
                      <span className="wwai-chip wwai-chip-slate text-[10px]">{m.response.latencyMs}ms</span>
                    )}
                  </div>
                  {m.response.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.response.actions.map((a: WWAIAction) => (
                        <a key={a.href} href={a.href} className="wwai-btn-secondary text-[11px] px-2 py-1">
                          {a.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="max-w-[60%] p-3 rounded-xl text-sm bg-cyan-400/5 border border-cyan-400/30 text-cyan-400 animate-pulse">
              WWAI is thinking…
            </div>
          )}
          {error && (
            <div className="text-[11px] text-red-400 bg-red-400/5 border border-red-400/30 rounded-lg px-3 py-1.5">
              ⚠️ {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && askAPI(input)}
            placeholder="Ask WWAI…"
            disabled={loading}
            className="flex-1 bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm disabled:opacity-50"
          />
          <button
            onClick={() => askAPI(input)}
            disabled={loading || !input.trim()}
            className="wwai-btn-primary text-sm disabled:opacity-50"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
        <p className="disclaimer-bar mt-2">Demo concierge. OpenAI enhances answers when configured. All data is illustrative.</p>
      </div>

      <div className="space-y-3">
        <div className="wwai-panel p-4">
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Language</div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <p className="text-[10px] text-slate-500 mt-2">Demo multilingual mode. Production translations require reviewed language packs.</p>
        </div>
        <div className="wwai-panel p-4">
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Try a question</div>
          <div className="flex flex-col gap-1.5">
            {WWAI_PRESETS.map((p) => (
              <button key={p.q} onClick={() => askAPI(p.q)} disabled={loading} className="text-left text-xs text-slate-300 hover:text-cyan-300 border border-[#162035] hover:border-cyan-400 rounded-lg p-2 disabled:opacity-40">
                {p.q}
              </button>
            ))}
          </div>
        </div>
        <WWAIProviderStatus />
      </div>
    </div>
  );
}

function WWAIProviderStatus() {
  const [status, setStatus] = useState<{
    openaiConfigured: boolean;
    ollamaConfigured: boolean;
    ragMode: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/wwai/status").then((r) => r.json()).then(setStatus).catch(() => null);
  }, []);

  if (!status) return null;

  return (
    <div className="wwai-panel p-4">
      <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">AI Provider Status</div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">OpenAI</span>
          <span className={status.openaiConfigured ? "text-green-400" : "text-slate-500"}>
            {status.openaiConfigured ? "✓ Configured" : "Not configured"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Ollama</span>
          <span className={status.ollamaConfigured ? "text-green-400" : "text-slate-500"}>
            {status.ollamaConfigured ? "✓ Configured" : "Not configured"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">RAG</span>
          <span className="text-cyan-400">{status.ragMode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Live data</span>
          <span className="text-slate-500">Demo only</span>
        </div>
      </div>
    </div>
  );
}
