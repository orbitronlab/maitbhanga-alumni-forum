'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ─────────────────────────────────────────────
// HomeLangToggle — Homepage-only language pill
// Sits inside the HeroSection, top-right corner
// Lucrative size, animated, highly visible
// ─────────────────────────────────────────────

export function HomeLangToggle() {
  const { language, setLanguage } = useLanguage();
  const isBangla = language === 'bn';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="inline-flex items-center rounded-full p-[3px] shadow-gold"
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.1) 100%)',
        border: '1.5px solid rgba(212,175,55,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* EN pill */}
      <button
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
        className="relative px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none"
        style={{ minWidth: 52 }}
      >
        {!isBangla && (
          <motion.span
            layoutId="home-lang-active"
            className="absolute inset-0 rounded-full bg-accent shadow-gold"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span
          className={`relative z-10 transition-colors duration-200 ${
            !isBangla ? 'text-primary-900' : 'text-white/70'
          }`}
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          EN
        </span>
      </button>

      {/* বাং pill */}
      <button
        onClick={() => setLanguage('bn')}
        aria-label="বাংলায় পরিবর্তন করুন"
        className="relative px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none"
        style={{ minWidth: 52 }}
      >
        {isBangla && (
          <motion.span
            layoutId="home-lang-active"
            className="absolute inset-0 rounded-full bg-accent shadow-gold"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span
          className={`relative z-10 transition-colors duration-200 ${
            isBangla ? 'text-primary-900' : 'text-white/70'
          }`}
          style={{ fontFamily: 'var(--font-noto), serif' }}
        >
          বাং
        </span>
      </button>
    </motion.div>
  );
}
