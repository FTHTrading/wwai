"use client";
import { useState } from "react";

type InquiryType = "sponsor" | "venue" | "sales" | "general";

const INQUIRY_TYPES = [
  { id: "sponsor" as const, label: "Sponsor Inquiry",  desc: "Activate your brand across fan touchpoints" },
  { id: "venue"   as const, label: "Venue Inquiry",    desc: "Onboard your location to the TROPTIONS network" },
  { id: "sales"   as const, label: "Sales Partnership",desc: "Join the TROPTIONS sales team or referral program" },
  { id: "general" as const, label: "General",          desc: "Any other question or request" },
];

export default function ContactPage() {
  const [type,    setType]    = useState<InquiryType>("sponsor");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [budget,  setBudget]  = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          type,
          name:           name.trim(),
          email:          email.trim(),
          phone:          phone.trim()   || undefined,
          company:        company.trim() || undefined,
          message:        message.trim() || undefined,
          source:         "web",
          estimatedValue: budget ? parseFloat(budget.replace(/[^0-9.]/g, "")) || undefined : undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="troptions-hex mx-auto">T</div>
          <h2 className="text-2xl font-bold text-white">Received.</h2>
          <p className="text-slate-400">
            We have your inquiry and will follow up within one business day. Our team reviews all submissions.
          </p>
          <p className="text-[#d4a017] font-semibold text-sm tracking-widest uppercase">One System. One Brand. Unlimited Scale.</p>
          <button onClick={() => { setSent(false); setName(""); setEmail(""); setPhone(""); setCompany(""); setMessage(""); setBudget(""); }}
            className="btn-troptions mt-2">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="pt-8 pb-2 text-center space-y-3 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="pill-gold">Get in Touch</span>
          <h1 className="troptions-hero-brand">Contact TROPTIONS</h1>
          <p className="troptions-hero-subtitle">Let&apos;s Build Together</p>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Sponsor activation, venue onboarding, sales partnerships, or general questions — we respond to everything.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inquiry type selector */}
        <div className="grid grid-cols-2 gap-3">
          {INQUIRY_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                type === t.id
                  ? "border-[#d4a017] bg-[#d4a017]/10 shadow-[0_0_20px_rgba(212,160,23,0.15)]"
                  : "border-[#162035] bg-[#0a0f1e] hover:border-[#d4a017]/40"
              }`}>
              <p className={`text-sm font-semibold ${type === t.id ? "text-[#FFD700]" : "text-white"}`}>{t.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card-dark p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Smith"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Email *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="jane@company.com"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+1 (404) 555-0100"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Company / Brand</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors" />
            </div>
          </div>

          {(type === "sponsor" || type === "venue") && (
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
                {type === "sponsor" ? "Estimated Budget" : "Estimated Venue Value"}
              </label>
              <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="$50,000"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors" />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
              placeholder="Tell us about your goals, timeline, and what you need from TROPTIONS..."
              className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff] transition-colors resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-troptions w-full justify-center">
            {loading ? "Sending…" : "Send Inquiry →"}
          </button>

          <p className="text-slate-600 text-xs text-center">
            We respond within one business day. All inquiries are reviewed by our team.
          </p>
        </form>
      </div>
    </div>
  );
}
