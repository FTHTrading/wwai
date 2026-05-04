import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [
    cardsListed, openOptions, volume, activeTraders, totalDeals, totalCommissions, payoutsProcessed,
    totalSponsors, activeSponsors, totalVenues, activeVenues,
    totalLeads, newLeads, totalCampaigns, activeCampaigns, totalRedemptions,
  ] = await Promise.all([
    prisma.listing.count({ where: { status: "open" } }),
    prisma.optionContract.count({ where: { status: "open" } }),
    prisma.listing.aggregate({ _sum: { price: true }, where: { status: "filled" } }),
    prisma.user.count(),
    prisma.listing.count({ where: { status: { in: ["open", "filled"] } } }),
    prisma.listing.aggregate({ _sum: { price: true } }),
    prisma.listing.aggregate({ _sum: { price: true }, where: { status: "filled" } }),
    // Phase 2 counts
    prisma.sponsor.count(),
    prisma.sponsor.count({ where: { status: "active" } }),
    prisma.venue.count(),
    prisma.venue.count({ where: { status: "active" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.qrEvent.count({ where: { eventType: "redeem" } }),
  ]);

  return NextResponse.json({
    cardsListed,
    openOptions,
    totalVolume:      volume._sum.price ?? 0,
    activeTraders,
    totalDeals,
    totalCommissions: (totalCommissions._sum.price ?? 0) * 0.02,
    payoutsProcessed: payoutsProcessed._sum.price ?? 0,
    // Phase 2
    totalSponsors,
    activeSponsors,
    totalVenues,
    activeVenues,
    totalLeads,
    newLeads,
    totalCampaigns,
    activeCampaigns,
    totalRedemptions,
  });
}

