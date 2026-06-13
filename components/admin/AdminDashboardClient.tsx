'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Heart, CalendarDays, Newspaper, CheckCircle,
  Clock, ArrowRight, UserCheck, TrendingUp, AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDateRelative } from '@/lib/utils';

interface Props {
  adminName: string;
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalDonationAmount: number;
    totalDonations: number;
    publishedEvents: number;
    publishedNews: number;
  };
  pendingUsers: any[];
  recentDonations: any[];
  recentUsers: any[];
}

const paymentBadge: Record<string, JSX.Element> = {
  COMPLETED: <span className="badge-success text-xs">Paid</span>,
  PENDING: <span className="badge-warning text-xs">Pending</span>,
  FAILED: <span className="badge-danger text-xs">Failed</span>,
  PROCESSING: <span className="badge-primary text-xs">Processing</span>,
};

export function AdminDashboardClient({ adminName, stats, pendingUsers, recentDonations, recentUsers }: Props) {
  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, {adminName.split(' ')[0]}. Here&apos;s your overview.</p>
      </motion.div>

      {/* Pending approval alert */}
      {stats.pendingUsers > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                {stats.pendingUsers} user{stats.pendingUsers > 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-amber-600 dark:text-amber-400 text-xs">Review and approve new member registrations.</p>
            </div>
          </div>
          <Link href="/admin/users?status=PENDING" className="btn-accent text-xs py-2 px-4 whitespace-nowrap">
            Review Now
          </Link>
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Total Alumni', value: stats.totalUsers.toLocaleString(), sub: `${stats.activeUsers} active`, color: 'text-primary bg-primary/10', href: '/admin/users' },
          { icon: Heart, label: 'Total Raised', value: formatCurrency(stats.totalDonationAmount), sub: `${stats.totalDonations} donations`, color: 'text-accent-600 bg-accent/10', href: '/admin/donations' },
          { icon: CalendarDays, label: 'Events', value: stats.publishedEvents.toString(), sub: 'Published events', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', href: '/admin/events' },
          { icon: Newspaper, label: 'News & Notices', value: stats.publishedNews.toString(), sub: 'Published articles', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', href: '/admin/news' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href} className="card-base p-5 flex flex-col h-full group">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-base p-6 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              Pending Approvals
            </h2>
            <Link href="/admin/users?status=PENDING" className="text-primary text-xs hover:text-accent font-medium">
              View all →
            </Link>
          </div>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-700 text-xs font-bold flex-shrink-0">
                    {(user.profile?.fullName ?? user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.profile?.fullName ?? user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.profile?.passingYear ? `Batch ${user.profile.passingYear}` : 'Batch N/A'} · {formatDateRelative(user.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-xs text-primary hover:text-accent font-medium"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-base p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Recent Donations
            </h2>
            <Link href="/admin/donations" className="text-primary text-xs hover:text-accent font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Donor</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Type</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Method</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-foreground">
                      {donation.isAnonymous ? 'Anonymous' : (donation.user?.profile?.fullName ?? donation.user?.email ?? 'Unknown')}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {donation.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </td>
                    <td className="py-3 text-sm font-bold text-accent">
                      {formatCurrency(Number(donation.amount))}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {donation.payment?.method ?? 'N/A'}
                    </td>
                    <td className="py-3">
                      {paymentBadge[donation.payment?.status ?? 'PENDING'] ?? paymentBadge['PENDING']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Quick admin actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 card-base p-6"
      >
        <h2 className="font-heading font-bold text-foreground mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/users/new', label: 'Add Admin User', icon: Users },
            { href: '/admin/events/new', label: 'Create Event', icon: CalendarDays },
            { href: '/admin/news/new', label: 'Publish News', icon: Newspaper },
            { href: '/admin/reports', label: 'View Reports', icon: TrendingUp },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <action.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
