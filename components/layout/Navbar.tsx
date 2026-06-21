'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Shield, Bell, GraduationCap
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import { NavbarToggles } from '@/components/ui/NavbarToggles';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ui/ThemeContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/alumni-directory', label: t.nav.alumni },
    { href: '/events', label: t.nav.events },
    { href: '/news', label: t.nav.news },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/contact', label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session?.user?.role ?? '');

  const linkClass = (active: boolean) =>
    cn(
      'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
      active
        ? 'bg-primary/10 text-primary dark:text-accent dark:bg-white/10'
        : isScrolled
        ? 'text-gray-700 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
    );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-bold leading-tight ${isScrolled ? 'text-primary dark:text-white' : 'text-white'}`}>
                Maitbhanga
              </p>
              <p className="text-xs text-accent font-semibold leading-tight">
                Alumni Forum
              </p>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(pathname === link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Toggles + Donate + Auth */}
          <div className="hidden lg:flex items-center gap-2">

            {/* ── Language + Dark/Light toggles ── */}
            <NavbarToggles scrolled={isScrolled} />

            {/* Donate button */}
            <Link
              href="/donate"
              className="px-4 py-2 rounded-xl text-sm bg-accent text-accent-foreground hover:bg-yellow-400 shadow-gold font-semibold transition-all duration-200 hover:scale-105"
            >
              {t.nav.donate}
            </Link>

            {/* Auth: profile or sign in */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
                    isScrolled
                      ? 'hover:bg-primary/5 dark:hover:bg-white/5'
                      : 'hover:bg-white/10'
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(session.user?.name ?? 'A')
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-semibold leading-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                      {session.user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {isAdmin ? t.nav.admin : t.nav.member}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${isScrolled ? 'text-muted-foreground' : 'text-white/70'}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm font-semibold text-foreground">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        {t.nav.myDashboard}
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}>
                        <User className="w-4 h-4 text-primary" />
                        {t.nav.myProfile}
                      </Link>
                      <Link href="/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}>
                        <Bell className="w-4 h-4 text-primary" />
                        {t.nav.notifications}
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsProfileOpen(false)}>
                          <Shield className="w-4 h-4 text-accent" />
                          {t.nav.adminPanel}
                        </Link>
                      )}
                      <div className="border-t border-border/50 mt-1 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.nav.signOut}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className={cn(
                  'text-sm py-2 px-4 rounded-xl font-medium border transition-all',
                  isScrolled
                    ? 'border-primary/20 text-primary hover:bg-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/5'
                    : 'border-white/30 text-white hover:bg-white/10'
                )}>
                  {t.nav.signIn}
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  {t.nav.joinNow}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn('lg:hidden p-2 rounded-xl transition-colors', isScrolled ? 'hover:bg-primary/5' : 'hover:bg-white/10')}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-primary dark:text-white' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-primary dark:text-white' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-white dark:bg-primary-900 rounded-2xl mb-4 p-4 shadow-xl border border-border/50">
                {/* Toggles row in mobile */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                  <span className="text-xs text-muted-foreground font-medium">Language &amp; Theme</span>
                  <NavbarToggles scrolled={true} />
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        pathname === link.href
                          ? 'bg-primary/10 text-primary dark:text-accent dark:bg-white/10'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-primary/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/donate" className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold bg-accent text-accent-foreground mt-1">
                    {t.nav.donate}
                  </Link>
                </div>

                {session ? (
                  <div className="border-t border-border/50 mt-4 pt-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-muted transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-primary" /> {t.nav.myDashboard}
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-muted transition-colors">
                        <Shield className="w-4 h-4 text-accent" /> {t.nav.adminPanel}
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> {t.nav.signOut}
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-border/50 mt-4 pt-4 flex gap-2">
                    <Link href="/login" className="btn-outline flex-1 text-center text-sm py-2.5">{t.nav.signIn}</Link>
                    <Link href="/register" className="btn-primary flex-1 text-center text-sm py-2.5">{t.nav.joinNow}</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
