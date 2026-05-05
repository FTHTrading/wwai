export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { issueOptionReceipt } from "@/lib/tsn";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { buyerAddress } = body;

    if (!buyerAddress) {
      return NextResponse.json({ error: "buyerAddress required" }, { status: 400 });
    }

    const contract = await prisma.optionContract.findUnique({
      where: { id },
      include: { card: true, seller: true },
    });
    if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    if (contract.status !== "open") {
      return NextResponse.json({ error: "Contract is not open" }, { status: 409 });
    }
    if (new Date(contract.expiresAt) < new Date()) {
      await prisma.optionContract.update({ where: { id }, data: { status: "expired" } });
      return NextResponse.json({ error: "Contract has expired" }, { status: 410 });
    }

    // Upsert buyer
    const buyer = await prisma.user.upsert({
      where: { address: buyerAddress },
      create: { address: buyerAddress },
      update: {},
    });

    // Update buyer on contract and mark exercised
    const updated = await prisma.optionContract.update({
      where: { id },
      data: { buyerId: buyer.id, status: "exercised" },
    });

    // Issue TSN NIL deal receipt (troptions.nil namespace, sport=soccer)
    const tsnReceipt = issueOptionReceipt({
      cardName:      contract.card.name,
      strikePrice:   contract.strikePrice,
      contractType:  contract.contractType,
      buyerAddress,
      sellerAddress: contract.seller.address,
      contractId:    id,
    });

    return NextResponse.json({ ...updated, tsn_receipt: tsnReceipt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to exercise option" }, { status: 500 });
  }
}
