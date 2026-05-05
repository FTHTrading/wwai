
import { NextRequest, NextResponse } from "next/server";
import { getVenue, updateVenue } from "@/lib/venues";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = await getVenue(id);
  if (!venue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(venue);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body    = await req.json();
    const updated = await updateVenue(id, body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 });
  }
}
