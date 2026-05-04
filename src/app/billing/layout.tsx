// Gated by middleware.ts (server-side cookie check on /billing/*).
export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
