import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PaginationSchema } from '@/lib/validators';

// GET - Admin analytics & reports
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? 'overview';

    if (type === 'overview') {
      const [
        totalUsers,
        activeUsers,
        pendingUsers,
        totalDonations,
        totalDonationAmount,
        totalEvents,
        totalNews,
        recentUsers,
        recentDonations,
      ] = await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } }),
        prisma.user.count({ where: { status: 'PENDING', deletedAt: null } }),
        prisma.donation.count(),
        prisma.donation.aggregate({ _sum: { amount: true } }),
        prisma.event.count({ where: { status: { not: 'DRAFT' } } }),
        prisma.news.count({ where: { status: 'PUBLISHED' } }),
        prisma.user.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { profile: { select: { fullName: true, passingYear: true } } },
        }),
        prisma.donation.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            user: { include: { profile: { select: { fullName: true } } } },
            payment: { select: { status: true, method: true } },
          },
        }),
      ]);

      return NextResponse.json({
        overview: {
          totalUsers,
          activeUsers,
          pendingUsers,
          totalDonations,
          totalDonationAmount: totalDonationAmount._sum.amount ?? 0,
          totalEvents,
          totalNews,
        },
        recentUsers,
        recentDonations,
      });
    }

    if (type === 'donations_chart') {
      // Monthly donation aggregation for the last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const donations = await prisma.donation.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: twelveMonthsAgo } },
        _sum: { amount: true },
        _count: { id: true },
      });

      return NextResponse.json({ donations });
    }

    if (type === 'users_by_batch') {
      const batches = await prisma.alumniBatch.findMany({
        include: {
          _count: { select: { profiles: true } },
        },
        orderBy: { year: 'desc' },
      });
      return NextResponse.json({ batches });
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}
