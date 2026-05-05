"use client";

import Link from "next/link";

export default function DemoDisclaimerPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
        </div>
        <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
          <div className="hidden print:block text-xs text-slate-500 mb-2">WWAI / TROPTIONS</div>
          <h1 className="text-2xl font-extrabold text-white print:text-black mb-4">Demo System Disclaimer</h1>
          <div className="space-y-4 text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            <p>
              The WWAI / TROPTIONS platform currently operates in <strong className="text-white print:text-black">demonstration (demo) mode</strong>.
              This disclaimer is intended for use in early-stage client meetings, partner discussions, and prospect presentations.
            </p>
            <h2 className="text-base font-extrabold text-white print:text-black mt-4">What Demo Mode Means</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All pricing shown is reference pricing and is not a binding offer or rate card.</li>
              <li>Business intake forms do not persist to a production database. Submissions are stored locally in the user&apos;s browser.</li>
              <li>EIN fields accept format input only. No EIN is stored, transmitted, or verified against any government database.</li>
              <li>Analytics data shown is demonstration data and does not represent real performance.</li>
              <li>QR campaigns shown are demonstration examples. Production QR deployment requires platform go-live.</li>
              <li>Payment processing is not active. No billing, invoicing, or financial transactions are processed through the demo system.</li>
            </ul>
            <h2 className="text-base font-extrabold text-white print:text-black mt-4">What This Platform Is Designed To Become</h2>
            <p>
              WWAI / TROPTIONS is built to be a production AI-native event-city sales and guest operations platform.
              The demo system demonstrates the user flows, package catalog, analytics architecture, and guest concierge capability
              that will be live in production once the platform completes its go-live readiness checklist.
            </p>
            <h2 className="text-base font-extrabold text-white print:text-black mt-4">Data Handling</h2>
            <p>
              No real business data, personally identifiable information, or financial data should be entered into the demo system.
              All inputs in the current demo are treated as test data only. Full data handling policies, privacy practices,
              and compliance documentation will be published prior to production launch.
            </p>
            <h2 className="text-base font-extrabold text-white print:text-black mt-4">Contact</h2>
            <p>
              For questions about the platform timeline, production readiness, or partnership discussions,
              use the contact form at <span className="text-cyan-400 print:text-blue-700">/contact</span>.
            </p>
          </div>
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Demo System Disclaimer — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}


