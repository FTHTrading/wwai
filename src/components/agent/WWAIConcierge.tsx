"use client";

import { useState } from "react";
import { LANGUAGES, WWAI_PRESETS } from "@/data/demoData";

interface Msg { role: "user" | "wwai"; text: string }

export default function WWAIConcierge() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "wwai", text: "Hi — I'm WWAI. Nowhere to go? I know. Ask about food, hotels, pickup, sponsor offers, or routes." },
  ]);
  const [input, setInput] = useState("");

  const ask = (q: string) => {
    if (!q.trim()) return;
    const preset = WWAI_PRESETS.find((p) => p.q === q);
    const a = preset?.a ||
      "Demo response: I would route this to the WWAI agent in production. Connect a live AI runtime + RAG sources for full answers.";
    setMessages((arr) => [...arr, { role: "user", text: q }, { role: "wwai", text: a }]);
    setInput("");
  };

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

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] p-3 rounded-xl text-sm ${
              m.role === "wwai"
                ? "bg-cyan-400/5 border border-cyan-400/30 text-slate-100"
                : "bg-[#0a1220] border border-[#162035] text-slate-300 ml-auto"
            }`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask WWAI…"
            className="flex-1 bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
          />
          <button onClick={() => ask(input)} className="wwai-btn-primary text-sm">Send</button>
        </div>
        <p className="disclaimer-bar mt-2">Demo responses. Production requires live AI runtime + RAG sources.</p>
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
              <button key={p.q} onClick={() => ask(p.q)} className="text-left text-xs text-slate-300 hover:text-cyan-300 border border-[#162035] hover:border-cyan-400 rounded-lg p-2">
                {p.q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
