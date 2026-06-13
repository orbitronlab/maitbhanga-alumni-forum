import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReceiptNumber } from '@/lib/utils';
import { sendDonationReceiptEmail } from '@/lib/email/mailer';
import { formatDate } from '@/lib/utils';
import { z } from 'zod';

const DonationSubmitSchema = z.object({
  amount: z.number().positive('Amount must be positive').min(10, 'Minimum donation is ৳10'),
  type: z.enum(['MEMBERSHIP_FEE', 'GENERAL_DONATION', 'DEVELOPMENT_FUND', 'EVENT_FEE', 'CAMPAIGN_DONATION']),
  paymentMethod: z.enum(['BKASH', 'BANK_TRANSFER', 'CASH']),
  transactionId: z.string().min(4, 'Transaction ID is too short').max(100),
  senderName: z.string().min(2, 'Name is required').max(100),
  senderPhone: z.string().min(6, 'Phone is required').max(20),
  campaignId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  message: z.string().max(500).optional().nullable(),
  isAnonymous: z.boolean().default(false),
});

// GET - List user's donations
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const [total, donations] = await Promise.all([
      prisma.donation.count({ where: { userId: session.user.id } }),
      prisma.donation.findMany({
        where: { userId: session.user.id },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          campaign: { select: { title: true } },
          event: { select: { title: true } },
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
    console.error('Donations GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

// POST - Submit a manual donation (bKash / Bank Transfer)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Please log in to make a donation.' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = DonationSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const {
      amount, type, paymentMethod,
      transactionId, senderName, senderPhone,
      campaignId, eventId, message, isAnonymous,
    } = parsed.data;

    // Check for duplicate transaction ID
    const existingPayment = await prisma.payment.findFirst({
      where: { gatewayTransactionId: transactionId },
    });
    if (existingPayment) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been submitted. Contact admin if this is an error.' },
        { status: 409 }
      );
    }

    const receiptNumber = generateReceiptNumber();

    // Create donation + payment in transaction
    const donation = await prisma.$transaction(async (tx) => {
      const newDonation = await tx.donation.create({
        data: {
          userId: session.user.id,
          type,
          amount,
          campaignId: campaignId ?? null,
          eventId: eventId ?? null,
          message: message ?? null,
          isAnonymous,
          receiptNumber,
        },
      });

      // Create payment record with transaction details in metadata
      await tx.payment.create({
        data: {
          donationId: newDonation.id,
          method: paymentMethod,
          status: 'PENDING', // Admin must verify
          amount,
          currency: 'BDT',
          gatewayTransactionId: transactionId,
          metadata: {
            transactionId,
            senderName,
            senderPhone,
            submittedAt: new Date().toISOString(),
            note: 'Manual verification required',
          },
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'PAYMENT',
          entityType: 'Donation',
          entityId: newDonation.id,
          metadata: { amount, type, paymentMethod, transactionId, receiptNumber },
        },
      });

      // Notification for admin
      const admins = await tx.user.findMany({
        where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] }, status: 'ACTIVE' },
        select: { id: true },
      });

      await tx.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: 'PAYMENT',
          title: '💰 New Donation Submitted',
          body: `${senderName} submitted a ৳${Number(amount).toLocaleString()} donation via ${paymentMethod}. TrxID: ${transactionId}`,
          link: '/admin/donations',
        })),
      });

      return newDonation;
    });

    // Send receipt email (non-blocking)
    sendDonationReceiptEmail({
      email: session.user.email ?? '',
      name: senderName,
      amount: Number(amount),
      receiptNumber,
      donationType: type.replace(/_/g, ' '),
      paymentMethod,
      date: formatDate(new Date()),
    }).catch((e) => console.warn('Receipt email failed:', e?.message));

    return NextResponse.json(
      {
        message: 'Donation submitted! We will verify within 24 hours.',
        donation: {
          id: donation.id,
          receiptNumber: donation.receiptNumber,
          amount: donation.amount,
          type: donation.type,
          status: 'PENDING_VERIFICATION',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Donation POST error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'This Transaction ID has already been used.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to submit donation. Please try again.' }, { status: 500 });
  }
}
