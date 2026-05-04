// src/lib/ai.ts — Local AI provider router (NIM primary, Ollama fallback)
// Server-side only. No secrets are exposed to the client.

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const NIM_BASE_URL =
  process.env.NIM_BASE_URL ?? "http://localhost:8800/v1";

export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

export const NIM_MODEL =
  process.env.NIM_MODEL ?? "nvidia/llama-3.1-nemotron-nano-8b-v1";

export const OLLAMA_FALLBACK_MODEL =
  process.env.OLLAMA_FALLBACK_MODEL ?? "qwen2.5:7b";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HEALTH_TIMEOUT_MS  = 8_000;
const CHAT_TIMEOUT_MS    = 60_000;
const MAX_INPUT_TOTAL    = 16_000;  // total chars across all messages
const MAX_INPUT_PER_MSG  = 4_000;   // chars per individual message

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface HealthResult {
  ok:        boolean;
  provider:  string;
  endpoint:  string;
  model?:    string;
  latencyMs: number;
  error?:    string;
}

export interface AiResult {
  ok:        boolean;
  provider:  "nim" | "ollama" | "none";
  model:     string;
  text:      string;
  latencyMs: number;
  status:    "live" | "fallback" | "offline";
  error?:    string;
}

/** @deprecated Use AiResult */
export type ChatResult = AiResult;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

/** Strip raw endpoint URLs from error strings so they never leak to logs/clients. */
function sanitizeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw.replace(/https?:\/\/[^\s,]+/g, "<endpoint>").slice(0, 200);
}

/** Translate HTTP status codes into readable, provider-neutral messages. */
function normalizeHttpError(status: number, body: string): string {
  if (status === 401) return "Authentication error — check provider API key";
  if (status === 429) return "Rate limit exceeded";
  if (status === 503) return "Provider temporarily unavailable";
  if (status >= 500)  return `Provider server error (HTTP ${status})`;
  return `HTTP ${status}: ${body.slice(0, 100)}`;
}

/** Return an error string if the message array exceeds input size limits. */
function guardInputSize(messages: AiMessage[]): string | null {
  const total = messages.reduce((s, m) => s + m.content.length, 0);
  if (total > MAX_INPUT_TOTAL)
    return `Input too large (${total} chars, max ${MAX_INPUT_TOTAL})`;
  for (const m of messages) {
    if (m.content.length > MAX_INPUT_PER_MSG)
      return `Single message too large (${m.content.length} chars, max ${MAX_INPUT_PER_MSG})`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Health checks
// ---------------------------------------------------------------------------

export async function checkNimHealth(): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await withTimeout(
      fetch(`${NIM_BASE_URL}/models`, { method: "GET" }),
      HEALTH_TIMEOUT_MS
    );
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, provider: "nim", endpoint: NIM_BASE_URL, latencyMs,
               error: normalizeHttpError(res.status, body) };
    }
    const json = await res.json();
    const model = json?.data?.[0]?.id ?? NIM_MODEL;
    return { ok: true, provider: "nim", endpoint: NIM_BASE_URL, model, latencyMs };
  } catch (err) {
    return { ok: false, provider: "nim", endpoint: NIM_BASE_URL,
             latencyMs: Date.now() - start, error: sanitizeError(err) };
  }
}

export async function checkOllamaHealth(): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await withTimeout(
      fetch(`${OLLAMA_BASE_URL}/api/tags`, { method: "GET" }),
      HEALTH_TIMEOUT_MS
    );
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, provider: "ollama", endpoint: OLLAMA_BASE_URL, latencyMs,
               error: normalizeHttpError(res.status, body) };
    }
    const json = await res.json();
    const models: string[] = (json?.models ?? []).map((m: { name: string }) => m.name);
    return { ok: true, provider: "ollama", endpoint: OLLAMA_BASE_URL,
             model: models.join(", ").slice(0, 120), latencyMs };
  } catch (err) {
    return { ok: false, provider: "ollama", endpoint: OLLAMA_BASE_URL,
             latencyMs: Date.now() - start, error: sanitizeError(err) };
  }
}

// ---------------------------------------------------------------------------
// Chat — NIM (OpenAI-compatible /chat/completions)
// ---------------------------------------------------------------------------

export async function chatWithNim(messages: AiMessage[]): Promise<AiResult> {
  const start = Date.now();
  const guard = guardInputSize(messages);
  if (guard) {
    return { ok: false, provider: "nim", model: NIM_MODEL, text: "",
             latencyMs: 0, status: "offline", error: guard };
  }
  try {
    const res = await withTimeout(
      fetch(`${NIM_BASE_URL}/chat/completions`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ model: NIM_MODEL, messages, max_tokens: 512 }),
      }),
      CHAT_TIMEOUT_MS
    );
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, provider: "nim", model: NIM_MODEL, text: "", latencyMs,
               status: "offline", error: normalizeHttpError(res.status, body) };
    }
    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? "";
    return { ok: true, provider: "nim", model: json?.model ?? NIM_MODEL,
             text, latencyMs, status: "live" };
  } catch (err) {
    console.error("[ai:nim]", sanitizeError(err));
    return { ok: false, provider: "nim", model: NIM_MODEL, text: "",
             latencyMs: Date.now() - start, status: "offline", error: sanitizeError(err) };
  }
}

// ---------------------------------------------------------------------------
// Chat — Ollama (/api/chat messages API)
// ---------------------------------------------------------------------------

export async function chatWithOllama(messages: AiMessage[]): Promise<AiResult> {
  const start = Date.now();
  const guard = guardInputSize(messages);
  if (guard) {
    return { ok: false, provider: "ollama", model: OLLAMA_FALLBACK_MODEL, text: "",
             latencyMs: 0, status: "offline", error: guard };
  }
  try {
    const res = await withTimeout(
      fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ model: OLLAMA_FALLBACK_MODEL, messages, stream: false }),
      }),
      CHAT_TIMEOUT_MS
    );
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, provider: "ollama", model: OLLAMA_FALLBACK_MODEL, text: "", latencyMs,
               status: "offline", error: normalizeHttpError(res.status, body) };
    }
    const json = await res.json();
    // /api/chat response: { message: { role, content }, done: true }
    const text: string = json?.message?.content ?? json?.response ?? "";
    return { ok: true, provider: "ollama", model: OLLAMA_FALLBACK_MODEL,
             text, latencyMs, status: "fallback" };
  } catch (err) {
    console.error("[ai:ollama]", sanitizeError(err));
    return { ok: false, provider: "ollama", model: OLLAMA_FALLBACK_MODEL, text: "",
             latencyMs: Date.now() - start, status: "offline", error: sanitizeError(err) };
  }
}

// ---------------------------------------------------------------------------
// Provider router — NIM primary → Ollama fallback
// ---------------------------------------------------------------------------

export async function localAiChat(
  messages:     AiMessage[],
  systemPrompt?: string,
): Promise<AiResult> {
  const fullMessages: AiMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  const guard = guardInputSize(fullMessages);
  if (guard) {
    return { ok: false, provider: "none", model: "", text: "",
             latencyMs: 0, status: "offline", error: guard };
  }

  const nimResult = await chatWithNim(fullMessages);
  if (nimResult.ok) return nimResult;

  const ollamaResult = await chatWithOllama(fullMessages);
  if (ollamaResult.ok) return ollamaResult;

  return {
    ok: false, provider: "none", model: "", text: "", status: "offline",
    latencyMs: nimResult.latencyMs + ollamaResult.latencyMs,
    error: `NIM: ${nimResult.error ?? "unavailable"} | Ollama: ${ollamaResult.error ?? "unavailable"}`,
  };
}
