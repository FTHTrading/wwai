/**
 * src/lib/wwai/providers.ts
 * WWAI LLM provider abstraction — server-side only.
 * Priority: OpenAI → Ollama → deterministic fallback.
 *
 * No OpenAI SDK dependency required — uses raw fetch against the Chat Completions API.
 * Set OPENAI_API_KEY and/or OLLAMA_BASE_URL in your environment (never NEXT_PUBLIC_).
 */

// ── Config ─────────────────────────────────────────────────────────────────
const OPENAI_API_KEY  = process.env.OPENAI_API_KEY  ?? "";
const OPENAI_MODEL    = process.env.OPENAI_MODEL    ?? "gpt-4o-mini";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL    = process.env.OLLAMA_MODEL    ?? "qwen2.5:7b";

const PROVIDER_TIMEOUT_MS = 20_000;

export type WWAIProvider = "openai" | "ollama" | "deterministic";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ProviderResult {
  ok: boolean;
  text: string;
  provider: WWAIProvider;
  model: string;
  latencyMs: number;
  error?: string;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Provider timeout after ${ms}ms`)), ms)
    ),
  ]);
}

function sanitizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  // Strip endpoint URLs from error messages before they reach logs/clients
  return msg.replace(/https?:\/\/[^\s,]+/g, "<endpoint>").slice(0, 200);
}

// ── OpenAI provider ────────────────────────────────────────────────────────
export async function callOpenAI(messages: LLMMessage[]): Promise<ProviderResult> {
  const start = Date.now();
  try {
    const res = await withTimeout(
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages,
          max_tokens: 512,
          temperature: 0.5,
        }),
      }),
      PROVIDER_TIMEOUT_MS
    );

    if (!res.ok) {
      const errMsg =
        res.status === 401 ? "OpenAI authentication error — check OPENAI_API_KEY"
        : res.status === 429 ? "OpenAI rate limit exceeded"
        : `OpenAI HTTP ${res.status}`;
      return { ok: false, text: "", provider: "openai", model: OPENAI_MODEL, latencyMs: Date.now() - start, error: errMsg };
    }

    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? "";
    if (!text) {
      return { ok: false, text: "", provider: "openai", model: OPENAI_MODEL, latencyMs: Date.now() - start, error: "Empty response from OpenAI" };
    }
    return { ok: true, text, provider: "openai", model: OPENAI_MODEL, latencyMs: Date.now() - start };
  } catch (err) {
    return { ok: false, text: "", provider: "openai", model: OPENAI_MODEL, latencyMs: Date.now() - start, error: sanitizeError(err) };
  }
}

// ── Ollama provider ────────────────────────────────────────────────────────
export async function callOllama(messages: LLMMessage[]): Promise<ProviderResult> {
  const start = Date.now();
  const url = `${OLLAMA_BASE_URL}/api/chat`;
  try {
    const res = await withTimeout(
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages,
          stream: false,
        }),
      }),
      PROVIDER_TIMEOUT_MS
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, text: "", provider: "ollama", model: OLLAMA_MODEL, latencyMs: Date.now() - start, error: `Ollama HTTP ${res.status}: ${body.slice(0, 100)}` };
    }

    const json = await res.json();
    const text: string = json?.message?.content ?? "";
    if (!text) {
      return { ok: false, text: "", provider: "ollama", model: OLLAMA_MODEL, latencyMs: Date.now() - start, error: "Empty response from Ollama" };
    }
    return { ok: true, text, provider: "ollama", model: OLLAMA_MODEL, latencyMs: Date.now() - start };
  } catch (err) {
    return { ok: false, text: "", provider: "ollama", model: OLLAMA_MODEL, latencyMs: Date.now() - start, error: sanitizeError(err) };
  }
}

// ── Provider availability checks ───────────────────────────────────────────
export function isOpenAIConfigured(): boolean {
  return OPENAI_API_KEY.length > 0;
}

export function isOllamaConfigured(): boolean {
  return OLLAMA_BASE_URL.length > 0;
}

export function getProviderPriority(): WWAIProvider[] {
  const p: WWAIProvider[] = [];
  if (isOpenAIConfigured()) p.push("openai");
  if (isOllamaConfigured()) p.push("ollama");
  p.push("deterministic");
  return p;
}

// ── Main dispatch ──────────────────────────────────────────────────────────
// Tries providers in priority order; falls back to deterministic on failure.
export async function dispatchToProvider(
  messages: LLMMessage[],
  deterministicAnswer: string
): Promise<ProviderResult> {
  if (isOpenAIConfigured()) {
    const result = await callOpenAI(messages);
    if (result.ok) return result;
    // Fall through to Ollama
  }

  if (isOllamaConfigured()) {
    const result = await callOllama(messages);
    if (result.ok) return result;
    // Fall through to deterministic
  }

  // Deterministic fallback — always succeeds
  return {
    ok: true,
    text: deterministicAnswer,
    provider: "deterministic",
    model: "keyword-rag",
    latencyMs: 0,
  };
}
