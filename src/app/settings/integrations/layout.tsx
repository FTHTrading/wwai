import DemoGate from "@/components/auth/DemoGate";

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return <DemoGate surface="Integrations">{children}</DemoGate>;
}
