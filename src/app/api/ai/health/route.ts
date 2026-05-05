export const runtime = 'edge';

import { NextResponse } from "next/server";
import { checkNimHealth, checkOllamaHealth } from "@/lib/ai";

export async function GET() {
  const [nim, ollama] = await Promise.all([checkNimHealth(), checkOllamaHealth()]);

  const recommendedProvider: "nim" | "ollama" | "none" = nim.ok
    ? "nim"
    : ollama.ok
    ? "ollama"
    : "none";

  return NextResponse.json({
    ok: nim.ok || ollama.ok,
    providers: {
      nim: {
        ok: nim.ok,
        endpoint: nim.endpoint,
        model: nim.model,
        latencyMs: nim.latencyMs,
        error: nim.error,
      },
      ollama: {
        ok: ollama.ok,
        endpoint: ollama.endpoint,
        model: ollama.model,
        latencyMs: ollama.latencyMs,
        error: ollama.error,
      },
    },
    recommendedProvider,
  });
}
