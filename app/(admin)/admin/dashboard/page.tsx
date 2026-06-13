import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const session = await auth();

  const [
    userStats,
    donationStats,
    eventStats,
    newsCount,
    pendingUsers,
    recentDonations,
    recentUsers,
  ] = await Promise.all([
    prisma.user.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.event.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.news.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.findMany({
      where: { status: 'PENDING', deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { profile: { select: { fullName: true, passingYear: true } } },
    }),
    prisma.donation.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { include: { profile: { select: { fullName: true } } } },
        payment: { select: { status: true, method: true } },
      },
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: { select: { fullName: true, passingYear: true, profession: true } },
      },
    }),
  ]);

  const totalUsers = userStats.reduce((sum, s) => sum + s._count.id, 0);
  const activeUsers = userStats.find((s) => s.status === 'ACTIVE')?._count.id ?? 0;
  const pendingCount = userStats.find((s) => s.status === 'PENDING')?._count.id ?? 0;
  const publishedEvents = eventStats.find((s) => s.status === 'PUBLISHED')?._count.id ?? 0;

  return (
    <AdminDashboardClient
      adminName={session?.user?.name ?? 'Admin'}
      stats={{
        totalUsers,
        activeUsers,
        pendingUsers: pendingCount,
        totalDonationAmount: Number(donationStats._sum.amount ?? 0),
        totalDonations: donationStats._count.id,
        publishedEvents,
        publishedNews: newsCount,
      }}
      pendingUsers={pendingUsers}
      recentDonations={recentDonations}
      recentUsers={recentUsers}
    />
  );
}
