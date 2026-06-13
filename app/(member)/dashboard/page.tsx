import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MemberDashboardClient } from '@/components/dashboard/MemberDashboardClient';

export const metadata: Metadata = { title: 'My Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [profile, donationStats, upcomingEvents, unreadNotifications, recentDonations] =
    await Promise.all([
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        include: { batch: true },
      }),
      prisma.donation.aggregate({
        where: { userId: session.user.id },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.eventRegistration.count({
        where: {
          userId: session.user.id,
          event: { startDate: { gte: new Date() } },
        },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
      prisma.donation.findMany({
        where: { userId: session.user.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { payment: { select: { status: true, method: true } } },
      }),
    ]);

  return (
    <MemberDashboardClient
      user={session.user}
      profile={profile}
      stats={{
        totalDonated: Number(donationStats._sum.amount ?? 0),
        donationCount: donationStats._count.id,
        upcomingEvents,
        unreadNotifications,
      }}
      recentDonations={recentDonations}
    />
  );
}
