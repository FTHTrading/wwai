"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  saveSalesIntake,
  validateEinFormat,
  maskEin,
  extractEinLastFour,
  REGISTRATION_TYPE_LABELS,
  AVAILABLE_SERVICES,
  type RegistrationType,
  type SalesIntake,
} from "@/lib/salesIntakeStorage";
import { ALL_SALES_PACKAGES, PACKAGE_CATEGORY_LABELS } from "@/data/salesPackages";

const REGISTRATION_TYPES: { value: RegistrationType; label: string }[] = [
  { value: "restaurant-bar", label: "Restaurant / Bar" },
  { value: "hotel", label: "Hotel" },
  { value: "driver-transportation", label: "Driver / Transportation" },
  { value: "sponsor", label: "Sponsor" },
  { value: "venue", label: "Venue / Event Space" },
  { value: "sales-partner", label: "Sales / Marketing Partner" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface FormState {
  registrationType: RegistrationType | "";
  businessLegalName: string;
  dba: string;
  ein: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  packageId: string;
  interestedServices: string[];
  notes: string;
  einConfirmed: boolean;
}

function IntakeFormContent() {
  const router = useRouter();
  const params = useSearchParams();
  const typeParam = params.get("type") as RegistrationType | null;

  const [form, setForm] = useState<FormState>({
    registrationType: typeParam || "",
    businessLegalName: "",
    dba: "",
    ein: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    packageId: "",
    interestedServices: [],
    notes: "",
    einConfirmed: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SalesIntake | null>(null);

  const filteredPackages = form.registrationType
    ? ALL_SALES_PACKAGES.filter((p) => p.category === form.registrationType)
    : ALL_SALES_PACKAGES;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleService(id: string) {
    setForm((prev) => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(id)
        ? prev.interestedServices.filter((s) => s !== id)
        : [...prev.interestedServices, id],
    }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.registrationType) errs.registrationType = "Registration type is required";
    if (!form.businessLegalName.trim()) errs.businessLegalName = "Business legal name is required";
    if (!form.ein.trim()) {
      errs.ein = "EIN is required (demo — use placeholder format XX-XXXXXXX)";
    } else if (!validateEinFormat(form.ein)) {
      errs.ein = "EIN must be in format XX-XXXXXXX (e.g. 12-3456789)";
    }
    if (!form.einConfirmed) {
      errs.einConfirmed = "Please confirm this is demo data only";
    }
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Valid email is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const intake = saveSalesIntake({
        registrationType: form.registrationType as RegistrationType,
        businessLegalName: form.businessLegalName.trim(),
        dba: form.dba.trim() || undefined,
        einRaw: form.ein.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state,
        zip: form.zip.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        title: form.title.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        packageId: form.packageId || undefined,
        interestedServices: form.interestedServices,
        notes: form.notes.trim() || undefined,
      });
      setSubmitted(intake);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="wwai-panel border-green-500/30 bg-green-500/5 p-6 mb-6">
          <div className="text-green-400 text-2xl mb-2">✓</div>
          <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-1">
            Demo Intake Submitted
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-1">Intake Received</h2>
          <p className="text-slate-300 text-sm mb-4">
            Your demo registration intake has been saved locally. A sales team member will follow up
            using the contact information provided.
          </p>
          <div className="bg-[#0a0f1e] rounded-lg p-4 font-mono text-sm mb-4 border border-[#1a2540]">
            <div className="text-cyan-400 text-xs uppercase tracking-widest mb-2">Reference Details</div>
            <div><span className="text-slate-400">Intake ID: </span><span className="text-white font-bold">{submitted.id}</span></div>
            <div><span className="text-slate-400">Business: </span><span className="text-white">{submitted.businessLegalName}</span></div>
            <div><span className="text-slate-400">EIN: </span><span className="text-white">{maskEin(submitted.einLastFour)}</span></div>
            <div><span className="text-slate-400">Type: </span><span className="text-white">{REGISTRATION_TYPE_LABELS[submitted.registrationType as RegistrationType]}</span></div>
            <div><span className="text-slate-400">Status: </span><span className="text-yellow-400">Pending Review</span></div>
            <div><span className="text-slate-400">Submitted: </span><span className="text-white">{new Date(submitted.createdAt).toLocaleString()}</span></div>
          </div>
          <div className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded p-2 mb-4">
            EIN has been masked ({maskEin(submitted.einLastFour)}) and is not stored in full. Demo data only — not transmitted to any external system.
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/sales-registration/summary/${encodeURIComponent(submitted.id)}`} className="wwai-btn-primary text-sm">
              View Intake Summary
            </Link>
            <Link href="/sales-deck" className="wwai-btn-ghost text-sm">Open Sales Deck</Link>
            <Link href="/sales-documents/proposal-worksheet" className="wwai-btn-ghost text-sm">Build Proposal</Link>
            <Link href="/admin/sales-intake" className="wwai-btn-ghost text-sm">Admin Review Queue</Link>
            <button
              className="wwai-btn-ghost text-sm"
              onClick={() => router.push("/sales-registration")}
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6" noValidate>
      {/* Demo warning */}
      <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-lg shrink-0">⚠</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">
              Demo Intake Only
            </div>
            <p className="text-sm text-slate-300">
              Do not enter real EINs, tax IDs, or sensitive business information. This is a
              demonstration system. Data is stored locally in your browser only and is not
              transmitted to any external system.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Registration Type */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Registration Type
        </legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {REGISTRATION_TYPES.map((rt) => (
            <label
              key={rt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                form.registrationType === rt.value
                  ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                  : "border-[#1a2540] bg-[#0a0f1e] text-slate-300 hover:border-cyan-400/30"
              }`}
            >
              <input
                type="radio"
                name="registrationType"
                value={rt.value}
                checked={form.registrationType === rt.value}
                onChange={() => set("registrationType", rt.value)}
                className="accent-cyan-400"
              />
              <span className="text-sm font-medium">{rt.label}</span>
            </label>
          ))}
        </div>
        {errors.registrationType && (
          <p className="text-red-400 text-xs mt-2">{errors.registrationType}</p>
        )}
      </fieldset>

      {/* Section 2: Business Information */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Business Information
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="form-label">Business Legal Name *</label>
            <input
              type="text"
              value={form.businessLegalName}
              onChange={(e) => set("businessLegalName", e.target.value)}
              className={`form-input w-full ${errors.businessLegalName ? "border-red-500/60" : ""}`}
              placeholder="Acme Restaurant LLC"
              autoComplete="organization"
            />
            {errors.businessLegalName && (
              <p className="text-red-400 text-xs mt-1">{errors.businessLegalName}</p>
            )}
          </div>
          <div>
            <label className="form-label">DBA (Doing Business As)</label>
            <input
              type="text"
              value={form.dba}
              onChange={(e) => set("dba", e.target.value)}
              className="form-input w-full"
              placeholder="The Acme"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="form-label">
              EIN *{" "}
              <span className="text-yellow-400 text-xs">(Demo: use placeholder like 12-3456789)</span>
            </label>
            <input
              type="text"
              value={form.ein}
              onChange={(e) => set("ein", e.target.value)}
              className={`form-input w-full font-mono ${errors.ein ? "border-red-500/60" : ""}`}
              placeholder="12-3456789"
              maxLength={10}
              autoComplete="off"
            />
            {form.ein && validateEinFormat(form.ein) && (
              <p className="text-green-400 text-xs mt-1">
                Format valid. Will be stored as {maskEin(extractEinLastFour(form.ein))}
              </p>
            )}
            {errors.ein && <p className="text-red-400 text-xs mt-1">{errors.ein}</p>}
            <p className="text-slate-500 text-xs mt-1">
              EIN format check only. Not verified against any government database.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.einConfirmed}
                onChange={(e) => set("einConfirmed", e.target.checked)}
                className="accent-cyan-400 mt-0.5 shrink-0"
              />
              <span className="text-xs text-slate-300">
                I confirm this is demo data only. I am not entering a real EIN or sensitive business
                information in this demo system.
              </span>
            </label>
            {errors.einConfirmed && (
              <p className="text-red-400 text-xs mt-1">{errors.einConfirmed}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Section 3: Business Address */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Business Address
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
              className="form-input w-full"
              placeholder="123 Main St"
              autoComplete="street-address"
            />
          </div>
          <div>
            <label className="form-label">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="form-input w-full"
              placeholder="Dallas"
              autoComplete="address-level2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">State</label>
              <select
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="form-input w-full"
              >
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">ZIP</label>
              <input
                type="text"
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
                className="form-input w-full"
                placeholder="75001"
                maxLength={10}
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Section 4: Contact Information */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Primary Contact
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={`form-input w-full ${errors.firstName ? "border-red-500/60" : ""}`}
              placeholder="Jane"
              autoComplete="given-name"
            />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={`form-input w-full ${errors.lastName ? "border-red-500/60" : ""}`}
              placeholder="Smith"
              autoComplete="family-name"
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <label className="form-label">Title / Role</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="form-input w-full"
              placeholder="General Manager"
              autoComplete="organization-title"
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="form-input w-full"
              placeholder="(214) 555-0100"
              autoComplete="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={`form-input w-full ${errors.email ? "border-red-500/60" : ""}`}
              placeholder="jane@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 5: Package Interest */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Package Interest
        </legend>
        {filteredPackages.length > 0 ? (
          <div className="space-y-2 mb-4">
            <label className="form-label">Interested Package (optional)</label>
            <select
              value={form.packageId}
              onChange={(e) => set("packageId", e.target.value)}
              className="form-input w-full"
            >
              <option value="">No specific package yet — just getting started</option>
              {form.registrationType ? (
                filteredPackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price.toLocaleString()}/yr
                    {p.setupFee ? ` + $${p.setupFee.toLocaleString()} setup` : ""}
                  </option>
                ))
              ) : (
                Object.entries(PACKAGE_CATEGORY_LABELS).map(([cat, label]) => (
                  <optgroup key={cat} label={label}>
                    {ALL_SALES_PACKAGES.filter((p) => p.category === cat).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${p.price.toLocaleString()}/yr
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
          </div>
        ) : null}

        <div>
          <label className="form-label mb-2 block">Services of Interest (select all that apply)</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {AVAILABLE_SERVICES.map((svc) => (
              <label key={svc.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.interestedServices.includes(svc.id)}
                  onChange={() => toggleService(svc.id)}
                  className="accent-cyan-400 shrink-0"
                />
                <span className="text-slate-300">{svc.label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Section 6: Notes */}
      <fieldset className="wwai-panel p-5">
        <legend className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
          Additional Notes
        </legend>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="form-input w-full h-28 resize-y"
          placeholder="Any additional context, questions, or details you want to share..."
        />
      </fieldset>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="wwai-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Demo Intake"}
          </button>
          <Link href="/sales-registration" className="wwai-btn-ghost">
            Back
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/sales-deck" className="wwai-btn-ghost text-xs">Sales Deck</Link>
          <Link href="/sales-documents" className="wwai-btn-ghost text-xs">Documents</Link>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">
        Fields marked * are required. Demo data only — do not enter real EINs or sensitive
        business information.
      </p>
    </form>
  );
}

export default function SalesIntakePage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl">
      <header className="mb-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Business Intake Form
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Complete the intake form to register your business, venue, or sales partnership with
          WWAI / TROPTIONS. All fields marked * are required.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="wwai-chip wwai-chip-cyan">Demo intake</span>
          <span className="wwai-chip wwai-chip-cyan">No real data stored</span>
        </div>
      </header>
      <Suspense fallback={<div className="text-slate-400 text-center py-12">Loading form...</div>}>
        <IntakeFormContent />
      </Suspense>
    </div>
  );
}
