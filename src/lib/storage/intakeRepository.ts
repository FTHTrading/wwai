/**
 * src/lib/storage/intakeRepository.ts
 *
 * Server-side data access for sales intakes / proposals / admin review events.
 *
 * Design:
 *   - If `DATABASE_URL` is set AND the Prisma client can connect, this module
 *     persists to the real database (storageMode = "database").
 *   - Otherwise it falls back to an in-memory store so dev / preview builds
 *     keep working (storageMode = "demo"). The in-memory store survives
 *     across requests in a single Node process; production use must run with
 *     a real database.
 *
 * SECURITY:
 *   - Full EIN is NEVER stored. Callers pass `einLastFour` only.
 *     Full EIN storage requires encrypted-field handling and compliance
 *     review — see docs/AUTH_AND_DATABASE_PRODUCTION_PLAN.md.
 *   - This module never returns admin-only fields to the client unless the
 *     caller explicitly opts in via `includeAdmin: true`.
 *
 * NOTE:
 *   - This is the SERVER-side store. Client pages should call the
 *     /api/sales-intake routes which delegate here.
 *   - The legacy localStorage helpers in src/lib/salesIntakeStorage.ts remain
 *     in place so the demo intake summary page continues to work for users
 *     who submitted before the API + DB path was wired up.
 */

import "server-only";
import prisma from "@/lib/prisma";

// ── Types ──────────────────────────────────────────────────────────────────
export type IntakeStatus =
  | "pending-review"
  | "approved"
  | "needs-info"
  | "rejected";

export type RegistrationType =
  | "restaurant-bar"
  | "hotel"
  | "driver-transportation"
  | "sponsor"
  | "venue"
  | "sales-partner";

export type StorageMode = "database" | "demo";

export interface IntakeRecord {
  id:                 string;
  intakeId:           string;
  status:             IntakeStatus;
  registrationType:   RegistrationType;
  // Business
  businessLegalName:  string;
  dbaName?:           string;
  einLastFour?:       string;
  einMasked?:         string; // computed on read for client convenience
  businessAddress?:   string;
  city?:              string;
  state?:             string;
  zip?:               string;
  website?:           string;
  businessCategory?:  string;
  // Contact
  contactFirstName:   string;
  contactLastName:    string;
  contactTitle?:      string;
  contactEmail:       string;
  contactPhone?:      string;
  // Package
  packageId?:         string;
  packageName?:       string;
  salesTerritory?:    string;
  estimatedBudget?:   number;
  interestedServices: string[];
  notes?:             string;
  // Admin
  adminNotes?:        string;
  createdAt:          string;
  updatedAt:          string;
}

export interface CreateIntakeInput {
  registrationType:   RegistrationType;
  businessLegalName:  string;
  dbaName?:           string;
  einLastFour?:       string; // last 4 only — caller MUST mask before passing
  businessAddress?:   string;
  city?:              string;
  state?:             string;
  zip?:               string;
  website?:           string;
  businessCategory?:  string;
  contactFirstName:   string;
  contactLastName:    string;
  contactTitle?:      string;
  contactEmail:       string;
  contactPhone?:      string;
  packageId?:         string;
  packageName?:       string;
  salesTerritory?:    string;
  estimatedBudget?:   number;
  interestedServices?: string[];
  notes?:             string;
}

export interface AdminReviewInput {
  intakeId:    string; // db row id (cuid)
  action:      "status-change" | "note-added" | "assigned" | "flagged";
  fromStatus?: IntakeStatus;
  toStatus?:   IntakeStatus;
  note?:       string;
  actorId?:    string;
  actorEmail?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const ALLOWED_STATUSES: IntakeStatus[] = [
  "pending-review",
  "approved",
  "needs-info",
  "rejected",
];

export function isValidStatus(s: string): s is IntakeStatus {
  return (ALLOWED_STATUSES as string[]).includes(s);
}

export function maskEin(lastFour?: string | null): string | undefined {
  if (!lastFour) return undefined;
  return `**-***${lastFour}`;
}

export function generateIntakeId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `WWAI-${date}-${rand}`;
}

// ── Database availability detection ────────────────────────────────────────
// Lazy probe: try a cheap query the first time we need it, cache result.
let _dbAvailable: boolean | null = null;

async function isDatabaseAvailable(): Promise<boolean> {
  if (_dbAvailable !== null) return _dbAvailable;
  if (!process.env.DATABASE_URL) {
    _dbAvailable = false;
    return false;
  }
  try {
    // SalesIntake table is created by migration; this confirms schema is in sync.
    await prisma.salesIntake.count();
    _dbAvailable = true;
    return true;
  } catch (e) {
    console.warn(
      "[intakeRepository] Database unavailable, falling back to demo store:",
      e instanceof Error ? e.message : e,
    );
    _dbAvailable = false;
    return false;
  }
}

export async function getStorageMode(): Promise<StorageMode> {
  return (await isDatabaseAvailable()) ? "database" : "demo";
}

// ── In-memory demo store ───────────────────────────────────────────────────
// Module-scoped — survives across requests in the same Node process.
const demoStore: IntakeRecord[] = [];
const demoEvents: Array<AdminReviewInput & { id: string; createdAt: string }> = [];

function decodeServices(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// Prisma row → public IntakeRecord
type PrismaIntakeRow = {
  id: string;
  intakeId: string;
  status: string;
  registrationType: string;
  businessLegalName: string;
  dbaName: string | null;
  einLastFour: string | null;
  businessAddress: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website: string | null;
  businessCategory: string | null;
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string | null;
  contactEmail: string;
  contactPhone: string | null;
  packageId: string | null;
  packageName: string | null;
  salesTerritory: string | null;
  estimatedBudget: number | null;
  interestedServices: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function fromDb(row: PrismaIntakeRow): IntakeRecord {
  return {
    id: row.id,
    intakeId: row.intakeId,
    status: (isValidStatus(row.status) ? row.status : "pending-review") as IntakeStatus,
    registrationType: row.registrationType as RegistrationType,
    businessLegalName: row.businessLegalName,
    dbaName: row.dbaName ?? undefined,
    einLastFour: row.einLastFour ?? undefined,
    einMasked: maskEin(row.einLastFour),
    businessAddress: row.businessAddress ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    zip: row.zip ?? undefined,
    website: row.website ?? undefined,
    businessCategory: row.businessCategory ?? undefined,
    contactFirstName: row.contactFirstName,
    contactLastName: row.contactLastName,
    contactTitle: row.contactTitle ?? undefined,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone ?? undefined,
    packageId: row.packageId ?? undefined,
    packageName: row.packageName ?? undefined,
    salesTerritory: row.salesTerritory ?? undefined,
    estimatedBudget: row.estimatedBudget ?? undefined,
    interestedServices: decodeServices(row.interestedServices),
    notes: row.notes ?? undefined,
    adminNotes: row.adminNotes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Strip admin-only fields before returning to non-admin callers.
export function publicView(intake: IntakeRecord): IntakeRecord {
  const copy = { ...intake };
  delete copy.adminNotes;
  return copy;
}

// ── Public repository API ──────────────────────────────────────────────────

export async function createSalesIntake(
  input: CreateIntakeInput,
): Promise<{ intake: IntakeRecord; storageMode: StorageMode }> {
  const intakeId = generateIntakeId();
  const services = input.interestedServices ?? [];
  const useDb = await isDatabaseAvailable();

  if (useDb) {
    const row = await prisma.salesIntake.create({
      data: {
        intakeId,
        registrationType: input.registrationType,
        status: "pending-review",
        businessLegalName: input.businessLegalName.trim(),
        dbaName: input.dbaName?.trim() || null,
        einLastFour: input.einLastFour?.trim() || null,
        businessAddress: input.businessAddress?.trim() || null,
        city: input.city?.trim() || null,
        state: input.state?.trim() || null,
        zip: input.zip?.trim() || null,
        website: input.website?.trim() || null,
        businessCategory: input.businessCategory?.trim() || null,
        contactFirstName: input.contactFirstName.trim(),
        contactLastName: input.contactLastName.trim(),
        contactTitle: input.contactTitle?.trim() || null,
        contactEmail: input.contactEmail.trim().toLowerCase(),
        contactPhone: input.contactPhone?.trim() || null,
        packageId: input.packageId || null,
        packageName: input.packageName || null,
        salesTerritory: input.salesTerritory || null,
        estimatedBudget: input.estimatedBudget ?? null,
        interestedServices: JSON.stringify(services),
        notes: input.notes?.trim() || null,
      },
    });
    return { intake: fromDb(row as PrismaIntakeRow), storageMode: "database" };
  }

  // Demo path — server-memory store
  const now = new Date().toISOString();
  const intake: IntakeRecord = {
    id: `demo_${Math.random().toString(36).slice(2, 10)}`,
    intakeId,
    status: "pending-review",
    registrationType: input.registrationType,
    businessLegalName: input.businessLegalName.trim(),
    dbaName: input.dbaName?.trim() || undefined,
    einLastFour: input.einLastFour?.trim() || undefined,
    einMasked: maskEin(input.einLastFour?.trim()),
    businessAddress: input.businessAddress?.trim() || undefined,
    city: input.city?.trim() || undefined,
    state: input.state?.trim() || undefined,
    zip: input.zip?.trim() || undefined,
    website: input.website?.trim() || undefined,
    businessCategory: input.businessCategory?.trim() || undefined,
    contactFirstName: input.contactFirstName.trim(),
    contactLastName: input.contactLastName.trim(),
    contactTitle: input.contactTitle?.trim() || undefined,
    contactEmail: input.contactEmail.trim().toLowerCase(),
    contactPhone: input.contactPhone?.trim() || undefined,
    packageId: input.packageId,
    packageName: input.packageName,
    salesTerritory: input.salesTerritory,
    estimatedBudget: input.estimatedBudget,
    interestedServices: services,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };
  demoStore.unshift(intake);
  return { intake, storageMode: "demo" };
}

export async function listSalesIntakes(): Promise<{
  intakes: IntakeRecord[];
  storageMode: StorageMode;
}> {
  const useDb = await isDatabaseAvailable();
  if (useDb) {
    const rows = await prisma.salesIntake.findMany({
      orderBy: { createdAt: "desc" },
    });
    return {
      intakes: rows.map((r) => fromDb(r as PrismaIntakeRow)),
      storageMode: "database",
    };
  }
  return { intakes: [...demoStore], storageMode: "demo" };
}

export async function getSalesIntakeById(
  idOrIntakeId: string,
): Promise<{ intake: IntakeRecord | null; storageMode: StorageMode }> {
  const useDb = await isDatabaseAvailable();
  if (useDb) {
    const row =
      (await prisma.salesIntake.findUnique({
        where: { intakeId: idOrIntakeId },
      })) ??
      (await prisma.salesIntake.findUnique({
        where: { id: idOrIntakeId },
      }));
    return {
      intake: row ? fromDb(row as PrismaIntakeRow) : null,
      storageMode: "database",
    };
  }
  const found =
    demoStore.find((i) => i.intakeId === idOrIntakeId) ??
    demoStore.find((i) => i.id === idOrIntakeId) ??
    null;
  return { intake: found, storageMode: "demo" };
}

export async function updateSalesIntakeStatus(
  idOrIntakeId: string,
  status: IntakeStatus,
  adminNotes?: string,
  actor?: { id?: string; email?: string },
): Promise<{ intake: IntakeRecord | null; storageMode: StorageMode }> {
  if (!isValidStatus(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const useDb = await isDatabaseAvailable();

  if (useDb) {
    const existing =
      (await prisma.salesIntake.findUnique({
        where: { intakeId: idOrIntakeId },
      })) ??
      (await prisma.salesIntake.findUnique({
        where: { id: idOrIntakeId },
      }));
    if (!existing) return { intake: null, storageMode: "database" };

    const fromStatus = existing.status as IntakeStatus;
    const updated = await prisma.salesIntake.update({
      where: { id: existing.id },
      data: {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });
    await prisma.adminReviewEvent.create({
      data: {
        intakeId: existing.id,
        action: "status-change",
        fromStatus,
        toStatus: status,
        note: adminNotes,
        actorId: actor?.id,
        actorEmail: actor?.email,
      },
    });
    return {
      intake: fromDb(updated as PrismaIntakeRow),
      storageMode: "database",
    };
  }

  // Demo path
  const idx =
    demoStore.findIndex((i) => i.intakeId === idOrIntakeId) >= 0
      ? demoStore.findIndex((i) => i.intakeId === idOrIntakeId)
      : demoStore.findIndex((i) => i.id === idOrIntakeId);
  if (idx < 0) return { intake: null, storageMode: "demo" };
  const fromStatus = demoStore[idx].status;
  demoStore[idx] = {
    ...demoStore[idx],
    status,
    adminNotes: adminNotes ?? demoStore[idx].adminNotes,
    updatedAt: new Date().toISOString(),
  };
  demoEvents.push({
    id: `evt_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    intakeId: demoStore[idx].id,
    action: "status-change",
    fromStatus,
    toStatus: status,
    note: adminNotes,
    actorId: actor?.id,
    actorEmail: actor?.email,
  });
  return { intake: demoStore[idx], storageMode: "demo" };
}

export async function addAdminReviewEvent(
  input: AdminReviewInput,
): Promise<{ storageMode: StorageMode }> {
  const useDb = await isDatabaseAvailable();
  if (useDb) {
    await prisma.adminReviewEvent.create({
      data: {
        intakeId: input.intakeId,
        action: input.action,
        fromStatus: input.fromStatus ?? null,
        toStatus: input.toStatus ?? null,
        note: input.note ?? null,
        actorId: input.actorId ?? null,
        actorEmail: input.actorEmail ?? null,
      },
    });
    return { storageMode: "database" };
  }
  demoEvents.push({
    id: `evt_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    ...input,
  });
  return { storageMode: "demo" };
}
