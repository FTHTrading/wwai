import DemoGate from "@/components/auth/DemoGate";

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return <DemoGate surface="Launch">{children}</DemoGate>;
}
