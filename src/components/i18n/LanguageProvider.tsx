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
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getLanguage, SITE_LANGUAGES, type SiteLanguage } from "@/lib/i18n/languages";
import { buildTranslator, type DictionaryKey } from "@/lib/i18n/dictionary";

const STORAGE_KEY = "wwai_language";

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>("en");

  // Restore from localStorage on mount (client only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SITE_LANGUAGES.some((l) => l.code === saved)) {
        setLang(saved);
      }
    } catch {
      // localStorage unavailable (SSR / private browsing)
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    const found = SITE_LANGUAGES.find((l) => l.code === code);
    if (!found) return;
    setLang(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch { /* ignore */ }
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
