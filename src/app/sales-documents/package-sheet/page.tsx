"use client";

import Link from "next/link";
import { RESTAURANT_BAR_PACKAGES, HOTEL_PACKAGES, DRIVER_PACKAGES, SPONSOR_PACKAGES, VENUE_PACKAGES } from "@/data/salesPackages";



const ALL_TIERS = [
  { label: "Restaurant / Bar", packages: RESTAURANT_BAR_PACKAGES },
  { label: "Hotel", packages: HOTEL_PACKAGES },
  { label: "Driver / Transportation", packages: DRIVER_PACKAGES },
  { label: "Sponsor", packages: SPONSOR_PACKAGES },
  { label: "Venue / Event Space", packages: VENUE_PACKAGES },
];

export default function PackageSheetPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6 print:rounded-none">
      <div className="max-w-4xl mx-auto">
        {/* Print header */}
        <div className="hidden print:block mb-6 pb-4 border-b border-slate-300">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
            WWAI / TROPTIONS — Package Reference Sheet
          </div>
          <h1 className="text-2xl font-extrabold text-black">Package Pricing & Services</h1>
          <p className="text-sm text-slate-600 mt-1">Demo pricing — reference only. Not a binding offer.</p>
        </div>

        {/* Screen header */}
        <div className="no-print mb-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-1">Sales Documents</div>
          <h1 className="text-3xl font-extrabold text-white">Package Reference Sheet</h1>
          <p className="text-slate-400 mt-1">All packages, pricing, and included services. Demo pricing — reference only.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
            <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back to Documents</Link>
            <Link href="/sales-deck" className="wwai-btn-ghost text-sm">Sales Deck</Link>
          </div>
        </div>

        <div className="space-y-8">
          {ALL_TIERS.map((tier) => (
            <section key={tier.label} className="wwai-panel p-5 print:border-slate-300 print:bg-white">
              <h2 className="text-base font-extrabold text-white mb-4 print:text-black">{tier.label}</h2>
              <div className="space-y-4">
                {tier.packages.map((p) => (
                  <div key={p.id} className="border-b border-[#1a2540] print:border-slate-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-bold text-white print:text-black">{p.name}</div>
                        <div className="text-xs text-slate-400 print:text-slate-600">{p.bestFor}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-cyan-400 print:text-blue-700">
                          {p.price === 0 ? "No fee" : `$${p.price.toLocaleString()}/yr`}
                        </div>
                        {p.setupFee && (
                          <div className="text-xs text-slate-400 print:text-slate-600">
                            + ${p.setupFee.toLocaleString()} setup
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.includedServices.map((svc) => (
                        <span key={svc} className="wwai-chip wwai-chip-cyan text-xs print:border-slate-400 print:text-slate-600 print:bg-white">
                          {svc}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 print:text-slate-500 mt-2">
                      Best for: {p.recommendedBuyer}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="wwai-panel p-4 mt-6 border-yellow-500/30 bg-yellow-500/5 print:border-slate-300 print:bg-white">
          <p className="text-xs text-yellow-400 print:text-slate-600">
            Demo pricing only — all prices are reference figures for demonstration purposes.
            Final pricing is determined per client agreement and event scope.
            Not a binding offer or official rate card.
          </p>
        </div>

        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Package Reference Sheet — {new Date().toLocaleDateString()} — Demo Build
        </div>
      </div>
    </div>
  );
}


