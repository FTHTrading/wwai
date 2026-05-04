"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SponsorPackage {
  id:                  string;
  slug:                string;
  name:                string;
  tagline:             string | null;
  monthlyFee:          number;
  setupFee:            number;
  campaignLimit:       number;
  qrLimit:             number;
  venuePlacementLimit: number;
  reportingLevel:      string;
  includedServices:    string | null;
  featured:            boolean;
}

const REPORTING: Record<string, string> = {
  basic:      "Monthly PDF report",
  standard:   "Bi-weekly analytics dashboard",
  advanced:   "Weekly live dashboard + alerts",
  enterprise: "Real-time portal + executive reports",
};

const addons = [
  { category: "QR & Redemption", items: [
    { name: "Additional QR Activation Zone",  price: "$1,200/mo each" },
    { name: "Custom Reward Type",             price: "$800/mo" },
    { name: "QR Event Analytics Export",     price: "$500/mo" },
    { name: "QR Print & Production Kit",     price: "$750 one-time" },
  ]},
  { category: "Campaign Add-Ons", items: [
    { name: "Extra Campaign Slot",       price: "$3,500/mo each" },
    { name: "Multilingual Campaign",     price: "$1,800/mo" },
    { name: "Social Media Amplification",price: "$2,200/mo" },
    { name: "Influencer Integration",    price: "$4,000/mo" },
  ]},
  { category: "Venue Expansion", items: [
    { name: "Additional Venue Placement",    price: "$2,500/mo each" },
    { name: "Premium Stadium Placement",     price: "$8,000/mo" },
    { name: "Airport Terminal Activation",   price: "$12,000/mo" },
    { name: "Transit Network Coverage",      price: "$5,500/mo" },
  ]},
  { category: "Technology", items: [
    { name: "White-Label Reporting Portal", price: "$2,000/mo" },
    { name: "API Data Feed",               price: "$1,500/mo" },
    { name: "Custom App Integration",      price: "Quote" },
    { name: "Dedicated Account Manager",   price: "$3,000/mo" },
  ]},
];

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toLocaleString()}`;

export default function PricingPage() {
  const [packages, setPackages] = useState<SponsorPackage[]>([]);

  useEffect(() => {
    fetch("/api/packages").then(r => r.json()).then(d => setPackages(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section className="pt-10 pb-4 text-center space-y-4 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="pill-gold">TROPTIONS™ Pricing</span>
          <h1 className="troptions-hero-brand">Sponsor Packages</h1>
          <p className="troptions-hero-subtitle">Activate. Engage. Measure. Grow.</p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Every package includes QR activation infrastructure, multilingual outreach, analytics, and dedicated onboarding.
            No hidden fees. All prices in USD.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/contact" className="btn-troptions">Request Custom Quote →</Link>
            <Link href="/proposals" className="px-5 py-2 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#00d4ff]/50 hover:text-white transition-colors">
              Build a Proposal
            </Link>
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="space-y-4">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {packages.map(pkg => {
            const services: string[] = pkg.includedServices ? JSON.parse(pkg.includedServices) : [];
            const isEnterprise = pkg.slug === "enterprise-brand-partner";
            return (
              <div key={pkg.id} className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                pkg.featured
                  ? "border-[#00d4ff]/50 bg-[#00d4ff]/3 shadow-[0_0_30px_rgba(0,212,255,0.08)]"
                  : "border-[#162035] bg-[#0a0f1e]"
              }`}>
                {pkg.featured && !isEnterprise && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="pill-cyan text-[10px] font-bold px-3 py-1">FEATURED</span>
                  </div>
                )}
                {isEnterprise && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="pill-gold text-[10px] font-bold px-3 py-1">ENTERPRISE</span>
                  </div>
                )}

                <div className="space-y-1 mb-4">
                  <h3 className="text-white font-bold text-lg">{pkg.name}</h3>
                  {pkg.tagline && <p className="text-slate-400 text-xs leading-relaxed">{pkg.tagline}</p>}
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${pkg.featured ? "text-[#00d4ff]" : "text-white"}`}>
                      {isEnterprise ? "Custom" : fmt(pkg.monthlyFee)}
                    </span>
                    {!isEnterprise && <span className="text-slate-500 text-sm">/month</span>}
                  </div>
                  {pkg.setupFee > 0 && (
                    <p className="text-slate-500 text-xs mt-0.5">+ {fmt(pkg.setupFee)} setup fee</p>
                  )}
                </div>

                {/* Limits */}
                <div className="grid grid-cols-3 gap-2 mb-5 p-3 bg-[#050810] rounded-xl border border-[#162035]">
                  {[
                    { label: "Campaigns", value: pkg.campaignLimit === 0 ? "∞" : pkg.campaignLimit },
                    { label: "QR Zones",  value: pkg.qrLimit === 0 ? "∞" : pkg.qrLimit },
                    { label: "Venues",    value: pkg.venuePlacementLimit === 0 ? "∞" : pkg.venuePlacementLimit },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-white font-bold text-lg">{s.value}</p>
                      <p className="text-slate-500 text-[10px]">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Reporting */}
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-[#00d4ff]">📊</span>
                  <span>{REPORTING[pkg.reportingLevel] ?? pkg.reportingLevel}</span>
                </div>

                {/* Services */}
                <ul className="space-y-1.5 flex-1 mb-6">
                  {services.slice(0, 6).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                  {services.length > 6 && (
                    <li className="text-slate-500 text-xs pl-4">+ {services.length - 6} more included</li>
                  )}
                </ul>

                <Link href={`/contact?package=${pkg.slug}`}
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    pkg.featured
                      ? "bg-[#00d4ff] text-[#050810] hover:bg-[#00b8e6]"
                      : "border border-[#162035] text-slate-300 hover:border-[#00d4ff]/50 hover:text-white"
                  }`}>
                  {isEnterprise ? "Request Consultation" : "Get Started"}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-white font-bold text-2xl">Add-On Services</h2>
          <p className="text-slate-400 text-sm">Expand any package with additional placements, campaigns, and technology.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {addons.map(group => (
            <div key={group.category} className="card-dark rounded-2xl p-5 space-y-3">
              <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest">{group.category}</h3>
              {group.items.map(item => (
                <div key={item.name} className="flex items-center justify-between border-b border-[#162035] pb-2 last:border-0">
                  <span className="text-slate-300 text-sm">{item.name}</span>
                  <span className="text-[#d4a017] text-xs font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Trust */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          { icon: "🔒", title: "No Long-Term Lock-In",       body: "Month-to-month options available on all tiers. Annual plans include a 10% discount." },
          { icon: "📊", title: "Real-Time Analytics",         body: "Every package includes access to campaign analytics. Enterprise includes a dedicated reporting portal." },
          { icon: "🌐", title: "Multilingual by Default",     body: "All packages include English outreach. Higher tiers expand to Spanish, French, Arabic, and more." },
          { icon: "⚡", title: "7-Day Activation",            body: "Standard campaigns go live within 7 business days of contract signing and asset delivery." },
          { icon: "🤝", title: "Dedicated Support",           body: "City Activation and above include a dedicated account manager and priority support." },
          { icon: "🧾", title: "Transparent Invoicing",       body: "All fees are itemized. Square and Stripe payment integrations available. Manual invoicing supported." },
        ].map(f => (
          <div key={f.title} className="card-dark rounded-2xl p-5 space-y-2">
            <span className="text-2xl">{f.icon}</span>
            <h4 className="text-white font-semibold text-sm">{f.title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card-dark rounded-2xl p-8 text-center space-y-4">
        <div className="troptions-hex mx-auto mb-2">T</div>
        <h2 className="text-white font-bold text-2xl">Ready to activate?</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Talk to our team to build a custom package for your brand, venue, or activation goals.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/contact" className="btn-troptions">Schedule a Demo →</Link>
          <Link href="/proposals" className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#00d4ff]/50 transition-colors">
            Build a Proposal
          </Link>
        </div>
      </section>

    </div>
  );
}
