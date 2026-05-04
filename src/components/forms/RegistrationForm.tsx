"use client";

import { useState, type FormEvent } from "react";
import { saveSubmission } from "@/lib/demoStorage";
import type { PartnerCategory } from "@/lib/types";
import { ZONES, ALL_PACKAGES } from "@/data/demoData";

interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export default function RegistrationForm({
  type,
  title,
  fields,
  packageCategoryFilter,
  intro,
}: {
  type: PartnerCategory;
  title: string;
  intro?: string;
  fields: FieldDef[];
  packageCategoryFilter?: ("sponsor" | "merchant" | "hotel" | "driver")[];
}) {
  const pkgOptions = packageCategoryFilter
    ? ALL_PACKAGES.filter((p) => packageCategoryFilter.includes(p.category))
    : ALL_PACKAGES;

  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | boolean) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    for (const f of fields) {
      if (f.required && !values[f.name]) {
        setError(`Missing: ${f.label}`);
        return;
      }
    }
    const sub = saveSubmission(type, values);
    setSubmittedId(sub.id);
  };

  if (submittedId) {
    return (
      <div className="wwai-panel p-6 max-w-2xl">
        <div className="wwai-chip wwai-chip-green mb-3">Pending Review</div>
        <h3 className="text-2xl font-extrabold text-white">Submission received</h3>
        <p className="text-slate-400 mt-2">
          Submission <span className="text-cyan-300">{submittedId}</span> saved to demo queue.
          An operator review is required in production.
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/admin" className="wwai-btn-primary text-sm">View in Admin</a>
          <a href="/register" className="wwai-btn-ghost text-sm">Register another</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="wwai-panel p-6 max-w-3xl space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
        {intro && <p className="text-sm text-slate-400 mt-1">{intro}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => {
          const isFull = f.type === "textarea";
          const v = values[f.name];
          return (
            <div key={f.name} className={isFull ? "md:col-span-2" : ""}>
              <label className="text-xs uppercase tracking-widest text-slate-400">
                {f.label}{f.required && <span className="text-rose-400"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={(v as string) || ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
                />
              ) : f.type === "select" ? (
                <select
                  value={(v as string) || ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
                >
                  <option value="">— Select —</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "checkbox" ? (
                <label className="flex items-center gap-2 mt-1 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(v)}
                    onChange={(e) => set(f.name, e.target.checked)}
                    className="accent-cyan-400"
                  />
                  Yes
                </label>
              ) : f.name === "packageId" ? (
                <select
                  value={(v as string) || ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
                >
                  <option value="">— Select package —</option>
                  {pkgOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString()}/yr</option>
                  ))}
                </select>
              ) : f.name === "zone" ? (
                <select
                  value={(v as string) || ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
                >
                  <option value="">— Zone —</option>
                  {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={(v as string) || ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
                />
              )}
            </div>
          );
        })}
      </div>
      {error && <div className="text-rose-400 text-sm">{error}</div>}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="wwai-btn-primary text-sm">Submit for Review</button>
        <span className="disclaimer-bar">Demo submission — operator review required in production.</span>
      </div>
    </form>
  );
}
