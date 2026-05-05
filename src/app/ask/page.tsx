import AppShell from "@/components/layout/AppShell";
import WWAIVoiceConcierge from "@/components/agent/WWAIVoiceConcierge";

export const metadata = {
  title: "Ask WWAI — WhichWay AI Event Concierge",
  description:
    "Ask WhichWay AI anything about food, hotels, bars, pickup, routes, sponsor offers, and safety — in 8 languages with voice support.",
};

export default function AskPage() {
  return (
    <AppShell
      title="Ask WWAI"
      subtitle="Voice or text — in 8 languages. WWAI finds food, hotels, bars, pickup zones, sponsor offers, and safety-informed routes."
      badges={["Voice ready", "8 languages", "Safety-informed", "Demo build"]}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <WWAIVoiceConcierge />

        {/* Voice setup status */}
        <div className="wwai-panel p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-300 text-sm">Voice setup</div>
          <ul className="space-y-1">
            <li>🟢 Text chat — always available (OpenAI → Ollama → Demo RAG)</li>
            <li>🟡 Voice input (STT) — requires <code className="bg-[#0a1220] px-1 rounded">DEEPGRAM_API_KEY</code> env var</li>
            <li>🟡 Voice output (TTS) — requires <code className="bg-[#0a1220] px-1 rounded">DEEPGRAM_API_KEY</code> env var</li>
          </ul>
          <p className="text-[11px] text-slate-500">
            Set <code className="bg-[#0a1220] px-1 rounded">DEEPGRAM_API_KEY</code> in your environment to enable voice features.
            Text chat works without any API key using deterministic demo data.
          </p>
        </div>

        {/* Language support */}
        <div className="wwai-panel p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-300 text-sm">Language support</div>
          <div className="grid grid-cols-2 gap-1">
            {[
              { flag: "🇺🇸", lang: "English",    voice: true  },
              { flag: "🇪🇸", lang: "Español",    voice: true  },
              { flag: "🇫🇷", lang: "Français",   voice: true  },
              { flag: "🇩🇪", lang: "Deutsch",    voice: true  },
              { flag: "🇧🇷", lang: "Português",  voice: true  },
              { flag: "🇯🇵", lang: "日本語",      voice: true  },
              { flag: "🇨🇳", lang: "中文",        voice: false },
              { flag: "🇸🇦", lang: "العربية",    voice: false },
            ].map((l) => (
              <div key={l.lang} className="flex items-center gap-1.5">
                <span>{l.flag}</span>
                <span>{l.lang}</span>
                <span className={`text-[10px] ${l.voice ? "text-green-400" : "text-slate-500"}`}>
                  {l.voice ? "✓ voice" : "text only"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Demo multilingual mode. Production translations require reviewed language packs.
          </p>
        </div>

        {/* What WWAI knows */}
        <div className="wwai-panel p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-300 text-sm">What WWAI knows</div>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {[
              { topic: "Restaurants",       detail: "8 demo venues, cuisines, pricing, offers" },
              { topic: "Hotels",            detail: "6 demo hotels with routes and shuttle times" },
              { topic: "Bars & Nightlife",  detail: "5 demo bars (age 21+ reminder)" },
              { topic: "Transport",         detail: "4 pickup zones with ETAs and driver rates" },
              { topic: "Sponsor Offers",    detail: "5 demo sponsor packages with QR offers" },
              { topic: "Routes",            detail: "Hotel→Seat and Seat→Hotel safety-informed routes" },
              { topic: "Registration",      detail: "Business, restaurant, hotel, driver, sponsor sign-up" },
              { topic: "Safety Nodes",      detail: "4 verified safety corridors (demo data)" },
            ].map((w) => (
              <div key={w.topic} className="border border-[#162035] rounded-lg p-2">
                <div className="font-medium text-slate-300">{w.topic}</div>
                <div className="text-[11px]">{w.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety */}
        <div className="wwai-panel p-3 border-amber-400/30 border text-[11px] text-amber-300">
          ⚠️ For emergencies, contact local emergency services immediately (911 in the US).
          WWAI is a demo concierge and does not replace professional safety services.
          All data shown is illustrative demo data only.
        </div>
      </div>
    </AppShell>
  );
}
