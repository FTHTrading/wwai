"use client";

/**
 * src/components/i18n/LanguageProvider.tsx
 * Site-wide language context — wraps the app for WWAI multilingual support.
 *
 * Persists selected language to localStorage.
 * Sets document.documentElement.dir and lang for RTL support (Arabic etc).
 */

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getLanguage, SITE_LANGUAGES, type SiteLanguage } from "@/lib/i18n/languages";
import { buildTranslator, type DictionaryKey } from "@/lib/i18n/dictionary";

const STORAGE_KEY = "wwai_language";
const CHANGE_EVENT = "wwai-language-change";

interface LanguageContextValue {
  lang:        string;
  language:    SiteLanguage;
  setLanguage: (code: string) => void;
  dir:         "ltr" | "rtl";
  t:           (key: DictionaryKey) => string;
  languages:   SiteLanguage[];
}

const LanguageContext = createContext<LanguageContextValue>({
  lang:        "en",
  language:    SITE_LANGUAGES[0],
  setLanguage: () => {},
  dir:         "ltr",
  t:           buildTranslator("en"),
  languages:   SITE_LANGUAGES,
});

// External store for language — keeps localStorage as the source of truth
// without violating react-hooks/set-state-in-effect.
function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

function getSnapshot(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SITE_LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    // localStorage unavailable
  }
  return "en";
}

function getServerSnapshot(): string {
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((code: string) => {
    if (!SITE_LANGUAGES.some((l) => l.code === code)) return;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
  }, []);

  // Apply dir + lang to <html> whenever language changes
  useEffect(() => {
    const langObj = getLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir  = langObj.dir;
  }, [lang]);

  const language = getLanguage(lang);
  const dir      = language.dir;
  const t        = buildTranslator(lang);

  return (
    <LanguageContext.Provider value={{ lang, language, setLanguage, dir, t, languages: SITE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
