import { NextRequest, NextResponse } from "next/server";
import { listSponsors, createSponsor } from "@/lib/sponsors";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const rows   = await listSponsors(status);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contactName, contactEmail, contactPhone, package: pkg, industry, website, budget, notes } = body;
    if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const sponsor = await createSponsor({
      name: name.trim(),
      contactName:  contactName  || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      package:      pkg          || undefined,
      industry:     industry     || undefined,
      website:      website      || undefined,
      budget:       budget != null ? Number(budget) : undefined,
      notes:        notes         || undefined,
    });
    return NextResponse.json(sponsor, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create sponsor" }, { status: 500 });
  }
}
