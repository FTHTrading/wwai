import AppShell from "@/components/layout/AppShell";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <AppShell
      title="Analytics"
      subtitle="Pipeline, performance, and sponsor revenue rollups across campaigns, registrations, routes, and proposals."
      badges={["Demo data"]}
    >
      <AnalyticsDashboard />
    </AppShell>
  );
}
