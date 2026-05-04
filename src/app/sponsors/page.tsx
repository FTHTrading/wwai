"use client";
import { useState } from "react";

const AUDIENCES = [
  { flag: "🇪🇸", country: "Spain",        tagline: "La Familia",       lang: "ES", fans: "2.4M", desc: "Passionate, family-first fans. Football is life. Engage in Spanish with cultural warmth." },
  { flag: "🇲🇦", country: "Morocco",      tagline: "Atlas Lions",      lang: "AR", fans: "1.8M", desc: "Proud, unified, deeply community-driven. Arabic and Darija communication builds trust." },
  { flag: "🇿🇦", country: "South Africa", tagline: "Bafana Nation",    lang: "ZU", fans: "1.2M", desc: "Electric energy and national pride. isiZulu and English outreach resonates deeply." },
  { flag: "🇸🇦", country: "Saudi Arabia", tagline: "Green Falcons",    lang: "AR", fans: "1.6M", desc: "Growing football culture with high spending power. Culturally respectful Arabic messaging." },
  { flag: "🇭🇹", country: "Haiti",        tagline: "Les Grenadiers",   lang: "HT", fans: "0.9M", desc: "Resilient, passionate, community-driven. Kreyòl Ayisyen outreach builds authentic connection." },
  { flag: "🇺🇿", country: "Uzbekistan",   tagline: "White Wolves",     lang: "UZ", fans: "0.7M", desc: "Emerging market with dedicated fans. Uzbek language content creates strong loyalty." },
  { flag: "🇨🇻", country: "Cape Verde",   tagline: "Tubarões Azuis",   lang: "PT", fans: "0.4M", desc: "Small but mighty fanbase. Portuguese language creates home-away connection." },
];

const PACKAGES = [
  {
    id: "smart",
    name: "Smart Placement",
    badge: "",
    price: "$25K–$75K",
    color: "border-slate-700 text-slate-300",
    header: "border-slate-700",
    features: ["Map pin placement at key locations", "QR code activations (up to 5 zones)", "Basic fan engagement analytics", "English + 1 language SMS outreach", "Monthly performance report"],
  },
  {
    id: "cultural",
    name: "Cultural Concierge",
    badge: "MOST POPULAR",
    price: "$100K–$300K",
    color: "border-cyan-500/60 text-white",
    header: "border-cyan-500/40 bg-cyan-500/5",
    features: ["Full cultural audience targeting (7 nations)", "AI-powered multilingual concierge mentions", "Sponsor injection in fan responses", "Dedicated map zone + venue activation", "Real-time revenue analytics dashboard", "Voice call + SMS campaign integration", "Cultural Concierge persona activation"],
  },
  {
    id: "reward",
    name: "Reward Engine",
    badge: "ENTERPRISE",
    price: "$400K+",
    color: "border-amber-500/50 text-amber-200",
    header: "border-amber-500/30 bg-amber-500/5",
    features: ["Everything in Cultural Concierge", "Custom fan rewards & loyalty program", "NFT-backed digital collectibles on XRPL", "Priority safety map placement", "Exclusive sponsor zone at stadium", "Dedicated account team", "Full white-label activation option"],
  },
];

const STEPS = [
  { num: "01", title: "Choose a Tier",       desc: "Select Smart Placement, Cultural Concierge, or Reward Engine based on your budget and goals." },
  { num: "02", title: "Define Targeting",    desc: "Select which fan nations, languages, and stadium zones your campaign will reach." },
  { num: "03", title: "Launch Creative",     desc: "Upload your brand assets. We integrate them into AI responses, map pins, and SMS campaigns." },
  { num: "04", title: "Measure Results",     desc: "Track real-time impressions, fan engagements, redemptions, and revenue contribution." },
];

const PILLARS = [
  { icon: "🌍", label: "Global Scale",          val: "64 match venues · 3.2M fans" },
  { icon: "🧠", label: "Cultural Intelligence",  val: "12 languages · 7 nations" },
  { icon: "📊", label: "Measurable Impact",      val: "$8.62M revenue target" },
  { icon: "🛡", label: "Brand Safety",           val: "AI-guardrailed responses" },
  { icon: "🤝", label: "End-to-End Support",     val: "Dedicated activation team" },
];

export default function SponsorsPage() {
  const [activeAudience, setActiveAudience] = useState(0);
  const [activePackage,  setActivePackage]  = useState("cultural");

  const aud = AUDIENCES[activeAudience];

  return (
    <div className="space-y-16">

      {/* Header */}
      <div className="text-center space-y-3 pt-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none city-bg-glow" />
        <div className="relative z-10 space-y-3">
          <span className="pill-gold">TROPTIONS Partner Portal</span>
          <h1 className="troptions-hero-brand tracking-widest">TROPTIONS<sup style={{WebkitTextFillColor:"#94a3b8",fontSize:"clamp(1rem,2.5vw,1.8rem)"}}>™</sup></h1>
          <p className="troptions-hero-subtitle text-3xl md:text-4xl">Partner Portal</p>
          <p className="text-lg font-semibold">
            <span className="text-cyan-400">Activate</span> sponsors.&nbsp;
            <span className="text-cyan-400">Drive</span> engagement.&nbsp;
            <span className="text-cyan-400">Capture</span> revenue.
          </p>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-7">
            Reach millions of fans across 7 nations in their own language. Culturally intelligent sponsor activation
            powered by the TROPTIONS growth platform.
          </p>
          <p className="text-[#d4a017]/60 text-sm font-semibold tracking-widest uppercase">One System. One Brand. Unlimited Scale.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {PILLARS.map((p) => (
          <div key={p.label} className="stat-card space-y-1.5 hover:border-[#d4a017]/30 transition-colors">
            <div className="text-2xl">{p.icon}</div>
            <p className="text-white text-sm font-bold">{p.label}</p>
            <p className="text-cyan-400 text-xs">{p.val}</p>
          </div>
        ))}
      </div>

      {/* Audience Profiles */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">Audience Profiles</span>
          <h2 className="text-2xl font-bold text-white">Connect with every fan nation</h2>
        </div>

        {/* Nation tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {AUDIENCES.map((a, i) => (
            <button
              key={a.country}
              onClick={() => setActiveAudience(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeAudience === i
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-400"
                  : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-base">{a.flag}</span>
              <span>{a.country}</span>
            </button>
          ))}
        </div>

        {/* Active profile */}
        <div className="card-dark rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{aud.flag}</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{aud.country}</h3>
                  <p className="text-cyan-400 text-base font-semibold italic">{aud.tagline}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{aud.desc}</p>
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-white font-bold text-lg">{aud.fans}</p>
                  <p className="text-slate-500 text-xs">Expected Fans</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-cyan-400 font-bold font-mono text-lg">{aud.lang}</p>
                  <p className="text-slate-500 text-xs">Primary Language</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Arrival Assistance", "Safety Alerts", "Food & Venue", "Sponsor Offers", "Wayfinding", "Rewards"].map((feat) => (
                <div key={feat} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"/>
                  <span className="text-slate-300 text-xs font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Packages */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">Sponsor Packages</span>
          <h2 className="text-2xl font-bold text-white">Choose your activation level</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setActivePackage(pkg.id)}
              className={`rounded-2xl border cursor-pointer transition-all overflow-hidden ${pkg.color} ${
                activePackage === pkg.id ? "shadow-lg shadow-cyan-500/10 scale-[1.01]" : "opacity-90 hover:opacity-100"
              }`}
            >
              {/* Package header */}
              <div className={`px-6 py-5 border-b ${pkg.header} space-y-1`}>
                {pkg.badge && (
                  <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">{pkg.badge}</span>
                )}
                <h3 className="text-lg font-black mt-1">{pkg.name}</h3>
                <p className="text-slate-400 text-sm font-semibold">{pkg.price}</p>
              </div>
              {/* Features */}
              <div className="px-6 py-5 space-y-2.5">
                {pkg.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="text-cyan-400 text-sm mt-0.5 shrink-0">✓</span>
                    <span className="text-slate-300 text-xs leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <a href="/sales" className={`block w-full text-center font-bold py-2.5 rounded-xl text-sm transition-colors ${
                  pkg.id === "cultural"
                    ? "bg-cyan-500 text-gray-950 hover:bg-cyan-400"
                    : "border border-slate-700 text-slate-300 hover:border-slate-600"
                }`}>
                  Get Started →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activation Journey */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">Activation Journey</span>
          <h2 className="text-2xl font-bold text-white">From contract to live campaign in 4 steps</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="card-dark rounded-2xl p-5 space-y-3 relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-slate-700 text-xl font-bold z-10">→</div>
              )}
              <div className="step-circle">{s.num}</div>
              <h3 className="text-white font-bold text-sm">{s.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card-dark rounded-2xl p-8 text-center space-y-5">
        <h2 className="text-2xl font-extrabold text-white">Ready to reach 2.7 million fans?</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Join the TROPTIONS sponsor network and activate a culturally intelligent campaign across live events worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/sales" className="btn-troptions">
            <span className="troptions-hex-sm">T</span>
            Grow with TROPTIONS →
          </a>
          <a href="/map" className="border border-slate-700 text-slate-300 font-bold px-8 py-3 rounded-xl hover:border-slate-600 transition-colors">
            Live Ops Map
          </a>
        </div>
        <p className="text-[#d4a017]/50 text-xs font-semibold tracking-widest uppercase">One System. One Brand. Unlimited Scale.</p>
      </section>
    </div>
  );
}
