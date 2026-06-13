import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileUpdateSchema } from '@/lib/validators';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { batch: true },
  });
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { fullName, nameInBangla, gender, phone, altPhone, bio, rollNumber,
      currentAddress, permanentAddress, city, country, profession, company,
      designation, facebookUrl, linkedinUrl, twitterUrl, websiteUrl } = parsed.data;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        fullName,
        nameInBangla,
        gender,
        phone,
        altPhone,
        bio,
        rollNumber,
        currentAddress,
        permanentAddress,
        city,
        country,
        profession,
        company,
        designation,
        facebookUrl,
        linkedinUrl,
        twitterUrl,
        websiteUrl,
      },
      update: {
        fullName,
        nameInBangla,
        gender,
        phone,
        altPhone,
        bio,
        rollNumber,
        currentAddress,
        permanentAddress,
        city,
        country,
        profession,
        company,
        designation,
        facebookUrl,
        linkedinUrl,
        twitterUrl,
        websiteUrl,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entityType: 'Profile',
        entityId: profile.id,
        metadata: { event: 'profile_update' },
      },
    });

    return NextResponse.json({ profile, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
