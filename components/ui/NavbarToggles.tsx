'use client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ui/ThemeContext';
import { Sun, Moon } from 'lucide-react';
export function NavbarToggles() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center gap-1.5 ml-2">
      <button
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        className="h-9 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-800 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all active:scale-95 cursor-pointer"
        aria-label="Toggle language"
      >
        {language === 'en' ? '\u09ac\u09be\u0982\u09b2\u09be' : 'EN'}
      </button>
      <button
        onClick={toggleTheme}
        className="h-9 w-9 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-yellow-500" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    </div>
  );
}