"use client";

import { useState, type FormEvent } from "react";
import { saveLead } from "@/lib/demoStorage";

const INQUIRY_TYPES = [
  "Sponsor package",
  "Restaurant registration",
  "Hotel registration",
  "Driver registration",
  "Campaign activation",
  "Safety route partnership",
  "Investor / Partner",
  "Sales demo",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const lead = saveLead({ name, email, company, phone, inquiryType, message });
    setSavedId(lead.id);
  };

  if (savedId) {
    return (
      <div className="wwai-panel p-6 max-w-2xl">
        <div className="wwai-chip wwai-chip-green mb-3">Lead captured</div>
        <h3 className="text-2xl font-extrabold text-white">Thank you</h3>
        <p className="text-slate-400 mt-2">
          Lead {savedId} captured for demo. Connect a CRM to route this into production.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="wwai-panel p-6 max-w-3xl space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Name *" value={name} onChange={setName} />
        <Input label="Email *" value={email} onChange={setEmail} type="email" />
        <Input label="Company" value={company} onChange={setCompany} />
        <Input label="Phone" value={phone} onChange={setPhone} type="tel" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-slate-400">Inquiry Type</label>
        <select
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
        >
          {INQUIRY_TYPES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-slate-400">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="wwai-btn-primary text-sm">Send</button>
        <span className="disclaimer-bar">Demo capture — CRM integration required for routing.</span>
      </div>
    </form>
  );
}

function Input({
  label, value, onChange, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-slate-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
      />
    </div>
  );
}
