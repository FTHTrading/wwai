import DemoGate from "@/components/auth/DemoGate";

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <DemoGate surface="Billing">{children}</DemoGate>;
}
