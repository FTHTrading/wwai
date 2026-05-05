"use client";

import Link from "next/link";
import { SPONSOR_PACKAGES } from "@/data/salesPackages";

export default function SponsorshipBriefPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
          <Link href="/sales-registration/intake?type=sponsor" className="wwai-btn-ghost text-sm">Sponsor Registration</Link>
        </div>
        <div className="space-y-5">
          <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="hidden print:block text-xs text-slate-500 mb-1">WWAI / TROPTIONS</div>
            <h1 className="text-2xl font-extrabold text-white print:text-black mb-2">Sponsorship Brief</h1>
            <p className="text-slate-300 print:text-slate-700">Brand placement opportunities across the WWAI event city platform — from local activation to enterprise partnership.</p>
          </div>
          <div className="wwai-panel p-5 print:border-slate-300 print:bg-white">
            <h2 className="text-base font-extrabold text-white print:text-black mb-3">Why Sponsor WWAI?</h2>
            <div className="space-y-2 text-sm text-slate-300 print:text-slate-700">
              <p>WWAI is the AI concierge that event guests talk to before, during, and after the event. Sponsor brands appear in AI responses, on map listings, in QR campaigns, and across co-branded materials. This is not banner advertising — it is embedded recommendation in the guest experience.</p>
            </div>
          </div>
          <div className="wwai-panel p-5 print:border-slate-300 print:bg-white">
            <h2 className="text-base font-extrabold text-white print:text-black mb-3">Sponsorship Tiers</h2>
            <div className="space-y-4">
              {SPONSOR_PACKAGES.map((p) => (
                <div key={p.id} className="border-b border-[#1a2540] print:border-slate-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-white print:text-black">{p.name}</div>
                    <div className="text-cyan-400 print:text-blue-700 font-bold shrink-0">
                      {p.price === 0 ? "No fee" : `$${p.price.toLocaleString()}/yr`}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 print:text-slate-600 mt-0.5">{p.bestFor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Sponsorship Brief — Demo Build — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}


