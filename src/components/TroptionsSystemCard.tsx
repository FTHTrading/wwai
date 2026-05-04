/**
 * TroptionsSystemCard
 * Premium glass panel for platform module / system feature cards.
 * Supports icon slot, status badge, CTA link, glow variant.
 */
import Link from "next/link";

interface TroptionsSystemCardProps {
  title:       string;
  description: string;
  icon?:       string;          // single character or SVG element text
  status?:     "live" | "beta" | "planned" | "configured" | "unconfigured";
  glow?:       "cyan" | "gold" | "none";
  href?:       string;
  className?:  string;
}

const STATUS_STYLES: Record<string, string> = {
  live:          "text-green-400 border-green-500/30 bg-green-500/10",
  beta:          "text-[#00d4ff] border-[#00d4ff]/30 bg-[#00d4ff]/10",
  planned:       "text-slate-500 border-slate-700 bg-slate-800",
  configured:    "text-green-400 border-green-500/30 bg-green-500/10",
  unconfigured:  "text-[#d4a017] border-[#d4a017]/30 bg-[#d4a017]/10",
};

const STATUS_LABEL: Record<string, string> = {
  live:          "Live",
  beta:          "Beta",
  planned:       "Planned",
  configured:    "Ready",
  unconfigured:  "Config needed",
};

export default function TroptionsSystemCard({
  title, description, icon, status, glow = "none", href, className = "",
}: TroptionsSystemCardProps) {
  const borderClass =
    glow === "cyan" ? "border-[#00d4ff]/20 hover:border-[#00d4ff]/40"
    : glow === "gold" ? "border-[#d4a017]/20 hover:border-[#d4a017]/40"
    : "border-[#162035] hover:border-[#00d4ff]/20";

  const inner = (
    <div className={`card-dark rounded-2xl p-5 space-y-3 border transition-all duration-200 group h-full ${borderClass} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 border ${
            glow === "gold" ? "bg-[#d4a017]/10 border-[#d4a017]/20 text-[#d4a017]"
            : "bg-[#00d4ff]/10 border-[#00d4ff]/20 text-[#00d4ff]"
          }`}>
            {icon}
          </div>
        )}
        {status && (
          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border shrink-0 ${STATUS_STYLES[status]}`}>
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className={`text-white font-bold text-sm ${href ? "group-hover:text-[#00d4ff]" : ""} transition-colors`}>
          {title}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
      </div>

      {href && (
        <div className="pt-1">
          <span className="text-[#00d4ff] text-xs font-semibold group-hover:text-white transition-colors">
            Open →
          </span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
}
