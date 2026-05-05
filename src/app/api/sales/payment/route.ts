export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();
    if (!amount || !description) {
      return NextResponse.json({ error: "Missing fields: amount, description" }, { status: 400 });
    }

    const squareToken    = process.env.SQUARE_ACCESS_TOKEN;
    const squareLocation = process.env.SQUARE_LOCATION_ID;

    // If Square not configured, return placeholder link
    if (!squareToken || !squareLocation) {
      return NextResponse.json({
        url: `https://square.link/u/fifa-troptions?amount=${amount}&desc=${encodeURIComponent(description)}`,
        note: "Configure SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in .env for live payments",
      });
    }

    const squareRes = await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${squareToken}`,
          "Square-Version": "2024-01-18",
        },
        body: JSON.stringify({
          idempotency_key: `fifa-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          quick_pay: {
            name:        description,
            price_money: { amount: Math.round(amount * 100), currency: "USD" },
            location_id: squareLocation,
          },
        }),
      }
    );

    const data = await squareRes.json();
    return NextResponse.json({ url: data.payment_link?.url ?? null, data });
  } catch (err) {
    console.error("[sales/payment]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
