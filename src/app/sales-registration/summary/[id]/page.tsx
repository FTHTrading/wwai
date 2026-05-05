"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSalesIntakeById,
  maskEin,
  REGISTRATION_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  AVAILABLE_SERVICES,
  type SalesIntake,
} from "@/lib/salesIntakeStorage";
import { getPackageById } from "@/data/salesPackages";

export default function SalesIntakeSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // Lazy-init from storage so we don't call setState in an effect.
  const [{ intake, notFound }] = useState<{ intake: SalesIntake | null; notFound: boolean }>(() => {
    if (!id || typeof window === "undefined") {
      return { intake: null, notFound: false };
    }
    const found = getSalesIntakeById(decodeURIComponent(id));
    return found ? { intake: found, notFound: false } : { intake: null, notFound: true };
  });

  if (notFound) {
    return (
      <div className="hud-grid-bg -mx-4 px-4 py-12 rounded-2xl">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Intake Not Found</h1>
          <p className="text-slate-400 mb-6">
            No demo intake found with ID: <code className="text-cyan-400">{id}</code>.
            <br />
            Demo intakes are stored in your browser only and may have been cleared.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/sales-registration/intake" className="wwai-btn-primary">New Intake</Link>
            <Link href="/admin/sales-intake" className="wwai-btn-ghost">Admin Queue</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="hud-grid-bg -mx-4 px-4 py-12 rounded-2xl text-center text-slate-400">
        Loading intake...
      </div>
    );
  }

  const pkg = intake.packageId ? getPackageById(intake.packageId) : undefined;
  const selectedServices = AVAILABLE_SERVICES.filter((s) =>
    intake.interestedServices.includes(s.id)
  );

  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-1">
            WWAI / TROPTIONS — Demo Intake Summary
          </div>
          <h1 className="text-3xl font-extrabold text-white print:text-black">
            Business Intake Summary
          </h1>
          <p className="text-slate-400 mt-1 text-sm print:text-slate-600">
            Reference ID: <span className="font-mono text-cyan-400 print:text-blue-700">{intake.id}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2 no-print">
            <span className="wwai-chip wwai-chip-cyan">Demo</span>
            <span className={`wwai-chip border ${STATUS_COLORS[intake.status]}`}>
              {STATUS_LABELS[intake.status]}
            </span>
          </div>
        </header>

        {/* Demo disclaimer */}
        <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-4 mb-6 no-print">
          <p className="text-sm text-yellow-300">
            Demo intake only. No real business data has been stored or transmitted. EIN is masked and
            is not stored in full.
          </p>
        </div>

        {/* Summary panels */}
        <div className="space-y-5">
          {/* Registration info */}
          <section className="wwai-panel p-5">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-blue-700">
              Registration Overview
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Row label="Registration Type" value={REGISTRATION_TYPE_LABELS[intake.registrationType as keyof typeof REGISTRATION_TYPE_LABELS] ?? intake.registrationType} />
              <Row label="Status" value={STATUS_LABELS[intake.status]} />
              <Row label="Submitted" value={new Date(intake.createdAt).toLocaleString()} />
              {intake.updatedAt && (
                <Row label="Updated" value={new Date(intake.updatedAt).toLocaleString()} />
              )}
              <Row label="Intake ID" value={intake.id} mono />
            </div>
          </section>

          {/* Business info */}
          <section className="wwai-panel p-5">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-blue-700">
              Business Information
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Row label="Legal Name" value={intake.businessLegalName} />
              {intake.dba && <Row label="DBA" value={intake.dba} />}
              <Row
                label="EIN"
                value={maskEin(intake.einLastFour)}
                note="Masked for security. Full EIN not stored."
                mono
              />
              {(intake.street || intake.city) && (
                <Row
                  label="Address"
                  value={[intake.street, intake.city, intake.state, intake.zip].filter(Boolean).join(", ")}
                />
              )}
            </div>
          </section>

          {/* Contact */}
          <section className="wwai-panel p-5">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-blue-700">
              Primary Contact
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Row label="Name" value={`${intake.firstName} ${intake.lastName}`} />
              {intake.title && <Row label="Title" value={intake.title} />}
              <Row label="Email" value={intake.email} />
              {intake.phone && <Row label="Phone" value={intake.phone} />}
            </div>
          </section>

          {/* Package & Services */}
          <section className="wwai-panel p-5">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3 print:text-blue-700">
              Package & Services Interest
            </div>
            {pkg ? (
              <div className="mb-4 bg-[#0a0f1e] rounded-lg p-4 border border-[#1a2540]">
                <div className="font-bold text-white">{pkg.name}</div>
                <div className="text-xs text-cyan-400 mt-0.5">
                  ${pkg.price.toLocaleString()}/yr
                  {pkg.setupFee ? ` + $${pkg.setupFee.toLocaleString()} setup` : ""}
                </div>
                <p className="text-sm text-slate-300 mt-1">{pkg.bestFor}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-4">No specific package selected</p>
            )}
            {selectedServices.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                  Services of Interest
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((s) => (
                    <span key={s.id} className="wwai-chip wwai-chip-cyan">{s.label}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Notes */}
          {intake.notes && (
            <section className="wwai-panel p-5">
              <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-2 print:text-blue-700">
                Notes
              </div>
              <p className="text-sm text-slate-300">{intake.notes}</p>
            </section>
          )}

          {/* Admin notes */}
          {intake.adminNotes && (
            <section className="wwai-panel p-5 border-orange-500/30">
              <div className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">
                Admin Notes
              </div>
              <p className="text-sm text-slate-300">{intake.adminNotes}</p>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 py-2 no-print">
            <button
              className="wwai-btn-ghost text-sm"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
            <Link href="/sales-deck" className="wwai-btn-ghost text-sm">Sales Deck</Link>
            <Link href="/sales-documents/proposal-worksheet" className="wwai-btn-ghost text-sm">Build Proposal</Link>
            <Link href="/admin/sales-intake" className="wwai-btn-ghost text-sm">Admin Queue</Link>
            <button
              className="wwai-btn-ghost text-sm"
              onClick={() => router.push("/sales-registration/intake")}
            >
              New Intake
            </button>
          </div>

          {/* Print footer */}
          <div className="hidden print:block border-t border-slate-300 pt-4 mt-4 text-xs text-slate-500">
            <p>
              WWAI / TROPTIONS — Demo Intake Summary — {new Date().toLocaleDateString()}
              {" "}· This document is a demo system output. EIN is masked and not verified.
              Not for official business use until production systems are live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  note,
  mono,
}: {
  label: string;
  value: string;
  note?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">{label}</div>
      <div className={`text-slate-100 print:text-black ${mono ? "font-mono" : ""}`}>{value}</div>
      {note && <div className="text-xs text-slate-500 mt-0.5">{note}</div>}
    </div>
  );
}
