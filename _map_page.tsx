"use client";
import { useState } from "react";
import Link from "next/link";

const FLOORS = [
  { id: "L1",  label: "L1 Concourse" },
  { id: "L2",  label: "L2 Upper Concourse" },
  { id: "L3S", label: "L3 Suites" },
  { id: "L3O", label: "L3 Outdoor Plaza" },
];

const LANGUAGES = [
  "English","Spanish","French","German","Arabic","Portuguese",
  "Chinese","Japanese","Korean","Italian","Russian","Dutch",
];

type PinMap = { [key: string]: { id: string; label: string; x: number; y: number; color: string; icon: string; eta: string }[] };
const PINS: PinMap = {
  L1: [
    { id: "stage",  label: "Main Stage",      x: 45, y: 35, color: "#facc15", icon: "⭐", eta: "6 min · 420m" },
    { id: "merch",  label: "Merchandise",      x: 72, y: 55, color: "#a78bfa", icon: "🛍", eta: "3 min · 180m" },
    { id: "food",   label: "Food Court",       x: 28, y: 65, color: "#f97316", icon: "🍔", eta: "2 min · 95m" },
    { id: "aid",    label: "First Aid",        x: 80, y: 22, color: "#ef4444", icon: "🏥", eta: "4 min · 220m" },
    { id: "sp1",    label: "Adidas Lounge",    x: 55, y: 18, color: "#22d3ee", icon: "🏆", eta: "5 min · 310m" },
    { id: "sp2",    label: "Nike Zone",        x: 18, y: 40, color: "#22d3ee", icon: "🏆", eta: "7 min · 390m" },
    { id: "rest",   label: "Restrooms",        x: 62, y: 72, color: "#6b7280", icon: "🚻", eta: "1 min · 60m" },
  ],
  L2: [
    { id: "vip",    label: "VIP Lounge",       x: 50, y: 30, color: "#facc15", icon: "⭐", eta: "8 min · 520m" },
    { id: "skybar", label: "Skybox Bar",       x: 65, y: 60, color: "#f97316", icon: "🍺", eta: "5 min · 280m" },
    { id: "sp3",    label: "FIFA Store",       x: 35, y: 45, color: "#22d3ee", icon: "🏆", eta: "4 min · 240m" },
    { id: "press",  label: "Press Box",        x: 78, y: 35, color: "#a78bfa", icon: "🎤", eta: "9 min · 580m" },
  ],
  L3S: [
    { id: "suiteA", label: "Suite A",          x: 30, y: 35, color: "#facc15", icon: "🏟", eta: "10 min · 680m" },
    { id: "suiteB", label: "Suite B",          x: 50, y: 30, color: "#facc15", icon: "🏟", eta: "11 min · 710m" },
    { id: "suiteC", label: "Suite C",          x: 70, y: 35, color: "#facc15", icon: "🏟", eta: "12 min · 750m" },
  ],
  L3O: [
    { id: "fanzone",label: "Fan Zone",         x: 50, y: 45, color: "#22d3ee", icon: "🎉", eta: "15 min · 1.1km" },
    { id: "parking",label: "Parking Lot A",    x: 25, y: 70, color: "#6b7280", icon: "🚗", eta: "18 min · 1.4km" },
    { id: "shuttle",label: "Shuttle Stop",     x: 72, y: 68, color: "#84cc16", icon: "🚌", eta: "20 min · 1.6km" },
  ],
};

const ROUTE_STEPS = [
  { icon: "📍", label: "Your Location",  sub: "North Concourse" },
  { icon: "⬆️", label: "Walk straight",  sub: "120 m" },
  { icon: "↪️", label: "Turn right",     sub: "45 m" },
  { icon: "🆙", label: "Escalator up",   sub: "15 m" },
  { icon: "↩️", label: "Keep left",      sub: "60 m" },
  { icon: "⭐", label: "Main Stage",     sub: "Arrive in 6 min" },
];

const CROWD = [
  { zone: "Main Concourse", pct: 78, color: "bg-red-500" },
  { zone: "Food Court",     pct: 45, color: "bg-yellow-500" },
  { zone: "Merchandise",    pct: 32, color: "bg-green-500" },
  { zone: "VIP Entrance",   pct: 15, color: "bg-green-400" },
];

export default function MapPage() {
  const [activeFloor,  setActiveFloor]  = useState("L1");
  const [selectedPin,  setSelectedPin]  = useState<string | null>("stage");
  const [language,     setLanguage]     = useState("English");
  const [routing,      setRouting]      = useState(false);

  const pins    = PINS[activeFloor] ?? [];
  const selected = pins.find((p) => p.id === selectedPin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Mapping Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          TROPTIONS <span className="text-cyan-400">Venue Map</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Live wayfinding · Indoor navigation · Sponsor locations · Crowd insights · 12+ languages
        </p>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-4 gap-4">

        {/* Map panel */}
        <div className="lg:col-span-3 bg-gray-900 border border-cyan-800/40 rounded-2xl overflow-hidden">

          {/* Floor tabs + language */}
          <div className="border-b border-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {FLOORS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setActiveFloor(f.id); setSelectedPin(null); setRouting(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFloor === f.id
                      ? "bg-cyan-500 text-gray-950"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* SVG Map canvas */}
          <div className="relative bg-[#050d1a]" style={{ height: 420 }}>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
            </svg>

            {/* Venue floor plan */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5"  y="8"  width="90" height="84" rx="3" fill="none" stroke="#1e40af" strokeWidth="0.8" opacity="0.5"/>
              <rect x="12" y="16" width="76" height="68" rx="2" fill="#0c1a3a" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.7"/>
              {/* Field */}
              <ellipse cx="50" cy="52" rx="22" ry="15" fill="#0a2a14" stroke="#166534" strokeWidth="0.8" opacity="0.8"/>
              <ellipse cx="50" cy="52" rx="16" ry="10" fill="none" stroke="#16a34a" strokeWidth="0.4" opacity="0.6"/>
              <line x1="50" y1="37" x2="50" y2="67" stroke="#16a34a" strokeWidth="0.3" opacity="0.5"/>
              <circle cx="50" cy="52" r="4" fill="none" stroke="#16a34a" strokeWidth="0.3" opacity="0.5"/>
              {/* Seating arcs */}
              <path d="M 15 25 Q 50 10 85 25" fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.4"/>
              <path d="M 15 79 Q 50 94 85 79" fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.4"/>
              {/* Corridors */}
              <rect x="5"  y="44" width="7"  height="12" fill="#0f172a" stroke="#1e40af" strokeWidth="0.3"/>
              <rect x="88" y="44" width="7"  height="12" fill="#0f172a" stroke="#1e40af" strokeWidth="0.3"/>
              <rect x="44" y="8"  width="12" height="8"  fill="#0f172a" stroke="#1e40af" strokeWidth="0.3"/>
              <rect x="44" y="84" width="12" height="8"  fill="#0f172a" stroke="#1e40af" strokeWidth="0.3"/>
              {/* Route line */}
              {routing && (
                <path
                  d="M 50 92 L 50 72 L 47 62 L 47 45 L 45 35"
                  fill="none" stroke="#22d3ee" strokeWidth="1.8"
                  strokeDasharray="3,2" opacity="0.95"
                  style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }}
                />
              )}
            </svg>

            {/* Pins */}
            {pins.map((pin) => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin.id === selectedPin ? null : pin.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-10"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                title={pin.label}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                  style={{
                    backgroundColor: pin.color + "33",
                    border: `2px solid ${selectedPin === pin.id ? pin.color : "transparent"}`,
                    boxShadow: selectedPin === pin.id ? `0 0 14px ${pin.color}88` : "none",
                  }}
                >
                  <span style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.5))" }}>{pin.icon}</span>
                </div>
                {selectedPin === pin.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 border border-cyan-600 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-20">
                    <div className="font-semibold">{pin.label}</div>
                    <div className="text-cyan-400">{pin.eta}</div>
                  </div>
                )}
              </button>
            ))}

            {/* Live badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-gray-900/90 border border-green-700 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-green-400 text-[10px] font-bold">LIVE</span>
            </div>

            {/* 3D toggle */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
              {["3D", "+", "−"].map((b) => (
                <button key={b} className="w-7 h-7 bg-gray-800/90 border border-gray-700 rounded text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Destination bar */}
          {selected ? (
            <div className="border-t border-gray-800 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white flex items-center gap-2">
                  <span>{selected.icon}</span> {selected.label}
                </p>
                <p className="text-sm text-cyan-400 font-medium">{selected.eta}</p>
                <p className="text-xs text-gray-500">via North Concourse</p>
              </div>
              <button
                onClick={() => setRouting(true)}
                className="bg-cyan-500 text-gray-950 font-bold px-5 py-2.5 rounded-lg hover:bg-cyan-400 transition-colors shrink-0 flex items-center gap-2"
              >
                Start Route →
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-800 p-4 text-center text-gray-500 text-sm">
              Tap any pin to get directions
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">

          {/* Route Steps */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-white text-sm">Route Steps</h3>
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className={`flex items-start gap-3 text-sm ${
                i === 0 ? "text-cyan-400" :
                i === ROUTE_STEPS.length - 1 ? "text-yellow-400" : "text-gray-300"
              }`}>
                <span className="text-base leading-none mt-0.5">{step.icon}</span>
                <div>
                  <p className="font-medium leading-tight">{step.label}</p>
                  <p className="text-xs text-gray-500">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floor / Zone */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-white text-sm mb-3">Floor / Zone</h3>
            {FLOORS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFloor(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeFloor === f.id
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Crowd Density */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-white text-sm">Crowd Density</h3>
            {CROWD.map((z) => (
              <div key={z.zone}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{z.zone}</span><span>{z.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${z.color} transition-all`} style={{ width: `${z.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { icon: "🧭", title: "Wayfinding",      desc: "Live, accurate guidance" },
            { icon: "🏟", title: "Indoor Maps",      desc: "Detailed venue navigation" },
            { icon: "🛡", title: "Safety Routing",   desc: "Intelligent safe routes" },
            { icon: "🌐", title: "Multilingual",     desc: "12+ languages" },
            { icon: "👥", title: "Crowd Insights",   desc: "Real-time density data" },
          ].map((f) => (
            <div key={f.title} className="space-y-1">
              <div className="text-2xl">{f.icon}</div>
              <p className="text-sm font-semibold text-white">{f.title}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-cyan-950 border border-cyan-800/40 rounded-2xl p-8 text-center space-y-3">
        <div className="text-4xl">🏆</div>
        <h2 className="text-2xl font-extrabold text-white">Navigate with TROPTIONS →</h2>
        <p className="text-gray-400 text-sm">One System. One Brand. Unlimited Scale.</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/sponsors" className="bg-yellow-400 text-gray-950 font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
            View Sponsors
          </Link>
          <a href="/sales" className="border border-cyan-500 text-cyan-400 font-bold px-5 py-2.5 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm">
            Sales Portal
          </a>
        </div>
      </div>
    </div>
  );
}
