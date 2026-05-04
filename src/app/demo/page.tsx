import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform Demo — TROPTIONS™ Sales Operating System",
  description: "Walk through the complete TROPTIONS sponsor activation flow: packages, venue placement, campaign setup, QR activation, analytics, proposal, and billing.",
};

const STEPS = [
  {
    num: "01",
    title: "Choose a Sponsor Package",
    desc: "TROPTIONS offers five sponsor tiers — from Local Venue at $2,500/month to Enterprise Brand Partner at custom pricing. Each tier defines campaign slots, QR zones, venue placements, and reporting level. The sales team presents these packages with clearly defined deliverables and contract terms.",
    actions: [
      { label: "View Pricing Page", href: "/pricing", primary: true },
    ],
    details: [
      "5 tier packages from $2,500 to $120,000/month",
      "Each package defines QR zones, campaign slots, and venue placements",
      "Setup fees separate from monthly recurring",
      "Featured tiers: City Activation and World Cup",
    ],
  },
  {
    num: "02",
    title: "Select Venue Placements",
    desc: "Sponsors are placed at physical activation venues — stadiums, airports, transit hubs, hotels, universities, and retail centers. Each venue is mapped with its category, city, capacity, and active campaign status. The operations map gives the sales team a live view of where every sponsor is running.",
    actions: [
      { label: "Open Venue Map", href: "/map", primary: true },
      { label: "Browse Venues", href: "/venues", primary: false },
    ],
    details: [
      "Venue categories: stadium, airport, transit, hotel, university, retail",
      "Live operations map with category-colored pins",
      "Capacity and address tracked per venue",
      "Each venue links to its campaigns and QR activity",
    ],
  },
  {
    num: "03",
    title: "Configure the Campaign",
    desc: "Each sponsor runs one or more campaigns tied to a venue. Campaign type can be QR scan-to-redeem, digital offer, event-based, or open offer. Campaigns carry their own impressions target, budget, start and end date, and redemption tracking.",
    actions: [
      { label: "View Campaigns", href: "/campaigns", primary: true },
    ],
    details: [
      "Campaign types: QR, offer, event, digital",
      "Budget, impressions, clicks, and redemptions tracked per campaign",
      "Start and end date scheduling",
      "Linked to sponsor and venue for full attribution",
    ],
  },
  {
    num: "04",
    title: "Deploy QR Activation Codes",
    desc: "QR codes are deployed at physical activation points inside each venue. Every scan and redemption is logged with event type and timestamp. The system tracks scan volume, redemption rate, and active status per QR code — giving both the sponsor and the operations team real attribution data.",
    actions: [
      { label: "View Campaigns with QR", href: "/campaigns", primary: true },
    ],
    details: [
      "Each QR code has a label, scan count, and redemption count",
      "Events logged per scan with eventType and timestamp",
      "Active/inactive status per code",
      "Campaign detail page shows top QR codes by activity",
    ],
  },
  {
    num: "05",
    title: "Review Analytics",
    desc: "The analytics dashboard shows 8 real-time KPIs pulled from the database: active sponsors, sponsor revenue, active venues, open leads, active campaigns, total QR scans, QR redemptions, and pipeline value. Tabs provide a detailed breakdown of campaigns, sponsors, and lead pipeline.",
    actions: [
      { label: "Open Analytics", href: "/analytics", primary: true },
    ],
    details: [
      "8 KPI cards with live DB values",
      "Sponsor, campaign, and lead tables",
      "CSV export for lead pipeline",
      "Redemption rate and conversion tracking",
    ],
  },
  {
    num: "06",
    title: "Build the Proposal",
    desc: "The proposal generator lets a sales rep select a sponsor, package, venue, campaign type, and term length. The system instantly calculates setup fee, monthly fee, term value, and total contract value. Proposals are stored in the database with status tracking: draft, sent, accepted, declined.",
    actions: [
      { label: "Open Proposal Generator", href: "/proposals", primary: true },
    ],
    details: [
      "Live contract value calculator",
      "Select sponsor, package, venue, campaign type, and term",
      "Proposal status workflow: draft → sent → accepted",
      "All proposals stored and retrievable",
    ],
  },
  {
    num: "07",
    title: "Issue Invoice and Track Payment",
    desc: "Once a proposal is accepted, an invoice is issued with a unique invoice number, amount, due date, and status. The billing dashboard tracks total invoiced, collected, and awaiting payment. Payment provider integration is ready for Square and Stripe — currently shows configuration status.",
    actions: [
      { label: "Open Billing Dashboard", href: "/billing", primary: true },
    ],
    details: [
      "Invoice status: draft, sent, paid, overdue, void",
      "Filter by status, export to CSV",
      "Square and Stripe integration ready (requires env keys)",
      "Manual payment tracking always available",
    ],
  },
];

export default function DemoPage() {
  return (
    <div className="space-y-12">

      {/* Header */}
      <section className="pt-10 pb-2 text-center space-y-4 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="pill-gold">Platform Demo</span>
          <h1 className="troptions-hero-brand">Platform Walkthrough</h1>
          <p className="troptions-hero-subtitle">7 steps from sponsor conversation to paid invoice</p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            This is a live demo environment. All data shown is seeded for demonstration purposes.
            Every step links to a working page in the system.
          </p>
          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <Link href="/pricing"      className="btn-troptions">Start with Pricing →</Link>
            <Link href="/case-studies" className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-6">
        {STEPS.map((step, idx) => (
          <div key={step.num} className="card-dark rounded-2xl overflow-hidden">
            <div className="flex flex-wrap items-start gap-0">

              {/* Step Number */}
              <div className="w-full md:w-16 bg-[#00d4ff]/5 border-b md:border-b-0 md:border-r border-[#162035] flex md:flex-col items-center justify-center p-4 shrink-0">
                <span className="text-[#00d4ff]/40 font-mono font-black text-2xl md:text-3xl">{step.num}</span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-4 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h2 className="text-white font-bold text-lg">{step.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {step.actions.map(a => (
                      <Link key={a.label} href={a.href}
                        className={a.primary
                          ? "btn-troptions text-xs py-2"
                          : "px-4 py-2 border border-[#162035] text-slate-300 rounded-lg text-xs font-semibold hover:border-[#00d4ff]/40 transition-colors"
                        }>{a.label}</Link>
                    ))}
                  </div>
                </div>

                {/* Detail bullets */}
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {step.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                      <span className="text-[#00d4ff]/60 mt-0.5 shrink-0">—</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress connector */}
            {idx < STEPS.length - 1 && (
              <div className="border-t border-[#162035] px-6 py-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#162035]" />
                <span className="text-slate-700 text-xs font-mono">→ next step</span>
                <div className="h-px flex-1 bg-[#162035]" />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card-dark rounded-2xl p-8 text-center space-y-4">
        <div className="troptions-hex mx-auto">T</div>
        <h2 className="text-white font-bold text-xl">Ready to run through it live?</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          All pages in this demo are connected to a live database. Create a proposal, view invoices, or browse the venue map.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/pricing"      className="btn-troptions">View Packages →</Link>
          <Link href="/proposals"    className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">Build Proposal</Link>
          <Link href="/analytics"    className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">View Analytics</Link>
          <Link href="/contact"      className="px-5 py-2.5 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors">Contact Sales</Link>
        </div>
      </section>

    </div>
  );
}
