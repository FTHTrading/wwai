"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_SALES_PACKAGES, PACKAGE_CATEGORY_LABELS } from "@/data/salesPackages";

export default function ProposalWorksheetPage() {
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [notes, setNotes] = useState("");

  const selectedPkg = ALL_SALES_PACKAGES.find((p) => p.id === selectedPkgId);
  const annualTotal = selectedPkg
    ? selectedPkg.price + (selectedPkg.setupFee ?? 0)
    : 0;

  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Screen controls */}
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back to Documents</Link>
          <Link href="/proposals" className="wwai-btn-ghost text-sm">Full Proposal Builder</Link>
        </div>

        <div className="hidden print:block mb-6 pb-4 border-b border-slate-300">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">WWAI / TROPTIONS</div>
          <h1 className="text-2xl font-extrabold text-black">Proposal Worksheet</h1>
          <p className="text-sm text-slate-600">Demo pricing — not a final proposal.</p>
        </div>

        <div className="no-print mb-4">
          <h1 className="text-3xl font-extrabold text-white">Proposal Worksheet</h1>
          <p className="text-slate-400 mt-1 text-sm">Build a quick proposal outline for a client meeting. Print or save as PDF.</p>
        </div>

        {/* Form section */}
        <div className="wwai-panel p-6 mb-5 print:border-slate-300 print:bg-white">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4 print:text-slate-500">
            Client Information
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="form-input w-full"
                placeholder="Acme Restaurant LLC"
              />
            </div>
            <div>
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="form-input w-full"
                placeholder="Jane Smith"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Package</label>
            <select
              value={selectedPkgId}
              onChange={(e) => setSelectedPkgId(e.target.value)}
              className="form-input w-full"
            >
              <option value="">Select a package...</option>
              {Object.entries(PACKAGE_CATEGORY_LABELS).map(([cat, label]) => (
                <optgroup key={cat} label={label}>
                  {ALL_SALES_PACKAGES.filter((p) => p.category === cat).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.price.toLocaleString()}/yr
                      {p.setupFee ? ` + $${p.setupFee.toLocaleString()} setup` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          {selectedPkg && (
            <div className="mt-4 bg-[#0a0f1e] print:bg-slate-50 rounded-lg p-4 border border-[#1a2540] print:border-slate-200">
              <div className="font-bold text-white print:text-black mb-1">{selectedPkg.name}</div>
              <div className="text-xs text-slate-400 print:text-slate-600 mb-2">{selectedPkg.bestFor}</div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Annual Fee</div>
                  <div className="text-cyan-400 print:text-blue-700 font-bold">
                    {selectedPkg.price === 0 ? "No fee" : `$${selectedPkg.price.toLocaleString()}`}
                  </div>
                </div>
                {selectedPkg.setupFee && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Setup Fee</div>
                    <div className="text-slate-300 print:text-slate-700 font-bold">
                      ${selectedPkg.setupFee.toLocaleString()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">First-Year Total</div>
                  <div className="text-white print:text-black font-bold text-lg">
                    ${annualTotal.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Included Services</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPkg.includedServices.map((s) => (
                    <span key={s} className="wwai-chip wwai-chip-cyan print:border-slate-400 print:text-slate-600 print:bg-white text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <label className="form-label">Notes / Custom Terms</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input w-full h-24"
              placeholder="Custom terms, start date, event scope..."
            />
          </div>
        </div>

        {/* Talking points */}
        {selectedPkg && (
          <div className="wwai-panel p-5 mb-5 print:border-slate-300 print:bg-white">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-slate-500">
              Sales Talking Points
            </div>
            <ul className="space-y-2">
              {selectedPkg.salesTalkingPoints.map((tp, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-cyan-400 print:text-blue-700 shrink-0">→</span>
                  <span className="text-slate-300 print:text-slate-700">{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next steps */}
        <div className="wwai-panel p-5 print:border-slate-300 print:bg-white">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-slate-500">
            Proposed Next Steps
          </div>
          <ol className="space-y-2 text-sm">
            {[
              "Complete the business intake form to formally register",
              "Review and sign proposal (once production billing is live)",
              "Campaign setup and QR code deployment",
              "Analytics dashboard access provided",
              "Go-live before the event",
            ].map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-cyan-400 print:text-blue-700 shrink-0 font-bold">{i + 1}.</span>
                <span className="text-slate-300 print:text-slate-700">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 no-print flex flex-wrap gap-2">
            <Link href="/sales-registration/intake" className="wwai-btn-primary text-sm">Start Intake</Link>
            <Link href="/proposals" className="wwai-btn-ghost text-sm">Full Proposal Builder</Link>
          </div>
        </div>

        <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-3 mt-4 no-print">
          <p className="text-xs text-yellow-400">
            This worksheet is for sales planning only. Pricing is demo/reference. Not a binding proposal or contract.
          </p>
        </div>

        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Proposal Worksheet — {new Date().toLocaleDateString()}
          {businessName && ` — Prepared for: ${businessName}`}
          {" "}· Demo pricing only. Not a final proposal or binding agreement.
        </div>
      </div>
    </div>
  );
}
