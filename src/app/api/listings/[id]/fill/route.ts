import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { issueListingReceipt } from "@/lib/tsn";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { buyerId } = body;

    if (!buyerId) {
      return NextResponse.json({ error: "buyerId required" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { card: true, seller: true },
    });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.status !== "open") return NextResponse.json({ error: "Listing already filled or cancelled" }, { status: 409 });

    const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    // Mark listing filled
    const updated = await prisma.listing.update({
      where: { id },
      data: { status: "filled" },
    });

    // Issue TSN NFT receipt (simulation, troptions.root namespace)
    const tsnReceipt = issueListingReceipt({
      cardName:      listing.card.name,
      price:         listing.price,
      currency:      listing.currency,
      buyerAddress:  buyer.address,
      sellerAddress: listing.seller.address,
      listingId:     id,
    });

    return NextResponse.json({ ...updated, tsn_receipt: tsnReceipt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fill listing" }, { status: 500 });
  }
}
