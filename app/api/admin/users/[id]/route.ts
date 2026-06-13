import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserStatus } from '@prisma/client';

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: { include: { batch: true } },
      donations: { take: 5, orderBy: { createdAt: 'desc' }, include: { payment: true } },
      eventRegistrations: { take: 5, orderBy: { createdAt: 'desc' }, include: { event: true } },
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { action, role } = body;

  let newStatus: UserStatus | undefined;
  if (action === 'approve') newStatus = UserStatus.ACTIVE;
  else if (action === 'suspend') newStatus = UserStatus.SUSPENDED;
  else if (action === 'activate') newStatus = UserStatus.ACTIVE;

  const data: any = {};
  if (newStatus) data.status = newStatus;
  if (role && session.user.role === 'SUPER_ADMIN') data.role = role;

  const user = await prisma.user.update({ where: { id: params.id }, data });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE',
      entityType: 'User',
      entityId: params.id,
      metadata: { action, by: session.user.id },
    },
  });

  // Send notification to user
  if (newStatus === UserStatus.ACTIVE) {
    await prisma.notification.create({
      data: {
        userId: params.id,
        type: 'SYSTEM',
        title: 'Account Approved',
        body: 'Your alumni account has been approved! You can now log in.',
      },
    });
  }

  return NextResponse.json({ user, message: `User ${action}d successfully` });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.user.update({
    where: { id: params.id },
    data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
  });

  return NextResponse.json({ message: 'User deleted' });
}
