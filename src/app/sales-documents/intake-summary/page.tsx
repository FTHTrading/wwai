"use client";

import Link from "next/link";



export default function IntakeSummaryTemplatePage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="wwai-btn-primary text-sm">Print / Save PDF</button>
          <Link href="/sales-documents" className="wwai-btn-ghost text-sm">Back</Link>
          <Link href="/sales-registration/intake" className="wwai-btn-ghost text-sm">Complete Real Intake</Link>
        </div>

        <div className="hidden print:block mb-6 pb-4 border-b border-slate-300">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">WWAI / TROPTIONS</div>
          <h1 className="text-2xl font-extrabold text-black">Business Intake Form — Template</h1>
          <p className="text-xs text-slate-500">Demo template only — complete the digital intake at troptions.com</p>
        </div>
        <div className="no-print mb-4">
          <h1 className="text-3xl font-extrabold text-white">Intake Summary Template</h1>
          <p className="text-slate-400 mt-1 text-sm">Blank intake form for prospect review before digital submission.</p>
        </div>

        {[
          { title: "Registration Information", fields: ["Registration Type", "Business Legal Name", "DBA (if applicable)", "EIN (format: XX-XXXXXXX — demo only)"] },
          { title: "Business Address", fields: ["Street Address", "City", "State", "ZIP Code"] },
          { title: "Primary Contact", fields: ["First Name", "Last Name", "Title / Role", "Email", "Phone"] },
          { title: "Package Interest", fields: ["Interested Package", "Services of Interest"] },
          { title: "Additional Notes", fields: ["Any additional context or questions"] },
        ].map((section) => (
          <div key={section.title} className="wwai-panel p-5 mb-4 print:border-slate-300 print:bg-white">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4 print:text-slate-500">{section.title}</div>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field}>
                  <div className="text-sm font-semibold text-slate-300 print:text-black mb-1">{field}</div>
                  <div className="h-8 border-b border-[#1a2540] print:border-slate-300" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="hidden print:block mt-4 border-t border-slate-300 pt-3 text-xs text-slate-500">
          WWAI / TROPTIONS — Intake Form Template — Demo Only — Complete digitally at the registration portal.
          EIN is for format verification only — not stored or verified against any government database.
        </div>
      </div>
    </div>
  );
}


