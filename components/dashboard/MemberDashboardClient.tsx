'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, CalendarDays, Bell, User, ArrowRight, CheckCircle, Clock, XCircle, Wallet } from 'lucide-react';
import { formatCurrency, formatDate, formatDateRelative, getInitials } from '@/lib/utils';

interface Props {
  user: any;
  profile: any;
  stats: {
    totalDonated: number;
    donationCount: number;
    upcomingEvents: number;
    unreadNotifications: number;
  };
  recentDonations: any[];
}

const paymentStatusIcon = {
  COMPLETED: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  PENDING: <Clock className="w-4 h-4 text-amber-500" />,
  FAILED: <XCircle className="w-4 h-4 text-red-500" />,
};

export function MemberDashboardClient({ user, profile, stats, recentDonations }: Props) {
  const isProfileComplete = !!(
    profile?.fullName &&
    profile?.phone &&
    profile?.profession &&
    profile?.batchId
  );

  return (
    <div className="pt-16 lg:pt-0">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">
          Welcome back, {profile?.fullName?.split(' ')[0] ?? user.name?.split(' ')[0] ?? 'Alumni'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile?.batch?.name ? `${profile.batch.name} · ` : ''}
          {profile?.profession ?? 'Maitbhanga High School Alumni'}
        </p>
      </motion.div>

      {/* Profile incomplete warning */}
      {!isProfileComplete && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
              Complete your profile
            </p>
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
              Add your profession, batch, and contact info to connect with alumni.
            </p>
          </div>
          <Link href="/profile" className="btn-accent text-xs py-2 px-4 whitespace-nowrap">
            Update Now
          </Link>
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Wallet,
            label: 'Total Donated',
            value: formatCurrency(stats.totalDonated),
            sub: `${stats.donationCount} donations`,
            color: 'text-accent bg-accent/10',
            href: '/donations',
          },
          {
            icon: CalendarDays,
            label: 'Upcoming Events',
            value: stats.upcomingEvents.toString(),
            sub: 'Registered events',
            color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
            href: '/my-events',
          },
          {
            icon: Bell,
            label: 'Notifications',
            value: stats.unreadNotifications.toString(),
            sub: 'Unread messages',
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
            href: '/notifications',
          },
          {
            icon: User,
            label: 'Profile Status',
            value: isProfileComplete ? '100%' : '60%',
            sub: isProfileComplete ? 'Profile complete' : 'Incomplete',
            color: isProfileComplete ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-600 bg-amber-50',
            href: '/profile',
          },
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

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-base p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-foreground text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Recent Donations
            </h2>
            <Link href="/donations" className="text-primary text-sm hover:text-accent transition-colors font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No donations yet</p>
              <Link href="/donate" className="btn-accent mt-3 text-xs py-2 px-4">
                Make a Donation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    donation.payment?.status === 'COMPLETED' ? 'bg-emerald-100' :
                    donation.payment?.status === 'PENDING' ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    {paymentStatusIcon[donation.payment?.status as keyof typeof paymentStatusIcon] ?? <Clock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {donation.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateRelative(donation.createdAt)}</p>
                  </div>
                  <p className="text-sm font-bold text-accent whitespace-nowrap">
                    {formatCurrency(Number(donation.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-base p-6"
        >
          <h2 className="font-heading font-bold text-foreground text-lg mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/donate', icon: Heart, label: 'Make a Donation', color: 'text-accent bg-accent/10 hover:bg-accent hover:text-primary-900' },
              { href: '/events', icon: CalendarDays, label: 'Browse Events', color: 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20' },
              { href: '/alumni-directory', icon: User, label: 'Find Alumni', color: 'text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white dark:bg-purple-900/20' },
              { href: '/profile', icon: User, label: 'Edit Profile', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:scale-105 hover:shadow-md`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-semibold leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Membership status */}
          <div className="mt-5 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">Membership Status</p>
              <span className="badge-primary text-xs">
                {profile?.isLifeMember ? '⭐ Life Member' : 'Annual Member'}
              </span>
            </div>
            {!profile?.isLifeMember && (
              <p className="text-xs text-muted-foreground mb-3">
                Upgrade to Life Membership for just ৳5,000 — one-time, lifetime benefits.
              </p>
            )}
            {!profile?.isLifeMember && (
              <Link href="/donate?type=MEMBERSHIP_FEE" className="btn-primary text-xs py-2 px-4 w-full justify-center">
                Pay Membership Fee
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
