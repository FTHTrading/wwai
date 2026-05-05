import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sponsor:  { select: { id: true, name: true, industry: true } },
      package:  { select: { id: true, name: true, monthlyFee: true, setupFee: true } },
      venue:    { select: { id: true, name: true, city: true } },
    },
  });
  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  const body = await req.json();
  const proposal = await prisma.proposal.create({
    data: {
      sponsorId:    body.sponsorId    ?? null,
      packageId:    body.packageId    ?? null,
      venueId:      body.venueId      ?? null,
      campaignType: body.campaignType ?? "qr",
      termMonths:   body.termMonths   ?? 12,
      customBudget: body.customBudget ?? null,
      estimatedROI: body.estimatedROI ?? null,
      notes:        body.notes        ?? null,
      status:       "draft",
    },
    include: {
      sponsor: { select: { id: true, name: true } },
      package: { select: { id: true, name: true, monthlyFee: true, setupFee: true } },
    },
  });
  return NextResponse.json(proposal, { status: 201 });
}
