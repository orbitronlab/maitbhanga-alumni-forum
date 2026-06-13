import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserStatus } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=missing_token', request.url));
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid_token', request.url));
  }

  if (verificationToken.usedAt) {
    return NextResponse.redirect(new URL('/verify-email?error=already_used', request.url));
  }

  if (verificationToken.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/verify-email?error=expired', request.url));
  }

  // Mark token as used and activate the user
  await prisma.$transaction([
    prisma.verificationToken.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: new Date(),
        status: UserStatus.ACTIVE,
      },
    }),
  ]);

  return NextResponse.redirect(new URL('/verify-email?success=true', request.url));
}
