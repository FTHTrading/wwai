import AppShell from "@/components/layout/AppShell";
import BillingConsole from "@/components/billing/BillingConsole";
import DemoWarning from "@/components/layout/DemoWarning";

export default function BillingPage() {
  return (
    <AppShell
      title="Billing Console"
      subtitle="Square, Stripe, and manual provider readiness. MRR, pipeline value, and recent invoices."
      badges={["Demo readiness"]}
    >
      <DemoWarning />
      <BillingConsole />
    </AppShell>
  );
}
