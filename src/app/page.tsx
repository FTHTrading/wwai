"use client";
import Link from "next/link";
import BrandDisclaimer from "@/components/BrandDisclaimer";

const CAPABILITIES = [
  { label: "Sponsor Activation",     desc: "Package sponsors into tiered programs with defined campaign limits, QR zones, and venue placements.",   href: "/pricing" },
  { label: "QR Campaign Engine",      desc: "Deploy scan-to-redeem QR codes at stadiums, airports, transit, hotels, and retail locations.",           href: "/campaigns" },
  { label: "Venue Network",           desc: "Map every activation location with category, capacity, and live campaign status in one operations view.", href: "/map" },
  { label: "Proposal Generator",      desc: "Build a sponsor proposal in minutes. Select package, venue, term, and see total contract value live.",    href: "/proposals" },
  { label: "Revenue Analytics",       desc: "Track impressions, clicks, QR scans, redemptions, conversion rates, and pipeline value in real time.",    href: "/analytics" },
  { label: "Billing & Invoicing",     desc: "Manage sponsor invoices, payment status, and collected revenue. Square and Stripe integration ready.",    href: "/billing" },
];

const FLOW = [
  { step: "01", label: "Select Package",     desc: "Choose from Local Venue, Category Sponsor, City Activation, World Cup, or Enterprise tiers.",   href: "/pricing" },
  { step: "02", label: "Place at Venue",      desc: "Assign sponsor to one or more activation venues. Stadiums, airports, transit, and retail.",       href: "/map" },
  { step: "03", label: "Launch Campaign",     desc: "Configure campaign type, QR zones, offer type, and audience targeting.",                          href: "/campaigns" },
  { step: "04", label: "Activate QR",         desc: "Deploy scan-to-redeem codes. Every scan and redemption is logged in real time.",                  href: "/campaigns" },
  { step: "05", label: "Measure Results",     desc: "View impressions, conversion rate, redemption volume, and revenue attribution.",                   href: "/analytics" },
  { step: "06", label: "Build Proposal",      desc: "Generate a formatted proposal with package details, contract value, and estimated ROI.",           href: "/proposals" },
  { step: "07", label: "Invoice & Collect",   desc: "Issue sponsor invoices and track payment status. Supports manual, Square, and Stripe.",            href: "/billing" },
];

const STATS = [
  { value: "52",     label: "Platform Routes",      note: "Live in this system" },
  { value: "5",      label: "Sponsor Tiers",         note: "$2.5K – $120K/mo" },
  { value: "100%",   label: "QR Attribution",        note: "Every scan tracked" },
  { value: "7-Day",  label: "Campaign Activation",   note: "Standard onboarding" },
];

export default function Home() {
  return (
    <div className="space-y-20 relative">

      {/* Hero */}
      <section className="text-center pt-10 pb-4 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none city-bg-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <span className="pill-gold">Sponsor Activation · QR Campaigns · Revenue Intelligence</span>

          <div>
            <h1 className="troptions-hero-brand tracking-widest">
              TROPTIONS<sup className="text-3xl font-normal" style={{WebkitTextFillColor:"#94a3b8", fontSize:"clamp(1rem,2.5vw,1.8rem)"}}>™</sup>
            </h1>
            <p className="troptions-hero-subtitle mt-1">Sales Operating System</p>
          </div>

          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-7">
            A complete platform for selling sponsor packages, running QR activation campaigns,
            tracking venue placements, and measuring revenue — from first conversation to paid invoice.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/pricing"   className="btn-troptions">View Sponsor Packages →</Link>
            <Link href="/demo"      className="px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] font-semibold rounded-xl text-sm hover:bg-[#00d4ff]/5 transition-colors">See Demo Flow</Link>
            <Link href="/proposals" className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Build a Proposal</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="stat-card space-y-1">
            <p className="stat-big text-[#00d4ff]">{s.value}</p>
            <p className="text-white text-xs font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-slate-500 text-[11px]">{s.note}</p>
          </div>
        ))}
      </section>

      {/* Sales Flow */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-cyan">End-to-End Sales Flow</span>
          <h2 className="text-2xl font-black text-white">From First Meeting to Paid Invoice</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Every step in the sponsor lifecycle is handled inside one system.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FLOW.slice(0, 4).map(f => (
            <Link key={f.step} href={f.href} className="card-dark rounded-2xl p-5 space-y-2 card-dark-hover group">
              <span className="text-[#00d4ff]/40 text-xs font-mono font-bold">{f.step}</span>
              <h3 className="text-white font-bold text-sm group-hover:text-[#00d4ff] transition-colors">{f.label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {FLOW.slice(4).map(f => (
            <Link key={f.step} href={f.href} className="card-dark rounded-2xl p-5 space-y-2 card-dark-hover group">
              <span className="text-[#00d4ff]/40 text-xs font-mono font-bold">{f.step}</span>
              <h3 className="text-white font-bold text-sm group-hover:text-[#00d4ff] transition-colors">{f.label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="pill-gold">Platform Capabilities</span>
          <h2 className="text-2xl font-black text-white">Built for Sponsors, Sales Teams, and Operators</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map(c => (
            <Link key={c.label} href={c.href} className="card-dark rounded-2xl p-5 space-y-2 card-dark-hover group">
              <h3 className="text-white font-semibold group-hover:text-[#00d4ff] transition-colors">{c.label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
              <span className="text-[#00d4ff] text-xs font-semibold">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Block */}
      <section className="card-dark rounded-2xl p-10 text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#d4a017]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 space-y-5">
          <div className="troptions-hex mx-auto">T</div>
          <h2 className="text-2xl font-black text-white">Ready to activate sponsors?</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Browse sponsor packages, build a proposal, or walk through the full demo flow.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pricing"      className="btn-troptions">View Packages →</Link>
            <Link href="/demo"         className="px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] font-semibold rounded-xl text-sm hover:bg-[#00d4ff]/5 transition-colors">Demo Flow</Link>
            <Link href="/case-studies" className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Case Studies</Link>
            <Link href="/contact"      className="px-5 py-2.5 border border-[#162035] text-slate-300 font-semibold rounded-xl text-sm hover:border-slate-600 transition-colors">Contact Sales</Link>
          </div>
          <p className="text-[#d4a017]/60 font-semibold text-xs tracking-widest uppercase pt-2">One System. One Brand. Unlimited Scale.</p>
          <BrandDisclaimer />
        </div>
      </section>

    </div>
  );
}

