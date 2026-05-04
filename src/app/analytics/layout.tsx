import type { Metadata } from "next";
import DemoGate from "@/components/auth/DemoGate";
export const metadata: Metadata = {
  title: "Revenue Analytics — TROPTIONS™",
  description: "Real-time KPIs: active sponsors, revenue, QR scans, redemptions, conversion rates, and pipeline value across the TROPTIONS platform.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <DemoGate surface="Analytics">{children}</DemoGate>; }
