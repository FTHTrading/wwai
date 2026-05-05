export const runtime = 'edge';

/**
 * GET /api/system-status
 * Returns full system readiness for the settings/integrations page.
 * Never exposes secret values — only presence flags and safe metadata.
 */
import { NextResponse } from "next/server";
import { getSystemReadiness } from "@/lib/env";

export async function GET() {
  try {
    const readiness = getSystemReadiness();
    return NextResponse.json(readiness, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[/api/system-status]", err);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}
