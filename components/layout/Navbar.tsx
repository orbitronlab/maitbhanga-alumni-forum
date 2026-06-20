'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield, Bell, GraduationCap } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import { NavbarToggles } from '@/components/ui/NavbarToggles';
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/alumni-directory', label: 'Alumni' },
  { href: '/events', label: 'Events' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate', isAccent: true }
];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => { setIsOpen(false); }, [pathname]);
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session?.user?.role ?? '');
  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
      <nav className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-primary dark:text-white leading-tight">Maitbhanga</p>
              <p className="text-xs text-accent font-semibold leading-tight">Alumni Forum</p>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200', link.isAccent ? 'bg-accent text-accent-foreground hover:bg-accent-600 shadow-gold font-semibold' : pathname === link.href ? 'bg-primary/10 text-primary dark:text-accent dark:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white')}>
                {link.label}
              </Link>
            ))}
            <NavbarToggles />
          </div>
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {session.user?.image ? (<Image src={session.user.image} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />) : (getInitials(session.user?.name ?? 'A'))}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{session.user?.name?.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{isAdmin ? 'Admin' : 'Member'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-56 bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 py-2 z-50">
                      <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm font-semibold text-foreground">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 text-primary" />My Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <User className="w-4 h-4 text-primary" />My Profile
                      </Link>
                      <Link href="/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Bell className="w-4 h-4 text-primary" />Notifications
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Shield className="w-4 h-4 text-accent" />Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-border/50 mt-1 pt-1">
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" />Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-outline text-sm py-2 px-4">Sign In</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">Join Now</Link>
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl hover:bg-primary/5 transition-colors" aria-label="Toggle menu">
            {isOpen ? (<X className="w-6 h-6 text-primary dark:text-white" />) : (<Menu className="w-6 h-6 text-primary dark:text-white" />)}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden overflow-hidden">
              <div className="bg-white dark:bg-primary-900 rounded-2xl mb-4 p-4 shadow-xl border border-border/50">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={cn('flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all', link.isAccent ? 'bg-accent text-accent-foreground' : pathname === link.href ? 'bg-primary/10 text-primary dark:text-accent dark:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-primary/5')}>
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex justify-end pt-2 border-t border-border/50 mt-2">
                    <NavbarToggles />
                  </div>
                </div>
                {session ? (
                  <div className="border-t border-border/50 mt-4 pt-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-muted transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-primary" />Dashboard
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-muted transition-colors">
                        <Shield className="w-4 h-4 text-accent" />Admin Panel
                      </Link>
                    )}
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-border/50 mt-4 pt-4 flex gap-2">
                    <Link href="/login" className="btn-outline flex-1 text-center text-sm py-2.5">Sign In</Link>
                    <Link href="/register" className="btn-primary flex-1 text-center text-sm py-2.5">Join Now</Link>
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