import { NextResponse } from "next/server";
import { AI_PRESETS, getPresetPublic } from "@/lib/ai-prompts";

// GET /api/ai/presets
// Returns public preset metadata only — no system prompt content.
export async function GET() {
  return NextResponse.json({
    ok:      true,
    presets: AI_PRESETS.map(getPresetPublic),
  });
}
