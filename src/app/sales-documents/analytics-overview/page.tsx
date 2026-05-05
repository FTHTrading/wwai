"use client";

import Link from "next/link";

export default function AnalyticsOverviewPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
          <Link href="/analytics" className="wwai-btn-ghost text-sm">Analytics Dashboard</Link>
        </div>
        <div className="space-y-5">
          <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="hidden print:block text-xs text-slate-500 mb-1">WWAI / TROPTIONS</div>
            <h1 className="text-2xl font-extrabold text-white print:text-black mb-2">Analytics Overview</h1>
            <p className="text-slate-300 print:text-slate-700">What analytics are available at each package tier and how to present ROI to clients.</p>
          </div>
          {[
            { tier: "Verified Listing / Basic", items: ["Total profile views", "Map placement impressions", "Basic monthly summary"] },
            { tier: "Enhanced / Guest Route", items: ["All basic metrics", "QR scan counts", "Offer redemption rate", "Weekly report"] },
            { tier: "Premium / Concierge", items: ["All enhanced metrics", "Redemption tracking by offer", "Concierge recommendation appearances", "Monthly account review"] },
            { tier: "Sponsor / Enterprise", items: ["All premium metrics", "Category performance vs. competitors", "Custom dashboard", "Board-level ROI report"] },
          ].map((t) => (
            <div key={t.tier} className="wwai-panel p-5 print:border-slate-300 print:bg-white">
              <h2 className="text-sm font-extrabold text-white print:text-black mb-3">{t.tier}</h2>
              <ul className="space-y-1">
                {t.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <span className="text-cyan-400 print:text-blue-700">→</span>
                    <span className="text-slate-300 print:text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — Analytics Overview — Demo Build — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}


