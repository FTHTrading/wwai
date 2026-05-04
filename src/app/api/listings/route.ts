import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const cardId = req.nextUrl.searchParams.get("cardId");
  const status = req.nextUrl.searchParams.get("status") ?? "open";

  const listings = await prisma.listing.findMany({
    where: {
      ...(cardId ? { cardId } : {}),
      status,
    },
    include: {
      card: true,
      seller: { select: { id: true, displayName: true, address: true } },
      bids: {
        where: { status: "pending" },
        orderBy: { amount: "desc" },
        take: 5,
      },
    },
    orderBy: { price: "asc" },
  });

  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, sellerId, price, currency, quantity } = body;

    if (!cardId || !sellerId || !price) {
      return NextResponse.json({ error: "cardId, sellerId, price required" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        cardId,
        sellerId,
        price: Number(price),
        currency: currency ?? "ATP",
        quantity: quantity ?? 1,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
