"use client";
import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  impressions: number;
  clicks: number;
  redemptions: number;
  notes: string | null;
  sponsor: { name: string } | null;
  venue: { name: string } | null;
  _count: { qrCodes: number };
}
interface Sponsor { id: string; name: string; }
interface Venue   { id: string; name: string; }

const STATUS_COLOR: Record<string, string> = {
  draft:     "text-slate-400 bg-slate-800 border-slate-700",
  active:    "text-green-400 bg-green-400/10 border-green-400/30",
  paused:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  completed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sponsors,  setSponsors]  = useState<Sponsor[]>([]);
  const [venues,    setVenues]    = useState<Venue[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);

  // Form state
  const [fName,      setFName]      = useState("");
  const [fSponsor,   setFSponsor]   = useState("");
  const [fVenue,     setFVenue]     = useState("");
  const [fType,      setFType]      = useState("qr");
  const [fStart,     setFStart]     = useState("");
  const [fEnd,       setFEnd]       = useState("");
  const [fBudget,    setFBudget]    = useState("");
  const [fNotes,     setFNotes]     = useState("");
  const [fLoading,   setFLoading]   = useState(false);
  const [fError,     setFError]     = useState("");

  function load() {
    setLoading(true);
    Promise.all([
      fetch("/api/campaigns").then(r => r.json()),
      fetch("/api/sponsors").then(r => r.json()),
      fetch("/api/venues").then(r => r.json()),
    ]).then(([c, s, v]) => {
      setCampaigns(Array.isArray(c) ? c : []);
      setSponsors(Array.isArray(s) ? s : []);
      setVenues(Array.isArray(v) ? v : []);
    }).catch(console.error).finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, []);

  async function submitCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!fName.trim()) { setFError("Campaign name is required"); return; }
    setFError(""); setFLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:      fName.trim(),
          sponsorId: fSponsor || undefined,
          venueId:   fVenue   || undefined,
          type:      fType,
          startDate: fStart   || undefined,
          endDate:   fEnd     || undefined,
          budget:    fBudget  ? parseFloat(fBudget) : undefined,
          notes:     fNotes   || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowForm(false); setFName(""); setFSponsor(""); setFVenue(""); setFType("qr");
      setFStart(""); setFEnd(""); setFBudget(""); setFNotes("");
      load();
    } catch (err) {
      setFError(err instanceof Error ? err.message : "Failed");
    } finally {
      setFLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="pt-8 pb-2 text-center space-y-3 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="pill-gold">TROPTIONS Campaign Engine</span>
          <h1 className="troptions-hero-brand">Campaigns</h1>
          <p className="troptions-hero-subtitle">Create · Track · Convert</p>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Build sponsor campaigns, generate QR codes, and track redemptions across every venue touchpoint.
          </p>
          <button onClick={() => setShowForm(v => !v)} className="btn-troptions inline-flex mx-auto">
            {showForm ? "Cancel" : "New Campaign →"}
          </button>
        </div>
      </section>

      {/* Creation Form */}
      {showForm && (
        <form onSubmit={submitCampaign} className="card-dark p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#d4a017]">Campaign Details</h3>
          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Campaign Name *</label>
            <input value={fName} onChange={e => setFName(e.target.value)} required placeholder="Atlanta Sponsor Activation Q2"
              className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Sponsor</label>
              <select value={fSponsor} onChange={e => setFSponsor(e.target.value)}
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]">
                <option value="">— No sponsor —</option>
                {sponsors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Venue</label>
              <select value={fVenue} onChange={e => setFVenue(e.target.value)}
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]">
                <option value="">— No venue —</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Campaign Type</label>
              <select value={fType} onChange={e => setFType(e.target.value)}
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]">
                <option value="qr">QR Code</option>
                <option value="offer">Offer / Coupon</option>
                <option value="event">Event Activation</option>
                <option value="digital">Digital</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Budget ($)</label>
              <input value={fBudget} onChange={e => setFBudget(e.target.value)} type="number" placeholder="50000"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Start Date</label>
              <input value={fStart} onChange={e => setFStart(e.target.value)} type="date"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">End Date</label>
              <input value={fEnd} onChange={e => setFEnd(e.target.value)} type="date"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Notes</label>
            <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} rows={2} placeholder="Campaign brief, targeting notes..."
              className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff] resize-none" />
          </div>
          {fError && <p className="text-red-400 text-sm">{fError}</p>}
          <button type="submit" disabled={fLoading} className="btn-troptions w-full justify-center">
            {fLoading ? "Creating…" : "Create Campaign →"}
          </button>
        </form>
      )}

      {/* Campaign List */}
      {loading ? (
        <p className="text-slate-500 text-center py-12">Loading campaigns…</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="card-dark p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_COLOR[c.status] ?? "text-slate-400"}`}>{c.status}</span>
                  <span className="text-[10px] text-slate-500 capitalize border border-[#162035] px-2 py-0.5 rounded">{c.type}</span>
                </div>
                <p className="text-slate-500 text-xs">
                  {c.sponsor?.name && <span className="text-[#d4a017]">{c.sponsor.name}</span>}
                  {c.sponsor?.name && c.venue?.name && <span className="text-slate-600"> · </span>}
                  {c.venue?.name && <span className="text-[#00d4ff]">{c.venue.name}</span>}
                  {!c.sponsor?.name && !c.venue?.name && <span>No sponsor or venue linked</span>}
                </p>
                {(c.startDate || c.endDate) && (
                  <p className="text-slate-600 text-xs">
                    {c.startDate ? new Date(c.startDate).toLocaleDateString() : "?"} — {c.endDate ? new Date(c.endDate).toLocaleDateString() : "ongoing"}
                  </p>
                )}
              </div>
              <div className="flex sm:flex-col gap-4 sm:gap-1 sm:text-right shrink-0 text-sm">
                <div>
                  <p className="text-[#d4a017] font-bold text-lg">{c.redemptions.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">redemptions</p>
                </div>
                <div>
                  <p className="text-[#00d4ff] font-semibold">{c._count.qrCodes}</p>
                  <p className="text-slate-500 text-xs">QR codes</p>
                </div>
                {c.budget && (
                  <div>
                    <p className="text-green-400 font-semibold">${c.budget.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">budget</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="text-center py-12 text-slate-500 border border-[#162035] rounded-xl">
              No campaigns yet. Create your first campaign above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
