/**
 * Sales intake API — demo mode.
 *
 * SECURITY NOTICE: This endpoint handles business intake data.
 * - EIN is NEVER stored or returned; only the masked format (**-***XXXX) is persisted.
 * - All data in demo mode is ephemeral (no database persistence).
 * - Do NOT process real EINs or payment data through this endpoint until production
 *   auth, encryption, and database layers are configured.
 *
 * Production path: Replace in-memory store with Prisma DB calls and add auth middleware.
 */
import { NextRequest, NextResponse } from "next/server";

export interface IntakeRecord {
  id: string;
  createdAt: string;
  status: "pending-review" | "approved" | "needs-info" | "rejected";
  registrationType: string;
  businessLegalName: string;
  dba?: string;
  einMasked: string; // **-***XXXX — never the real EIN
  street: string;
  city: string;
  state: string;
  zip: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  packageId?: string;
  interestedServices: string[];
  notes?: string;
}

// In-memory store for demo (resets on server restart; replace with DB in production)
const demoIntakes: IntakeRecord[] = [];

function createIntakeId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `WWAI-${date}-${rand}`;
}

function validateEinFormat(ein: string): boolean {
  return /^\d{2}-\d{7}$/.test(ein.trim());
}

function maskEin(ein: string): string {
  const digits = ein.replace(/\D/g, "");
  const lastFour = digits.slice(-4);
  return `**-***${lastFour}`;
}

export async function GET() {
  // Return intakes without any sensitive fields (EIN already masked at input time)
  return NextResponse.json({ intakes: demoIntakes, total: demoIntakes.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      registrationType?: string;
      businessLegalName?: string;
      dba?: string;
      ein?: string; // Received once, immediately masked, never stored raw
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      firstName?: string;
      lastName?: string;
      title?: string;
      email?: string;
      phone?: string;
      packageId?: string;
      interestedServices?: string[];
      notes?: string;
    };

    const {
      registrationType,
      businessLegalName,
      dba,
      ein,
      street,
      city,
      state,
      zip,
      firstName,
      lastName,
      title,
      email,
      phone,
      packageId,
      interestedServices,
      notes,
    } = body;

    // Validate required fields
    const missing: string[] = [];
    if (!registrationType) missing.push("registrationType");
    if (!businessLegalName?.trim()) missing.push("businessLegalName");
    if (!ein) missing.push("ein");
    if (!firstName?.trim()) missing.push("firstName");
    if (!lastName?.trim()) missing.push("lastName");
    if (!email?.trim()) missing.push("email");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate EIN format only — never verify against IRS
    if (!validateEinFormat(ein!)) {
      return NextResponse.json(
        { error: "EIN must be in format XX-XXXXXXX (e.g. 12-3456789). Format check only — not verified." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email!)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Mask EIN immediately — never store raw value
    const einMasked = maskEin(ein!);

    const intake: IntakeRecord = {
      id: createIntakeId(),
      createdAt: new Date().toISOString(),
      status: "pending-review",
      registrationType: registrationType!,
      businessLegalName: businessLegalName!.trim(),
      dba: dba?.trim() || undefined,
      einMasked,
      street: street?.trim() || "",
      city: city?.trim() || "",
      state: state?.trim() || "",
      zip: zip?.trim() || "",
      firstName: firstName!.trim(),
      lastName: lastName!.trim(),
      title: title?.trim() || "",
      email: email!.trim().toLowerCase(),
      phone: phone?.trim() || "",
      packageId: packageId || undefined,
      interestedServices: Array.isArray(interestedServices) ? interestedServices : [],
      notes: notes?.trim() || undefined,
    };

    demoIntakes.unshift(intake);

    return NextResponse.json(
      {
        intake,
        message: "Demo intake submitted. EIN has been masked and is not stored.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[sales-intake POST]", err);
    return NextResponse.json({ error: "Failed to process intake" }, { status: 500 });
  }
}
