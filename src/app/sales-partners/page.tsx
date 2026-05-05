import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { SALES_PARTNER_PACKAGES } from "@/data/salesPackages";

export const metadata = {
  title: "Sales Partners | TROPTIONS · WWAI",
  description:
    "Join the WWAI / TROPTIONS sales partner program. Sell event-city business packages and earn commission.",
};

export default function SalesPartnersPage() {
  return (
    <AppShell
      title="Sales Partner Program"
      subtitle="Earn commission selling TROPTIONS packages to restaurants, hotels, drivers, sponsors, and venues in event cities. Full sales materials provided."
      badges={["Commission-based", "Demo program"]}
    >
      {/* Demo disclaimer */}
      <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
        <p className="text-sm text-yellow-300">
          Demo program. Commission rates and terms are demonstration only — not binding. Final program
          terms are set at the operator level prior to production launch.
        </p>
      </div>

      {/* Hero value prop */}
      <section className="wwai-panel p-6 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3">Why Partner with TROPTIONS?</div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { stat: "6 Categories", label: "Sell to restaurants, hotels, drivers, sponsors, venues, and other partners" },
            { stat: "~10–15%", label: "Demo commission rate on first-year annual package value" },
            { stat: "Full Kit", label: "Sales deck, package sheet, proposal builder, talk tracks, and document center" },
          ].map((item) => (
            <div key={item.stat} className="stat-card">
              <div className="stat-big">{item.stat}</div>
              <div className="text-xs text-slate-400 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What you sell */}
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3">What You Sell</div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Restaurants & Bars", "From $500 / year", "Verified listings, QR campaigns, map placement"],
            ["Hotels", "From $750 / year", "Concierge placement, guest route integration"],
            ["Drivers / Transportation", "From $250 / year", "Pickup zones, route placement, shuttle integration"],
            ["Sponsors & Brands", "From $2,500 / year", "Category sponsorships, AI concierge placement"],
            ["Venues / Event Spaces", "From $1,000 / year", "Event route integration, featured listings"],
            ["Sales Partners", "Varies", "Recruit and onboard other sales reps and agency partners"],
          ].map(([type, price, desc]) => (
            <div key={type} className="card-dark p-4">
              <div className="font-bold text-white text-sm">{type}</div>
              <div className="text-xs text-cyan-400 mt-0.5">{price}</div>
              <div className="text-xs text-slate-400 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Commission demo */}
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3">Commission Demo Calculator</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a2540]">
                <th className="text-left text-xs text-slate-400 uppercase tracking-wide pb-2 pr-4">Package</th>
                <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2 pr-4">Annual Fee</th>
                <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2">Demo Commission</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Restaurant Verified Listing", 500, 50],
                ["Restaurant Enhanced Profile", 1250, 125],
                ["Restaurant Premium", 2500, 250],
                ["Hotel Concierge Integration", 7500, 750],
                ["Sponsor Category Sponsor", 10000, 1000],
                ["City Activation Sponsor", 25000, 2500],
                ["Premium Campaign Sponsor", 75000, 7500],
              ].map(([name, fee, comm]) => (
                <tr key={name as string} className="border-b border-[#0d1626]">
                  <td className="py-2 pr-4 text-slate-300">{name}</td>
                  <td className="py-2 pr-4 text-right text-slate-300">${(fee as number).toLocaleString()}</td>
                  <td className="py-2 text-right text-green-400 font-bold">${(comm as number).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Demo rates at 10%. Actual commission rates set per partner agreement. These figures are for
          illustration only.
        </p>
      </section>

      {/* Partner tiers */}
      <section className="mb-6">
        <h2 className="text-xl font-extrabold text-white mb-4">Partner Tiers</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {SALES_PARTNER_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="card-dark-hover p-5">
              <div className="font-bold text-white text-base mb-1">{pkg.name}</div>
              <div className="text-xs text-cyan-400 mb-2">
                {pkg.price === 0 ? "No upfront fee" : `$${pkg.price.toLocaleString()} territory fee`}
              </div>
              <div className="text-sm text-slate-400 mb-3">{pkg.bestFor}</div>
              <div className="flex flex-wrap gap-1.5">
                {pkg.includedServices.map((s) => (
                  <span key={s} className="wwai-chip text-xs">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How proposals work */}
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3">How Proposals Work</div>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Find Prospect", desc: "Identify a restaurant, hotel, driver, sponsor, or venue" },
            { step: "2", title: "Run Sales Deck", desc: "Walk them through the platform value" },
            { step: "3", title: "Build Proposal", desc: "Use the proposal builder — takes under 10 minutes" },
            { step: "4", title: "Close & Earn", desc: "Client completes intake; commission tracked on close" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-2">
              <div className="step-circle">{s.step}</div>
              <div className="font-bold text-white text-sm">{s.title}</div>
              <div className="text-xs text-slate-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wwai-panel p-6 text-center">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-2">Ready to Start?</div>
        <h2 className="text-2xl font-extrabold text-white mb-3">Join the TROPTIONS Partner Program</h2>
        <p className="text-slate-400 text-sm mb-5 max-w-lg mx-auto">
          Complete the sales partner registration intake to get started. No upfront cost for independent reps.
          Full sales materials available immediately.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/sales-registration/intake?type=sales-partner" className="wwai-btn-primary">
            Register as Sales Partner
          </Link>
          <Link href="/sales-deck" className="wwai-btn-ghost">View Sales Deck</Link>
          <Link href="/sales-documents/proposal-worksheet" className="wwai-btn-ghost">Build a Proposal</Link>
          <Link href="/sales-documents/sales-partner-program" className="wwai-btn-ghost text-sm">Partner Program Guide</Link>
        </div>
      </section>
    </AppShell>
  );
}
