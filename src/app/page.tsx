"use client";
import Link from "next/link";
import BrandDisclaimer from "@/components/BrandDisclaimer";

const MODULES = [
  { icon: "🤖", label: "AI Concierge",         color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
  { icon: "📱", label: "Guest App",             color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
  { icon: "🤝", label: "Sponsor Portal",        color: "rgba(212,160,23,0.08)", border: "rgba(212,160,23,0.3)" },
  { icon: "💼", label: "Sales Portal",          color: "rgba(212,160,23,0.08)", border: "rgba(212,160,23,0.3)" },
  { icon: "⭐", label: "Rewards Engine",        color: "rgba(212,160,23,0.08)", border: "rgba(212,160,23,0.35)" },
  { icon: "📊", label: "Revenue Console",       color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
  { icon: "🛡", label: "Safety Ops",            color: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.35)" },
  { icon: "🎬", label: "Media Studio",          color: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)" },
  { icon: "⛓", label: "Blockchain Settlement", color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
  { icon: "💸", label: "Commission Payouts",    color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
  { icon: "🎟", label: "Ticketing & Access",    color: "rgba(167,139,250,0.08)",border: "rgba(167,139,250,0.25)" },
  { icon: "🌐", label: "Multi-Language",        color: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
];

const STATS = [
  { value: "2.7M+",  label: "Fans & Users",    icon: "👥" },
  { value: "420+",   label: "Sponsors",         icon: "🤝" },
  { value: "1,250+", label: "Events",           icon: "🎯" },
  { value: "120+",   label: "Countries",        icon: "🌍" },
];

const PHONE_OFFERS = [
  { label: "20% OFF Concessions",   sub: "Today only",        btn: "Redeem" },
  { label: "Buy 1, Get 1 Free",     sub: "Select Beverages",  btn: "Redeem" },
  { label: "$5 OFF Merchandise",    sub: "Min. $25 purchase",  btn: "Redeem" },
];

const FEATURES = [
  { icon: "🤝", label: "Sponsor\nActivation",  sub: "Launch. Engage. Grow." },
  { icon: "🏧", label: "POS",                   sub: "Drive conversion." },
  { icon: "🎁", label: "Rewards",               sub: "Build loyalty." },
  { icon: "🏷", label: "Offer\nRedemption",     sub: "Real-time offers." },
  { icon: "📈", label: "Revenue\nInsights",     sub: "Measure results." },
];

const FLOW_STEPS = [
  "Fan Input", "Language Detection", "Intent Classification",
  "RAG Retrieval", "Cultural Ranking", "Sponsor Injection", "Response / Alert",
];

export default function Home() {
  return (
    <div className="space-y-20 relative">

      {/* ── Hero ── */}
      <section className="text-center pt-10 pb-2 space-y-5 relative overflow-hidden">
        {/* Background city glow */}
        <div className="absolute inset-0 pointer-events-none city-bg-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="pill-gold">AI · Blockchain · Sales Operating System</span>

          {/* TROPTIONS™ chrome title */}
          <div>
            <h1 className="troptions-hero-brand tracking-widest">TROPTIONS<sup className="text-3xl font-normal" style={{WebkitTextFillColor:"#94a3b8",fontSize:"clamp(1rem,2.5vw,1.8rem)"}}>™</sup></h1>
            <p className="troptions-hero-subtitle mt-1">Growth Platform</p>
          </div>

          <p className="text-lg font-semibold tracking-wide">
            <span className="text-cyan-400">Activate</span> sponsors.&nbsp;
            <span className="text-cyan-400">Drive</span> engagement.&nbsp;
            <span className="text-cyan-400">Capture</span> revenue.
          </p>
          <p className="text-slate-500 text-sm">
            Brought to you by <span className="text-[#d4a017] font-bold">TROPTIONS</span>.
          </p>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-7">
            Connect sponsor campaigns, live offers, POS conversion, loyalty rewards, and fan engagement
            into one measurable operating system.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <Link href="/sponsors" className="btn-troptions">
              <span className="troptions-hex-sm text-sm">T</span>
              Grow with TROPTIONS →
            </Link>
            <Link href="/dashboard" className="border border-slate-700 text-slate-300 font-bold px-7 py-3 rounded-xl hover:bg-slate-800/60 transition-colors">
              📊 Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card space-y-2">
            <div className="text-2xl">{s.icon}</div>
            <p className="stat-big">{s.value}</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── Phone Mockup Section ── */}
      <section className="relative overflow-hidden">
        <div className="text-center mb-10 space-y-2">
          <span className="pill-cyan">Platform Preview</span>
          <h2 className="text-2xl font-black text-white">The TROPTIONS App — in action</h2>
          <p className="text-slate-400 text-sm">Sponsor activations, live offers, and rewards — all in one fan experience.</p>
        </div>

        {/* Glow ring */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[80px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center items-end gap-6 flex-wrap relative z-10">

          {/* Left float card — Live Offers */}
          <div className="float-card w-52 mb-8 hidden lg:block">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs font-bold">Live Offers</span>
              <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            {PHONE_OFFERS.map((o) => (
              <div key={o.label} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                <div>
                  <p className="text-white text-[11px] font-semibold leading-tight">{o.label}</p>
                  <p className="text-slate-500 text-[10px]">{o.sub}</p>
                </div>
                <button className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {o.btn}
                </button>
              </div>
            ))}
            <p className="text-cyan-400/60 text-[10px] mt-2 text-right">View all offers →</p>
          </div>

          {/* Center Phone */}
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="text-center pt-2 pb-3 border-b border-slate-800/60">
                <p className="text-white text-xs font-black tracking-widest">TROPTIONS</p>
                <p className="text-cyan-400 text-[10px]">Growth Platform</p>
              </div>

              <div className="space-y-3 overflow-hidden flex-1">
                {/* Sponsor Activations */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Sponsor Activations</p>
                    <span className="text-cyan-400 text-[10px]">View all</span>
                  </div>
                  <div className="card-dark p-2.5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-[11px] font-bold">Summer Fan Drive</p>
                        <p className="text-slate-400 text-[9px]">Presented by TROPTIONS</p>
                      </div>
                      <span className="bg-green-400/10 text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-2">
                      {[["24.8K","Engagements"],["8.7K","Redemptions"],["12.6%","Conv. Rate"]].map(([v,l])=>(
                        <div key={l} className="text-center">
                          <p className="text-white text-[11px] font-bold">{v}</p>
                          <p className="text-slate-500 text-[9px]">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Offers */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Live Offers</p>
                    <span className="text-cyan-400 text-[10px]">View all</span>
                  </div>
                  {PHONE_OFFERS.slice(0,2).map((o)=>(
                    <div key={o.label} className="flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                      <div>
                        <p className="text-white text-[10px] font-semibold">{o.label}</p>
                        <p className="text-slate-500 text-[9px]">{o.sub}</p>
                      </div>
                      <button className="bg-cyan-500 text-[#050810] text-[9px] font-black px-2 py-0.5 rounded">Redeem</button>
                    </div>
                  ))}
                </div>

                {/* Rewards */}
                <div className="card-dark p-2.5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Rewards Wallet</p>
                    <span className="text-cyan-400 text-[10px]">View wallet</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-yellow-400 text-base">⭐</span>
                    <div>
                      <p className="text-[11px] text-slate-400">TROPTIONS Rewards</p>
                      <p className="text-white font-black text-sm">2,450 <span className="text-slate-500 text-[10px] font-normal">pts</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom nav bar */}
              <div className="flex justify-around pt-2 border-t border-slate-800/60 mt-auto">
                {["🏠","🏷","⭐","📋","👤"].map((ic,i)=>(
                  <span key={i} className={`text-base ${i===0?"text-cyan-400":"text-slate-600"}`}>{ic}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right float cards */}
          <div className="space-y-3 hidden lg:block">
            {/* POS Revenue */}
            <div className="float-card w-52">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-bold">POS Revenue</span>
                <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <p className="text-white font-black text-xl mt-1">$128,450</p>
              <p className="text-green-400 text-[11px]">+18.6% vs yesterday</p>
              <div className="h-12 mt-2 relative overflow-hidden rounded">
                <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                  <polyline points="0,35 15,28 30,30 45,20 60,15 75,10 90,5 100,3" fill="none" stroke="#00d4ff" strokeWidth="2"/>
                  <polyline points="0,35 15,28 30,30 45,20 60,15 75,10 90,5 100,3 100,40 0,40" fill="rgba(0,212,255,0.08)"/>
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[["2,843","Transactions"],["$45.21","Avg Order"]].map(([v,l])=>(
                  <div key={l} className="bg-slate-900/60 rounded-lg p-1.5 text-center">
                    <p className="text-white text-xs font-bold">{v}</p>
                    <p className="text-slate-500 text-[9px]">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Rewards Wallet */}
            <div className="float-card w-52">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-bold">Rewards Wallet</span>
                <span className="text-cyan-400 text-[10px]">View all</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <p className="text-slate-400 text-[10px]">TROPTIONS Rewards</p>
                  <p className="text-white font-black text-xl">2,450</p>
                  <p className="text-slate-400 text-[10px]">Points Available</p>
                </div>
                <span className="text-yellow-400 text-3xl">⭐</span>
              </div>
              <div className="mt-2 bg-slate-900/60 rounded-lg p-2">
                <p className="text-slate-400 text-[10px]">Next Tier: Gold</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                  <div className="bg-[#d4a017] h-1.5 rounded-full" style={{width:"82%"}} />
                </div>
                <p className="text-slate-500 text-[9px] mt-0.5">3,000 pts to unlock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capability Modules ── */}
      <section>
        <div className="text-center mb-8 space-y-2">
          <span className="pill-cyan">Capability Modules</span>
          <h2 className="text-2xl font-black text-white">Everything your platform needs</h2>
          <p className="text-slate-400 text-sm">12 integrated modules — one unified operating system.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {MODULES.map((m) => (
            <div key={m.label} className="icon-card">
              <div className="icon-card-inner" style={{ background: m.color, borderColor: m.border }}>
                {m.icon}
              </div>
              <span className="icon-card-label">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Architecture ── */}
      <section className="card-dark rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">Platform Architecture</span>
          <h2 className="text-xl font-bold text-white">Fan Input → Intelligent Response</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 items-center">
          {FLOW_STEPS.map((step, i) => (
            i < FLOW_STEPS.length - 1 ? (
              <span key={`a${i}`} className="flex items-center gap-2">
                <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-300 text-center">
                  {step}
                </div>
                <span className="text-slate-600 text-lg font-bold">→</span>
              </span>
            ) : (
              <div key={step} className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-300 text-center">
                {step}
              </div>
            )
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {[
            { label: "Guest Responses",  value: "Personalized · Actionable",  icon: "💬" },
            { label: "Staff Alerts",     value: "Real-time Notifications",     icon: "🔔" },
            { label: "Revenue Target",   value: "$8.62M",                      icon: "📈" },
            { label: "Live Map Ops",     value: "Routes · Zones · POIs",       icon: "🗺" },
          ].map((o) => (
            <div key={o.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-xl">{o.icon}</div>
              <p className="text-cyan-400 text-xs font-bold">{o.label}</p>
              <p className="text-slate-400 text-xs">{o.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Strip ── */}
      <section className="feature-strip">
        {FEATURES.map((f) => (
          <div key={f.label} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <span className="feature-label" style={{whiteSpace:"pre-line"}}>{f.label}</span>
            <span className="text-slate-600 text-[10px] text-center">{f.sub}</span>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="text-center space-y-5 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#d4a017]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <Link href="/sponsors" className="btn-troptions inline-flex">
            <span className="troptions-hex text-base">T</span>
            Grow with TROPTIONS →
          </Link>
          <p className="text-[#d4a017]/60 font-semibold text-sm tracking-widest uppercase">One System. One Brand. Unlimited Scale.</p>
          <BrandDisclaimer />
        </div>
      </section>
    </div>
  );
}
