"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Package { id: string; name: string; monthlyFee: number; setupFee: number; tier: string; includedServices: string; }
interface Sponsor { id: string; name: string; }
interface Venue   { id: string; name: string; city: string; }

interface Proposal {
  id:           string;
  status:       string;
  campaignType: string;
  termMonths:   number;
  customBudget: number | null;
  estimatedROI: number | null;
  notes:        string | null;
  createdAt:    string;
  sponsor:      { id: string; name: string } | null;
  package:      { id: string; name: string; monthlyFee: number; setupFee: number } | null;
  venue:        { id: string; name: string; city: string } | null;
}

const STATUS_COLOR: Record<string, string> = {
  draft:    "text-slate-400 border-slate-700 bg-slate-800",
  sent:     "text-blue-400 border-blue-400/30 bg-blue-400/10",
  accepted: "text-green-400 border-green-400/30 bg-green-400/10",
  declined: "text-red-400 border-red-400/30 bg-red-400/10",
};

const CAMPAIGN_TYPES = ["qr", "offer", "event", "digital"];

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n.toFixed(0)}`;

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [packages,  setPackages]  = useState<Package[]>([]);
  const [sponsors,  setSponsors]  = useState<Sponsor[]>([]);
  const [venues,    setVenues]    = useState<Venue[]>([]);
  const [creating,  setCreating]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  // Form state
  const [form, setForm] = useState({
    sponsorId: "", packageId: "", venueId: "",
    campaignType: "qr", termMonths: "12", notes: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/proposals").then(r => r.json()),
      fetch("/api/packages").then(r => r.json()),
      fetch("/api/sponsors").then(r => r.json()),
      fetch("/api/venues").then(r => r.json()),
    ]).then(([p, pk, sp, v]) => {
      setProposals(Array.isArray(p)  ? p  : []);
      setPackages( Array.isArray(pk) ? pk : []);
      setSponsors( Array.isArray(sp) ? sp : []);
      setVenues(   Array.isArray(v)  ? v  : []);
    }).catch(console.error);
  }, []);

  const selectedPkg = packages.find(p => p.id === form.packageId);
  const months      = parseInt(form.termMonths) || 12;
  const totalBase   = selectedPkg ? (selectedPkg.monthlyFee * months) + selectedPkg.setupFee : 0;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorId:    form.sponsorId    || null,
          packageId:    form.packageId    || null,
          venueId:      form.venueId      || null,
          campaignType: form.campaignType,
          termMonths:   months,
          notes:        form.notes        || null,
        }),
      });
      const created = await res.json();
      setProposals(prev => [created, ...prev]);
      setCreating(false);
      setForm({ sponsorId: "", packageId: "", venueId: "", campaignType: "qr", termMonths: "12", notes: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section className="pt-8 pb-2 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="pill-gold">Sales Proposals</span>
            <h1 className="text-3xl font-black text-white">
              <span className="gradient-cyan">Proposal</span> Generator
            </h1>
            <p className="text-slate-400 text-sm">Build sponsor packages and calculate contract value before sending.</p>
          </div>
          <button onClick={() => setCreating(c => !c)} className="btn-troptions">
            {creating ? "× Cancel" : "+ New Proposal"}
          </button>
        </div>
      </section>

      {/* New Proposal Form */}
      {creating && (
        <section className="card-dark rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Build New Proposal</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Sponsor</label>
                <select value={form.sponsorId} onChange={e => setForm(f => ({ ...f, sponsorId: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none">
                  <option value="">— Select sponsor —</option>
                  {sponsors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Package</label>
                <select value={form.packageId} onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none">
                  <option value="">— Select package —</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name} (${p.monthlyFee.toLocaleString()}/mo)</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Venue (optional)</label>
                <select value={form.venueId} onChange={e => setForm(f => ({ ...f, venueId: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none">
                  <option value="">— Select venue —</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Campaign Type</label>
                <select value={form.campaignType} onChange={e => setForm(f => ({ ...f, campaignType: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none">
                  {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Term (months)</label>
                <input type="number" min={1} max={60} value={form.termMonths}
                  onChange={e => setForm(f => ({ ...f, termMonths: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-xs uppercase tracking-widest">Notes</label>
                <input type="text" value={form.notes} placeholder="Optional notes…"
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-[#050810] border border-[#162035] text-white rounded-xl px-3 py-2 text-sm focus:border-[#00d4ff]/60 outline-none placeholder:text-slate-600" />
              </div>
            </div>

            {/* Proposal Preview Card */}
            {selectedPkg && (
              <div className="rounded-2xl bg-[#050810] border border-[#00d4ff]/30 overflow-hidden">
                <div className="border-b border-[#162035] px-5 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4ff] text-xs font-bold uppercase tracking-widest">Proposal Preview</span>
                    {selectedPkg.tier && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        selectedPkg.tier === "enterprise" ? "text-purple-400 border-purple-400/30 bg-purple-400/10"
                        : selectedPkg.tier === "featured"  ? "text-[#d4a017] border-[#d4a017]/30 bg-[#d4a017]/10"
                        : "text-slate-400 border-slate-700 bg-slate-800"
                      }`}>{selectedPkg.tier.toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-slate-600 text-[10px]">Not yet saved</span>
                </div>

                <div className="p-5 space-y-5">
                  {/* Key Numbers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#162035]">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Package</p>
                      <p className="text-white font-semibold text-sm leading-tight">{selectedPkg.name}</p>
                    </div>
                    <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#162035]">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Monthly Fee</p>
                      <p className="text-[#00d4ff] font-bold text-base">{fmt(selectedPkg.monthlyFee)}</p>
                    </div>
                    <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#162035]">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Setup Fee</p>
                      <p className="text-[#d4a017] font-bold text-base">{fmt(selectedPkg.setupFee)}</p>
                    </div>
                    <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#00d4ff]/30">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Total Contract Value</p>
                      <p className="text-green-400 font-black text-lg">{fmt(totalBase)}</p>
                      <p className="text-slate-600 text-[10px]">{fmt(selectedPkg.monthlyFee)}/mo × {months} + {fmt(selectedPkg.setupFee)}</p>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[10px] uppercase tracking-widest">Sponsor</p>
                      <p className="text-white text-sm">{sponsors.find(s => s.id === form.sponsorId)?.name ?? <span className="text-slate-500 italic">Not selected</span>}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[10px] uppercase tracking-widest">Venue</p>
                      <p className="text-white text-sm">{venues.find(v => v.id === form.venueId)?.name ?? <span className="text-slate-500 italic">Not selected</span>}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[10px] uppercase tracking-widest">Campaign Type / Term</p>
                      <p className="text-white text-sm capitalize">{form.campaignType} — {months} months</p>
                    </div>
                  </div>

                  {/* Included Services */}
                  {(() => {
                    let services: string[] = [];
                    try { services = JSON.parse(selectedPkg.includedServices); } catch {}
                    return services.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-slate-600 text-[10px] uppercase tracking-widest">Included Services</p>
                        <div className="flex flex-wrap gap-2">
                          {services.map((s: string) => (
                            <span key={s} className="text-[11px] bg-[#162035] text-slate-300 px-2 py-1 rounded-lg border border-[#162035]">{s}</span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="flex items-center gap-2 border border-[#162035] rounded-lg px-4 py-2.5">
                    <span className="text-[#d4a017] text-sm">↓</span>
                    <p className="text-slate-500 text-xs">Save this proposal to prepare it for PDF export and sharing with the sponsor.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-troptions">
                {saving ? "Saving…" : "Create Proposal"}
              </button>
              <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 border border-[#162035] text-slate-400 rounded-xl text-sm hover:border-slate-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Proposals List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-xs">{proposals.length} proposals</p>
          <Link href="/pricing" className="text-[#00d4ff] text-xs hover:underline">View Package Pricing →</Link>
        </div>

        {proposals.length === 0 && (
          <div className="card-dark rounded-2xl p-10 text-center space-y-3">
            <div className="text-4xl">📋</div>
            <p className="text-white font-semibold">No proposals yet</p>
            <p className="text-slate-400 text-sm">Create your first proposal to estimate contract value and package fit.</p>
            <button onClick={() => setCreating(true)} className="btn-troptions">+ New Proposal</button>
          </div>
        )}

        {proposals.map(prop => {
          const monthly = prop.package?.monthlyFee ?? 0;
          const setup   = prop.package?.setupFee   ?? 0;
          const total   = monthly * prop.termMonths + setup;
          return (
            <div key={prop.id} className="card-dark rounded-xl p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-white font-semibold truncate">
                    {prop.sponsor?.name ?? "Unassigned Sponsor"}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLOR[prop.status] ?? ""}`}>
                    {prop.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {prop.package && <span className="text-[#00d4ff]">{prop.package.name}</span>}
                  {prop.venue   && <span>📍 {prop.venue.name}</span>}
                  <span className="capitalize">🎯 {prop.campaignType} campaign</span>
                  <span>📅 {prop.termMonths} months</span>
                </div>
                {prop.notes && <p className="text-slate-500 text-xs italic truncate">{prop.notes}</p>}
              </div>
              <div className="text-right shrink-0">
                {total > 0 ? (
                  <>
                    <p className="text-green-400 font-bold text-lg">{fmt(total)}</p>
                    <p className="text-slate-500 text-xs">total contract value</p>
                    {monthly > 0 && <p className="text-slate-600 text-xs">{fmt(monthly)}/mo × {prop.termMonths} + {fmt(setup)} setup</p>}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">No package selected</p>
                )}
                <p className="text-slate-700 text-[10px] mt-1">{new Date(prop.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
