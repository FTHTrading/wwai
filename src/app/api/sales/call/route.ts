export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();
    if (!to) {
      return NextResponse.json({ error: "Missing field: to" }, { status: 400 });
    }

    // Route through FTH MCP Hub (Telnyx server at port 9077)
    const hubRes = await fetch("http://localhost:9077/mcp/invoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "telnyx_make_call",
        input: {
          to,
          from: process.env.TELNYX_FIFA_NUMBER ?? process.env.TELNYX_FROM_NUMBER,
          webhook_url: process.env.TELNYX_CALL_WEBHOOK_URL,
        },
      }),
    });

    const data = await hubRes.json();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[sales/call]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
