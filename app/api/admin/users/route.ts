import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Admin: list all users
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '15');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const where: any = { deletedAt: null };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { fullName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { profile: { include: { batch: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}
