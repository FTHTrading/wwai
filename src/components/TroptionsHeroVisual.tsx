/**
 * TroptionsHeroVisual
 * Cinematic dark-glass hero panel used on homepage, demo, and landing sections.
 * Renders a title + metric grid in command-center HUD style.
 */
interface Metric {
  value: string;
  label: string;
  live?: boolean;
}

interface TroptionsHeroVisualProps {
  title:       string;
  subtitle?:   string;
  metrics?:    Metric[];
  glow?:       "cyan" | "gold";
  className?:  string;
}

export default function TroptionsHeroVisual({
  title, subtitle, metrics = [], glow = "cyan", className = "",
}: TroptionsHeroVisualProps) {
  const glowColor = glow === "gold" ? "#d4a017" : "#00d4ff";
  const glowBg    = glow === "gold" ? "rgba(212,160,23,0.06)" : "rgba(0,212,255,0.06)";
  const borderCol = glow === "gold" ? "border-[#d4a017]/20" : "border-[#00d4ff]/20";

  return (
    <div
      className={`relative rounded-2xl border bg-[#0a0f1e] overflow-hidden ${borderCol} ${className}`}
      style={{ boxShadow: `0 0 60px ${glowBg}` }}
    >
      {/* Top bar */}
      <div className="border-b border-[#162035] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: glowColor }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: glowColor }}>LIVE</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">TROPTIONS OS</span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <p className="text-white font-black text-lg leading-tight">{title}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>

        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="bg-[#050810] rounded-xl border border-[#162035] p-3 space-y-0.5">
                <p className="text-white font-black text-xl" style={{ color: glowColor }}>{m.value}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">{m.label}</p>
                {m.live && (
                  <span className="inline-block text-[9px] font-bold text-green-400 border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corner decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)` }}
      />
    </div>
  );
}
