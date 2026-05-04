import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [cardsListed, openOptions, volume, activeTraders, totalDeals, totalCommissions, payoutsProcessed] =
    await Promise.all([
      prisma.listing.count({ where: { status: "open" } }),
      prisma.optionContract.count({ where: { status: "open" } }),
      prisma.listing.aggregate({ _sum: { price: true }, where: { status: "filled" } }),
      prisma.user.count(),
      prisma.listing.count({ where: { status: { in: ["open", "filled"] } } }),
      prisma.listing.aggregate({ _sum: { price: true } }),
      prisma.listing.aggregate({ _sum: { price: true }, where: { status: "filled" } }),
    ]);

  return NextResponse.json({
    cardsListed,
    openOptions,
    totalVolume: volume._sum.price ?? 0,
    activeTraders,
    totalDeals,
    totalCommissions: (totalCommissions._sum.price ?? 0) * 0.02, // 2% fee model
    payoutsProcessed: payoutsProcessed._sum.price ?? 0,
  });
}
