// Gated by middleware.ts (server-side cookie check on /admin/*).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
