import { NextRequest, NextResponse } from "next/server";
import { listVenues, createVenue } from "@/lib/venues";

export async function GET(req: NextRequest) {
  const status   = req.nextUrl.searchParams.get("status")   ?? undefined;
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const rows     = await listVenues(status, category);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, city, lat, lng, category, capacity, contactName, contactEmail, contactPhone, notes } = body;
    if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const venue = await createVenue({
      name: name.trim(),
      address:      address      || undefined,
      city:         city         || undefined,
      lat:          lat  != null ? Number(lat)      : undefined,
      lng:          lng  != null ? Number(lng)      : undefined,
      category:     category     || undefined,
      capacity:     capacity != null ? Number(capacity) : undefined,
      contactName:  contactName  || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      notes:        notes        || undefined,
    });
    return NextResponse.json(venue, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create venue" }, { status: 500 });
  }
}
