"use client";

import Link from "next/link";

export default function SalesPartnerProgramPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
          <Link href="/sales-partners" className="wwai-btn-ghost text-sm">Partner Program Page</Link>
        </div>
        <div className="space-y-5">
          <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="hidden print:block text-xs text-slate-500 mb-1">WWAI / TROPTIONS</div>
            <h1 className="text-2xl font-extrabold text-white print:text-black mb-2">Sales Partner Program Guide</h1>
            <p className="text-slate-300 print:text-slate-700">How the TROPTIONS sales partner program works — roles, commission structure, and how to close deals.</p>
          </div>
          {[
            { title: "Who Can Join", body: "Independent sales reps, sports and hospitality marketing professionals, event agencies, and regional marketing consultants. No upfront cost for independent reps. Regional partner territories require a territory fee." },
            { title: "What You Sell", body: "All TROPTIONS packages across every category — restaurants, hotels, drivers, sponsors, venues, and other sales partners. Full package catalog and proposal tools are provided. You bring the relationships; TROPTIONS provides the platform and materials." },
            { title: "Commission Structure (Demo)", body: "Commission is earned on each closed package. Rates are defined per partner agreement. Demo commission structure: ~10–15% of first-year annual fee depending on package tier and partner level. Production rates set by operator. This is demonstration only." },
            { title: "How Proposals Work", body: "Sales partners use the TROPTIONS proposal builder to generate a proposal for any prospect. Proposals include package details, pricing, included services, and next steps. When the client completes intake and moves to payment, commission is tracked." },
            { title: "Support Provided", body: "Full sales deck, package reference sheet, proposal worksheet, QR campaign guide, analytics overview, and objection handling guides. Regional partners receive additional marketing support budget." },
          ].map((s) => (
            <div key={s.title} className="wwai-panel p-5 print:border-slate-300 print:bg-white">
              <h2 className="text-base font-extrabold text-white print:text-black mb-2">{s.title}</h2>
              <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="wwai-panel p-3 border-yellow-500/30 bg-yellow-500/5 mt-4 no-print">
          <p className="text-xs text-yellow-400">Demo only. Commission rates and program terms are subject to final operator agreement. Not a binding offer.</p>
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Sales Partner Program Guide — Demo Build — {new Date().toLocaleDateString()}
          · Commission rates are demonstration only and not binding.
        </div>
      </div>
    </div>
  );
}


