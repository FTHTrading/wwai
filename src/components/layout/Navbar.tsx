// Top-level WWAI/TROPTIONS navbar (client for mobile menu)
"use client";

import Link from "next/link";
import { useState } from "react";

const PRIMARY = [
  { href: "/",                 label: "Home" },
  { href: "/wwai",             label: "WWAI" },
  { href: "/demo",             label: "Demo" },
  { href: "/packages",         label: "Packages" },
  { href: "/area-guide",       label: "Area Guide" },
  { href: "/map",              label: "Map" },
  { href: "/safety-routes",    label: "Safety Routes" },
];

const SECONDARY = [
  { href: "/register",   label: "Register" },
  { href: "/sponsors",   label: "Sponsors" },
  { href: "/restaurants",label: "Restaurants" },
  { href: "/hotels",     label: "Hotels" },
  { href: "/drivers",    label: "Drivers" },
  { href: "/campaigns",  label: "Campaigns" },
  { href: "/analytics",  label: "Analytics" },
  { href: "/sales-registration", label: "Sales Registration" },
  { href: "/sales-deck",         label: "Sales Deck" },
  { href: "/sales-documents",    label: "Sales Documents" },
  { href: "/sales-partners",     label: "Sales Partners" },
  { href: "/proposals",          label: "Proposals" },
  { href: "/billing",            label: "Billing" },
  { href: "/admin",              label: "Admin" },
  { href: "/contact",            label: "Contact" },
  { href: "/launch",             label: "Launch" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#162035] bg-[#020611]/90 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wwai-logo.png"
            alt="WWAI logo"
            width={44}
            height={44}
            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(0,213,255,0.35)]"
          />
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-white">
              TROPTIONS<span className="text-[10px] align-super text-slate-500">™</span> · <span className="text-cyan-400">WWAI</span>
            </div>
            <div className="text-[10px] text-slate-500 tracking-widest uppercase">Not sure where to go? WhichWay AI knows.</div>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-4 text-sm">
          {PRIMARY.map((l) => (
            <Link key={l.href} href={l.href} className="text-slate-300 hover:text-cyan-400 transition-colors">{l.label}</Link>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/wwai" className="wwai-btn-primary text-sm">Try WWAI</Link>
          <Link href="/contact" className="wwai-btn-ghost text-sm">Contact Sales</Link>
        </div>
        <button
          aria-label="Open menu"
          className="lg:hidden wwai-btn-ghost text-sm"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[#162035] bg-[#07111f] px-4 py-3 grid grid-cols-2 gap-2 text-sm">
          {[...PRIMARY, ...SECONDARY].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-300 hover:text-cyan-400 py-1.5"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
      <div className="hidden lg:flex container mx-auto px-4 pb-2 -mt-1 gap-4 text-xs text-slate-500 overflow-x-auto">
        {SECONDARY.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-cyan-400 whitespace-nowrap">{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
