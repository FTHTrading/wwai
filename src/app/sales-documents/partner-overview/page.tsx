"use client";

import Link from "next/link";



export default function PartnerOverviewPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6 print:rounded-none">
      <div className="max-w-3xl mx-auto">
        {/* Screen controls */}
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back to Documents</Link>
          <Link href="/sales-registration/intake" className="wwai-btn-ghost text-sm">Start Registration</Link>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <section className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-1 print:text-slate-500">
              WWAI / TROPTIONS
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3 print:text-black">
              Partner Overview
            </h1>
            <p className="text-slate-300 leading-relaxed print:text-slate-700">
              WWAI (WhichWay AI) is the AI-native guest concierge platform built for major event cities.
              TROPTIONS is the B2B sales and operations platform that connects event-city businesses to
              the WWAI guest network. Together, they form the only independent AI + operations system
              purpose-built for event-city business.
            </p>
          </section>

          {/* What we do */}
          <section className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <h2 className="text-lg font-extrabold text-white mb-3 print:text-black">What the Platform Does</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "🤖", title: "AI Guest Concierge", body: "WWAI answers guest questions in real time — where to eat, stay, travel, and what to do — surfacing registered businesses as recommended options." },
                { icon: "📊", title: "Analytics & ROI Tracking", body: "QR redemptions, foot traffic impact, and campaign performance tracked and reported per business." },
                { icon: "📋", title: "Proposal & Billing Tools", body: "Sales reps build proposals in minutes from the package catalog. Billing prep is integrated." },
                { icon: "🗺", title: "Map & Safety Routing", body: "Businesses appear on the WWAI map with safety-informed routing to their location — a premium differentiator." },
              ].map((item) => (
                <div key={item.title} className="card-dark p-4 print:border-slate-200">
                  <div className="text-xl mb-1 print:hidden">{item.icon}</div>
                  <div className="font-bold text-white text-sm mb-1 print:text-black">{item.title}</div>
                  <div className="text-xs text-slate-400 print:text-slate-600">{item.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Who we serve */}
          <section className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <h2 className="text-lg font-extrabold text-white mb-3 print:text-black">Who We Serve</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Restaurants & Bars", "Increase event-day covers and brand visibility among visiting fans"],
                ["Hotels", "Drive direct bookings and guest recommendations from WWAI"],
                ["Transportation Providers", "Place pickup zones and routes on WWAI maps"],
                ["Sponsors & Brands", "Brand placement in AI concierge responses and across the platform"],
                ["Event Venues", "Drive event-adjacent traffic and private bookings"],
                ["Sales Partners", "Earn commission selling TROPTIONS packages to their client base"],
              ].map(([type, value]) => (
                <div key={type} className="flex gap-3 py-2 border-b border-[#1a2540] print:border-slate-200 last:border-b-0">
                  <div className="font-semibold text-white print:text-black w-48 shrink-0">{type}</div>
                  <div className="text-slate-400 print:text-slate-600">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Next steps */}
          <section className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <h2 className="text-lg font-extrabold text-white mb-3 print:text-black">Next Steps</h2>
            <ol className="space-y-3 text-sm">
              {[
                "Complete the business intake form to register your business type and package interest.",
                "A TROPTIONS sales team member will follow up within 1 business day.",
                "Review the package reference sheet and select the tier that best fits your operation.",
                "A proposal will be built and sent for review.",
                "Upon agreement, your campaign deploys and analytics begin tracking.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="step-circle shrink-0">{i + 1}</div>
                  <div className="text-slate-300 print:text-slate-700 pt-1">{step}</div>
                </li>
              ))}
            </ol>
            <div className="mt-4 no-print flex flex-wrap gap-2">
              <Link href="/sales-registration/intake" className="wwai-btn-primary text-sm">Start Intake</Link>
              <Link href="/sales-documents/package-sheet" className="wwai-btn-ghost text-sm">Package Sheet</Link>
            </div>
          </section>
        </div>

        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Partner Overview — Demo Build — {new Date().toLocaleDateString()}
          {" "}· All pricing and features are demonstration purposes only.
        </div>
      </div>
    </div>
  );
}


