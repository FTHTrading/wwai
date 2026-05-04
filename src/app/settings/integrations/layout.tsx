// Gated by middleware.ts (server-side cookie check on /settings/integrations/*).
export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
