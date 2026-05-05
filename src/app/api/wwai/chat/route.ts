/**
 * src/app/api/wwai/chat/route.ts
 * WWAI real AI concierge endpoint — server-side only.
 * POST /api/wwai/chat
 *
 * Pipeline:
 *   1. Input validation + size limits
 *   2. Intent classification
 *   3. Safety guardrails (blocks restricted + injection attempts)
 *   4. RAG retrieval from demo data
 *   5. Deterministic answer construction
 *   6. LLM enhancement if provider is configured (OpenAI → Ollama → skip)
 *   7. Structured JSON response
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { classifyIntent, isRestrictedIntent } from "@/lib/wwai/intent";
import { applyWWAIPolicy, appendNightlifeNotice, appendDemoNotice } from "@/lib/wwai/guardrails";
import { retrieveWWAIContext, formatContextForPrompt, getSuggestedActions, getSourceLabels } from "@/lib/wwai/retrieval";
import { buildDeterministicAnswer } from "@/lib/wwai/deterministic";
import { buildSystemPrompt } from "@/lib/wwai/systemPrompt";
import { dispatchToProvider, isOpenAIConfigured, isOllamaConfigured } from "@/lib/wwai/providers";
import type { LLMMessage } from "@/lib/wwai/providers";

const MAX_MESSAGE_LENGTH = 500;
const MAX_BODY_BYTES     = 8_192;

export interface WWAIChatRequest {
  message: string;
  language?: string;
  context?: {
    currentHotel?: string;
    currentZone?: string;
    routeMode?: string;
    userType?: string;
  };
}

export interface WWAIAction {
  label: string;
  href: string;
}

export interface WWAIChatResponse {
  answer: string;
  intent: string;
  sources: string[];
  actions: WWAIAction[];
  demoOnly: boolean;
  provider: "openai" | "ollama" | "deterministic";
  safetyNotice?: string;
  latencyMs?: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Size guard ────────────────────────────────────────────────────────────
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Object body required" }, { status: 400 });
  }

  const { message, language = "en", context = {} } = body as Record<string, unknown>;

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const cleanMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  const lang = typeof language === "string" ? language : "en";
  const ctx = typeof context === "object" && context !== null ? context as WWAIChatRequest["context"] : {};

  const start = Date.now();

  // ── 1. Intent classification ───────────────────────────────────────────────
  const intent = classifyIntent(cleanMessage);

  // ── 2. Safety guardrails ───────────────────────────────────────────────────
  const guardrail = applyWWAIPolicy(cleanMessage, intent);
  if (guardrail.blocked) {
    const response: WWAIChatResponse = {
      answer:       guardrail.redirectMessage ?? "I can't help with that request.",
      intent,
      sources:      [],
      actions:      getSuggestedActions(intent, [], true),
      demoOnly:     true,
      provider:     "deterministic",
      safetyNotice: guardrail.safetyNotice,
      latencyMs:    Date.now() - start,
    };
    return NextResponse.json(response);
  }

  // ── 3. RAG retrieval ───────────────────────────────────────────────────────
  const ragContext = retrieveWWAIContext(cleanMessage, intent);

  // ── 4. Deterministic answer ────────────────────────────────────────────────
  let deterministicAnswer = buildDeterministicAnswer(intent, ragContext.records, ctx);

  // Append nightlife notice for bar queries
  if (intent === "bars_nightlife") {
    deterministicAnswer = appendNightlifeNotice(deterministicAnswer);
  }

  // ── 5. LLM enhancement (if provider configured) ───────────────────────────
  const contextSnippet = formatContextForPrompt(ragContext);
  const systemPrompt   = buildSystemPrompt(lang);

  const llmMessages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
  ];

  if (contextSnippet) {
    llmMessages.push({
      role: "system",
      content: contextSnippet,
    });
  }

  llmMessages.push({ role: "user", content: cleanMessage });

  const providerResult = await dispatchToProvider(llmMessages, deterministicAnswer);

  // If LLM returned something, use it; otherwise fall back to deterministic
  let finalAnswer = providerResult.ok && providerResult.provider !== "deterministic"
    ? providerResult.text
    : deterministicAnswer;

  // Always label demo data
  finalAnswer = appendDemoNotice(finalAnswer);

  // ── 6. Build response ──────────────────────────────────────────────────────
  const sources = getSourceLabels(ragContext.records);
  const actions = getSuggestedActions(intent, ragContext.records, isRestrictedIntent(intent));

  const response: WWAIChatResponse = {
    answer:   finalAnswer,
    intent,
    sources,
    actions,
    demoOnly: true,
    provider: providerResult.provider,
    latencyMs: Date.now() - start,
  };

  if (guardrail.safetyNotice) {
    response.safetyNotice = guardrail.safetyNotice;
  }

  return NextResponse.json(response);
}

// ── GET — quick health check ───────────────────────────────────────────────
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok:                 true,
    openaiConfigured:   isOpenAIConfigured(),
    ollamaConfigured:   isOllamaConfigured(),
    ragMode:            "keyword-demo",
    demoOnly:           true,
  });
}
