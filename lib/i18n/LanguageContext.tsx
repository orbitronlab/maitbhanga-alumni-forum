'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, translations, TranslationKeys } from '@/lib/i18n/translations';

// ─────────────────────────────────────────────
// Language Context
// ─────────────────────────────────────────────

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
      document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'en' ? 'bn' : 'en';
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', next);
        document.documentElement.lang = next === 'bn' ? 'bn' : 'en';
      }
      return next;
    });
  }, []);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language | null;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
      document.documentElement.lang = saved === 'bn' ? 'bn' : 'en';
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
