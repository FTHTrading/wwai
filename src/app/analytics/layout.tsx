import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Revenue Analytics — TROPTIONS™",
  description: "Real-time KPIs: active sponsors, revenue, QR scans, redemptions, conversion rates, and pipeline value across the TROPTIONS platform.",
};
// Gated by middleware.ts (server-side cookie check on /analytics/*).
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
