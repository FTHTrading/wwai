/**
 * Venue data layer — TROPTIONS Sales OS
 * CRUD operations for Venue records via Prisma.
 */
import prisma from "./prisma";

export type VenueCategory = "stadium" | "hotel" | "transit" | "entertainment" | "food" | "retail" | "general";
export type VenueStatus   = "prospect" | "onboarded" | "active" | "inactive";

export interface VenueRow {
  id:           string;
  name:         string;
  address:      string | null;
  city:         string;
  lat:          number | null;
  lng:          number | null;
  category:     string;
  capacity:     number | null;
  contactName:  string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status:       string;
  notes:        string | null;
  createdAt:    Date;
  updatedAt:    Date;
  _count?: { campaigns: number; leads: number };
}

export async function listVenues(status?: string, category?: string): Promise<VenueRow[]> {
  return prisma.venue.findMany({
    where: {
      ...(status   ? { status }   : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { campaigns: true, leads: true } } },
  });
}

export async function getVenue(id: string) {
  return prisma.venue.findUnique({
    where: { id },
    include: {
      _count: { select: { campaigns: true, leads: true } },
      campaigns: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          sponsor: { select: { id: true, name: true } },
          qrCodes: { select: { id: true, label: true, scans: true, redemptions: true, active: true } },
        },
      },
      leads:    { orderBy: { createdAt: "desc" }, take: 10 },
      proposals: {
        orderBy: { createdAt: "desc" },
        include: { sponsor: { select: { name: true } }, package: { select: { name: true } } },
      },
    },
  });
}

export async function createVenue(data: {
  name: string;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  category?: string;
  capacity?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}) {
  return prisma.venue.create({ data });
}

export async function updateVenue(id: string, data: Partial<{
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  category: string;
  capacity: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  notes: string;
}>) {
  return prisma.venue.update({ where: { id }, data });
}

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  stadium:       { label: "Stadium / Arena",    icon: "⬡", color: "text-[#00d4ff]"  },
  hotel:         { label: "Hotel / Hospitality",icon: "⬡", color: "text-[#d4a017]"  },
  transit:       { label: "Transit Hub",        icon: "⬡", color: "text-purple-400" },
  entertainment: { label: "Entertainment",      icon: "⬡", color: "text-pink-400"   },
  food:          { label: "Food & Beverage",    icon: "⬡", color: "text-orange-400" },
  retail:        { label: "Retail",             icon: "⬡", color: "text-green-400"  },
  general:       { label: "General",            icon: "⬡", color: "text-slate-400"  },
};

export const VENUE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  prospect:  { label: "Prospect",  color: "text-slate-400 bg-slate-800 border-slate-700" },
  onboarded: { label: "Onboarded", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  active:    { label: "Active",    color: "text-green-400 bg-green-400/10 border-green-400/30" },
  inactive:  { label: "Inactive",  color: "text-red-400 bg-red-400/10 border-red-400/30" },
};
