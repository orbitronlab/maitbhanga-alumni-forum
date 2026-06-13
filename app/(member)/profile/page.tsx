import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileClient } from '@/components/member/ProfileClient';

export const metadata: Metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { batch: true },
  });
  const batches = await prisma.alumniBatch.findMany({ where: { isActive: true }, orderBy: { year: 'desc' } });

  return <ProfileClient profile={profile} batches={batches} userId={session.user.id} userEmail={session.user.email ?? ''} />;
}
