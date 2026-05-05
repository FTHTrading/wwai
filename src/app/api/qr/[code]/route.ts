export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getQrByCode, recordQrScan } from "@/lib/campaigns";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const qr = await getQrByCode(code);
  if (!qr) return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  if (!qr.active) return NextResponse.json({ error: "QR code is inactive" }, { status: 410 });
  if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) {
    return NextResponse.json({ error: "QR code has expired" }, { status: 410 });
  }

  // Record scan event
  const ip        = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  await recordQrScan({ qrCodeId: qr.id, eventType: "scan", ip: ip ?? undefined, userAgent });

  return NextResponse.json(qr);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const qr = await getQrByCode(code);
  if (!qr)         return NextResponse.json({ error: "QR code not found" },  { status: 404 });
  if (!qr.active)  return NextResponse.json({ error: "QR code is inactive" },{ status: 410 });
  if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) {
    return NextResponse.json({ error: "QR code has expired" }, { status: 410 });
  }

  const ip        = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  await recordQrScan({ qrCodeId: qr.id, eventType: "redeem", ip: ip ?? undefined, userAgent });

  return NextResponse.json({ ok: true, message: "Offer redeemed", offer: qr.offerText, rewardValue: qr.rewardValue, rewardType: qr.rewardType });
}
