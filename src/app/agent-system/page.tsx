import AppShell from "@/components/layout/AppShell";
import AgentArchitecture from "@/components/agent/AgentArchitecture";

export default function AgentSystemPage() {
  return (
    <AppShell
      title="AI Agent System"
      subtitle="The full TROPTIONS + WWAI agent architecture — concierge, sales, proposal, onboarding, safety, intake, and ops agents with RAG and MCP layers."
      badges={["Architecture", "Demo"]}
    >
      <div className="wwai-panel p-4 mb-5 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">System view.</span>{" "}
        TROPTIONS sells and operates the platform. WWAI is the guest-facing concierge. Behind both,
        sales, proposal, onboarding, safety, intake, and ops agents share a RAG corpus and MCP tool layer.
        All AI runtimes are demo / integration-ready until connected.
      </div>
      <AgentArchitecture />
    </AppShell>
  );
}
