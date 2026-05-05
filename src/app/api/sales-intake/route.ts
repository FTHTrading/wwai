/**
 * /api/sales-intake — list (GET) + create (POST)
 *
 * Storage:
 *   Routes through src/lib/storage/intakeRepository.ts which auto-selects
 *   between database and demo (in-memory) modes. The response always
 *   includes `storageMode` so the UI can display the appropriate badge.
 *
 * Security:
 *   EIN is validated for format only and immediately reduced to last-4.
 *   The full EIN is never stored or returned. Real EIN handling requires
 *   encrypted-field storage and a compliance review (see
 *   docs/AUTH_AND_DATABASE_PRODUCTION_PLAN.md).
 */
import { NextRequest, NextResponse } from "next/server";
import {
  createSalesIntake,
  listSalesIntakes,
  publicView,
  type CreateIntakeInput,
  type RegistrationType,
} from "@/lib/storage/intakeRepository";

export const dynamic = "force-dynamic";

const VALID_TYPES: RegistrationType[] = [
  "restaurant-bar",
  "hotel",
  "driver-transportation",
  "sponsor",
  "venue",
  "sales-partner",
];

function validateEinFormat(ein: string): boolean {
  return /^\d{2}-\d{7}$/.test(ein.trim());
}
function einLastFour(ein: string): string {
  return ein.replace(/\D/g, "").slice(-4);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeAdmin = searchParams.get("admin") === "1";
  const { intakes, storageMode } = await listSalesIntakes();
  return NextResponse.json({
    storageMode,
    total: intakes.length,
    intakes: includeAdmin ? intakes : intakes.map(publicView),
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const get = (k: string): string | undefined =>
    typeof body[k] === "string" ? (body[k] as string) : undefined;

  const registrationType = get("registrationType");
  const businessLegalName = get("businessLegalName");
  const ein = get("ein");
  const contactFirstName = get("contactFirstName") ?? get("firstName");
  const contactLastName = get("contactLastName") ?? get("lastName");
  const contactEmail = get("contactEmail") ?? get("email");

  const missing: string[] = [];
  if (!registrationType) missing.push("registrationType");
  if (!businessLegalName?.trim()) missing.push("businessLegalName");
  if (!contactFirstName?.trim()) missing.push("contactFirstName");
  if (!contactLastName?.trim()) missing.push("contactLastName");
  if (!contactEmail?.trim()) missing.push("contactEmail");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  if (!VALID_TYPES.includes(registrationType as RegistrationType)) {
    return NextResponse.json(
      { error: `Invalid registrationType: ${registrationType}` },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail!)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  let last4: string | undefined;
  if (ein && ein.trim()) {
    if (!validateEinFormat(ein)) {
      return NextResponse.json(
        {
          error:
            "EIN must be in format XX-XXXXXXX (e.g. 12-3456789). Format check only — not verified.",
        },
        { status: 400 },
      );
    }
    last4 = einLastFour(ein);
  }

  const services = Array.isArray(body.interestedServices)
    ? (body.interestedServices as unknown[]).map(String)
    : [];

  const input: CreateIntakeInput = {
    registrationType: registrationType as RegistrationType,
    businessLegalName: businessLegalName!.trim(),
    dbaName: get("dbaName") ?? get("dba"),
    einLastFour: last4,
    businessAddress: get("businessAddress") ?? get("street"),
    city: get("city"),
    state: get("state"),
    zip: get("zip"),
    website: get("website"),
    businessCategory: get("businessCategory"),
    contactFirstName: contactFirstName!.trim(),
    contactLastName: contactLastName!.trim(),
    contactTitle: get("contactTitle") ?? get("title"),
    contactEmail: contactEmail!.trim().toLowerCase(),
    contactPhone: get("contactPhone") ?? get("phone"),
    packageId: get("packageId"),
    packageName: get("packageName"),
    salesTerritory: get("salesTerritory"),
    estimatedBudget:
      typeof body.estimatedBudget === "number" ? body.estimatedBudget : undefined,
    interestedServices: services,
    notes: get("notes"),
  };

  try {
    const { intake, storageMode } = await createSalesIntake(input);
    return NextResponse.json(
      {
        ok: true,
        storageMode,
        intake: publicView(intake),
        message:
          storageMode === "database"
            ? "Intake saved to database. EIN was masked to last 4 digits."
            : "Demo intake stored in memory. EIN was masked to last 4 digits. Connect a database for persistence.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[sales-intake POST]", err);
    return NextResponse.json(
      { error: "Failed to process intake" },
      { status: 500 },
    );
  }
}
