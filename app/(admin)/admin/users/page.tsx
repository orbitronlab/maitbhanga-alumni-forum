import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export const metadata: Metadata = { title: 'User Management — Admin' };

export default async function AdminUsersPage({ searchParams }: { searchParams: { status?: string; page?: string; search?: string } }) {
  const status = searchParams.status ?? '';
  const page = parseInt(searchParams.page ?? '1');
  const search = searchParams.search ?? '';
  const limit = 15;

  const where: any = { deletedAt: null };
  if (status) where.status = status;
  if (search) where.OR = [
    { email: { contains: search, mode: 'insensitive' } },
    { profile: { fullName: { contains: search, mode: 'insensitive' } } },
  ];

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

  return <AdminUsersClient users={users} total={total} page={page} limit={limit} status={status} search={search} />;
}
