/**
 * src/lib/i18n/languages.ts
 * WWAI supported site languages.
 *
 * deepgramSupported: true  → Deepgram Flux multilingual STT/TTS supports this language.
 * deepgramSupported: false → Text UI works; voice uses demo/browser fallback until confirmed.
 *
 * Deepgram Flux supports: en, es, de, fr, hi, ru, pt, ja, it, nl.
 * Arabic (ar) and Mandarin (zh) are WWAI UI-only for now — no confirmed Deepgram voice model.
 */

export interface SiteLanguage {
  code:              string;
  label:             string;
  nativeLabel:       string;
  dir:               "ltr" | "rtl";
  deepgramSupported: boolean;
  deepgramModel?:    string;       // STT model override when different from default
  demoOnlyNotice?:   string;       // shown in UI when voice is not available for this lang
}

export const SITE_LANGUAGES: SiteLanguage[] = [
  {
    code:              "en",
    label:             "English",
    nativeLabel:       "English",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "es",
    label:             "Spanish",
    nativeLabel:       "Español",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "fr",
    label:             "French",
    nativeLabel:       "Français",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "de",
    label:             "German",
    nativeLabel:       "Deutsch",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "pt",
    label:             "Portuguese",
    nativeLabel:       "Português",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "ja",
    label:             "Japanese",
    nativeLabel:       "日本語",
    dir:               "ltr",
    deepgramSupported: true,
    deepgramModel:     "nova-3",
  },
  {
    code:              "zh",
    label:             "Chinese",
    nativeLabel:       "中文",
    dir:               "ltr",
    deepgramSupported: false,
    demoOnlyNotice:    "Voice input not yet available for Mandarin. Text chat works in all languages.",
  },
  {
    code:              "ar",
    label:             "Arabic",
    nativeLabel:       "العربية",
    dir:               "rtl",
    deepgramSupported: false,
    demoOnlyNotice:    "Voice input not yet available for Arabic. Text chat works in all languages.",
  },
];

export const SITE_LANGUAGE_CODES = SITE_LANGUAGES.map((l) => l.code);

export function getLanguage(code: string): SiteLanguage {
  return SITE_LANGUAGES.find((l) => l.code === code) ?? SITE_LANGUAGES[0];
}

export const DEEPGRAM_VOICE_LANGUAGES = SITE_LANGUAGES
  .filter((l) => l.deepgramSupported)
  .map((l) => l.code);
