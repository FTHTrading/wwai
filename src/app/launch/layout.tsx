// Gated by middleware.ts (server-side cookie check on /launch/*).
export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
