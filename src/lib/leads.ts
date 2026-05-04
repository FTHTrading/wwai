/**
 * Lead data layer — TROPTIONS Sales OS
 * Capture, store, and manage inbound leads for sponsors, venues, and sales.
 */
import prisma from "./prisma";

export type LeadType   = "sponsor" | "venue" | "sales" | "general";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type LeadSource = "web" | "qr" | "referral" | "cold";

export interface LeadRow {
  id:             string;
  type:           string;
  name:           string;
  email:          string | null;
  phone:          string | null;
  company:        string | null;
  message:        string | null;
  source:         string;
  status:         string;
  estimatedValue: number | null;
  sponsorId:      string | null;
  venueId:        string | null;
  createdAt:      Date;
  updatedAt:      Date;
}

export async function listLeads(opts?: { type?: string; status?: string; limit?: number }): Promise<LeadRow[]> {
  return prisma.lead.findMany({
    where: {
      ...(opts?.type   ? { type: opts.type }     : {}),
      ...(opts?.status ? { status: opts.status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: opts?.limit ?? 100,
  });
}

export async function createLead(data: {
  type?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  estimatedValue?: number;
  sponsorId?: string;
  venueId?: string;
}): Promise<LeadRow> {
  return prisma.lead.create({ data });
}

export async function updateLeadStatus(id: string, status: string): Promise<LeadRow> {
  return prisma.lead.update({ where: { id }, data: { status } });
}

export const LEAD_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:        { label: "New",       color: "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30" },
  contacted:  { label: "Contacted", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  qualified:  { label: "Qualified", color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  converted:  { label: "Converted", color: "text-green-400 bg-green-400/10 border-green-400/30" },
  lost:       { label: "Lost",      color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

export const LEAD_TYPE_LABELS: Record<string, string> = {
  sponsor: "Sponsor Inquiry",
  venue:   "Venue Inquiry",
  sales:   "Sales Team",
  general: "General",
};
