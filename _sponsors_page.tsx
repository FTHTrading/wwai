"use client";
import { useState } from "react";

type Tier = "gold" | "silver" | "bronze";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  desc: string;
  deals: number;
  revenue: string;
  videoTitle: string;
  location: string;
  since: string;
}

const SPONSORS: Record<Tier, Sponsor[]> = {
  gold: [
    { id: "adidas",  name: "Adidas",        logo: "👟", desc: "Official Kit Partner",       deals: 24, revenue: "$2.1M",  videoTitle: "Adidas FIFA 2026 Activation",    location: "L1 – Adidas Lounge",    since: "2022" },
    { id: "visa",    name: "Visa",           logo: "💳", desc: "Official Payment Partner",   deals: 18, revenue: "$1.8M",  videoTitle: "Pay the FIFA Way",               location: "All Gates",             since: "2018" },
    { id: "cocacola",name: "Coca-Cola",      logo: "🥤", desc: "Official Beverage Partner",  deals: 31, revenue: "$2.7M",  videoTitle: "Taste the Game",                 location: "L1 – All Concessions",  since: "2014" },
  ],
  silver: [
    { id: "nike",    name: "Nike",           logo: "⚽", desc: "Ball Technology Partner",    deals: 12, revenue: "$890K",  videoTitle: "Nike Ball Tech 2026",            location: "L1 – Nike Zone",        since: "2023" },
    { id: "qatar",   name: "Qatar Airways",  logo: "✈️", desc: "Official Airline Partner",   deals: 9,  revenue: "$650K",  videoTitle: "Fly to the Final",               location: "L2 – Arrivals Hall",    since: "2021" },
    { id: "hyundai", name: "Hyundai",        logo: "🚗", desc: "Official Mobility Partner",  deals: 7,  revenue: "$520K",  videoTitle: "Drive the Future of Football",   location: "L3O – Outer Plaza",     since: "2022" },
  ],
  bronze: [
    { id: "budweiser",name:"Budweiser",      logo: "🍺", desc: "Official Beer Partner",      deals: 5,  revenue: "$320K",  videoTitle: "Bud Light FIFA Spots",           location: "L2 – Skybox Bar",       since: "2019" },
    { id: "mcdonalds",name:"McDonald's",     logo: "🍟", desc: "Food & Beverage Partner",    deals: 4,  revenue: "$280K",  videoTitle: "Lovin' Every Goal",              location: "L1 – Food Court",       since: "2020" },
    { id: "vivo",    name: "Vivo",           logo: "📱", desc: "Smartphone Partner",         deals: 6,  revenue: "$310K",  videoTitle: "Capture the Moment",             location: "L1 – Merchandise",      since: "2023" },
  ],
};

const TIERS: { id: Tier; label: string; accent: string; badge: string }[] = [
  { id: "gold",   label: "Gold Partners",   accent: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",  badge: "bg-yellow-400/20 text-yellow-400" },
  { id: "silver", label: "Silver Partners", accent: "text-gray-300 border-gray-500/40 bg-gray-500/10",        badge: "bg-gray-500/20 text-gray-300" },
  { id: "bronze", label: "Bronze Partners", accent: "text-orange-400 border-orange-600/40 bg-orange-600/10",  badge: "bg-orange-600/20 text-orange-400" },
];

export default function SponsorsPage() {
  const [activeTier,     setActiveTier]     = useState<Tier>("gold");
  const [selectedSponsor,setSelectedSponsor] = useState<string | null>(null);
  const [playing,        setPlaying]        = useState<string | null>(null);

  const tier     = TIERS.find((t) => t.id === activeTier)!;
  const sponsors = SPONSORS[activeTier];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Sponsor Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          FIFA × TROPTIONS <span className="text-yellow-400">Partners</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Official sponsor activations, promo videos, and deal tracking across all FIFA 2026 venues.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Sponsors",   value: "420",    icon: "🏆" },
          { label: "Total Activations", value: "1,280",  icon: "📊" },
          { label: "Sponsor Revenue",   value: "$12.7M", icon: "💰" },
          { label: "Events Covered",    value: "64",     icon: "🌍" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-yellow-400">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tier tabs */}
      <div className="flex gap-3 flex-wrap">
        {TIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTier(t.id); setSelectedSponsor(null); }}
            className={`px-5 py-2 rounded-lg font-semibold text-sm border transition-all ${
              activeTier === t.id ? t.accent : "border-gray-800 text-gray-500 hover:border-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sponsor grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            onClick={() => setSelectedSponsor(selectedSponsor === sponsor.id ? null : sponsor.id)}
            className={`bg-gray-900 border rounded-2xl p-6 cursor-pointer transition-all space-y-4 ${
              selectedSponsor === sponsor.id
                ? "border-yellow-400/50 shadow-lg shadow-yellow-400/10"
                : "border-gray-800 hover:border-gray-700"
            }`}
          >
            {/* Logo + tier */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{sponsor.logo}</div>
                <div>
                  <h3 className="font-bold text-white">{sponsor.name}</h3>
                  <p className="text-xs text-gray-400">{sponsor.desc}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Partner since {sponsor.since}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${tier.badge}`}>
                {activeTier.toUpperCase()}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-white">{sponsor.deals}</p>
                <p className="text-xs text-gray-500">Active Deals</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-cyan-400">{sponsor.revenue}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>

            {/* Video card */}
            <div
              onClick={(e) => { e.stopPropagation(); setPlaying(playing === sponsor.id ? null : sponsor.id); }}
              className="bg-gradient-to-br from-blue-950 to-cyan-950 border border-cyan-800/30 rounded-xl h-32 flex items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              {playing === sponsor.id ? (
                <div className="relative text-center space-y-1 px-4">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"/>
                  <p className="text-xs text-cyan-400 font-medium">{sponsor.videoTitle}</p>
                  <p className="text-xs text-gray-500">Streaming…</p>
                </div>
              ) : (
                <div className="relative text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <span className="text-white text-lg ml-0.5">▶</span>
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 px-4">{sponsor.videoTitle}</p>
                </div>
              )}
            </div>

            {/* Location */}
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>📍</span> {sponsor.location}
            </p>

            {/* Expanded actions */}
            {selectedSponsor === sponsor.id && (
              <div className="flex gap-2 pt-1">
                <a href="/sales" className="flex-1 bg-yellow-400 text-gray-950 font-bold py-2 rounded-lg text-sm text-center hover:bg-yellow-300 transition-colors">
                  View Activation
                </a>
                <a href="/map" className="flex-1 bg-gray-800 text-gray-300 font-semibold py-2 rounded-lg text-sm text-center hover:bg-gray-700 transition-colors">
                  Find on Map
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Become a partner CTA */}
      <div className="bg-gradient-to-r from-yellow-950/50 via-gray-900 to-gray-900 border border-yellow-600/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Become a TROPTIONS Partner</h2>
          <p className="text-gray-400 text-sm max-w-lg">
            Join 420+ sponsors activating across FIFA 2026 venues. Custom deal structures, promo video placement,
            and real-time activation tracking — all managed through the TROPTIONS platform.
          </p>
        </div>
        <a
          href="/sales"
          className="shrink-0 bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors whitespace-nowrap"
        >
          Contact Sales →
        </a>
      </div>
    </div>
  );
}
