import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TROPTIONS™ — AI + Blockchain + Sales Operating System",
  description: "TROPTIONS is a sovereign sales and activation platform built on blockchain settlement, AI intelligence, and real-world fan engagement infrastructure.",
};

const TIMELINE = [
  { year: "2012", label: "TROPTIONS Founded",       desc: "The TROPTIONS token ecosystem is established as a commodity-backed digital asset framework." },
  { year: "2017", label: "Blockchain Integration",  desc: "TROPTIONS integrates with XRPL and Stellar for real-time settlement across merchant and consumer touchpoints." },
  { year: "2021", label: "NIL Protocol Launch",     desc: "The TROPTIONS NIL protocol enables name, image, and likeness rights management on-chain." },
  { year: "2023", label: "TSN Network Launch",      desc: "The TROPTIONS Settlement Network (TSN) goes live with 15 namespaces covering RWA, commodities, and event operations." },
  { year: "2024", label: "Apostle Chain Deploy",    desc: "Apostle Chain (chain_id 7332) launches as a dedicated Rust/Axum settlement backbone with Ed25519 signing and mesh agent architecture." },
  { year: "2026", label: "AI + Sales OS Release",   desc: "The TROPTIONS Sales Operating System launches: multi-brain AI, sponsor activation, venue onboarding, QR campaigns, and real-time revenue intelligence." },
];

const PILLARS = [
  { title: "Blockchain Settlement",  body: "Real-time ATP settlement via Apostle Chain with XRPL and Stellar bridges. Tamper-evident NFT receipts for every transaction." },
  { title: "AI Concierge",          body: "Multi-model AI routing across NIM and Ollama inference. Sovereign compute on local GPU — no cloud dependency required." },
  { title: "Sponsor Activation",    body: "Structured sponsor packages from Smart Placement to Rewards Engine. Cultural intelligence for global fan audiences." },
  { title: "Venue Network",         body: "Stadiums, hotels, transit hubs, and retail locations onboarded as activation points. QR campaigns and offer redemption at scale." },
  { title: "Sales Engine",          body: "Full CRM pipeline: lead capture, deal tracking, SMS/voice outreach, Square payment links, and commission reporting." },
  { title: "Revenue Intelligence",  body: "Live dashboards tracking impressions, clicks, redemptions, commissions, and pipeline value across every operator touchpoint." },
];

const TEAM_DISCLAIMER = "TROPTIONS™ is operated by authorized TROPTIONS network operators and sales partners. Contact us for onboarding inquiries.";

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-10 pb-4 text-center space-y-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <span className="pill-gold">About TROPTIONS</span>
          <h1 className="troptions-hero-brand">The Platform</h1>
          <p className="troptions-hero-subtitle">Built Different</p>
          <p className="text-slate-400 max-w-2xl mx-auto leading-7">
            TROPTIONS is not a startup. It is a mature, production-tested commodity token and settlement network
            that has been operating since 2012. The Sales Operating System is the next layer —
            bringing AI intelligence, sponsor activation, and real-time revenue infrastructure to global events.
          </p>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="pill-cyan">Platform Architecture</span>
          <h2 className="text-2xl font-bold text-white mt-2">Six Core Capabilities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="card-dark p-5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff]/20 to-[#d4a017]/20 border border-[#162035] flex items-center justify-center text-xs font-bold text-[#00d4ff]">
                  {i + 1}
                </div>
                <h3 className="text-white font-semibold text-sm">{p.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="pill-gold">History</span>
          <h2 className="text-2xl font-bold text-white mt-2">TROPTIONS Timeline</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-0">
          {TIMELINE.map((t, i) => (
            <div key={t.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#d4a017] bg-[#0a0f1e] flex items-center justify-center text-[#d4a017] text-xs font-bold shrink-0">
                  {t.year.slice(2)}
                </div>
                {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-[#162035] my-1" />}
              </div>
              <div className="pb-6 space-y-1">
                <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-widest">{t.year}</p>
                <p className="text-white font-semibold">{t.label}</p>
                <p className="text-slate-400 text-sm">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { v: "2012", l: "Founded" },
          { v: "15",   l: "TSN Namespaces" },
          { v: "7332", l: "Apostle Chain ID" },
          { v: "120+", l: "Countries Reached" },
        ].map(s => (
          <div key={s.l} className="stat-card">
            <p className="stat-big text-[#d4a017]">{s.v}</p>
            <p className="text-slate-400 text-xs mt-1">{s.l}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold text-white">Ready to Activate?</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Whether you are a sponsor, venue operator, or sales partner — TROPTIONS has a path for you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/contact"   className="btn-troptions inline-flex">Get in Touch →</a>
          <a href="/sponsors"  className="px-5 py-2.5 border border-[#d4a017]/50 text-[#d4a017] rounded-xl font-semibold text-sm hover:bg-[#d4a017]/10 transition-colors">Partner Portal</a>
          <a href="/venues"    className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors">Venue Network</a>
        </div>
        <p className="text-slate-600 text-xs max-w-lg mx-auto">{TEAM_DISCLAIMER}</p>
      </section>
    </div>
  );
}
