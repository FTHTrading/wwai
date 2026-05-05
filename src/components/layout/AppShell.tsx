// AppShell — wraps WWAI/TROPTIONS pages with consistent header, disclaimer, and grid background.
import type { ReactNode } from "react";
import WhichWayLiveLogo from "@/components/brand/WhichWayLiveLogo";

export type AppShellBrand = "troptions" | "whichway";

export default function AppShell({
  title,
  subtitle,
  badges,
  brand = "troptions",
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  badges?: string[];
  /**
   * Visual identity:
   * - "troptions" (default) — operator/sales/admin pages
   * - "whichway" — guest-facing WWAI / whichway.live pages with logo + slogan
   *   + "Powered by TROPTIONS" attribution
   */
  brand?: AppShellBrand;
  /** Small label above the title (e.g. "WWAI Concierge"). Only used when brand === "whichway". */
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl">
      <header className="mb-6">
        {brand === "whichway" ? (
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="shrink-0 flex sm:block justify-center">
              <WhichWayLiveLogo size={92} variant="gradient" />
            </div>
            <div className="flex-1 min-w-0">
              {eyebrow && (
                <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#2bd0e5] mb-1.5">
                  {eyebrow}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-slate-400 max-w-3xl">{subtitle}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2bd0e5]/30 bg-[#2bd0e5]/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2bd0e5]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7ee36a]" />
                  whichway.live
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  Not sure where to go? <span className="text-slate-300">WhichWay AI knows.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-600">
                  · Powered by <span className="text-slate-400 font-semibold">TROPTIONS</span>
                </span>
                {badges?.map((b) => (
                  <span key={b} className="wwai-chip wwai-chip-cyan">{b}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-400 max-w-3xl">{subtitle}</p>}
            {badges && badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span key={b} className="wwai-chip wwai-chip-cyan">{b}</span>
                ))}
              </div>
            )}
          </>
        )}
      </header>
      {children}
    </div>
  );
}
