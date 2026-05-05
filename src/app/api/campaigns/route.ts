export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { listCampaigns, createCampaign } from "@/lib/campaigns";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const rows   = await listCampaigns(status);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sponsorId, venueId, type, startDate, endDate, budget, notes } = body;
    if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const campaign = await createCampaign({
      name: name.trim(),
      sponsorId:  sponsorId  || undefined,
      venueId:    venueId    || undefined,
      type:       type       || undefined,
      startDate:  startDate  || undefined,
      endDate:    endDate    || undefined,
      budget:     budget != null ? Number(budget) : undefined,
      notes:      notes      || undefined,
    });
    return NextResponse.json(campaign, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
