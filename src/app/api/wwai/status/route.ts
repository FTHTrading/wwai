/**
 * src/app/api/wwai/status/route.ts
 * WWAI provider status — used by /agent-system and /settings/integrations
 */

export const runtime = 'edge';

import { NextResponse } from "next/server";
import { isOpenAIConfigured, isOllamaConfigured, getProviderPriority } from "@/lib/wwai/providers";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    openaiConfigured:  isOpenAIConfigured(),
    ollamaConfigured:  isOllamaConfigured(),
    providerPriority:  getProviderPriority(),
    ragMode:           "keyword-demo",
    liveDataConfigured: false,
    demoOnly:          true,
  });
}
