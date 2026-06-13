import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET - Admin: list all donations with payment info
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const status = searchParams.get('status'); // PENDING | COMPLETED | FAILED

    const where: any = {};
    if (status) {
      where.payment = { status };
    }

    const [total, donations] = await Promise.all([
      prisma.donation.count({ where }),
      prisma.donation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { include: { profile: { select: { fullName: true, phone: true } } } },
          campaign: { select: { title: true } },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      data: donations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin donations GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

// PATCH - Admin: verify (approve/reject) a donation
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { donationId, action, note } = z.object({
      donationId: z.string(),
      action: z.enum(['APPROVE', 'REJECT']),
      note: z.string().optional(),
    }).parse(body);

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { payment: true, user: { include: { profile: true } } },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const newStatus = action === 'APPROVE' ? 'COMPLETED' : 'FAILED';

    await prisma.$transaction(async (tx) => {
      // Update payment status
      if (donation.payment) {
        await tx.payment.update({
          where: { id: donation.payment.id },
          data: {
            status: newStatus,
            paidAt: action === 'APPROVE' ? new Date() : null,
            failureReason: action === 'REJECT' ? (note ?? 'Rejected by admin') : null,
            verificationData: {
              verifiedBy: session.user.id,
              verifiedAt: new Date().toISOString(),
              action,
              note,
            },
          },
        });
      }

      // Notify the donor
      await tx.notification.create({
        data: {
          userId: donation.userId,
          type: 'PAYMENT',
          title: action === 'APPROVE' ? '✅ Donation Verified!' : '❌ Donation Rejected',
          body: action === 'APPROVE'
            ? `Your donation of ৳${Number(donation.amount).toLocaleString()} (Receipt: ${donation.receiptNumber}) has been verified. Thank you!`
            : `Your donation of ৳${Number(donation.amount).toLocaleString()} was rejected. ${note ? `Reason: ${note}` : 'Please contact admin.'}`,
          link: '/donations',
        },
      });

      // Audit
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: action === 'APPROVE' ? 'APPROVE' : 'REJECT',
          entityType: 'Donation',
          entityId: donation.id,
          metadata: { action, note, donationId, verifiedBy: session.user.email },
        },
      });
    });

    return NextResponse.json({
      message: action === 'APPROVE' ? 'Donation approved successfully.' : 'Donation rejected.',
    });
  } catch (error) {
    console.error('Admin donation PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 });
  }
}
