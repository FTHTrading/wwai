"use client";
import { useState } from "react";

const LANGUAGES = [
  "English","Español","Français","العربية","Português","isiZulu",
  "Deutsch","日本語","한국어","Italiano","Uzbek","Kreyòl Ayisyen",
];

const LOCATIONS = [
  { id: 1,  label: "Gate C — North Entrance",        type: "gate",     x: 50, y: 12, status: "open",    crowd: 68 },
  { id: 2,  label: "Rideshare — West Lot",            type: "transport", x: 10, y: 50, status: "active",  crowd: 42 },
  { id: 3,  label: "Lost-Person Station · C200",      type: "safety",   x: 68, y: 40, status: "staffed", crowd: 0  },
  { id: 4,  label: "Five Points MARTA Hub",           type: "transit",  x: 18, y: 82, status: "active",  crowd: 71 },
  { id: 5,  label: "Downtown Hotel Corridor",         type: "route",    x: 82, y: 68, status: "clear",   crowd: 29 },
  { id: 6,  label: "ATL Airport Arrivals",            type: "transit",  x: 88, y: 20, status: "active",  crowd: 55 },
  { id: 7,  label: "Volunteer Staging Tent",          type: "safety",   x: 35, y: 78, status: "active",  crowd: 0  },
  { id: 8,  label: "Overflow Safe-Zone",              type: "safety",   x: 60, y: 82, status: "on-call", crowd: 12 },
];

const TYPE_COLOR: Record<string, { dot: string; ring: string; label: string }> = {
  gate:     { dot: "#22d3ee", ring: "rgba(34,211,238,0.3)",  label: "Gate" },
  transport:{ dot: "#a78bfa", ring: "rgba(167,139,250,0.3)", label: "Rideshare/Transport" },
  safety:   { dot: "#ef4444", ring: "rgba(239,68,68,0.35)",  label: "Safety Post" },
  transit:  { dot: "#facc15", ring: "rgba(250,204,21,0.3)",  label: "Transit Hub" },
  route:    { dot: "#22d3ee", ring: "rgba(34,211,238,0.2)",  label: "Route Corridor" },
};

const LEGEND = [
  { color: "#22d3ee", label: "Fan Flow" },
  { color: "#ef4444", label: "Response Corridors" },
  { color: "#a78bfa", label: "Pedestrian Routes" },
  { color: "#facc15", label: "Vehicle Routes" },
];

const CROWD_ZONES = [
  { zone: "North Gate Area",  pct: 74, color: "bg-red-500" },
  { zone: "MARTA Concourse",  pct: 58, color: "bg-yellow-500" },
  { zone: "West Lot (Uber)",  pct: 42, color: "bg-yellow-400" },
  { zone: "South Plaza",      pct: 31, color: "bg-green-500" },
  { zone: "Hotel Corridor",   pct: 19, color: "bg-green-400" },
];

export default function MapPage() {
  const [selected,  setSelected]  = useState<number | null>(1);
  const [language,  setLanguage]  = useState("English");
  const [routing,   setRouting]   = useState(false);

  const sel = LOCATIONS.find((l) => l.id === selected);
  const tc  = sel ? TYPE_COLOR[sel.type] : null;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="space-y-1">
        <span className="pill-gold">TROPTIONS Live Operations</span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mt-1">
              <span className="gradient-cyan">TROPTIONS</span>™ Operations Map
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Live Operational Intelligence · Real-Time Fan & Venue Monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#0f1629] border border-green-700/60 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-green-400 text-xs font-bold tracking-wide">LIVE OPS</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0f1629] border border-[#1a2540] text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500/50"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main 3-col layout */}
      <div className="grid lg:grid-cols-[260px_1fr_260px] gap-4">

        {/* LEFT SIDEBAR */}
        <div className="space-y-4">
          <div className="map-sidebar p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Map Legend</h3>
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-3">
                <div className="w-8 h-1.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}80` }} />
                <span className="text-slate-300 text-xs font-medium">{l.label}</span>
              </div>
            ))}
            <div className="pt-1 space-y-1.5">
              {Object.entries(TYPE_COLOR).map(([, v]) => (
                <div key={v.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.dot, boxShadow: `0 0 5px ${v.dot}` }} />
                  <span className="text-slate-400 text-xs">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="map-sidebar p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safety Tools</h3>
            {[
              { icon: "📞", label: "24/7 Safety Hotline",  val: "+1 (888) TAP-FIFA",  color: "text-red-400" },
              { icon: "📲", label: "TROPTIONS App",       val: "troptions.com/app",   color: "text-cyan-400" },
              { icon: "🚗", label: "Verified Driver Zone", val: "West Lot · Gate D",   color: "text-purple-400" },
              { icon: "📡", label: "Live Ops Command",     val: "Suite 100 · Level 1", color: "text-yellow-400" },
            ].map((t) => (
              <div key={t.label} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{t.icon}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{t.label}</p>
                  <p className={`text-[11px] font-medium ${t.color}`}>{t.val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="map-sidebar p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Multilingual Outreach</h3>
            <div className="flex flex-wrap gap-1.5">
              {["EN","ES","FR","AR","PT","ZU","UZ","HT","DE","JA","KO","IT"].map((code) => (
                <span key={code} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-mono px-1.5 py-0.5 rounded cursor-pointer hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                  {code}
                </span>
              ))}
            </div>
            <p className="text-slate-500 text-[11px] pt-1">AI concierge responds in any supported language</p>
          </div>
        </div>

        {/* MAP CANVAS */}
        <div className="card-dark rounded-2xl overflow-hidden" style={{ minHeight: 520 }}>
          <div className="border-b border-[#1a2540] px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Mercedes-Benz Stadium · Atlanta, GA</span>
            <div className="flex gap-2">
              {["Satellite","Safety","Transit"].map((m) => (
                <button key={m} className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  m === "Safety" ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                }`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="relative bg-[#040d1c]" style={{ height: 460 }}>
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ops-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ops-grid)" />
            </svg>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="50" cy="50" rx="42" ry="38" fill="none" stroke="#0d2a50" strokeWidth="2" opacity="0.7"/>
              <ellipse cx="50" cy="50" rx="40" ry="36" fill="#060f24" stroke="#0e2d58" strokeWidth="1.2" opacity="0.8"/>
              <ellipse cx="50" cy="50" rx="36" ry="32" fill="none" stroke="#0f3060" strokeWidth="0.8" opacity="0.6"/>
              <ellipse cx="50" cy="50" rx="30" ry="26" fill="#0a1a38" stroke="#112766" strokeWidth="0.6" opacity="0.5"/>
              <rect x="32" y="33" width="36" height="34" rx="4" fill="#071b0d" stroke="#15532e" strokeWidth="1"/>
              <rect x="34" y="35" width="32" height="30" rx="3" fill="#0c2811" stroke="#166534" strokeWidth="0.5" opacity="0.8"/>
              <line x1="50" y1="35" x2="50" y2="65" stroke="#16a34a" strokeWidth="0.3" opacity="0.6"/>
              <circle cx="50" cy="50" r="5" fill="none" stroke="#16a34a" strokeWidth="0.3" opacity="0.5"/>
              <circle cx="50" cy="50" r="1" fill="#16a34a" opacity="0.5"/>
              <rect x="45" y="10" width="10" height="6" rx="1" fill="#091833" stroke="#0e3060" strokeWidth="0.5"/>
              <rect x="45" y="84" width="10" height="6" rx="1" fill="#091833" stroke="#0e3060" strokeWidth="0.5"/>
              <rect x="6"  y="45" width="6"  height="10" rx="1" fill="#091833" stroke="#0e3060" strokeWidth="0.5"/>
              <rect x="88" y="45" width="6"  height="10" rx="1" fill="#091833" stroke="#0e3060" strokeWidth="0.5"/>
              <path d="M 50 13 Q 50 24 50 34" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2,1.5" opacity="0.7" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}/>
              <path d="M 50 66 Q 50 76 50 87" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2,1.5" opacity="0.7" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}/>
              <path d="M 9 50 Q 20 50 32 50"  fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2,1.5" opacity="0.7" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}/>
              <path d="M 68 50 Q 80 50 91 50" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2,1.5" opacity="0.7" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}/>
              <path d="M 50 13 L 18 5"  fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4"/>
              <path d="M 50 13 L 88 8"  fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4"/>
              <path d="M 9  50 L 5  82" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4"/>
              <path d="M 91 50 L 92 20" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4"/>
              <path d="M 50 25 Q 65 35 68 40" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,1" opacity="0.6" style={{ filter: "drop-shadow(0 0 3px #ef4444)" }}/>
              {routing && (
                <path d="M 50 90 L 50 66 L 50 34" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3,2" opacity="0.95" style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }}/>
              )}
            </svg>
            {LOCATIONS.map((loc) => {
              const tc2 = TYPE_COLOR[loc.type];
              const isSelected = selected === loc.id;
              return (
                <button key={loc.id} onClick={() => setSelected(isSelected ? null : loc.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-10"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white transition-all"
                    style={{ background: `${tc2.dot}22`, border: `2px solid ${isSelected ? tc2.dot : tc2.dot + "80"}`,
                      boxShadow: isSelected ? `0 0 16px ${tc2.dot}` : `0 0 6px ${tc2.dot}60` }}>
                    {loc.id}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-xl p-3 text-left min-w-[200px] z-20 space-y-1"
                      style={{ background: "#0f1629", border: `1px solid ${tc2.dot}60` }}>
                      <p className="font-bold text-white text-xs leading-snug">{loc.label}</p>
                      <p className="text-[11px] font-medium" style={{ color: tc2.dot }}>{tc2.label}</p>
                      {loc.crowd > 0 && <p className="text-slate-500 text-[11px]">Crowd density: {loc.crowd}%</p>}
                      <p className={`text-[11px] font-semibold ${ loc.status === "staffed" ? "text-green-400" : loc.status === "active" ? "text-cyan-400" : loc.status === "on-call" ? "text-yellow-400" : "text-slate-400" }`}>
                        ● {loc.status.toUpperCase()}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
            <div className="absolute top-3 left-3 text-slate-500 text-lg font-bold opacity-60">N ↑</div>
            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
              {["+","−"].map((b) => (
                <button key={b} className="w-8 h-8 bg-[#0f1629]/90 border border-[#1a2540] rounded-lg text-slate-300 text-sm font-bold hover:border-cyan-500/50 transition-colors">{b}</button>
              ))}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0a0e1a]/90 border border-green-700/60 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-green-400 text-[10px] font-bold tracking-widest">LIVE</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">
          {sel && tc ? (
            <div className="map-sidebar p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tc.dot, boxShadow: `0 0 6px ${tc.dot}` }}/>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: tc.dot }}>{tc.label}</span>
              </div>
              <h3 className="font-bold text-white text-sm leading-snug">{sel.label}</h3>
              <p className={`text-xs font-semibold ${ sel.status === "staffed" ? "text-green-400" : sel.status === "active" ? "text-cyan-400" : sel.status === "on-call" ? "text-yellow-400" : "text-slate-400" }`}>
                ● {sel.status.toUpperCase()}
              </p>
              {sel.crowd > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Crowd Density</span><span>{sel.crowd}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${sel.crowd}%` }}/>
                  </div>
                </div>
              )}
              <button onClick={() => setRouting(true)} className="w-full bg-cyan-500 text-gray-950 font-bold py-2 rounded-lg hover:bg-cyan-400 transition-colors text-sm">
                Route Here →
              </button>
            </div>
          ) : (
            <div className="map-sidebar p-4 text-center text-slate-500 text-sm">
              <div className="text-2xl mb-2">📍</div>
              Tap a numbered marker to view location details
            </div>
          )}
          <div className="map-sidebar p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Crowd Density</h3>
            {CROWD_ZONES.map((z) => (
              <div key={z.zone}>
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{z.zone}</span><span className="font-mono">{z.pct}%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${z.color} transition-all`} style={{ width: `${z.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="map-sidebar p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Actions</h3>
            {[
              { icon: "👨‍👩‍👧", label: "Lost Child Report",  color: "border-red-500/40 text-red-400"      },
              { icon: "🚑",    label: "Request Medical Aid",color: "border-red-500/40 text-red-400"      },
              { icon: "🚌",    label: "MARTA Schedule",     color: "border-yellow-500/40 text-yellow-400" },
              { icon: "🚗",    label: "Rideshare Pickup",   color: "border-purple-500/40 text-purple-400" },
            ].map((a) => (
              <button key={a.label} className={`w-full flex items-center gap-2.5 border rounded-lg px-3 py-2 text-xs font-semibold hover:bg-slate-800/50 transition-colors ${a.color}`}>
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Ops Bar */}
      <div className="card-dark rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Operations Status</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Field Teams",    val: "42 Active", color: "text-green-400"  },
                { label: "Incidents Open", val: "3",         color: "text-yellow-400" },
                { label: "Response Time",  val: "2.4 min",   color: "text-cyan-400"   },
                { label: "Safe Zones",     val: "8 / 8",     color: "text-green-400"  },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 min-w-[90px]">
                  <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-slate-500 text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Hotlines</h3>
            {[
              { icon: "🛡", label: "Safety Ops",   num: "+1 (888) TAP-FIFA" },
              { icon: "👨‍👩‍👧",label: "Lost Persons",num: "+1 (888) TAP-SAFE" },
              { icon: "🚑",  label: "Medical",      num: "+1 (888) FIFA-MED" },
            ].map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <span>{h.icon}</span>
                <span className="text-slate-400 text-xs">{h.label}</span>
                <span className="text-cyan-400 text-xs font-mono ml-auto">{h.num}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Partner Command</h3>
            {[
              { icon: "🏟", label: "ATL PD Liaison",    status: "Connected",  color: "text-green-400"  },
              { icon: "🚒",  label: "Fire/EMS Dispatch", status: "Standby",    color: "text-yellow-400" },
              { icon: "🚇",  label: "MARTA Ops Center",  status: "Connected",  color: "text-green-400"  },
              { icon: "✈️",  label: "ATL Airport Ops",   status: "Monitoring", color: "text-cyan-400"   },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-slate-400 text-xs">{p.label}</span>
                <span className={`ml-auto text-[10px] font-bold ${p.color}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
