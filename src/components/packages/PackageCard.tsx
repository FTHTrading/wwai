"use client";

import Link from "next/link";
import type { PackageItem } from "@/lib/types";
import { formatUSD } from "@/lib/calculations";

export default function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PackageItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className={`p-5 cursor-pointer ${pkg.featured ? "wwai-card wwai-card-gold" : "wwai-card"} ${
        selected ? "ring-2 ring-cyan-400" : ""
      }`}
      onClick={() => onSelect?.(pkg.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-500">{pkg.category}</div>
          <div className="text-lg font-bold text-white mt-0.5">{pkg.name}</div>
        </div>
        {pkg.featured && <span className="wwai-chip wwai-chip-gold">Featured</span>}
      </div>
      <div className="mt-3 text-3xl font-extrabold text-cyan-400">
        {formatUSD(pkg.price)}
        <span className="text-xs text-slate-500 font-normal"> /year</span>
      </div>
      {pkg.setupFee ? (
        <div className="text-xs text-slate-500 mt-0.5">+ {formatUSD(pkg.setupFee)} setup</div>
      ) : null}
      <div className="text-xs text-slate-400 mt-3 italic">Best for: {pkg.bestFor}</div>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-cyan-400 mt-0.5">▸</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/register?pkg=${pkg.id}`}
          className="wwai-btn-primary text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          Register
        </Link>
        <Link
          href={`/proposals?pkg=${pkg.id}`}
          className="wwai-btn-ghost text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          Build Proposal
        </Link>
      </div>
    </div>
  );
}
