export const runtime = 'edge';

/**
 * src/app/api/wwai/status/route.ts
 * WWAI provider status — used by /agent-system and /settings/integrations
 */

import { NextResponse } from "next/server";
import { isOpenAIConfigured, isOllamaConfigured, getProviderPriority } from "@/lib/wwai/providers";
import { isDeepgramConfigured, getDeepgramStatus } from "@/lib/voice/deepgram";
import { SITE_LANGUAGE_CODES, DEEPGRAM_VOICE_LANGUAGES } from "@/lib/i18n/languages";

export async function GET(): Promise<NextResponse> {
  const deepgramStatus = getDeepgramStatus();
  const priority       = getProviderPriority();

  return NextResponse.json({
    openaiConfigured:       isOpenAIConfigured(),
    ollamaConfigured:       isOllamaConfigured(),
    providerPriority:       priority,
    chatProvider:           priority[0] ?? "deterministic",
    ragMode:                "keyword-demo",
    liveDataConfigured:     false,
    demoOnly:               true,
    deepgramConfigured:     isDeepgramConfigured(),
    voiceInputConfigured:   deepgramStatus.voiceInputReady,
    voiceOutputConfigured:  deepgramStatus.voiceOutputReady,
    deepgramSttModel:       deepgramStatus.sttModel,
    deepgramTtsModel:       deepgramStatus.ttsModel,
    siteLanguages:          SITE_LANGUAGE_CODES,
    deepgramVoiceLanguages: DEEPGRAM_VOICE_LANGUAGES,
  });
}
