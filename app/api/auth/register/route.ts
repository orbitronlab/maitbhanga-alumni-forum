import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { RegisterSchema } from '@/lib/validators';
import { sendOtpEmail } from '@/lib/email/mailer';
import { UserRole, UserStatus } from '@prisma/client';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone, batchYear, rollNumber } = parsed.data;

    // Check DB connectivity + existing user
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure PostgreSQL is running.' },
        { status: 503 }
      );
    }

    if (existingUser) {
      // If user exists but is PENDING (not verified), allow re-sending OTP
      if (existingUser.status === UserStatus.PENDING && !existingUser.emailVerified) {
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Invalidate old OTPs
        await prisma.verificationToken.updateMany({
          where: { userId: existingUser.id, usedAt: null },
          data: { usedAt: new Date() },
        });

        await prisma.verificationToken.create({
          data: { userId: existingUser.id, token: otp, type: 'email_otp', expiresAt },
        });

        sendOtpEmail(email, existingUser.profile?.fullName ?? fullName, otp).catch(console.warn);

        return NextResponse.json(
          { message: 'A new OTP has been sent to your email.', email },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find batch
    let batchId: string | undefined;
    if (batchYear) {
      const batch = await prisma.alumniBatch.findUnique({ where: { year: batchYear } });
      batchId = batch?.id;
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user + OTP in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: UserRole.ALUMNI,
          status: UserStatus.PENDING,
          profile: {
            create: {
              fullName,
              phone: phone || null,
              batchId: batchId || null,
              rollNumber: rollNumber || null,
              passingYear: batchYear ?? null,
            },
          },
        },
      });

      await tx.verificationToken.create({
        data: { userId: newUser.id, token: otp, type: 'email_otp', expiresAt },
      });

      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'CREATE',
          entityType: 'User',
          entityId: newUser.id,
          metadata: { event: 'registration', email },
        },
      });

      return newUser;
    });

    // Send OTP email (non-blocking)
    sendOtpEmail(email, fullName, otp).catch((e) =>
      console.warn('OTP email failed:', e?.message)
    );

    return NextResponse.json(
      { message: 'Registration successful! Check your email for the OTP.', email },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
