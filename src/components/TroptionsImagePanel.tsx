/**
 * TroptionsImagePanel
 * Dark-glass image panel with optional cyan/gold glow border, badge, and CTA.
 * Internal reference images with protected marks must NOT be passed to this component
 * on public-facing pages unless marks are removed/replaced.
 */
import Image from "next/image";
import Link  from "next/link";

interface TroptionsImagePanelProps {
  src:        string;
  alt:        string;
  width?:     number;
  height?:    number;
  badge?:     string;
  label?:     string;
  glow?:      "cyan" | "gold" | "none";
  ctaLabel?:  string;
  ctaHref?:   string;
  className?: string;
}

export default function TroptionsImagePanel({
  src, alt, width = 800, height = 500,
  badge, label, glow = "cyan",
  ctaLabel, ctaHref, className = "",
}: TroptionsImagePanelProps) {
  const borderClass =
    glow === "cyan" ? "border-[#00d4ff]/20 shadow-[0_0_40px_rgba(0,212,255,0.07)]"
    : glow === "gold" ? "border-[#d4a017]/20 shadow-[0_0_40px_rgba(212,160,23,0.07)]"
    : "border-[#162035]";

  return (
    <div className={`relative rounded-2xl overflow-hidden border bg-[#0a0f1e] ${borderClass} ${className}`}>
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#050810]/80 border border-[#00d4ff]/30 text-[#00d4ff]">
            {badge}
          </span>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {(label || ctaLabel) && (
        <div className="p-4 border-t border-[#162035] flex items-center justify-between gap-3">
          {label && <p className="text-slate-400 text-xs font-medium">{label}</p>}
          {ctaLabel && ctaHref && (
            <Link href={ctaHref}
              className="text-[#00d4ff] text-xs font-semibold hover:text-white transition-colors whitespace-nowrap">
              {ctaLabel} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
