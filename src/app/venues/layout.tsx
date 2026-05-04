import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Venue Network — TROPTIONS™",
  description: "Browse all TROPTIONS activation venues — stadiums, airports, transit, hotels, universities, and retail. View campaigns and QR activity per venue.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
