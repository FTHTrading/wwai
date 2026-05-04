import DemoGate from "@/components/auth/DemoGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DemoGate surface="Operator Admin">{children}</DemoGate>;
}
