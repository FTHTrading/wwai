"use client";

import { useMemo, useState } from "react";
import {
  ALL_PACKAGES,
  SPONSOR_PACKAGES,
  MERCHANT_PACKAGES,
  HOTEL_PACKAGES,
  DRIVER_PACKAGES,
  ZONES,
} from "@/data/demoData";
import { ADDON_PRICES, formatUSD } from "@/lib/calculations";
import { buildProposalSummary } from "@/lib/proposal";
import { saveProposal } from "@/lib/demoStorage";
import type { PartnerCategory } from "@/lib/types";

const CUSTOMER_TYPES: { id: PartnerCategory; label: string }[] = [
  { id: "sponsor", label: "Sponsor" },
  { id: "restaurant", label: "Restaurant" },
  { id: "bar", label: "Bar" },
  { id: "hotel", label: "Hotel" },
  { id: "driver", label: "Driver" },
  { id: "venue", label: "Venue" },
];

export default function ProposalBuilder({ initialPackageId }: { initialPackageId?: string }) {
  const [customerType, setCustomerType] = useState<PartnerCategory>("sponsor");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [packageId, setPackageId] = useState(initialPackageId || SPONSOR_PACKAGES[0].id);
  const [campaignType, setCampaignType] = useState("QR Offer");
  const [zone, setZone] = useState(ZONES[0]);
  const [termMonths, setTermMonths] = useState(12);
  const [addons, setAddons] = useState<string[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);

  const pkgsForType = useMemo(() => {
    if (customerType === "sponsor") return SPONSOR_PACKAGES;
    if (customerType === "hotel") return HOTEL_PACKAGES;
    if (customerType === "driver") return DRIVER_PACKAGES;
    if (customerType === "venue") return [...SPONSOR_PACKAGES, ...MERCHANT_PACKAGES];
    return MERCHANT_PACKAGES;
  }, [customerType]);

  const pkg = useMemo(() => ALL_PACKAGES.find((p) => p.id === packageId), [packageId]);
  const summary = buildProposalSummary(pkg, addons, termMonths);

  const toggleAddon = (id: string) =>
    setAddons((arr) => (arr.includes(id) ? arr.filter((a) => a !== id) : [...arr, id]));

  const handleSave = () => {
    if (!pkg) return;
    const proposal = saveProposal({
      customerType,
      businessName: businessName || "Demo Business",
      contactName: contactName || "Demo Contact",
      packageId: pkg.id,
      campaignType,
      zone,
      termMonths,
      addons,
      totalContractValue: summary.total,
      setupFee: summary.setup,
      annualFee: summary.annual,
    });
    setSavedId(proposal.id);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="wwai-panel p-5 space-y-4">
        <h3 className="text-lg font-bold text-white">Configure Proposal</h3>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest">Customer Type</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CUSTOMER_TYPES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCustomerType(c.id);
                  setPackageId(
                    c.id === "sponsor" ? SPONSOR_PACKAGES[0].id
                    : c.id === "hotel" ? HOTEL_PACKAGES[0].id
                    : c.id === "driver" ? DRIVER_PACKAGES[0].id
                    : MERCHANT_PACKAGES[0].id
                  );
                }}
                className={`text-xs py-2 rounded-lg border ${
                  customerType === c.id
                    ? "bg-cyan-400/10 border-cyan-400 text-cyan-300"
                    : "border-[#162035] text-slate-400 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Business name" value={businessName} onChange={setBusinessName} />
          <Field label="Contact name" value={contactName} onChange={setContactName} />
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest">Package</label>
          <select
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
          >
            {pkgsForType.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatUSD(p.price)}/yr
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest">Campaign Type</label>
            <select
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
              className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
            >
              {["QR Offer", "Hotel Route", "Citywide Activation", "Audience Segment", "Reward Engine", "Safety Route", "Venue Placement"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest">Zone</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
            >
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest">Term (months)</label>
          <input
            type="number"
            min={3}
            max={60}
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value) || 12)}
            className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest">Add-ons</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.entries(ADDON_PRICES).map(([id, info]) => (
              <label key={id} className={`flex items-center gap-2 text-xs p-2 rounded-lg border cursor-pointer ${
                addons.includes(id) ? "border-cyan-400 bg-cyan-400/5" : "border-[#162035]"
              }`}>
                <input
                  type="checkbox"
                  checked={addons.includes(id)}
                  onChange={() => toggleAddon(id)}
                  className="accent-cyan-400"
                />
                <span className="flex-1 text-slate-300">{info.label}</span>
                <span className="text-amber-400">{formatUSD(info.annual)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="wwai-panel p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Proposal Summary</h3>
        <div className="text-sm text-slate-400">{pkg?.name} · {pkg?.bestFor}</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Setup Fee"   value={summary.formatted.setup} />
          <Row label="Annual Fee"  value={summary.formatted.annual} />
          <Row label="Add-ons / yr" value={summary.formatted.addons} />
          <Row label="Term"         value={`${termMonths} months`} />
        </div>
        <div className="mt-4 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
          <div className="text-xs uppercase tracking-widest text-amber-400">Total Contract Value</div>
          <div className="text-3xl font-extrabold text-amber-300 mt-1">{summary.formatted.total}</div>
        </div>
        {summary.addonLabels.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-3">Included add-ons</div>
            <ul className="mt-1 text-sm text-slate-300 list-disc list-inside">
              {summary.addonLabels.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
        )}
        <div className="flex gap-2 pt-3 flex-wrap">
          <button onClick={handleSave} className="wwai-btn-primary text-sm">Save Demo Proposal</button>
          <button onClick={() => typeof window !== "undefined" && window.print()} className="wwai-btn-ghost text-sm">Print Preview</button>
          <a href="/contact" className="wwai-btn-ghost text-sm">Contact Sales</a>
          <a href="/billing" className="wwai-btn-ghost text-sm">View Billing</a>
          <button className="wwai-btn-disabled text-sm" disabled title="PDF export future-ready">PDF Export</button>
        </div>
        {savedId && (
          <div className="text-xs text-emerald-400 mt-2">Saved demo proposal: {savedId}</div>
        )}
        <p className="disclaimer-bar mt-3">Demo data. PDF export, signature, and CRM sync require integration.</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-slate-400 uppercase tracking-widest">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#0a1220] border border-[#162035]">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-base font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}
