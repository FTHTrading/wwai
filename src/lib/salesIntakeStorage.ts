/**
 * Sales intake storage — demo mode localStorage implementation.
 *
 * SECURITY NOTICE: This is a demo system only.
 * - EIN is never stored verbatim; only the last 4 digits are retained.
 * - Do not enter real EINs or sensitive business data until production
 *   database and authentication are enabled.
 * - Production path: replace localStorage operations with Prisma/database calls.
 */

export type RegistrationType =
  | "restaurant-bar"
  | "hotel"
  | "driver-transportation"
  | "sponsor"
  | "venue"
  | "sales-partner";

export type IntakeStatus =
  | "pending-review"
  | "approved"
  | "needs-info"
  | "rejected";

export interface SalesIntake {
  id: string;
  createdAt: string;
  status: IntakeStatus;
  registrationType: RegistrationType;
  // Business info
  businessLegalName: string;
  dba?: string;
  einLastFour: string; // NEVER store full EIN — only last 4 digits
  // Address
  street: string;
  city: string;
  state: string;
  zip: string;
  // Contact
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  // Package interest
  packageId?: string;
  interestedServices: string[];
  notes?: string;
  // Admin fields
  adminNotes?: string;
  updatedAt?: string;
}

// Storage key
const STORAGE_KEY = "troptions_sales_intakes";

/** Generate a human-readable intake ID like WWAI-20260502-A3F7 */
export function createIntakeId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `WWAI-${date}-${rand}`;
}

/**
 * Validate EIN format: two digits, dash, seven digits (e.g. 12-3456789).
 * NOTE: This validates format only. Production verification requires a
 * qualified business verification provider.
 */
export function validateEinFormat(ein: string): boolean {
  return /^\d{2}-\d{7}$/.test(ein.trim());
}

/** Extract last 4 digits from a formatted EIN (e.g. "12-3456789" → "6789") */
export function extractEinLastFour(ein: string): string {
  const digits = ein.replace(/\D/g, "");
  return digits.slice(-4);
}

/** Return masked EIN display string: **-***XXXX */
export function maskEin(lastFour: string): string {
  return `**-***${lastFour}`;
}

/** Load all intakes from localStorage (client-side demo only) */
export function getSalesIntakes(): SalesIntake[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SalesIntake[];
  } catch {
    return [];
  }
}

/** Persist intake list to localStorage */
function setSalesIntakes(intakes: SalesIntake[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intakes));
}

/**
 * Save a new sales intake. Accepts the full EIN only to extract last 4 digits;
 * the full EIN is immediately discarded and never stored.
 */
export function saveSalesIntake(
  data: Omit<SalesIntake, "id" | "createdAt" | "status" | "einLastFour"> & {
    einRaw: string; // full EIN — used only to extract last 4, then discarded
  }
): SalesIntake {
  const { einRaw, ...rest } = data;
  const intake: SalesIntake = {
    ...rest,
    id: createIntakeId(),
    createdAt: new Date().toISOString(),
    status: "pending-review",
    einLastFour: extractEinLastFour(einRaw),
  };
  const existing = getSalesIntakes();
  setSalesIntakes([intake, ...existing]);
  return intake;
}

/** Get a single intake by ID */
export function getSalesIntakeById(id: string): SalesIntake | undefined {
  return getSalesIntakes().find((i) => i.id === id);
}

/** Update intake status and optional admin notes */
export function updateSalesIntakeStatus(
  id: string,
  status: IntakeStatus,
  adminNotes?: string
): SalesIntake | undefined {
  const intakes = getSalesIntakes();
  const idx = intakes.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  intakes[idx] = {
    ...intakes[idx],
    status,
    updatedAt: new Date().toISOString(),
    ...(adminNotes !== undefined ? { adminNotes } : {}),
  };
  setSalesIntakes(intakes);
  return intakes[idx];
}

export const REGISTRATION_TYPE_LABELS: Record<RegistrationType, string> = {
  "restaurant-bar": "Restaurant / Bar",
  hotel: "Hotel",
  "driver-transportation": "Driver / Transportation",
  sponsor: "Sponsor",
  venue: "Venue / Event Space",
  "sales-partner": "Sales / Marketing Partner",
};

export const STATUS_LABELS: Record<IntakeStatus, string> = {
  "pending-review": "Pending Review",
  approved: "Approved",
  "needs-info": "Needs More Info",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<IntakeStatus, string> = {
  "pending-review": "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  approved: "text-green-400 border-green-400/40 bg-green-400/10",
  "needs-info": "text-orange-400 border-orange-400/40 bg-orange-400/10",
  rejected: "text-red-400 border-red-400/40 bg-red-400/10",
};

export const AVAILABLE_SERVICES: { id: string; label: string }[] = [
  { id: "wwai-listing", label: "WWAI Discovery Listing" },
  { id: "map-placement", label: "Map Placement" },
  { id: "qr-campaign", label: "QR Offer Campaign" },
  { id: "analytics-dashboard", label: "Analytics Dashboard" },
  { id: "concierge-placement", label: "Concierge Recommendation Slot" },
  { id: "safety-route", label: "Safety Route Integration" },
  { id: "co-branding", label: "Co-Branded Materials" },
  { id: "account-management", label: "Dedicated Account Management" },
  { id: "proposal-builder", label: "Proposal Builder Access" },
];
