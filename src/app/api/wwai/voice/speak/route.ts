export const runtime = 'edge';

/**
 * src/app/api/wwai/voice/speak/route.ts
 * POST /api/wwai/voice/speak
 *
 * Body: { text: string, language?: string, voice?: string }
 *
 * Returns:
 *   audio/mpeg response if Deepgram TTS is configured
 *   503 JSON if not configured
 *
 * NEVER exposes DEEPGRAM_API_KEY to the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech, isDeepgramConfigured } from "@/lib/voice/deepgram";

const MAX_TEXT_CHARS = 2_000;

export async function POST(req: NextRequest): Promise<NextResponse | Response> {
  // ── Not configured ───────────────────────────────────────────────────────
  if (!isDeepgramConfigured()) {
    return NextResponse.json(
      {
        ok:      false,
        reason:  "deepgram_not_configured",
        message: "Voice output is not configured. Text mode is available.",
      },
      { status: 503 }
    );
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body: { text?: string; language?: string; voice?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_request", message: "Expected JSON body with a text field." },
      { status: 400 }
    );
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, reason: "missing_text", message: "text field is required." },
      { status: 400 }
    );
  }
  if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json(
      { ok: false, reason: "text_too_long", message: `text exceeds ${MAX_TEXT_CHARS} character limit.` },
      { status: 413 }
    );
  }

  // ── Synthesize ───────────────────────────────────────────────────────────
  const result = await synthesizeSpeech(text, {
    voice: body.voice,
  });

  if (!result.ok || !result.audioData) {
    return NextResponse.json(
      { ok: false, reason: "synthesis_failed", message: result.error ?? "TTS failed." },
      { status: 502 }
    );
  }

  return new Response(result.audioData, {
    status: 200,
    headers: {
      "Content-Type":  result.mimeType,
      "Cache-Control": "no-store",
      // Signal to client which provider served the response
      "X-Voice-Provider": "deepgram",
    },
  });
}
