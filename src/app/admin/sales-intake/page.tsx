"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getSalesIntakes,
  updateSalesIntakeStatus,
  maskEin,
  SalesIntake,
  IntakeStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  REGISTRATION_TYPE_LABELS,
  type RegistrationType,
} from "@/lib/salesIntakeStorage";

type StorageMode = "database" | "demo";

// Server DTO shape returned by /api/sales-intake (subset of fields we use).
interface ApiIntake {
  id: string;
  intakeId: string;
  status: IntakeStatus;
  registrationType: RegistrationType;
  businessLegalName: string;
  dbaName?: string | null;
  einLastFour?: string | null;
  businessAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  contactFirstName: string;
  contactLastName: string;
  contactTitle?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  packageId?: string | null;
  packageName?: string | null;
  interestedServices?: string[];
  notes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Map server DTO → the legacy localStorage shape so the rest of the UI is unchanged.
function adaptApiIntake(api: ApiIntake): SalesIntake {
  return {
    id: api.intakeId,
    registrationType: api.registrationType,
    businessLegalName: api.businessLegalName,
    dba: api.dbaName ?? undefined,
    einLastFour: api.einLastFour ?? "",
    street: api.businessAddress ?? "",
    city: api.city ?? "",
    state: api.state ?? "",
    zip: api.zip ?? "",
    firstName: api.contactFirstName,
    lastName: api.contactLastName,
    title: api.contactTitle ?? "",
    email: api.contactEmail,
    phone: api.contactPhone ?? "",
    packageId: api.packageId ?? undefined,
    interestedServices: api.interestedServices ?? [],
    notes: api.notes ?? undefined,
    adminNotes: api.adminNotes ?? undefined,
    status: api.status,
    createdAt: api.createdAt,
  };
}

function loadLocalIntakes(): SalesIntake[] {
  if (typeof window === "undefined") return [];
  return getSalesIntakes().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export default function SalesIntakeAdminPage() {
  const [intakes, setIntakes] = useState<SalesIntake[]>([]);
  const [filter, setFilter] = useState<IntakeStatus | "all">("all");
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>("demo");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/sales-intake?admin=1", { cache: "no-store" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = (await res.json()) as {
        storageMode?: StorageMode;
        intakes?: ApiIntake[];
      };
      const mode: StorageMode = data.storageMode === "database" ? "database" : "demo";
      setStorageMode(mode);
      const apiIntakes = (data.intakes ?? []).map(adaptApiIntake);
      if (mode === "database") {
        setIntakes(apiIntakes);
      } else {
        // Demo mode: merge server-memory + browser localStorage so an admin
        // can still review intakes submitted before a DB was attached.
        const local = loadLocalIntakes();
        const seen = new Set(apiIntakes.map((i) => i.id));
        setIntakes([...apiIntakes, ...local.filter((i) => !seen.has(i.id))]);
      }
    } catch (err) {
      // Fallback: API unreachable — read browser localStorage only.
      console.warn("[admin/sales-intake] API unreachable, falling back to localStorage", err);
      setStorageMode("demo");
      setIntakes(loadLocalIntakes());
      setLoadError("API unreachable — showing browser localStorage only.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial data fetch on mount. setState calls inside `reload` are
    // intentional and run asynchronously after the fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  const filtered = filter === "all" ? intakes : intakes.filter((i) => i.status === filter);

  async function handleStatus(id: string, status: IntakeStatus) {
    const note = noteMap[id] ?? "";
    setSaving(id);
    try {
      // Always update localStorage (cheap + keeps demo summary working)
      updateSalesIntakeStatus(id, status, note || undefined);
      // Best-effort PATCH to API; ignore failure (handled by reload error path)
      try {
        await fetch(`/api/sales-intake/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, adminNotes: note || undefined }),
        });
      } catch (err) {
        console.warn("[admin/sales-intake] PATCH failed", err);
      }
      await reload();
    } finally {
      setSaving(null);
    }
  }

  const STATUS_BTN_COLORS: Record<string, string> = {
    approved: "bg-green-600/20 text-green-300 border-green-600/40 hover:bg-green-600/40",
    "needs-info": "bg-yellow-600/20 text-yellow-300 border-yellow-600/40 hover:bg-yellow-600/40",
    rejected: "bg-red-700/20 text-red-300 border-red-700/40 hover:bg-red-700/40",
    "pending-review": "bg-slate-700/30 text-slate-300 border-slate-600/40 hover:bg-slate-600/40",
  };

  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-extrabold text-white">Sales Intake Queue</h1>
            <span
              className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border font-bold ${
                storageMode === "database"
                  ? "text-cyan-300 border-cyan-400/40 bg-cyan-400/10"
                  : "text-amber-300 border-amber-400/40 bg-amber-400/10"
              }`}
              title={
                storageMode === "database"
                  ? "Reads/writes routed to the production database"
                  : "Demo mode — server is using in-memory + browser localStorage"
              }
            >
              {storageMode === "database" ? "Database storage" : "Demo storage"}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Review and action submitted business registrations.</p>
          {loadError && (
            <p className="text-xs text-amber-300 mt-1">{loadError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className="wwai-btn-ghost text-sm disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <Link href="/sales-registration" className="wwai-btn-ghost text-sm">Registration Hub</Link>
          <Link href="/sales-deck" className="wwai-btn-ghost text-sm">Sales Deck</Link>
        </div>
      </div>

      {/* Storage warning */}
      <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
        <p className="text-sm text-yellow-300">
          <strong>{storageMode === "database" ? "Database mode:" : "Demo mode:"}</strong>{" "}
          {storageMode === "database"
            ? "Submissions are persisted in the application database. Do not enter real EINs or sensitive business data until production auth and encryption are enabled — see docs/AUTH_AND_DATABASE_PRODUCTION_PLAN.md."
            : "Submissions are stored in your browser's localStorage and a server-memory store only. No persistent database is connected. This queue is for demo and sales workflow testing only."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {([
          ["all", "Total"],
          ["pending-review", "Pending"],
          ["approved", "Approved"],
          ["needs-info", "Needs Info"],
        ] as [string, string][]).map(([status, label]) => {
          const count = status === "all" ? intakes.length : intakes.filter((i) => i.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`stat-card text-left transition-colors ${filter === status ? "border-cyan-400/50 bg-cyan-900/20" : ""}`}
            >
              <div className="stat-big">{count}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </button>
          );
        })}
      </div>

      {/* Intake table */}
      {filtered.length === 0 ? (
        <div className="wwai-panel p-10 text-center text-slate-500">
          <p className="text-lg font-bold mb-2">No intakes found</p>
          <p className="text-sm">
            {filter === "all"
              ? "No registrations have been submitted yet."
              : `No intakes with status "${STATUS_LABELS[filter as IntakeStatus]}".`}
          </p>
          <Link href="/sales-registration/intake" className="wwai-btn-primary mt-4 inline-block text-sm">
            Submit Test Intake
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((intake) => (
            <div key={intake.id} className="wwai-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{intake.businessLegalName}</span>
                    {intake.dba && (
                      <span className="text-xs text-slate-400">DBA: {intake.dba}</span>
                    )}
                    <span className={`wwai-chip text-xs ${STATUS_COLORS[intake.status] ?? ""}`}>
                      {STATUS_LABELS[intake.status]}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {REGISTRATION_TYPE_LABELS[intake.registrationType]} ·{" "}
                    {intake.packageId ?? "No package"} ·{" "}
                    EIN: {maskEin(intake.einLastFour)} ·{" "}
                    <span className="font-mono">{intake.id}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(intake.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                <div>
                  <span className="text-slate-500">Contact: </span>
                  <span className="text-slate-300">{intake.firstName} {intake.lastName}</span>
                  {intake.title && <span className="text-slate-500"> ({intake.title})</span>}
                </div>
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span className="text-slate-300">{intake.email}</span>
                </div>
                {intake.phone && (
                  <div>
                    <span className="text-slate-500">Phone: </span>
                    <span className="text-slate-300">{intake.phone}</span>
                  </div>
                )}
                {intake.city && (
                  <div>
                    <span className="text-slate-500">Location: </span>
                    <span className="text-slate-300">{intake.city}, {intake.state} {intake.zip}</span>
                  </div>
                )}
              </div>

              {intake.interestedServices && intake.interestedServices.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {intake.interestedServices.map((s) => (
                    <span key={s} className="wwai-chip wwai-chip-cyan text-xs">{s}</span>
                  ))}
                </div>
              )}

              {intake.notes && (
                <div className="text-xs text-slate-400 bg-[#080e1a] p-2 rounded mb-3">
                  <span className="text-slate-500">Notes: </span>{intake.notes}
                </div>
              )}

              {/* Admin controls */}
              <div className="border-t border-[#1a2540] pt-3 mt-1">
                <div className="flex flex-wrap gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={noteMap[intake.id] ?? intake.adminNotes ?? ""}
                      onChange={(e) =>
                        setNoteMap((prev) => ({ ...prev, [intake.id]: e.target.value }))
                      }
                      placeholder="Admin notes..."
                      rows={2}
                      className="form-input w-full text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {(["approved", "needs-info", "rejected", "pending-review"] as IntakeStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          disabled={saving === intake.id || intake.status === status}
                          onClick={() => handleStatus(intake.id, status)}
                          className={`text-xs px-3 py-1.5 border rounded-lg transition-all ${STATUS_BTN_COLORS[status]} ${intake.status === status ? "opacity-50 cursor-default" : ""}`}
                        >
                          {saving === intake.id ? "..." : STATUS_LABELS[status]}
                        </button>
                      )
                    )}
                    <Link
                      href={`/sales-registration/summary/${encodeURIComponent(intake.id)}`}
                      className="text-xs px-3 py-1.5 border border-[#1a2540] text-slate-300 rounded-lg hover:bg-white/5 transition"
                    >
                      View Summary
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
