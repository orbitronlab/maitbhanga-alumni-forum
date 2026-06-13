'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Users, Heart, CalendarDays, Newspaper,
  Images, BarChart3, Settings, LogOut, GraduationCap,
  Shield, Globe, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/users', icon: Users, label: 'User Management' },
      { href: '/admin/donations', icon: Heart, label: 'Donations' },
      { href: '/admin/events', icon: CalendarDays, label: 'Events' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/news', icon: Newspaper, label: 'News & Notices' },
      { href: '/admin/gallery', icon: Images, label: 'Gallery' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 bg-primary-900 dark:bg-gray-950 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-900" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Maitbhanga Alumni</p>
            <p className="text-accent text-xs leading-tight flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* User badge */}
      <div className="p-4 mx-3 my-3 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className="text-accent text-xs">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'bg-accent text-primary-900'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Globe className="w-4 h-4" />
          View Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
