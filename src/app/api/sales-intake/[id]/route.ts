import { NextRequest, NextResponse } from "next/server";

// Demo mode: same in-memory references are not shared across modules.
// In production, replace with Prisma lookup by ID.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  // Demo: cannot retrieve from server-side memory across requests without a DB.
  // Client should use localStorage via salesIntakeStorage.ts for demo lookups.
  return NextResponse.json({
    id,
    message:
      "Demo mode: intake detail is stored client-side. Use localStorage/salesIntakeStorage for client reads. Connect a database for server-side persistence.",
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const body = await req.json() as { status?: string; adminNotes?: string };
  const allowedStatuses = ["pending-review", "approved", "needs-info", "rejected"];
  if (body.status && !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  return NextResponse.json({
    id,
    status: body.status || "pending-review",
    adminNotes: body.adminNotes || "",
    updatedAt: new Date().toISOString(),
    message: "Demo mode: status update acknowledged. Connect a database for persistent updates.",
  });
}
