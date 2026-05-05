import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TROPTIONS · WWAI — Independent Event-City SalesOS + GuestOps",
  description:
    "TROPTIONS is an independent AI + Blockchain SalesOS and GuestOps platform for major event cities. WWAI (WhichWay AI) is the guest-facing concierge.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "TROPTIONS" },
  openGraph: {
    title: "TROPTIONS · WWAI",
    description: "Independent event-city SalesOS + GuestOps. Demo build.",
    siteName: "TROPTIONS",
    type: "website",
  },
};

const FOOTER_LINKS = [
  { href: "/wwai", label: "WWAI" },
  { href: "/packages", label: "Packages" },
  { href: "/area-guide", label: "Area Guide" },
  { href: "/map", label: "Map" },
  { href: "/safety-routes", label: "Safety Routes" },
  { href: "/register", label: "Register" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/hotels", label: "Hotels" },
  { href: "/drivers", label: "Drivers" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/analytics", label: "Analytics" },
  { href: "/proposals", label: "Proposals" },
  { href: "/billing", label: "Billing" },
  { href: "/admin", label: "Admin" },
  { href: "/agent-system", label: "Agent System" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/launch", label: "Launch" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020611" />
      </head>
      <body className="min-h-full flex flex-col bg-[#020611] text-slate-100">
        <LanguageProvider>
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
        <footer className="border-t border-[#0d1626] bg-[#040910] mt-12">
          <div className="container mx-auto px-4 py-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/wwai-logo.png"
                  alt="WWAI"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain opacity-90"
                />
                <div>
                  <div className="font-extrabold text-white text-lg">TROPTIONS<span className="text-[10px] align-super text-slate-500">™</span> · WWAI</div>
                  <div className="text-xs text-slate-500">WWAI by TROPTIONS — One city. One crowd. One operating system.</div>
                  <div className="text-[11px] text-cyan-400/70 italic">&quot;Not sure where to go? WhichWay AI knows.&quot;</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/wwai" className="wwai-btn-primary text-xs">Try WWAI</Link>
                <Link href="/contact" className="wwai-btn-ghost text-xs">Contact Sales</Link>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1 text-xs text-slate-500">
              {FOOTER_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-cyan-400">{l.label}</Link>
              ))}
            </div>
            <div className="disclaimer-bar text-[11px]">
              TROPTIONS is an independent AI + Blockchain SalesOS and GuestOps platform for major event cities. It is not affiliated with any protected sports league, event, team, venue, hotel, rideshare brand, or restaurant brand unless separately licensed. Safety guidance is informational and demo-based unless connected to verified local data, official agencies, and live operator review. For emergencies, contact local emergency services immediately.
            </div>
          </div>
        </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
