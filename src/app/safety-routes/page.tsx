import AppShell from "@/components/layout/AppShell";
import SafetyRoutePlanner from "@/components/map/SafetyRoutePlanner";
import VenueMap from "@/components/map/VenueMap";

export default function SafetyRoutesPage() {
  return (
    <AppShell
      title="Safety-Informed Route Planner"
      subtitle="Build a hotel→seat or seat→hotel demo route with checkpoints, pickup, accessibility, and language. Operator-reviewed in production."
      badges={["Safety-informed", "Demo only"]}
    >
      <div className="wwai-panel p-4 mb-5 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">Guest step.</span>{" "}
        WWAI builds a safety-informed demo route between hotels, restaurants, bars, pickup zones, and venue
        areas. Production routing requires live map data, verified local feeds, and operator review. For
        emergencies, contact local emergency services immediately.
      </div>
      <SafetyRoutePlanner />
      <div className="mt-6">
        <VenueMap venueName="Primary venue (demo)" focus={{ gate: "Gate 3", section: "114", seat: "Row K, Seat 12" }} />
      </div>
    </AppShell>
  );
}
