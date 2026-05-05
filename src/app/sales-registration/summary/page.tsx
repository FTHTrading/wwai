"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function IntakeSummaryLookupPage() {
  const [intakeId, setIntakeId] = useState("");
  const router = useRouter();

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = intakeId.trim();
    if (!trimmed) return;
    router.push(`/sales-registration/summary/${encodeURIComponent(trimmed)}`);
  }

  return (
    <AppShell
      title="Look Up Intake Status"
      subtitle="Enter your demo intake ID to view your submission details."
      badges={["Demo mode"]}
    >
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleLookup} className="wwai-panel p-6 space-y-4">
          <div>
            <label className="form-label">Intake ID</label>
            <input
              type="text"
              value={intakeId}
              onChange={(e) => setIntakeId(e.target.value)}
              className="form-input w-full font-mono"
              placeholder="WWAI-20260502-A3F7"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1">
              Your intake ID was shown on the confirmation screen after submission.
            </p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="wwai-btn-primary">Look Up</button>
            <Link href="/sales-registration" className="wwai-btn-ghost">Back</Link>
          </div>
        </form>

        <div className="wwai-panel p-4 mt-4">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">
            Demo Note
          </div>
          <p className="text-sm text-slate-400">
            Demo intakes are stored in your browser&apos;s localStorage. If you cleared your browser
            data or are using a different device/browser, your demo intake will not be found.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/sales-intake" className="wwai-btn-ghost text-xs">Admin Queue</Link>
            <Link href="/sales-registration/intake" className="wwai-btn-ghost text-xs">New Intake</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
