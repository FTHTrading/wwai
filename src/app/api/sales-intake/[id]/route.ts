/**
 * /api/sales-intake/[id] — fetch (GET) + status update (PATCH)
 *
 * Accepts either the database row id (cuid) or the human-readable
 * intakeId (WWAI-YYYYMMDD-XXXX) as the path param.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getSalesIntakeById,
  updateSalesIntakeStatus,
  publicView,
  isValidStatus,
  type IntakeStatus,
} from "@/lib/storage/intakeRepository";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const includeAdmin = searchParams.get("admin") === "1";

  const { intake, storageMode } = await getSalesIntakeById(decodeURIComponent(id));
  if (!intake) {
    return NextResponse.json(
      { storageMode, error: "Intake not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({
    storageMode,
    intake: includeAdmin ? intake : publicView(intake),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  let body: { status?: string; adminNotes?: string };
  try {
    body = (await req.json()) as { status?: string; adminNotes?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status || !isValidStatus(body.status)) {
    return NextResponse.json(
      {
        error:
          "Invalid status. Must be one of: pending-review, approved, needs-info, rejected",
      },
      { status: 400 },
    );
  }

  try {
    const { intake, storageMode } = await updateSalesIntakeStatus(
      decodeURIComponent(id),
      body.status as IntakeStatus,
      body.adminNotes,
      // TODO: replace with auth user once production auth is wired:
      undefined,
    );
    if (!intake) {
      return NextResponse.json(
        { storageMode, error: "Intake not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      storageMode,
      intake,
      message:
        storageMode === "database"
          ? "Status updated and audit event recorded."
          : "Demo mode: status updated in memory. Connect a database for persistent updates.",
    });
  } catch (err) {
    console.error("[sales-intake PATCH]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update status" },
      { status: 500 },
    );
  }
}
