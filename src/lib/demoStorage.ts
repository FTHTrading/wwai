// localStorage helpers for demo submissions, proposals, leads
"use client";

import type { Lead, PartnerCategory, Proposal, Submission, SubmissionStatus } from "./types";

const KEY = {
  submissions: "wwai.submissions.v1",
  proposals:   "wwai.proposals.v1",
  leads:       "wwai.leads.v1",
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors in demo */
  }
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Submissions ────────────────────────────────────────────────────────────
export function saveSubmission(
  type: PartnerCategory,
  data: Record<string, unknown>
): Submission {
  const all = read<Submission>(KEY.submissions);
  const sub: Submission = {
    id: uid(),
    type,
    name: String(data.name || data.businessName || data.hotelName || data.barName || "Unnamed"),
    contact: String(data.contact || data.contactName || data.owner || ""),
    email: String(data.email || ""),
    phone: data.phone ? String(data.phone) : undefined,
    zone: data.zone ? String(data.zone) : undefined,
    packageId: data.packageId ? String(data.packageId) : undefined,
    status: "pending",
    submittedAt: new Date().toISOString(),
    data,
  };
  all.unshift(sub);
  write(KEY.submissions, all);
  return sub;
}

export function getSubmissions(type?: PartnerCategory): Submission[] {
  const all = read<Submission>(KEY.submissions);
  return type ? all.filter((s) => s.type === type) : all;
}

export function updateSubmissionStatus(
  _type: PartnerCategory,
  id: string,
  status: SubmissionStatus
): void {
  const all = read<Submission>(KEY.submissions);
  const next = all.map((s) => (s.id === id ? { ...s, status } : s));
  write(KEY.submissions, next);
}

// ── Proposals ──────────────────────────────────────────────────────────────
export function saveProposal(p: Omit<Proposal, "id" | "createdAt">): Proposal {
  const all = read<Proposal>(KEY.proposals);
  const proposal: Proposal = { ...p, id: uid(), createdAt: new Date().toISOString() };
  all.unshift(proposal);
  write(KEY.proposals, all);
  return proposal;
}

export function getProposals(): Proposal[] {
  return read<Proposal>(KEY.proposals);
}

// ── Leads ──────────────────────────────────────────────────────────────────
export function saveLead(l: Omit<Lead, "id" | "createdAt">): Lead {
  const all = read<Lead>(KEY.leads);
  const lead: Lead = { ...l, id: uid(), createdAt: new Date().toISOString() };
  all.unshift(lead);
  write(KEY.leads, all);
  return lead;
}

export function getLeads(): Lead[] {
  return read<Lead>(KEY.leads);
}
