import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TROPTIONS™ — Growth Platform · Event OS",
  description: "One System. One Brand. Unlimited Scale. Activate sponsors, drive fan engagement, and capture revenue with the TROPTIONS Growth Platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TROPTIONS",
  },
  openGraph: {
    title: "TROPTIONS™ — Growth Platform · Event OS",
    description: "One System. One Brand. Unlimited Scale.",
    siteName: "TROPTIONS",
    type: "website",
  },
  other: { "mobile-web-app-capable": "yes" },
};

const NAV_LINKS = [
  { href: "/market",    label: "Market" },
  { href: "/options",   label: "Options" },
  { href: "/cards",     label: "Cards" },
  { href: "/map",       label: "Map",       accent: true },
  { href: "/sponsors",  label: "Sponsors",  accent: true },
  { href: "/sales",     label: "Sales" },
  { href: "/wallet",    label: "Wallet" },
  { href: "/dashboard", label: "Dashboard", cta: true },
];

const MOBILE_NAV = [
  { href: "/",          label: "Home" },
  { href: "/map",       label: "Map" },
  { href: "/sales",     label: "Sales" },
  { href: "/sponsors",  label: "Sponsors" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest"         href="/manifest.json" />
        <meta name="theme-color"     content="#050810" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050810] text-slate-100">

        {/* ── Top Nav ── */}
        <nav className="nav-glass px-6 py-3 flex items-center justify-between sticky top-0 z-50">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="troptions-hex-sm flex-shrink-0">T</div>
            <span className="brand-label">
              TROPTIONS<span className="brand-label-tm">™</span>
            </span>
            <span className="hidden md:inline-block text-[9px] text-slate-600 font-medium tracking-widest uppercase ml-1 mt-0.5 border border-slate-700 rounded px-1.5 py-0.5">Growth Platform</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                 className={`transition-colors ${
                   l.cta
                     ? "bg-[#00d4ff] text-[#050810] font-bold px-4 py-1.5 rounded-lg hover:bg-cyan-300"
                     : l.accent
                     ? "text-cyan-400 hover:text-cyan-300"
                     : "text-slate-400 hover:text-slate-200"
                 }`}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile quick links */}
          <div className="md:hidden flex items-center gap-2">
            <a href="/map"       className="text-cyan-400 text-xs font-semibold border border-[#00d4ff]/30 px-2.5 py-1.5 rounded-lg hover:bg-[#00d4ff]/5 transition-colors">Map</a>
            <a href="/sales"     className="text-slate-400 text-xs font-semibold border border-[#162035] px-2.5 py-1.5 rounded-lg hover:text-white transition-colors">Sales</a>
            <a href="/dashboard" className="bg-[#00d4ff] text-[#050810] font-bold text-xs px-3 py-1.5 rounded-lg">Dashboard</a>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 flex-1 pb-20 md:pb-8">{children}</main>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="mobile-nav-glass md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-2">
          {MOBILE_NAV.map((item) => (
            <a key={item.href} href={item.href}
               className="flex flex-col items-center gap-0.5 px-2 py-1 text-slate-500 transition-colors hover:text-cyan-400">
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* ── Footer ── */}
        <footer className="footer-bar hidden md:flex items-center justify-between px-8 py-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="footer-brand">TROPTIONS<span style={{WebkitTextFillColor:"#94a3b8",fontSize:"0.7em",verticalAlign:"super"}}>™</span></span>
            <span className="text-slate-600">Event OS · Powered by Apostle Chain</span>
          </div>
          <div className="flex gap-4 text-slate-600">
            <span className="text-[#d4a017]/70">One System. One Brand. Unlimited Scale.</span>
            <a href="https://troptionsxchange.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">troptionsxchange.com</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
