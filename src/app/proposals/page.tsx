"use client";

import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ProposalBuilder from "@/components/proposals/ProposalBuilder";
import { Suspense } from "react";

function ProposalsInner() {
  const params = useSearchParams();
  const initial = params.get("pkg") || undefined;
  return <ProposalBuilder initialPackageId={initial} />;
}

export default function ProposalsPage() {
  return (
    <AppShell
      title="Proposal Builder"
      subtitle="Configure package, add-ons, term, payment terms, and contract value. Save the proposal locally and review in admin."
      badges={["Demo only"]}
    >
      <div className="wwai-panel p-4 mb-5 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">Sales step.</span>{" "}
        Lead captured → package selected → proposal built here → operator reviews in admin → campaign launches
        in WWAI → analytics and billing track value.
      </div>
      <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
        <ProposalsInner />
      </Suspense>
    </AppShell>
  );
}
