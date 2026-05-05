/**
 * src/lib/wwai/guardrails.ts
 * WWAI safety guardrails — server-side only.
 * Enforces content policy before any LLM call and before response delivery.
 */

import type { WWAIIntent } from "./intent";

export interface GuardrailResult {
  blocked: boolean;
  safetyNotice?: string;
  redirectMessage?: string;
}

// ── Adult / restricted content patterns ────────────────────────────────────
const RESTRICTED_INPUT_PATTERNS = [
  /strip\s*club/i,
  /adult\s*club/i,
  /erotic/i,
  /escort/i,
  /sexual\s*service/i,
  /\bporn\b/i,
  /adult\s*entertainment/i,
  /\bsex\s*shop\b/i,
  /gentlemen'?s?\s*club/i,
  /nude\s*bar/i,
  /topless/i,
];

// ── Prompt injection patterns ──────────────────────────────────────────────
// Detect attempts to override system prompt or leak instructions.
const INJECTION_PATTERNS = [
  /ignore\s+(previous|prior|above|all)\s+instructions/i,
  /disregard\s+(your|all|previous)\s+(instructions|rules|guidelines)/i,
  /you\s+are\s+now\s+(?:a\s+)?(?:different|evil|jailbroken|DAN)/i,
  /\[system\]/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /print\s+(your\s+)?(system\s+)?prompt/i,
  /override\s+(safety|policy|guardrail)/i,
];

export function detectRestrictedRequest(message: string): boolean {
  return RESTRICTED_INPUT_PATTERNS.some((p) => p.test(message));
}

export function detectPromptInjection(message: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(message));
}

export function applyWWAIPolicy(message: string, intent: WWAIIntent): GuardrailResult {
  // 1. Prompt injection check
  if (detectPromptInjection(message)) {
    return {
      blocked: true,
      safetyNotice: "WWAI cannot process that type of request.",
      redirectMessage:
        "I'm here to help with restaurants, hotels, pickup zones, routes, and sponsor offers. What can I help you find?",
    };
  }

  // 2. Adult / restricted content
  if (intent === "adult_or_restricted" || detectRestrictedRequest(message)) {
    return {
      blocked: true,
      safetyNotice:
        "Adult-only venue recommendations are outside WWAI's service scope.",
      redirectMessage:
        "I can't help find adult-only entertainment venues. I can help you find restaurants, hotels, public nightlife districts, driver pickup zones, sponsor offers, or safety-informed public routes.",
    };
  }

  // 3. Emergency language — do not replace emergency services
  const emergencyKeywords = /\b(emergency|911|fire|police|ambulance|dying|overdose|assault|robbery)\b/i;
  if (emergencyKeywords.test(message)) {
    return {
      blocked: false,
      safetyNotice:
        "For emergencies, contact local emergency services immediately. WWAI cannot substitute for emergency response.",
    };
  }

  return { blocked: false };
}

export function buildSafetyResponse(
  intent: WWAIIntent,
  language?: string
): string {
  void language;
  if (intent === "adult_or_restricted") {
    return (
      "I can't help find adult-only entertainment venues. " +
      "I can help you find restaurants, hotels, public nightlife districts, " +
      "driver pickup zones, sponsor offers, or safety-informed public routes."
    );
  }
  return "I'm here to help with directions, dining, lodging, and event services.";
}

/** Append required notices to bar/nightlife responses. */
export function appendNightlifeNotice(text: string): string {
  return (
    text +
    "\n\n⚠️ Age restrictions apply. Please carry valid ID. " +
    "Use verified transportation and check local regulations."
  );
}

/** Append demo data notice. */
export function appendDemoNotice(text: string): string {
  return text + "\n\n_[Demo data — not affiliated with any protected brand. Production requires live integrations.]_";
}
