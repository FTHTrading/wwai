"use client";

/**
 * src/components/agent/WWAIVoiceConcierge.tsx
 * Full WWAI voice + text concierge component.
 *
 * Features:
 * - Text chat via /api/wwai/chat (OpenAI → Ollama → deterministic RAG)
 * - Microphone → /api/wwai/voice/transcribe → /api/wwai/chat pipeline
 * - Play response → /api/wwai/voice/speak
 * - Language selector with direction support
 * - Safety guardrails on both typed and spoken input
 * - Graceful degradation: voice disabled → text still works
 * - Provider badges: openai / ollama / deterministic / deepgram-voice
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { WWAI_PRESETS } from "@/data/demoData";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { WWAIChatResponse } from "@/app/api/wwai/chat/route";

// ── Types ───────────────────────────────────────────────────────────────────
interface Msg {
  role:       "user" | "wwai";
  text:       string;
  response?:  WWAIChatResponse;
  viaVoice?:  boolean;
}

type RecordState = "idle" | "recording" | "processing";

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

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

// ── Component ───────────────────────────────────────────────────────────────
export default function WWAIVoiceConcierge() {
  const { lang, setLanguage, t, languages, language: langObj } = useLanguage();

  const [messages,     setMessages]     = useState<Msg[]>([{
    role: "wwai",
    text: t("slogan") + "\n\n" + t("demoMultilingualNotice"),
  }]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [recordState,  setRecordState]  = useState<RecordState>("idle");
  const [voiceReady,   setVoiceReady]   = useState<boolean | null>(null);  // null = checking
  // Lazy-init mediaSupported so we don't call setState in an effect.
  const [mediaSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !!(window.MediaRecorder && navigator.mediaDevices?.getUserMedia);
  });
  const [playingIdx,   setPlayingIdx]   = useState<number | null>(null);
  const [status,       setStatus]       = useState<{
    deepgramConfigured: boolean;
    chatProvider: string;
  } | null>(null);

  const bottomRef     = useRef<HTMLDivElement>(null);
  const mediaRef      = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const audioRef      = useRef<HTMLAudioElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch WWAI status (async — setState inside .then is allowed by the rule).
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch("/api/wwai/status")
      .then((r) => r.json())
      .then((s) => {
        setStatus(s);
        setVoiceReady(!!s.deepgramConfigured);
      })
      .catch(() => setVoiceReady(false));
  }, []);

  // ── Text chat ─────────────────────────────────────────────────────────────
  const askAPI = useCallback(async (question: string): Promise<void> => {
    if (!question.trim() || loading) return;
    const userMsg = question.trim();

    setMessages((arr) => [...arr, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wwai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: userMsg, language: lang }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const data: WWAIChatResponse = await res.json();
      setMessages((arr) => [...arr, { role: "wwai", text: data.answer, response: data }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setMessages((arr) => [...arr, {
        role: "wwai",
        text: "Sorry — something went wrong. Text chat is still available.",
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, lang]);

  // ── Voice input ───────────────────────────────────────────────────────────
  const handleAudioBlob = useCallback(async (blob: Blob) => {
    const form = new FormData();
    form.append("audio", blob, "recording.webm");
    form.append("language", lang);

    // Show user's voice prompt indicator
    setMessages((arr) => [...arr, { role: "user", text: "🎤 (voice input — transcribing…)", viaVoice: true }]);
    setLoading(true);
    setError(null);

    try {
      const tRes = await fetch("/api/wwai/voice/transcribe", { method: "POST", body: form });
      const tData = await tRes.json() as { ok: boolean; transcript?: string; message?: string };

      if (!tData.ok || !tData.transcript?.trim()) {
        // Fallback message — keep text mode note
        const notice = tData.message ?? "Voice transcription unavailable. Type your question below.";
        setMessages((arr) => {
          const updated = [...arr];
          updated[updated.length - 1] = { role: "user", text: `🎤 ${notice}`, viaVoice: true };
          return updated;
        });
        setError(notice);
        setLoading(false);
        return;
      }

      const transcript = tData.transcript;
      setMessages((arr) => {
        const updated = [...arr];
        updated[updated.length - 1] = { role: "user", text: transcript, viaVoice: true };
        return updated;
      });

      // Now send to chat
      const cRes = await fetch("/api/wwai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: transcript, language: lang }),
      });
      if (!cRes.ok) throw new Error(`Chat HTTP ${cRes.status}`);
      const cData: WWAIChatResponse = await cRes.json();
      setMessages((arr) => [...arr, { role: "wwai", text: cData.answer, response: cData, viaVoice: true }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
      setMessages((arr) => [...arr, { role: "wwai", text: "Voice pipeline error. Text chat still works." }]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const startRecording = useCallback(async () => {
    if (!mediaSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecordState("processing");
        await handleAudioBlob(new Blob(chunksRef.current, { type: mr.mimeType }));
        setRecordState("idle");
      };
      mr.start();
      mediaRef.current = mr;
      setRecordState("recording");
    } catch {
      setError("Could not access microphone. Check browser permissions.");
    }
  }, [mediaSupported, handleAudioBlob]);

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop();
    mediaRef.current = null;
  }, []);

  // ── TTS playback ──────────────────────────────────────────────────────────
  const playResponse = useCallback(async (text: string, idx: number) => {
    if (playingIdx === idx) {
      audioRef.current?.pause();
      setPlayingIdx(null);
      return;
    }
    setPlayingIdx(idx);
    try {
      const res = await fetch("/api/wwai/voice/speak", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text, language: lang }),
      });
      if (!res.ok) { setPlayingIdx(null); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setPlayingIdx(null); URL.revokeObjectURL(url); };
      audio.onerror = () => { setPlayingIdx(null); };
      audio.play();
    } catch {
      setPlayingIdx(null);
    }
  }, [playingIdx, lang]);

  // ── Language change — re-greet ─────────────────────────────────────────
  const handleLanguageChange = (code: string) => {
    setLanguage(code);
  };

  const isRTL       = langObj.dir === "rtl";
  const voiceEnabled = voiceReady && mediaSupported && langObj.deepgramSupported;
  const voiceLabel   = !mediaSupported
    ? t("voiceNotSupported")
    : !langObj.deepgramSupported
      ? (langObj.demoOnlyNotice ?? t("voiceNotConfigured"))
      : !voiceReady
        ? t("voiceNotConfigured")
        : null;

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Language pills ─────────────────────────────────────────────── */}
      <div className="wwai-panel p-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Language</div>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              title={l.deepgramSupported ? "Voice + text" : "Text only (voice coming soon)"}
              className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                lang === l.code
                  ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                  : "bg-transparent border-[#162035] text-slate-400 hover:border-cyan-400/50 hover:text-slate-200"
              }`}
            >
              {l.nativeLabel}
              {!l.deepgramSupported && (
                <span className="ml-1 text-[9px] text-slate-500" title="Text only">T</span>
              )}
            </button>
          ))}
        </div>
        {voiceLabel && (
          <p className="text-[10px] text-amber-400/80 mt-2">{voiceLabel}</p>
        )}
      </div>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <div className="wwai-panel p-4 flex flex-col" style={{ minHeight: 480 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-sm">W</div>
            <div>
              <div className="font-bold text-white text-sm">WhichWay AI</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                {t("demoMode")} · {langObj.label}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {status && (
              <span className={`wwai-chip text-[10px] ${status.deepgramConfigured ? "wwai-chip-green" : "wwai-chip-slate"}`}>
                {status.deepgramConfigured ? "Voice ready" : "Text only"}
              </span>
            )}
            <span className="wwai-chip wwai-chip-cyan text-[10px]">Demo</span>
          </div>
        </div>

        {/* Messages */}
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
                  : <span>{m.viaVoice && <span className="mr-1 text-cyan-400">🎤</span>}{m.text}</span>
                }
              </div>

              {/* Response metadata */}
              {m.response && (
                <div className="mt-1.5 space-y-1.5">
                  {m.response.safetyNotice && (
                    <div className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-400/30 rounded-lg px-3 py-1.5">
                      ⚠️ {m.response.safetyNotice}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {m.response.provider && (
                      <span className={`wwai-chip text-[10px] ${PROVIDER_COLORS[m.response.provider] ?? "wwai-chip-slate"}`}>
                        {PROVIDER_LABELS[m.response.provider] ?? m.response.provider}
                      </span>
                    )}
                    {m.viaVoice && (
                      <span className="wwai-chip wwai-chip-cyan text-[10px]">🎤 Voice</span>
                    )}
                    {m.response.intent && m.response.intent !== "unknown" && (
                      <span className="wwai-chip wwai-chip-slate text-[10px]">{m.response.intent}</span>
                    )}
                    {m.response.demoOnly && (
                      <span className="wwai-chip wwai-chip-amber text-[10px]">Demo data</span>
                    )}
                    {m.response.latencyMs !== undefined && (
                      <span className="wwai-chip wwai-chip-slate text-[10px]">{m.response.latencyMs}ms</span>
                    )}
                    {/* Play response button */}
                    {voiceReady && (
                      <button
                        onClick={() => playResponse(m.text, i)}
                        title={t("playResponse")}
                        className="wwai-chip wwai-chip-slate text-[10px] hover:border-yellow-400 hover:text-yellow-300"
                      >
                        {playingIdx === i ? "⏹ Stop" : "▶ Play"}
                      </button>
                    )}
                  </div>
                  {/* Source chips */}
                  {m.response.sources && m.response.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.response.sources.map((s, si) => (
                        <span key={si} className="wwai-chip wwai-chip-slate text-[10px] opacity-70">{s}</span>
                      ))}
                    </div>
                  )}
                  {/* Action buttons */}
                  {m.response.actions && m.response.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {m.response.actions.map((a) => (
                        <a
                          key={a.href}
                          href={a.href}
                          className="wwai-chip wwai-chip-cyan text-[10px] hover:bg-cyan-400/20 cursor-pointer"
                        >
                          {a.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {(loading || recordState === "processing") && (
            <div className="max-w-[60%] p-3 rounded-xl text-sm bg-cyan-400/5 border border-cyan-400/30 text-cyan-400 animate-pulse">
              {recordState === "processing" ? "Transcribing…" : "WWAI is thinking…"}
            </div>
          )}
          {error && (
            <div className="text-[11px] text-red-400 bg-red-400/5 border border-red-400/30 rounded-lg px-3 py-1.5">
              ⚠️ {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="mt-3 flex gap-2">
          {/* Mic button */}
          <button
            onClick={recordState === "recording" ? stopRecording : startRecording}
            disabled={!voiceEnabled || loading || recordState === "processing"}
            title={
              !voiceEnabled
                ? (voiceLabel ?? t("voiceNotConfigured"))
                : recordState === "recording"
                  ? t("stop")
                  : t("speak")
            }
            className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center text-lg transition-all ${
              recordState === "recording"
                ? "bg-red-500/20 border-red-400 text-red-400 animate-pulse"
                : voiceEnabled
                  ? "bg-cyan-400/10 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
                  : "bg-transparent border-[#1e2d45] text-slate-600 cursor-not-allowed"
            }`}
          >
            {recordState === "recording" ? "⏹" : "🎤"}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && askAPI(input)}
            placeholder={t("askWWAI") + "…"}
            disabled={loading || recordState === "processing"}
            dir={isRTL ? "rtl" : "ltr"}
            className="flex-1 bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm disabled:opacity-50"
          />
          <button
            onClick={() => askAPI(input)}
            disabled={loading || !input.trim() || recordState === "processing"}
            className="wwai-btn-primary text-sm disabled:opacity-50 px-3"
          >
            {loading ? "…" : t("send")}
          </button>
        </div>

        <p className="text-[10px] text-slate-600 mt-2 text-center">
          {t("demoMultilingualNotice")}
        </p>
      </div>

      {/* ── Quick presets ────────────────────────────────────────────────── */}
      <div className="wwai-panel p-4">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Try a question</div>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {WWAI_PRESETS.map((p) => (
            <button
              key={p.q}
              onClick={() => askAPI(p.q)}
              disabled={loading || recordState !== "idle"}
              className="text-left text-xs text-slate-300 hover:text-cyan-300 border border-[#162035] hover:border-cyan-400/50 rounded-lg p-2 disabled:opacity-40"
            >
              {p.q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status footer ────────────────────────────────────────────────── */}
      {status && (
        <div className="wwai-panel p-3 text-xs text-slate-500 space-y-1">
          <div className="flex flex-wrap gap-2">
            <span className={`wwai-chip text-[10px] ${status.deepgramConfigured ? "wwai-chip-green" : "wwai-chip-slate"}`}>
              Voice: {status.deepgramConfigured ? "Deepgram" : "not configured"}
            </span>
            <span className={`wwai-chip text-[10px] ${PROVIDER_COLORS[status.chatProvider] ?? "wwai-chip-slate"}`}>
              Chat: {PROVIDER_LABELS[status.chatProvider] ?? status.chatProvider}
            </span>
            <span className="wwai-chip wwai-chip-slate text-[10px]">RAG: keyword-demo</span>
          </div>
          <p>{t("emergencyNotice")}</p>
          <p>{t("poweredBy")} · <a href="/wwai" className="text-cyan-400/70 hover:text-cyan-300">WWAI</a></p>
        </div>
      )}
    </div>
  );
}
