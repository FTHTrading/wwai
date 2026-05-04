import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const cardId = req.nextUrl.searchParams.get("cardId");
  const status = req.nextUrl.searchParams.get("status"); // null = all statuses

  const contracts = await prisma.optionContract.findMany({
    where: {
      ...(cardId ? { cardId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      card: true,
      buyer:  { select: { id: true, displayName: true, address: true } },
      seller: { select: { id: true, displayName: true, address: true } },
    },
    orderBy: { expiresAt: "asc" },
  });

  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, buyerId, sellerId, strikePrice, premium, contractType, expiresAt } = body;

    if (!cardId || !buyerId || !sellerId || !strikePrice || !premium || !expiresAt) {
      return NextResponse.json(
        { error: "cardId, buyerId, sellerId, strikePrice, premium, expiresAt required" },
        { status: 400 }
      );
    }

    const contract = await prisma.optionContract.create({
      data: {
        cardId,
        buyerId,
        sellerId,
        strikePrice: Number(strikePrice),
        premium: Number(premium),
        contractType: contractType ?? "call",
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create option" }, { status: 500 });
  }
}
