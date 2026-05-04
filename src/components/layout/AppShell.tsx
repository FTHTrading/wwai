// AppShell — wraps WWAI/TROPTIONS pages with consistent header, disclaimer, and grid background.
import type { ReactNode } from "react";

export default function AppShell({
  title,
  subtitle,
  badges,
  children,
}: {
  title: string;
  subtitle?: string;
  badges?: string[];
  children: ReactNode;
}) {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-400 max-w-3xl">{subtitle}</p>}
        {badges && badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b} className="wwai-chip wwai-chip-cyan">{b}</span>
            ))}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
