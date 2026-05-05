
import { NextRequest, NextResponse } from "next/server";
import { getSponsor, updateSponsor } from "@/lib/sponsors";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sponsor = await getSponsor(id);
  if (!sponsor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sponsor);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body    = await req.json();
    const updated = await updateSponsor(id, body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update sponsor" }, { status: 500 });
  }
}
