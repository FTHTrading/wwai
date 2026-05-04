"use client";
import Link from "next/link";
import BrandDisclaimer from "@/components/BrandDisclaimer";
import TroptionsSystemCard from "@/components/TroptionsSystemCard";
import TroptionsHeroVisual from "@/components/TroptionsHeroVisual";
import TroptionsIconCard   from "@/components/TroptionsIconCard";

const HERO_METRICS = [
  { value: "$128,450", label: "POS Revenue Today",    live: true  },
  { value: "24.8K",    label: "Engagements",          live: true  },
  { value: "12.6%",    label: "Conversion Rate",      live: false },
  { value: "2,843",    label: "Transactions",         live: true  },
];

const PLATFORM_MODULES = [
  {
    icon: "SP",  title: "Sponsor Activation",
    desc: "Package sponsors into tiered programs with defined campaign limits, QR zones, and venue placements.",
    href: "/pricing",   glow: "gold",  status: "live",
  },
  {
    icon: "QR",  title: "QR Campaign Engine",
    desc: "Deploy scan-to-redeem QR codes at stadiums, airports, transit, hotels, and retail locations.",
    href: "/campaigns", glow: "cyan", status: "live",
  },
  {
    icon: "MV",  title: "Venue Network",
    desc: "Map every activation location with category, capacity, and live campaign status in one operations view.",
    href: "/map",       glow: "cyan", status: "live",
  },
  {
    icon: "RW",  title: "Rewards Engine",
    desc: "Build loyalty programs, points wallets, and redemption offers linked to sponsor activations.",
    href: "/wallet",    glow: "gold", status: "live",
  },
  {
    icon: "AN",  title: "Analytics Console",
    desc: "Track impressions, redemptions, conversion rates, and pipeline value across every campaign.",
    href: "/analytics", glow: "cyan", status: "live",
  },
  {
    icon: "FS",  title: "Field Sales Engine",
    desc: "Click-to-call, SMS outreach, payment capture, lead tracking, and commission management.",
    href: "/sales",     glow: "gold", status: "live",
  },
  {
    icon: "PR",  title: "Proposal Builder",
    desc: "Generate sponsor proposals in minutes — package, venue, term, contract value, included services.",
    href: "/proposals", glow: "cyan", status: "live",
  },
  {
    icon: "BI",  title: "Billing & Invoicing",
    desc: "Manage sponsor invoices, payment status, and collected revenue. Square and Stripe integration ready.",
    href: "/billing",   glow: "gold", status: "live",
  },
];

const ECOSYSTEM = [
  { icon: "G",  title: "Guest Web / PWA",   subtitle: "Fan-facing offer redemption",   glow: "cyan", href: "/app",       live: true  },
  { icon: "A",  title: "Admin Control",     subtitle: "Full operator console",          glow: "gold", href: "/dashboard", live: true  },
  { icon: "S",  title: "Staff Console",     subtitle: "Venue ops + field tools",        glow: "cyan", href: "/sales",     live: true  },
  { icon: "R",  title: "Revenue Console",   subtitle: "Billing + invoicing + payouts",  glow: "gold", href: "/billing",   live: true  },
  { icon: "AP", title: "API Core",          subtitle: "Apostle Chain · ATP settlement", glow: "cyan", href: "/wallet",    live: true  },
];

const FLOW_STEPS = [
  { num: "01", label: "Sponsor Package",    desc: "Choose activation tier",          href: "/pricing"   },
  { num: "02", label: "Venue Placement",    desc: "Map physical activation zones",   href: "/map"       },
  { num: "03", label: "Campaign Launch",    desc: "Configure offer + QR layer",      href: "/campaigns" },
  { num: "04", label: "QR Activation",      desc: "Deploy codes, track every scan",  href: "/campaigns" },
  { num: "05", label: "Analytics",          desc: "Measure impressions + revenue",   href: "/analytics" },
  { num: "06", label: "Proposal",           desc: "Generate sales-ready proposal",   href: "/proposals" },
  { num: "07", label: "Invoice + Collect",  desc: "Bill sponsor, record payment",    href: "/billing"   },
];

const ICON_MODULES = [
  { icon: "AR", title: "Arrival",           glow: "cyan" },
  { icon: "LG", title: "Language",          glow: "cyan" },
  { icon: "FD", title: "Food Discovery",    glow: "gold" },
  { icon: "WF", title: "Wayfinding",        glow: "cyan" },
  { icon: "SH", title: "Safety Hotline",    glow: "gold", live: true },
  { icon: "FR", title: "Family Reunion",    glow: "cyan" },
  { icon: "RW", title: "Rewards",           glow: "gold", live: true },
  { icon: "SO", title: "Sponsor Offer",     glow: "cyan", live: true },
  { icon: "SM", title: "SMS Outreach",      glow: "cyan" },
  { icon: "VC", title: "Voice Call",        glow: "gold" },
  { icon: "RA", title: "Revenue Analytics", glow: "cyan", live: true },
  { icon: "MS", title: "Media Studio",      glow: "gold" },
];

export default function Home() {
  return (
    <div className="space-y-24 relative">

      {/* HERO */}
      <section className="pt-10 pb-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none city-bg-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="pill-gold text-xs tracking-wider">
              Activate sponsors. Drive engagement. Capture revenue.
            </span>
            <div className="space-y-1">
              <h1 className="troptions-hero-brand tracking-widest">
                TROPTIONS
              </h1>
              <p className="troptions-hero-subtitle">Growth Platform</p>
            </div>
            <p className="text-slate-300 text-base max-w-lg leading-7">
              One city. One crowd. One revenue operating system.
              Connect sponsor campaigns, live offers, POS conversion, loyalty rewards,
              and fan engagement into one measurable command center.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/pricing"   className="btn-troptions">View Sponsor Packages</Link>
              <Link href="/demo"      className="px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] font-semibold rounded-xl text-sm hover:bg-[#00d4ff]/5 transition-colors">Platform Demo</Link>
              <Link href="/proposals" className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Build Proposal</Link>
            </div>
            <p className="text-[#d4a017]/60 font-semibold text-[11px] tracking-widest uppercase">
              One System. One Brand. Unlimited Scale.
            </p>
          </div>
          <div className="hidden lg:block">
            <TroptionsHeroVisual
              title="Summer Fan Drive"
              subtitle="TROPTIONS Activation · LIVE"
              metrics={HERO_METRICS}
              glow="cyan"
            />
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-gold">Platform Capabilities</span>
          <h2 className="text-2xl font-black text-white">One Connected Operating System</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Sponsor activation, venue mapping, QR campaigns, rewards, analytics, field sales, proposals, and billing
            all inside one platform.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_MODULES.map(m => (
            <TroptionsSystemCard
              key={m.title}
              icon={m.icon}
              title={m.title}
              description={m.desc}
              href={m.href}
              glow={m.glow as "cyan" | "gold"}
              status={m.status as "live"}
            />
          ))}
        </div>
      </section>

      {/* ACTIVATION FLOW */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">End-to-End Revenue Flow</span>
          <h2 className="text-2xl font-black text-white">From First Meeting to Paid Invoice</h2>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {FLOW_STEPS.map((f, i) => (
              <Link key={f.num} href={f.href}
                className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0a0f1e] border border-[#162035] hover:border-[#00d4ff]/30 transition-all text-center group">
                <div className="w-10 h-10 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#00d4ff] text-xs font-black">{i + 1}</span>
                </div>
                <p className="text-white text-xs font-bold group-hover:text-[#00d4ff] transition-colors leading-tight">{f.label}</p>
                <p className="text-slate-600 text-[10px] leading-tight">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Link href="/demo" className="text-[#00d4ff] text-sm font-semibold hover:text-white transition-colors">
            Walk the full demo flow
          </Link>
        </div>
      </section>

      {/* PLATFORM ECOSYSTEM */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">Platform Ecosystem</span>
          <h2 className="text-2xl font-black text-white">Five Connected Consoles</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Guest experience, admin control, staff ops, revenue management, and API settlement all connected.
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {ECOSYSTEM.map(e => (
            <TroptionsIconCard
              key={e.title}
              icon={e.icon}
              title={e.title}
              subtitle={e.subtitle}
              glow={e.glow as "cyan" | "gold"}
              href={e.href}
              live={e.live}
            />
          ))}
        </div>
      </section>

      {/* LIVE OFFER / REWARDS HUD */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card-dark rounded-2xl border border-[#d4a017]/20 overflow-hidden">
          <div className="border-b border-[#162035] px-5 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">Rewards Wallet</span>
            <Link href="/wallet" className="text-[#00d4ff] text-xs font-semibold hover:text-white transition-colors">View wallet</Link>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#d4a017]/10 border border-[#d4a017]/20 flex items-center justify-center">
                <span className="text-[#d4a017] text-2xl font-black">*</span>
              </div>
              <div>
                <p className="text-white font-black text-3xl">2,450</p>
                <p className="text-slate-500 text-xs">TROPTIONS Reward Points</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Next Tier: Gold</span>
                <span className="text-[#d4a017] font-bold">550 pts to unlock</span>
              </div>
              <div className="h-1.5 bg-[#162035] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#d4a017] to-[#FFD700]" style={{ width: "82%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card-dark rounded-2xl border border-[#00d4ff]/20 overflow-hidden">
          <div className="border-b border-[#162035] px-5 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">Live Offers</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-bold">LIVE</span>
            </span>
          </div>
          <div className="p-3 space-y-2">
            {[
              { title: "20% OFF Concessions", sub: "Valid today only" },
              { title: "Buy 1, Get 1 Free",   sub: "Select Beverages" },
              { title: "$5 OFF Merchandise",  sub: "Min. $25 purchase" },
            ].map(o => (
              <div key={o.title} className="flex items-center justify-between gap-3 bg-[#050810] rounded-xl px-3 py-2.5 border border-[#162035]">
                <div>
                  <p className="text-white text-xs font-semibold">{o.title}</p>
                  <p className="text-slate-600 text-[10px]">{o.sub}</p>
                </div>
                <Link href="/sales" className="text-[10px] font-bold text-[#050810] bg-[#00d4ff] px-2.5 py-1 rounded-lg whitespace-nowrap hover:bg-cyan-300 transition-colors">
                  Redeem
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark rounded-2xl border border-[#00d4ff]/20 overflow-hidden">
          <div className="border-b border-[#162035] px-5 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">POS Revenue</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-bold">LIVE</span>
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[#00d4ff] font-black text-3xl">$128,450</p>
              <p className="text-slate-500 text-xs">Today · <span className="text-green-400 font-semibold">+18.6% vs yesterday</span></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "2,843",  l: "Transactions",   d: "+15.3%" },
                { v: "$45.21", l: "Avg Order Value", d: "+9.7%"  },
              ].map(s => (
                <div key={s.l} className="bg-[#050810] rounded-xl border border-[#162035] p-3">
                  <p className="text-white font-black text-lg">{s.v}</p>
                  <p className="text-slate-500 text-[10px]">{s.l}</p>
                  <p className="text-green-400 text-[9px] font-bold mt-0.5">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODULE ICON SYSTEM */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-gold">Platform Module System</span>
          <h2 className="text-2xl font-black text-white">Every Guest Service. Every Revenue Layer.</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Arrival, language, wayfinding, safety, rewards, sponsorship, messaging, analytics, and media
            modular, multilingual, and measurable.
          </p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
          {ICON_MODULES.map(m => (
            <TroptionsIconCard
              key={m.title}
              icon={m.icon}
              title={m.title}
              glow={m.glow as "cyan" | "gold"}
              live={m.live}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card-dark rounded-2xl p-10 text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-[#00d4ff]/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-[#d4a017]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 space-y-5">
          <div className="troptions-hex mx-auto">T</div>
          <h2 className="text-2xl font-black text-white">
            Grow with <span className="gradient-cyan">TROPTIONS</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Activate sponsors. Drive engagement. Capture revenue. One platform. Unlimited scale.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pricing"   className="btn-troptions">View Pricing</Link>
            <Link href="/proposals" className="px-5 py-2.5 border border-[#d4a017]/40 text-[#d4a017] font-semibold rounded-xl text-sm hover:bg-[#d4a017]/5 transition-colors">Build Proposal</Link>
            <Link href="/map"       className="px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] font-semibold rounded-xl text-sm hover:bg-[#00d4ff]/5 transition-colors">Explore Venues</Link>
            <Link href="/analytics" className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">View Analytics</Link>
            <Link href="/demo"      className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Platform Demo</Link>
            <Link href="/contact"   className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Contact Sales</Link>
          </div>
          <p className="text-[#d4a017]/60 font-semibold text-xs tracking-widest uppercase pt-2">One System. One Brand. Unlimited Scale.</p>
          <BrandDisclaimer />
        </div>
      </section>

    </div>
  );
}
