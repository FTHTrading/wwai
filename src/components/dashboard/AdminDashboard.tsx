"use client";

import { useEffect, useState } from "react";
import { getSubmissions, updateSubmissionStatus } from "@/lib/demoStorage";
import type { Submission, SubmissionStatus, PartnerCategory } from "@/lib/types";
import { ALL_PACKAGES } from "@/data/demoData";

const STATUS_OPTIONS: SubmissionStatus[] = ["pending", "approved", "needs_info", "rejected"];

const CHIP: Record<SubmissionStatus, string> = {
  pending: "wwai-chip-amber",
  approved: "wwai-chip-green",
  needs_info: "wwai-chip-cyan",
  rejected: "wwai-chip-red",
};

export default function AdminDashboard() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<PartnerCategory | "all">("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubs(getSubmissions());
  }, [tick]);

  const filtered = filter === "all" ? subs : subs.filter((s) => s.type === filter);

  const counts = {
    pending: subs.filter((s) => s.status === "pending").length,
    approved: subs.filter((s) => s.status === "approved").length,
    needs_info: subs.filter((s) => s.status === "needs_info").length,
    rejected: subs.filter((s) => s.status === "rejected").length,
  };

  const totalValue = subs.reduce((sum, s) => {
    const pkg = ALL_PACKAGES.find((p) => p.id === s.packageId);
    return sum + (pkg?.price || 0);
  }, 0);

  const setStatus = (s: Submission, status: SubmissionStatus) => {
    updateSubmissionStatus(s.type, s.id, status);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Tile label="Pending"      value={counts.pending}    tone="amber" />
        <Tile label="Approved"     value={counts.approved}   tone="green" />
        <Tile label="Needs info"   value={counts.needs_info} tone="cyan" />
        <Tile label="Rejected"     value={counts.rejected}   tone="red" />
        <Tile label="Est. value"   value={`$${totalValue.toLocaleString()}`} tone="gold" />
      </div>

      <div className="wwai-panel p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-white">Registration Queue</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as PartnerCategory | "all")}
            className="bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
          >
            <option value="all">All types</option>
            {(["restaurant","bar","hotel","driver","sponsor","merchant","venue"] as PartnerCategory[]).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <div className="text-slate-500 text-sm py-8 text-center">No submissions yet. Try registering a partner.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-widest text-slate-500 border-b border-[#162035]">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Zone</th>
                  <th className="text-left p-2">Package</th>
                  <th className="text-left p-2">Submitted</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const pkg = ALL_PACKAGES.find((p) => p.id === s.packageId);
                  return (
                    <tr key={s.id} className="border-b border-[#0d1626] hover:bg-[#0a1220]">
                      <td className="p-2 font-semibold text-white">{s.name}</td>
                      <td className="p-2 text-slate-400">{s.type}</td>
                      <td className="p-2 text-slate-400">{s.contact || s.email}</td>
                      <td className="p-2 text-slate-400">{s.zone || "—"}</td>
                      <td className="p-2 text-slate-400">{pkg?.name || "—"}</td>
                      <td className="p-2 text-slate-500 text-xs">{new Date(s.submittedAt).toLocaleDateString()}</td>
                      <td className="p-2"><span className={`wwai-chip ${CHIP[s.status]}`}>{s.status}</span></td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {STATUS_OPTIONS.filter((o) => o !== s.status).map((o) => (
                            <button key={o} onClick={() => setStatus(s, o)} className="text-[10px] px-2 py-1 rounded border border-[#162035] hover:border-cyan-400 text-slate-300">
                              {o.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: number | string; tone: "amber"|"green"|"cyan"|"red"|"gold" }) {
  const map = { amber: "text-amber-400", green: "text-emerald-400", cyan: "text-cyan-400", red: "text-rose-400", gold: "text-amber-300" };
  return (
    <div className="wwai-card p-4">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${map[tone]}`}>{value}</div>
    </div>
  );
}
