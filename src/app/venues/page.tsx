"use client";
import { useEffect, useState } from "react";

interface Venue {
  id: string;
  name: string;
  address: string | null;
  city: string;
  category: string;
  capacity: number | null;
  status: string;
  _count: { campaigns: number; leads: number };
}

const CATEGORIES = [
  { id: "",              label: "All Categories" },
  { id: "stadium",       label: "Stadium / Arena" },
  { id: "hotel",         label: "Hotel / Hospitality" },
  { id: "transit",       label: "Transit Hub" },
  { id: "entertainment", label: "Entertainment" },
  { id: "food",          label: "Food & Beverage" },
  { id: "retail",        label: "Retail" },
];

const STATUS_COLOR: Record<string, string> = {
  prospect:  "text-slate-400 bg-slate-800 border-slate-700",
  onboarded: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  active:    "text-green-400 bg-green-400/10 border-green-400/30",
  inactive:  "text-red-400 bg-red-400/10 border-red-400/30",
};

const CAT_COLOR: Record<string, string> = {
  stadium:       "text-[#00d4ff]",
  hotel:         "text-[#d4a017]",
  transit:       "text-purple-400",
  entertainment: "text-pink-400",
  food:          "text-orange-400",
  retail:        "text-green-400",
  general:       "text-slate-400",
};

export default function VenuesPage() {
  const [venues,    setVenues]    = useState<Venue[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [showForm,  setShowForm]  = useState(false);

  // Form state
  const [fName,    setFName]    = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fCity,    setFCity]    = useState("Atlanta");
  const [fCat,     setFCat]     = useState("general");
  const [fCap,     setFCap]     = useState("");
  const [fEmail,   setFEmail]   = useState("");
  const [fPhone,   setFPhone]   = useState("");
  const [fContact, setFContact] = useState("");
  const [fNotes,   setFNotes]   = useState("");
  const [fLoading, setFLoading] = useState(false);
  const [fError,   setFError]   = useState("");

  function load() {
    setLoading(true);
    const q = catFilter ? `?category=${catFilter}` : "";
    fetch(`/api/venues${q}`)
      .then(r => r.json())
      .then(d => { setVenues(Array.isArray(d) ? d : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [catFilter]);

  async function submitVenue(e: React.FormEvent) {
    e.preventDefault();
    if (!fName.trim()) { setFError("Venue name is required"); return; }
    setFError(""); setFLoading(true);
    try {
      const res = await fetch("/api/venues", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fName.trim(), address: fAddress || undefined, city: fCity,
          category: fCat, capacity: fCap ? Number(fCap) : undefined,
          contactName: fContact || undefined, contactEmail: fEmail || undefined,
          contactPhone: fPhone || undefined, notes: fNotes || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowForm(false); setFName(""); setFAddress(""); setFCity("Atlanta"); setFCat("general");
      setFCap(""); setFEmail(""); setFPhone(""); setFContact(""); setFNotes("");
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
          <span className="pill-gold">TROPTIONS Venue Network</span>
          <h1 className="troptions-hero-brand">Venue System</h1>
          <p className="troptions-hero-subtitle">Onboard · Activate · Convert</p>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Stadiums, hotels, transit hubs, entertainment zones — every venue is a revenue activation point.
          </p>
          <button onClick={() => setShowForm(v => !v)} className="btn-troptions inline-flex mx-auto">
            {showForm ? "Cancel" : "Add Venue →"}
          </button>
        </div>
      </section>

      {/* Onboarding Form */}
      {showForm && (
        <form onSubmit={submitVenue} className="card-dark p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#d4a017]">Venue Onboarding</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Venue Name *</label>
              <input value={fName} onChange={e => setFName(e.target.value)} required placeholder="Mercedes-Benz Stadium"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">City</label>
              <input value={fCity} onChange={e => setFCity(e.target.value)} placeholder="Atlanta"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Address</label>
            <input value={fAddress} onChange={e => setFAddress(e.target.value)} placeholder="1 AMB Drive NW, Atlanta, GA 30313"
              className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Category</label>
              <select value={fCat} onChange={e => setFCat(e.target.value)}
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]">
                <option value="stadium">Stadium / Arena</option>
                <option value="hotel">Hotel / Hospitality</option>
                <option value="transit">Transit Hub</option>
                <option value="entertainment">Entertainment</option>
                <option value="food">Food &amp; Beverage</option>
                <option value="retail">Retail</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Capacity</label>
              <input value={fCap} onChange={e => setFCap(e.target.value)} type="number" placeholder="71,000"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Contact Name</label>
              <input value={fContact} onChange={e => setFContact(e.target.value)} placeholder="John Doe"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Contact Email</label>
              <input value={fEmail} onChange={e => setFEmail(e.target.value)} type="email" placeholder="ops@venue.com"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Contact Phone</label>
              <input value={fPhone} onChange={e => setFPhone(e.target.value)} type="tel" placeholder="+1 404 555 0100"
                className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Notes</label>
            <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} rows={2} placeholder="Any context for the onboarding team..."
              className="w-full bg-[#050810] border border-[#162035] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff] resize-none" />
          </div>
          {fError && <p className="text-red-400 text-sm">{fError}</p>}
          <button type="submit" disabled={fLoading} className="btn-troptions w-full justify-center">
            {fLoading ? "Adding…" : "Add Venue →"}
          </button>
        </form>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              catFilter === c.id ? "border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10" : "border-[#162035] text-slate-400 hover:border-[#00d4ff]/40"
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Venue Grid */}
      {loading ? (
        <p className="text-slate-500 text-center py-12">Loading venues…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map(v => (
            <div key={v.id} className="card-dark p-5 space-y-3 hover:border-[#162035]/80 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{v.name}</h3>
                  <p className="text-slate-500 text-xs">{v.address ?? v.city}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${STATUS_COLOR[v.status] ?? "text-slate-400"}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium capitalize ${CAT_COLOR[v.category] ?? "text-slate-400"}`}>{v.category}</span>
                {v.capacity && <span className="text-slate-500">{v.capacity.toLocaleString()} cap.</span>}
              </div>
              <div className="flex gap-3 text-xs text-slate-500 border-t border-[#162035] pt-2">
                <span><span className="text-[#00d4ff] font-semibold">{v._count.campaigns}</span> campaigns</span>
                <span><span className="text-[#d4a017] font-semibold">{v._count.leads}</span> leads</span>
              </div>
            </div>
          ))}
          {venues.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No venues yet. Use the form above to onboard your first venue.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
