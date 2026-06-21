'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ─────────────────────────────────────────────────────────────────
// Premium Language Toggle — EN ↔ বাং
// Animated sliding pill switcher for the Navbar
// Works on transparent (dark hero) AND scrolled (light/white) modes
// ─────────────────────────────────────────────────────────────────

interface LanguageToggleProps {
  /** Pass scrolled=true when the navbar has a light background */
  scrolled?: boolean;
}

export function LanguageToggle({ scrolled = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const isBangla = language === 'bn';

  return (
    <button
      onClick={() => setLanguage(isBangla ? 'en' : 'bn')}
      aria-label={isBangla ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
      className={`
        relative flex items-center rounded-full overflow-hidden cursor-pointer select-none
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70
        ${scrolled
          ? 'border border-primary/20 bg-primary/5 hover:border-accent/50'
          : 'border border-white/25 bg-white/10 hover:bg-white/15 hover:border-accent/50 backdrop-blur-sm'
        }
      `}
      style={{ width: 76, height: 32 }}
      title={isBangla ? 'Switch to English' : 'Switch to বাংলা'}
    >
      {/* Sliding gold pill */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 38 }}
        className="absolute top-[3px] bottom-[3px] w-[50%] rounded-full bg-gradient-to-r from-accent-600 to-accent shadow-gold z-10"
        style={{ left: isBangla ? 'calc(50% - 1px)' : '3px' }}
      />

      {/* EN */}
      <span
        className={`
          relative z-20 flex-1 text-center text-[11px] font-extrabold tracking-wide
          transition-colors duration-200
          ${!isBangla
            ? 'text-primary-900'
            : scrolled ? 'text-primary/50' : 'text-white/55'
          }
        `}
        style={{ fontFamily: 'var(--font-outfit), system-ui, sans-serif' }}
      >
        EN
      </span>

      {/* বাং */}
      <span
        className={`
          relative z-20 flex-1 text-center text-[11px] font-bold
          transition-colors duration-200
          ${isBangla
            ? 'text-primary-900'
            : scrolled ? 'text-primary/50' : 'text-white/55'
          }
        `}
        style={{ fontFamily: 'var(--font-noto), serif', fontSize: '12px' }}
      >
        বাং
      </span>
    </button>
  );
}
