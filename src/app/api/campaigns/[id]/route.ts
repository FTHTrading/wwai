export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getCampaign } from "@/lib/campaigns";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campaign);
}
