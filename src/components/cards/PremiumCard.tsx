import type { ReactNode } from "react";

export default function PremiumCard({
  title,
  subtitle,
  badge,
  featured,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  featured?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={`p-5 ${featured ? "wwai-card wwai-card-gold" : "wwai-card"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-base font-bold text-white">{title}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        {badge && (
          <span className={`wwai-chip ${featured ? "wwai-chip-gold" : "wwai-chip-cyan"}`}>{badge}</span>
        )}
      </div>
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-[#162035]">{footer}</div>}
    </div>
  );
}
