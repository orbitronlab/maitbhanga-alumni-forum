'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from './ThemeContext';

// ─────────────────────────────────────────────────────────────────
// NavbarToggles — Language (EN↔বাং) + Dark/Light mode
// Sits in the navbar right before the Donate button / auth section
// Sliding pill style, premium look
// ─────────────────────────────────────────────────────────────────

interface NavbarTogglesProps {
  scrolled: boolean;
}

export function NavbarToggles({ scrolled }: NavbarTogglesProps) {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isBangla = language === 'bn';
  const isDark = theme === 'dark';

  const pillBase = scrolled
    ? 'border border-gray-200 dark:border-white/20 bg-gray-100 dark:bg-white/10'
    : 'border border-white/30 bg-white/10 backdrop-blur-sm';

  const inactiveText = scrolled
    ? 'text-gray-500 dark:text-white/50'
    : 'text-white/60';

  return (
    <div className="flex items-center gap-2">

      {/* ── Language toggle: EN | বাং ── */}
      <div
        className={`relative flex items-center rounded-full p-[3px] transition-all duration-300 ${pillBase}`}
        style={{ minWidth: 84 }}
      >
        {/* Sliding gold pill */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 550, damping: 38 }}
          className="absolute top-[3px] bottom-[3px] rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-sm z-10"
          style={{
            width: 'calc(50% - 3px)',
            left: isBangla ? 'calc(50%)' : '3px',
          }}
        />
        <button
          onClick={() => setLanguage('en')}
          aria-label="Switch to English"
          className="relative z-20 flex-1 text-center py-1.5 text-[11px] font-extrabold tracking-wider cursor-pointer focus:outline-none transition-colors duration-200"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          <span className={!isBangla ? 'text-gray-900' : inactiveText}>
            EN
          </span>
        </button>
        <button
          onClick={() => setLanguage('bn')}
          aria-label="বাংলায় পরিবর্তন করুন"
          className="relative z-20 flex-1 text-center py-1.5 text-[12px] font-bold cursor-pointer focus:outline-none transition-colors duration-200"
          style={{ fontFamily: 'var(--font-noto), serif' }}
        >
          <span className={isBangla ? 'text-gray-900' : inactiveText}>
            বাং
          </span>
        </button>
      </div>

      {/* ── Dark/Light mode toggle ── */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`
          relative flex items-center justify-center w-9 h-9 rounded-full
          transition-all duration-300 cursor-pointer focus:outline-none
          hover:scale-110 active:scale-95
          ${pillBase}
        `}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className={`w-4 h-4 ${scrolled ? 'text-yellow-500 dark:text-yellow-400' : 'text-yellow-300'}`} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className={`w-4 h-4 ${scrolled ? 'text-primary dark:text-white' : 'text-white'}`} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
