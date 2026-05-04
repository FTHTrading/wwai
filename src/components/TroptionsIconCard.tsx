/**
 * TroptionsIconCard
 * HUD-style module icon card. Inspired by premium event operating system icon systems.
 * No emojis — monospace letter icons or short text glyphs only.
 */
import Link from "next/link";

interface TroptionsIconCardProps {
  icon:        string;
  title:       string;
  subtitle?:   string;
  glow?:       "cyan" | "gold";
  href?:       string;
  live?:       boolean;
  className?:  string;
}

export default function TroptionsIconCard({
  icon, title, subtitle, glow = "cyan", href, live = false, className = "",
}: TroptionsIconCardProps) {
  const isGold = glow === "gold";
  const color  = isGold ? "#d4a017" : "#00d4ff";
  const bgCls  = isGold ? "bg-[#d4a017]/10 border-[#d4a017]/20" : "bg-[#00d4ff]/10 border-[#00d4ff]/20";

  const inner = (
    <div className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border bg-[#0a0f1e] transition-all duration-200 hover:scale-[1.02] ${
      isGold ? "border-[#d4a017]/20 hover:border-[#d4a017]/40" : "border-[#162035] hover:border-[#00d4ff]/30"
    } ${className}`}>
      {live && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-sm ${bgCls}`}
        style={{ color }}>
        {icon}
      </div>
      <p className="text-white text-xs font-semibold text-center leading-tight">{title}</p>
      {subtitle && <p className="text-slate-600 text-[10px] text-center">{subtitle}</p>}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
