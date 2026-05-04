import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — TROPTIONS™ Sponsor Activation",
  description: "Demo-ready case studies showing TROPTIONS sponsor activation results across local venues, citywide campaigns, and premium brand QR redemption programs.",
};

const CASES = [
  {
    id:       "local-venue",
    tag:      "Local Venue",
    tagColor: "pill-cyan",
    title:    "Local Sponsor Activation at Multi-Venue Complex",
    summary:  "A regional beverage brand activated a 12-month QR campaign across 3 local entertainment venues, driving repeat redemption through a scan-to-offer flow.",
    package:  "Local Venue — $2,500/month",
    term:     "12 months",
    contractValue: "$30,000",
    venues:   "3 venues (sports bar, bowling alley, entertainment center)",
    setup:    "$1,500 setup fee",
    results: [
      { metric: "QR Scans",          value: "14,820",  note: "over 12-month term" },
      { metric: "Redemptions",       value: "3,940",   note: "26.6% conversion rate" },
      { metric: "Repeat Redeemers",  value: "61%",     note: "of customers returned" },
      { metric: "Revenue Influenced", value: "$128K",  note: "attributed through QR" },
    ],
    approach: [
      "QR codes placed at point-of-sale, bar counters, and restroom mirrors at each venue",
      "Offer rotated monthly — 15% off appetizers, free upgrade, loyalty points",
      "Scans tracked in real time with event logs per QR code",
      "Monthly analytics report shared with sponsor via dashboard",
      "Proposal generated, accepted, and invoiced through TROPTIONS billing system",
    ],
    disclaimer: "Results shown are illustrative of typical activation performance. Actual results vary.",
  },
  {
    id:       "citywide-worldcup",
    tag:      "City Activation",
    tagColor: "pill-gold",
    title:    "Citywide World Cup Sponsor Campaign",
    summary:  "A major beverage sponsor ran a 6-month city activation campaign across 8 venues during the World Cup period, combining QR redemption with digital offer amplification.",
    package:  "City Activation — $18,000/month",
    term:     "6 months",
    contractValue: "$115,000",
    venues:   "8 venues (stadium concourse, 3 sports bars, 2 airports, hotel lobby, transit hub)",
    setup:    "$7,000 setup fee",
    results: [
      { metric: "QR Scans",         value: "87,400",  note: "over 6-month term" },
      { metric: "Redemptions",      value: "22,100",  note: "25.3% conversion rate" },
      { metric: "Venue Coverage",   value: "8 sites", note: "stadium, airport, transit, hotel" },
      { metric: "Campaign ROI",     value: "4.2x",    note: "based on attributed revenue" },
    ],
    approach: [
      "Campaign launched simultaneously at all 8 venues with coordinated QR deployment",
      "Stadium activation featured branded QR stands at 30 concourse activation zones",
      "Airport and transit activations targeted international traveler audience",
      "Advanced analytics dashboard with weekly reporting provided to sponsor",
      "Mid-campaign optimization adjusted offer value based on scan-to-redeem conversion data",
    ],
    disclaimer: "Results shown are illustrative of a citywide activation scenario. Actual results vary.",
  },
  {
    id:       "premium-qr-brand",
    tag:      "Premium Brand",
    tagColor: "pill-gold",
    title:    "Premium Brand QR Redemption Program",
    summary:  "A global sportswear brand used a 12-month World Cup package to run a points-based QR redemption program across 20 venues in 4 cities, with multilingual activation.",
    package:  "Premium World Cup — $45,000/month",
    term:     "12 months",
    contractValue: "$547,000",
    venues:   "20 venues across 4 cities",
    setup:    "$7,000 setup fee",
    results: [
      { metric: "QR Scans",         value: "290,000+", note: "over 12-month term" },
      { metric: "Redemptions",      value: "68,400",   note: "23.6% conversion rate" },
      { metric: "Languages Served", value: "6",         note: "EN, ES, FR, AR, PT, ZH" },
      { metric: "App Downloads",    value: "41,200",   note: "attributed to QR campaign" },
    ],
    approach: [
      "100 QR zones deployed across 20 venues with multi-language offer text",
      "Rewards-based redemption: scan to earn points, redeem for merchandise discounts",
      "Real-time dashboard integrated with sponsor's existing analytics stack via API feed",
      "Enterprise reporting portal with executive weekly summaries",
      "Dedicated account manager and priority support throughout campaign",
    ],
    disclaimer: "Results shown are illustrative of a premium brand activation scenario. Actual results vary.",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="space-y-12">

      {/* Header */}
      <section className="pt-10 pb-2 text-center space-y-4 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="pill-gold">Case Studies</span>
          <h1 className="troptions-hero-brand">Activation in Practice</h1>
          <p className="troptions-hero-subtitle">Three illustrated campaign scenarios</p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            The following scenarios illustrate how TROPTIONS packages are structured, activated, and measured
            across different sponsor tiers and venue types.
            <strong className="text-slate-400 block mt-1">All data shown is for demonstration purposes.</strong>
          </p>
          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <Link href="/pricing"   className="btn-troptions">See Packages →</Link>
            <Link href="/proposals" className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">Build a Proposal</Link>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="space-y-8">
        {CASES.map(c => (
          <div key={c.id} className="card-dark rounded-2xl overflow-hidden">

            {/* Case Header */}
            <div className="border-b border-[#162035] p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className={c.tagColor}>{c.tag}</span>
                <span className="text-slate-600 text-xs border border-[#162035] px-2 py-0.5 rounded">Demo Scenario</span>
              </div>
              <h2 className="text-white font-bold text-xl">{c.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">{c.summary}</p>
            </div>

            {/* Package Details */}
            <div className="border-b border-[#162035] p-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Package",  value: c.package },
                  { label: "Term",     value: c.term },
                  { label: "Contract", value: c.contractValue },
                  { label: "Venues",   value: c.venues },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest mb-1">{d.label}</p>
                    <p className="text-white text-sm font-semibold leading-snug">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="border-b border-[#162035] p-6">
              <h3 className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest mb-4">Campaign Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {c.results.map(r => (
                  <div key={r.metric} className="bg-[#050810] rounded-xl p-4 border border-[#162035] space-y-1">
                    <p className="text-white font-black text-xl">{r.value}</p>
                    <p className="text-slate-300 text-xs font-semibold">{r.metric}</p>
                    <p className="text-slate-600 text-[10px]">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approach */}
            <div className="p-6 space-y-3">
              <h3 className="text-[#d4a017] text-xs font-bold uppercase tracking-widest">Activation Approach</h3>
              <ul className="space-y-2">
                {c.approach.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-[#00d4ff]/50 shrink-0 mt-0.5">—</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 text-[10px] pt-2 italic">{c.disclaimer}</p>
            </div>

          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card-dark rounded-2xl p-8 text-center space-y-4">
        <div className="troptions-hex mx-auto">T</div>
        <h2 className="text-white font-bold text-xl">See how this applies to your brand</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Every scenario shown here is built on the same infrastructure available in TROPTIONS today.
          Choose a package and build a proposal to see the numbers for your activation.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/pricing"   className="btn-troptions">View Packages →</Link>
          <Link href="/proposals" className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">Build Proposal</Link>
          <Link href="/contact"   className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">Contact Sales</Link>
        </div>
      </section>

    </div>
  );
}
