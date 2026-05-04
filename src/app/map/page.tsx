import AppShell from "@/components/layout/AppShell";
import CommandMap from "@/components/map/CommandMap";

export default function MapPage() {
  return (
    <AppShell
      title="Operational City Map"
      subtitle="Demo command-center map with togglable layers for hotels, restaurants, bars, drivers, pickup zones, safety nodes, sponsor offers, and routes."
      badges={["Demo visualization", "Live providers required for production"]}
    >
      <CommandMap />
    </AppShell>
  );
}
