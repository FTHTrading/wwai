import AppShell from "@/components/layout/AppShell";
import WWAIVoiceConcierge from "@/components/agent/WWAIVoiceConcierge";

export default function WWAIPage() {
  return (
    <AppShell
      title="Not sure where to go? WhichWay AI knows."
      subtitle="WWAI is the AI concierge for event cities — finding restaurants, hotels, bars, pickup zones, sponsor offers, language support, and safety-informed routes from hotel to seat and seat to hotel."
      badges={["Demo concierge", "8 demo languages", "Powered by TROPTIONS"]}
    >
      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        <div className="hidden lg:flex justify-center wwai-panel p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wwai-logo.png"
            alt="WWAI"
            width={220}
            height={220}
            className="object-contain drop-shadow-[0_0_30px_rgba(0,213,255,0.45)]"
          />
        </div>
        <WWAIVoiceConcierge />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          { t: "What is WWAI?",            d: "The guest-facing AI concierge layer of TROPTIONS." },
          { t: "What can WWAI help with?", d: "Food, hotels, bars, pickup, sponsor offers, routes, languages." },
          { t: "Multilingual demo",        d: "8 languages available in demo. Production needs reviewed packs." },
          { t: "Route builder",            d: "Hotel→seat and seat→hotel safety-informed routes." },
        ].map((c) => (
          <div key={c.t} className="wwai-card p-4">
            <div className="font-bold text-white">{c.t}</div>
            <div className="text-sm text-slate-400 mt-1">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="wwai-panel p-4 mt-6 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">Behind WWAI:</span>{" "}
        TROPTIONS sells and operates the system. Businesses register, packages are selected, proposals are
        built, campaigns launch, analytics track value, and billing is prepared. WWAI surfaces the result of
        all that work to the guest.
      </div>
    </AppShell>
  );
}
