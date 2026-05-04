import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Settings — TROPTIONS",
};
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#050810" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {children}
      </div>
    </div>
  );
}
