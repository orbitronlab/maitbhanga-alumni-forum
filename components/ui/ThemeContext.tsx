'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
type Theme = 'dark' | 'light';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; setTheme: (theme: Theme) => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {}, setTheme: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setInternalTheme] = useState<Theme>('dark');
  const applyTheme = useCallback((t: Theme) => {
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('preferred-theme', t);
  }, []);
  const setTheme = useCallback((t: Theme) => { setInternalTheme(t); applyTheme(t); }, [applyTheme]);
  const toggleTheme = useCallback(() => {
    setInternalTheme((prev) => { const next = prev === 'dark' ? 'light' : 'dark'; applyTheme(next); return next; });
  }, [applyTheme]);
  useEffect(() => {
    const saved = localStorage.getItem('preferred-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved: Theme = saved ?? (prefersDark ? 'dark' : 'light');
    setInternalTheme(resolved); applyTheme(resolved);
  }, [applyTheme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}