import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const cleanOtp = otp.toString().replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json({ error: 'OTP must be a 6-digit number.' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationTokens: {
          where: { usedAt: null, type: 'email_otp' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'This email is already verified. Please log in.' }, { status: 409 });
    }

    const tokenRecord = user.verificationTokens[0];

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'No active OTP found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (tokenRecord.token !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // Verify: mark token used + activate user
    await prisma.$transaction([
      prisma.verificationToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          status: UserStatus.ACTIVE,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Email verified successfully! You can now log in.' }, { status: 200 });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
