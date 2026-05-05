/**
 * GET /api/payment-status
 * Returns payment provider readiness (no secret values).
 * Used by /billing and /settings/integrations.
 */
import { NextResponse } from "next/server";
import { buildPaymentStatusResponse } from "@/lib/payments";

export async function GET() {
  try {
    const status = buildPaymentStatusResponse();
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[/api/payment-status]", err);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}
