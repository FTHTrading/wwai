import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Live Operations Map — TROPTIONS™",
  description: "Live map of all TROPTIONS activation venues. View active campaigns, sponsor placements, and QR zone activity by city and venue category.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
