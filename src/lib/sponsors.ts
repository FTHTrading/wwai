/**
 * Sponsor data layer — TROPTIONS Sales OS
 * CRUD operations for Sponsor records via Prisma.
 */
import prisma from "./prisma";

export type SponsorPackage = "smart" | "cultural" | "rewards";
export type SponsorStatus  = "prospect" | "active" | "paused" | "closed";

export interface SponsorRow {
  id:           string;
  name:         string;
  contactName:  string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  package:      string;
  status:       string;
  budget:       number | null;
  industry:     string | null;
  website:      string | null;
  notes:        string | null;
  createdAt:    Date;
  updatedAt:    Date;
  _count?: { campaigns: number; leads: number };
}

export async function listSponsors(status?: string): Promise<SponsorRow[]> {
  return prisma.sponsor.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { campaigns: true, leads: true } } },
  });
}

export async function getSponsor(id: string) {
  return prisma.sponsor.findUnique({
    where: { id },
    include: {
      _count: { select: { campaigns: true, leads: true } },
      campaigns: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          qrCodes: { select: { id: true, label: true, scans: true, redemptions: true } },
          venue:   { select: { id: true, name: true } },
        },
      },
      leads: { orderBy: { createdAt: "desc" }, take: 10 },
      proposals: {
        orderBy: { createdAt: "desc" },
        include: { package: { select: { name: true, monthlyFee: true } } },
      },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function createSponsor(data: {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  package?: string;
  industry?: string;
  website?: string;
  budget?: number;
  notes?: string;
}) {
  return prisma.sponsor.create({ data });
}

export async function updateSponsor(id: string, data: Partial<{
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  package: string;
  status: string;
  budget: number;
  industry: string;
  website: string;
  notes: string;
}>) {
  return prisma.sponsor.update({ where: { id }, data });
}

export const PACKAGE_LABELS: Record<string, { label: string; range: string; color: string }> = {
  smart:    { label: "Smart Placement",      range: "$25K–$75K",      color: "text-[#00d4ff]" },
  cultural: { label: "Cultural Concierge",   range: "$100K–$300K",    color: "text-[#d4a017]" },
  rewards:  { label: "Rewards Engine",       range: "$400K+",         color: "text-purple-400" },
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  prospect: { label: "Prospect",  color: "text-slate-400 bg-slate-800 border-slate-700" },
  active:   { label: "Active",    color: "text-green-400 bg-green-400/10 border-green-400/30" },
  paused:   { label: "Paused",    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  closed:   { label: "Closed",    color: "text-red-400 bg-red-400/10 border-red-400/30" },
};
