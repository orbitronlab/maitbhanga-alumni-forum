import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email/mailer';
import { UserStatus } from '@prisma/client';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'This email is already verified.' }, { status: 409 });
    }

    // Rate limit: check if OTP was sent in last 60 seconds
    const recentToken = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        type: 'email_otp',
        usedAt: null,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: 'OTP already sent. Please wait 60 seconds before requesting a new one.' },
        { status: 429 }
      );
    }

    // Invalidate old OTPs
    await prisma.verificationToken.updateMany({
      where: { userId: user.id, usedAt: null, type: 'email_otp' },
      data: { usedAt: new Date() },
    });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.verificationToken.create({
      data: { userId: user.id, token: otp, type: 'email_otp', expiresAt },
    });

    // Send email (non-blocking)
    sendOtpEmail(email, user.profile?.fullName ?? 'Member', otp).catch(console.warn);

    return NextResponse.json({ message: 'A new OTP has been sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Failed to resend OTP. Please try again.' }, { status: 500 });
  }
}
