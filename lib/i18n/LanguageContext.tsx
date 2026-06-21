'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

const translations = {
    en: {
          hero: {
                  badge: 'Established 1950 \u00b7 Sandwip, Chattogram',
                  title: 'Welcome to',
                  titleHighlight: 'Maitbhanga',
                  titleSuffix: 'Alumni Forum',
                  subtitle: 'Reconnect with thousands of proud alumni. Celebrate shared memories, participate in events, support school development, and build lasting bonds with your alma mater.',
                  joinBtn: 'Join Our Community',
                  findBtn: 'Find Alumni',
                  statAlumni: 'Alumni Members',
                  statBatches: 'Active Batches',
                  statEvents: 'Events Organized',
                  cardAlumni: 'Total Alumni',
                  cardLife: 'Life Members',
                  cardCountries: 'Countries',
                  cardEvents: 'Events This Year',
                  schoolInfo: 'Maitbhanga High School',
                  schoolSub: 'Est. 1950 \u00b7 Sandwip, Chattogram',
                  active: 'Active',
                  legacy: '75+ Years Legacy',
                  joinToday: '\uD83C\uDF93 Join Today',
                  legacyBadge: '\u2764\uFE0F 75+ Year Legacy'
          }
    },
    bn: {
          hero: {
                  badge: 'Protishthito 1950 \u00b7 Sandwip, Chattogram',
                  title: 'Maitbhanga',
                  titleHighlight: 'Alumni Forum-e',
                  titleSuffix: 'Shagotom',
                  subtitle: 'Maitbhanga High School-er proktton chatro-chatrider official platform-e shagotom. Reconnect krun, sriti charon krun, ebong school development-e ongshogrohon krun.',
                  joinBtn: 'Amader community-te jog din',
                  findBtn: 'Alumni khujun',
                  statAlumni: 'Alumni Shodossho',
                  statBatches: 'Sokriy Batch',
                  statEvents: 'Ayojito Anushthan',
                  cardAlumni: 'Mot Alumni',
                  cardLife: 'Ajibon Shodossho',
                  cardCountries: 'Deshshomuho',
                  cardEvents: 'Eibochorer Anushthan',
                  schoolInfo: 'Maitbhanga High School',
                  schoolSub: 'Protishthito 1950 \u00b7 Sandwip, Chattogram',
                  active: 'Sokriy',
                  legacy: '75+ Bochorer Oitijhyo',
                  joinToday: '\uD83C\uDF93 Jog Din',
                  legacyBadge: '\u2764\uFE0F 75+ Bochorer Oitijhyo'
          }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang === 'en' || savedLang === 'bn') {
                setLanguage(savedLang);
        }
  }, []);

  const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
  };

  return React.createElement(
        LanguageContext.Provider,
    { value: { language, setLanguage: handleSetLanguage, t: translations[language] } },
        children
      );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
          throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
