"use client";

import Link from "next/link";



export default function QRCampaignGuidePage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
        </div>
        <div className="space-y-5">
          <div className="wwai-panel p-6 print:border-slate-300 print:bg-white">
            <div className="hidden print:block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">WWAI / TROPTIONS</div>
            <h1 className="text-2xl font-extrabold text-white print:text-black mb-2">QR Campaign Guide</h1>
            <p className="text-slate-300 print:text-slate-700">How QR campaigns work within the WWAI platform — from deployment to redemption tracking to analytics.</p>
          </div>

          {[
            { title: "What is a QR Campaign?", body: "A QR campaign is a scannable code deployed at your business location — on tables, windows, menus, lobby stands, or event materials. When a guest scans it, they are directed to your WWAI offer page where they can redeem a promotion, view your profile, or get directions." },
            { title: "How QR Campaigns Are Deployed", body: "Once your business is registered and your package includes QR capability, the TROPTIONS ops team generates a unique QR code for your location. You receive a printable QR asset file that you can print and place at your business." },
            { title: "What Gets Tracked", body: "Every scan is logged with timestamp, location context, and whether the offer was redeemed. This data flows into your analytics dashboard so you can see exactly how many guests interacted with your campaign." },
            { title: "How to Talk About QR ROI", body: "When presenting to a client: 'If 1% of the 500,000 event guests scan your QR code, that's 5,000 interactions with your brand — each one tracked, each one reported.' That's a conversation starter that lands with business owners and marketing directors alike." },
            { title: "Which Packages Include QR", body: "QR capability is available from the Enhanced Profile tier and above for restaurants/bars, from the Guest Route Package for hotels, and from the Pickup Zone Partner tier for transportation. Sponsor packages include QR from Local Sponsor tier." },
          ].map((s) => (
            <div key={s.title} className="wwai-panel p-5 print:border-slate-300 print:bg-white">
              <h2 className="text-base font-extrabold text-white print:text-black mb-2">{s.title}</h2>
              <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500">
          WWAI / TROPTIONS — QR Campaign Guide — Demo Build — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}


