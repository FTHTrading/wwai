/**
 * src/app/api/wwai/voice/transcribe/route.ts
 * POST /api/wwai/voice/transcribe
 *
 * Accepts multipart/form-data:
 *   audio   — Blob/File (audio/webm, audio/mp4, etc.)
 *   language — optional BCP-47 language code
 *
 * Returns:
 *   { ok, transcript, provider, language }
 *   or 503 with { ok:false, reason, message } if Deepgram not configured
 *
 * NEVER exposes DEEPGRAM_API_KEY to the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio, isDeepgramConfigured } from "@/lib/voice/deepgram";
import { getLanguage } from "@/lib/i18n/languages";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Not configured ───────────────────────────────────────────────────────
  if (!isDeepgramConfigured()) {
    return NextResponse.json(
      {
        ok:      false,
        reason:  "deepgram_not_configured",
        message: "Voice transcription is not configured. Text mode is available.",
      },
      { status: 503 }
    );
  }

  // ── Parse multipart form ─────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_request", message: "Expected multipart/form-data with an audio field." },
      { status: 400 }
    );
  }

  const audioFile = formData.get("audio");
  if (!audioFile || !(audioFile instanceof Blob)) {
    return NextResponse.json(
      { ok: false, reason: "missing_audio", message: "No audio file in request." },
      { status: 400 }
    );
  }

  // Size check
  if (audioFile.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { ok: false, reason: "audio_too_large", message: "Audio file exceeds 10 MB limit." },
      { status: 413 }
    );
  }

  const rawLang  = (formData.get("language") as string | null) ?? "en";
  const langObj  = getLanguage(rawLang);
  const language = langObj.code;

  // ── Transcribe ───────────────────────────────────────────────────────────
  const buffer   = await audioFile.arrayBuffer();
  const mimeType = audioFile.type || "audio/webm";
  const result   = await transcribeAudio(buffer, {
    language,
    mimeType,
    model: langObj.deepgramModel,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: "transcription_failed", message: result.error ?? "Transcription failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok:         true,
    transcript: result.transcript,
    provider:   "deepgram",
    language:   result.language,
    model:      result.model,
  });
}
