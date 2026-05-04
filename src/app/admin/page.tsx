import AppShell from "@/components/layout/AppShell";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DemoWarning from "@/components/layout/DemoWarning";

export default function AdminPage() {
  return (
    <AppShell
      title="Operator Admin Dashboard"
      subtitle="Review submissions across restaurants, bars, merchants, hotels, drivers, sponsors, and venues. Approve, request more info, or reject."
      badges={["Demo", "Local storage"]}
    >
      <DemoWarning />
      <div className="wwai-panel p-4 mb-5 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">Operator step.</span>{" "}
        Businesses register, the operator reviews here, approved listings flow into WWAI discovery and into
        sponsor / merchant campaigns. Demo data only — production replaces local storage with the database.
      </div>
      <AdminDashboard />
    </AppShell>
  );
}
