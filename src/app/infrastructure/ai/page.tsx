"use client";
import { useEffect, useState, useRef } from "react";

interface ProviderStatus {
  ok: boolean;
  endpoint: string;
  model?: string;
  latencyMs: number;
  error?: string;
}

interface HealthData {
  ok: boolean;
  providers: {
    nim: ProviderStatus;
    ollama: ProviderStatus;
  };
  recommendedProvider: "nim" | "ollama" | "none";
}

interface ChatResponse {
  ok: boolean;
  provider?: string;
  model?: string;
  content?: string;
  latencyMs?: number;
  error?: string;
}

const NIM_MODEL   = "nvidia/llama-3.1-nemotron-nano-8b-v1";
const NIM_ENDPOINT = "http://localhost:8800/v1";
const OLLAMA_ENDPOINT = "http://localhost:11434";

function StatusBadge({ ok, loading }: { ok: boolean; loading?: boolean }) {
  if (loading) return <span className="text-xs bg-gray-700 text-gray-400 border border-gray-600 rounded-full px-2 py-0.5">checking…</span>;
  return ok
    ? <span className="text-xs bg-green-400/10 text-green-400 border border-green-400/30 rounded-full px-2 py-0.5 font-bold">LIVE</span>
    : <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/30 rounded-full px-2 py-0.5 font-bold">OFFLINE</span>;
}

export default function AiInfraPage() {
  const [health,       setHealth]       = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError,  setHealthError]  = useState<string | null>(null);

  const [prompt,    setPrompt]    = useState("Describe the TROPTIONS FIFA trading platform in one sentence.");
  const [chatResp,  setChatResp]  = useState<ChatResponse | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchHealth() {
    try {
      const res = await fetch("/api/ai/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthData = await res.json();
      setHealth(data);
      setHealthError(null);
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : "Failed to reach /api/ai/health");
    } finally {
      setHealthLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
    intervalRef.current = setInterval(fetchHealth, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setChatLoading(true);
    setChatResp(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt.trim() }] }),
      });
      const data: ChatResponse = await res.json();
      setChatResp(data);
    } catch (err) {
      setChatResp({ ok: false, error: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setChatLoading(false);
    }
  }

  const nim    = health?.providers.nim;
  const ollama = health?.providers.ollama;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-block bg-purple-400/10 border border-purple-400/30 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Infrastructure · Local AI
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Infrastructure</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Local GPU inference via NVIDIA NIM · Ollama fallback · OpenAI-compatible API
        </p>
      </div>

      {/* Provider Status Cards */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* NIM Card */}
        <div className={`bg-gray-900 border rounded-xl p-6 space-y-3 ${nim?.ok ? "border-green-700/40" : "border-gray-800"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <h2 className="font-bold text-white">NVIDIA NIM</h2>
            </div>
            <StatusBadge ok={nim?.ok ?? false} loading={healthLoading} />
          </div>
          <div className="space-y-1 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Endpoint</span>
              <code className="text-purple-300 text-xs">{NIM_ENDPOINT}</code>
            </div>
            <div className="flex justify-between">
              <span>Model</span>
              <code className="text-yellow-300 text-xs truncate ml-2">{NIM_MODEL}</code>
            </div>
            {nim && (
              <>
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-white">{nim.latencyMs}ms</span>
                </div>
                {nim.error && (
                  <div className="text-red-400 text-xs mt-1 bg-red-400/10 rounded px-2 py-1">
                    {nim.error}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="text-xs text-gray-600 border-t border-gray-800 pt-2">
            GPU: RTX 5090 Laptop · 16K context · TensorRT-LLM BF16
          </div>
        </div>

        {/* Ollama Card */}
        <div className={`bg-gray-900 border rounded-xl p-6 space-y-3 ${ollama?.ok ? "border-blue-700/40" : "border-gray-800"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦙</span>
              <h2 className="font-bold text-white">Ollama Fallback</h2>
            </div>
            <StatusBadge ok={ollama?.ok ?? false} loading={healthLoading} />
          </div>
          <div className="space-y-1 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Endpoint</span>
              <code className="text-blue-300 text-xs">{OLLAMA_ENDPOINT}</code>
            </div>
            <div className="flex justify-between">
              <span>Role</span>
              <span className="text-gray-300 text-xs">Fallback when NIM unavailable</span>
            </div>
            {ollama && (
              <>
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-white">{ollama.latencyMs}ms</span>
                </div>
                {ollama.error && (
                  <div className="text-red-400 text-xs mt-1 bg-red-400/10 rounded px-2 py-1">
                    {ollama.error}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="text-xs text-gray-600 border-t border-gray-800 pt-2">
            Local Windows host · qwen2.5:7b default · CPU/GPU shared
          </div>
        </div>
      </div>

      {/* Recommended Provider Banner */}
      {health && (
        <div className={`rounded-xl border px-5 py-3 flex items-center justify-between text-sm ${
          health.recommendedProvider === "nim"    ? "bg-green-400/5 border-green-700/40 text-green-300"  :
          health.recommendedProvider === "ollama" ? "bg-blue-400/5 border-blue-700/40 text-blue-300"    :
                                                    "bg-red-400/5 border-red-700/40 text-red-300"
        }`}>
          <span>
            Active provider:{" "}
            <strong>
              {health.recommendedProvider === "nim"    ? "NVIDIA NIM (primary)"     :
               health.recommendedProvider === "ollama" ? "Ollama (fallback active)" :
                                                         "None — all providers offline"}
            </strong>
          </span>
          <button
            onClick={() => { setHealthLoading(true); fetchHealth(); }}
            className="text-xs border border-current rounded px-2 py-0.5 hover:bg-white/5 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {healthError && (
        <div className="bg-red-400/10 border border-red-700/40 rounded-xl px-5 py-3 text-red-400 text-sm">
          Health check error: {healthError}
        </div>
      )}

      {/* Test Prompt Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🧪</span>
          <h2 className="font-bold text-white">Test Prompt</h2>
          {chatResp?.provider && (
            <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/30 rounded-full px-2 py-0.5">
              via {chatResp.provider}
            </span>
          )}
        </div>
        <form onSubmit={sendChat} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={4000}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Enter a prompt to test the local AI…"
          />
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-600">{prompt.length} / 4000 chars</span>
            <button
              type="submit"
              disabled={chatLoading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {chatLoading ? "Sending…" : "Send"}
            </button>
          </div>
        </form>

        {/* Response Panel */}
        {chatResp && (
          <div className={`rounded-xl border p-4 space-y-2 ${chatResp.ok ? "bg-gray-800/60 border-gray-700" : "bg-red-400/5 border-red-700/40"}`}>
            {chatResp.ok ? (
              <>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Model: <code className="text-gray-300">{chatResp.model}</code></span>
                  <span>{chatResp.latencyMs}ms</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{chatResp.content}</p>
              </>
            ) : (
              <p className="text-sm text-red-400">{chatResp.error ?? "Request failed"}</p>
            )}
          </div>
        )}
      </div>

      {/* Safety Notes */}
      <div className="bg-gray-900 border border-amber-700/40 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <h2 className="font-bold text-white">Safety Notes</h2>
        </div>
        <ul className="text-sm text-gray-400 space-y-2 list-none">
          {[
            "All AI inference runs locally on your RTX 5090. No data leaves your machine.",
            "NIM API keys are server-side only and never exposed to this client page.",
            "Do not restart the NIM container during TensorRT engine build — use ops/local-ai/health-check.ps1 to verify state first.",
            "Ollama activates only as a fallback when NIM is unavailable. Avoid loading large Ollama models while NIM is running to prevent VRAM contention.",
            "This page calls /api/ai/health and /api/ai/chat — both are server-side proxies with input validation and size limits.",
          ].map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-amber-400 shrink-0">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <a href="/infrastructure" className="border border-orange-500 text-orange-400 font-bold px-6 py-3 rounded-lg hover:bg-orange-500/10 transition-colors">
          Infrastructure Overview
        </a>
        <a href="/dashboard" className="bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors">
          Dashboard
        </a>
      </div>
    </div>
  );
}
