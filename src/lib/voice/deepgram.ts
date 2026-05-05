/**
 * src/lib/voice/deepgram.ts
 * Server-side Deepgram adapter — STT + TTS only.
 * Voice Agent API is noted for future integration.
 *
 * Uses raw fetch — no SDK required.
 * NEVER import this on the client; it reads process.env secrets.
 *
 * Env vars:
 *   DEEPGRAM_API_KEY   — required; if absent all methods return "not configured"
 *   DEEPGRAM_STT_MODEL — default "nova-3"
 *   DEEPGRAM_TTS_MODEL — default "aura-2-thalia-en"
 *   DEEPGRAM_LANGUAGE  — default "en"
 */

// ── Config ─────────────────────────────────────────────────────────────────
const DEEPGRAM_API_KEY   = process.env.DEEPGRAM_API_KEY   ?? "";
const DEEPGRAM_KEY_ALT   = process.env.DEEPGRAM_KEY_ALT   ?? "";
const DEEPGRAM_STT_MODEL = process.env.DEEPGRAM_STT_MODEL ?? "nova-3";
const DEEPGRAM_TTS_MODEL = process.env.DEEPGRAM_TTS_MODEL ?? "aura-2-thalia-en";
const DEEPGRAM_LANGUAGE  = process.env.DEEPGRAM_LANGUAGE  ?? "en";

const STT_BASE = "https://api.deepgram.com/v1/listen";
const TTS_BASE = "https://api.deepgram.com/v1/speak";

const TIMEOUT_MS = 30_000;

// ── Status ──────────────────────────────────────────────────────────────────
export function isDeepgramConfigured(): boolean {
  return DEEPGRAM_API_KEY.length > 10 || DEEPGRAM_KEY_ALT.length > 10;
}

/** Returns the active key with dual-key failover */
function activeKey(): string {
  return DEEPGRAM_API_KEY.length > 10 ? DEEPGRAM_API_KEY : DEEPGRAM_KEY_ALT;
}

export interface DeepgramStatus {
  configured:        boolean;
  sttModel:          string;
  ttsModel:          string;
  defaultLanguage:   string;
  voiceInputReady:   boolean;
  voiceOutputReady:  boolean;
}

export function getDeepgramStatus(): DeepgramStatus {
  const configured = isDeepgramConfigured();
  return {
    configured,
    sttModel:         DEEPGRAM_STT_MODEL,
    ttsModel:         DEEPGRAM_TTS_MODEL,
    defaultLanguage:  DEEPGRAM_LANGUAGE,
    voiceInputReady:  configured,
    voiceOutputReady: configured,
  };
}

// ── STT — Speech to Text ────────────────────────────────────────────────────
export interface TranscribeOptions {
  language?:  string;
  model?:     string;
  mimeType?:  string;          // e.g. "audio/webm", "audio/mp4"
}

export interface TranscribeResult {
  ok:         boolean;
  transcript: string;
  provider:   "deepgram";
  language:   string;
  model:      string;
  error?:     string;
}

/**
 * Transcribe audio buffer using Deepgram STT.
 * @param buffer  Raw audio bytes
 * @param opts    Model/language overrides
 */
export async function transcribeAudio(
  buffer: ArrayBuffer,
  opts: TranscribeOptions = {}
): Promise<TranscribeResult> {
  const lang  = opts.language ?? DEEPGRAM_LANGUAGE;
  const model = opts.model    ?? DEEPGRAM_STT_MODEL;
  const mime  = opts.mimeType ?? "audio/webm";

  if (!isDeepgramConfigured()) {
    return {
      ok:         false,
      transcript: "",
      provider:   "deepgram",
      language:   lang,
      model,
      error:      "Deepgram not configured — DEEPGRAM_API_KEY missing",
    };
  }

  const params = new URLSearchParams({
    model,
    language:    lang,
    smart_format: "true",
    punctuate:   "true",
  });
  const url = `${STT_BASE}?${params}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: {
        Authorization:  `Token ${activeKey()}`,
        "Content-Type": mime,
      },
      body:   buffer,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok:         false,
        transcript: "",
        provider:   "deepgram",
        language:   lang,
        model,
        error:      `Deepgram STT HTTP ${res.status}: ${errText.slice(0, 120)}`,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    const transcript: string =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

    return { ok: true, transcript, provider: "deepgram", language: lang, model };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message.slice(0, 120) : "Unknown error";
    return {
      ok:         false,
      transcript: "",
      provider:   "deepgram",
      language:   lang,
      model,
      error:      `Deepgram STT error: ${msg}`,
    };
  }
}

// ── TTS — Text to Speech ────────────────────────────────────────────────────
export interface SynthesizeOptions {
  voice?:     string;  // Deepgram voice model e.g. "aura-2-thalia-en"
  encoding?:  "linear16" | "mp3" | "opus" | "flac" | "mulaw" | "ulaw";
  sampleRate?: number;
}

export interface SynthesizeResult {
  ok:        boolean;
  audioData?: ArrayBuffer;
  mimeType:  string;
  provider:  "deepgram";
  error?:    string;
}

/**
 * Synthesize speech from text using Deepgram TTS.
 * @param text  Text to speak (max ~2000 chars recommended)
 * @param opts  Voice model / encoding overrides
 */
export async function synthesizeSpeech(
  text: string,
  opts: SynthesizeOptions = {}
): Promise<SynthesizeResult> {
  const voice    = opts.voice    ?? DEEPGRAM_TTS_MODEL;
  const encoding = opts.encoding ?? "mp3";

  if (!isDeepgramConfigured()) {
    return {
      ok:       false,
      mimeType: "audio/mpeg",
      provider: "deepgram",
      error:    "Deepgram not configured — DEEPGRAM_API_KEY missing",
    };
  }

  const params = new URLSearchParams({ model: voice, encoding });
  const url    = `${TTS_BASE}?${params}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: {
        Authorization:  `Token ${activeKey()}`,
        "Content-Type": "application/json",
        Accept:         "audio/mpeg",
      },
      body:   JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok:       false,
        mimeType: "audio/mpeg",
        provider: "deepgram",
        error:    `Deepgram TTS HTTP ${res.status}: ${errText.slice(0, 120)}`,
      };
    }

    const audioData = await res.arrayBuffer();
    const mimeType  = res.headers.get("content-type") ?? "audio/mpeg";

    return { ok: true, audioData, mimeType, provider: "deepgram" };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message.slice(0, 120) : "Unknown error";
    return {
      ok:       false,
      mimeType: "audio/mpeg",
      provider: "deepgram",
      error:    `Deepgram TTS error: ${msg}`,
    };
  }
}
