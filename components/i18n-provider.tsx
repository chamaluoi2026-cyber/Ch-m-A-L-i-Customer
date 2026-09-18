"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations, Translations } from "@/lib/i18n/translations";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: "vi",
  setLanguage: () => {},
  t: translations.vi
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cham_aluoi_lang") as Language;
      if (saved === "vi" || saved === "en") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("cham_aluoi_lang", lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  };

  const t = translations[language] || translations.vi;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  return useContext(I18nContext);
}
