import { NextRequest, NextResponse } from "next/server";
import { localAiChat, AiMessage } from "@/lib/ai";
import { getPreset } from "@/lib/ai-prompts";

const MAX_MESSAGES      = 20;
const MAX_CONTENT_CHARS = 4_000;
const MAX_BODY_BYTES    = 32_768;

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const raw = (body as Record<string, unknown>).messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  if (raw.length > MAX_MESSAGES) {
    return NextResponse.json({ error: `Too many messages (max ${MAX_MESSAGES})` }, { status: 400 });
  }

  const messages: AiMessage[] = [];
  for (const m of raw) {
    if (typeof m !== "object" || m === null) {
      return NextResponse.json({ error: "Each message must be an object" }, { status: 400 });
    }
    const msg = m as Record<string, unknown>;
    const role    = msg.role;
    const content = msg.content;
    if (role !== "system" && role !== "user" && role !== "assistant") {
      return NextResponse.json({ error: `Invalid role: ${String(role)}` }, { status: 400 });
    }
    if (typeof content !== "string" || content.length === 0) {
      return NextResponse.json({ error: "Each message must have a non-empty content string" }, { status: 400 });
    }
    if (content.length > MAX_CONTENT_CHARS) {
      return NextResponse.json({ error: `Message content too long (max ${MAX_CONTENT_CHARS} chars)` }, { status: 400 });
    }
    messages.push({ role, content });
  }

  // Optional preset — look up server-side system prompt (never exposed to client)
  const presetId     = typeof (body as Record<string, unknown>).preset === "string"
    ? (body as Record<string, unknown>).preset as string
    : undefined;
  const systemPrompt = presetId ? getPreset(presetId)?.systemPrompt : undefined;

  const result = await localAiChat(messages, systemPrompt);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "All AI providers unavailable", provider: result.provider },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok:        true,
    provider:  result.provider,
    model:     result.model,
    text:      result.text,
    status:    result.status,
    latencyMs: result.latencyMs,
    preset:    presetId ?? null,
  });
}

