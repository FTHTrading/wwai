import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Campaigns — TROPTIONS™",
  description: "Manage QR activation campaigns across all venues and sponsors. Track impressions, redemptions, and conversion rates in real time.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
