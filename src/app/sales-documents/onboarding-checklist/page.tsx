"use client";

import Link from "next/link";

export default function OnboardingChecklistPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
        </div>
        <div className="space-y-5">
          <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="hidden print:block text-xs text-slate-500 mb-1">WWAI / TROPTIONS</div>
            <h1 className="text-2xl font-extrabold text-white print:text-black mb-2">Client Onboarding Checklist</h1>
            <p className="text-slate-300 print:text-slate-700">Step-by-step checklist for onboarding a new client from closed deal to campaign go-live.</p>
          </div>
          {[
            {
              phase: "Phase 1: Registration & Intake",
              steps: [
                "Complete business intake form (digital or print template)",
                "Confirm registration type and package selection",
                "Verify business name, DBA, and contact information",
                "Obtain EIN (demo: format only; production: verification required)",
                "Confirm business address and service area",
              ],
            },
            {
              phase: "Phase 2: Proposal & Agreement",
              steps: [
                "Build proposal in TROPTIONS proposal builder",
                "Present proposal to client decision-maker",
                "Address objections (see sales deck talk tracks)",
                "Client reviews and signs proposal (production billing required)",
                "Invoice/payment processed",
              ],
            },
            {
              phase: "Phase 3: Campaign Setup",
              steps: [
                "Set up business profile in TROPTIONS platform",
                "Upload business photos and media",
                "Configure QR campaign offers (if included in package)",
                "Generate and deliver QR code assets to client",
                "Verify map listing placement and profile accuracy",
              ],
            },
            {
              phase: "Phase 4: Go-Live & Review",
              steps: [
                "Confirm WWAI listing is active and discoverable",
                "Test QR code scan and redemption flow",
                "Provide client with analytics dashboard access",
                "Schedule first review call (30 days post-launch)",
                "Confirm client understands demo vs. production status",
              ],
            },
          ].map((phase) => (
            <div key={phase.phase} className="wwai-panel p-5 print:border-slate-300 print:bg-white">
              <h2 className="text-sm font-extrabold text-white print:text-black mb-3">{phase.phase}</h2>
              <ul className="space-y-2">
                {phase.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <div className="w-5 h-5 border border-[#1a2540] print:border-slate-400 rounded shrink-0 mt-0.5" />
                    <span className="text-slate-300 print:text-slate-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Client Onboarding Checklist — Demo Build — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}


