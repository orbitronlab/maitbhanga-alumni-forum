import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PaginationSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = PaginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 12,
      search: searchParams.get('search') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? 'createdAt',
      sortOrder: searchParams.get('sortOrder') ?? 'desc',
    });

    const batchYear = searchParams.get('batchYear');
    const profession = searchParams.get('profession');
    const country = searchParams.get('country');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      status: status ?? 'ACTIVE',
      role: 'ALUMNI',
      deletedAt: null,
    };

    if (params.search) {
      where.OR = [
        { profile: { fullName: { contains: params.search, mode: 'insensitive' } } },
        { profile: { profession: { contains: params.search, mode: 'insensitive' } } },
        { profile: { company: { contains: params.search, mode: 'insensitive' } } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (batchYear) {
      where.profile = {
        ...where.profile,
        batch: { year: parseInt(batchYear) },
      };
    }

    if (profession) {
      where.profile = {
        ...where.profile,
        profession: { contains: profession, mode: 'insensitive' },
      };
    }

    if (country) {
      where.profile = {
        ...where.profile,
        country: { contains: country, mode: 'insensitive' },
      };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          profile: {
            include: { batch: true },
          },
        },
        orderBy:
          params.sortBy === 'name'
            ? { profile: { fullName: params.sortOrder } }
            : { createdAt: params.sortOrder },
      }),
    ]);

    const alumni = users.map((user) => ({
      id: user.id,
      fullName: user.profile?.fullName ?? user.email,
      profilePhoto: user.profile?.profilePhoto ?? null,
      batch: user.profile?.batch?.name ?? null,
      batchYear: user.profile?.batch?.year ?? null,
      passingYear: user.profile?.passingYear ?? null,
      profession: user.profile?.profession ?? null,
      company: user.profile?.company ?? null,
      designation: user.profile?.designation ?? null,
      currentAddress: user.profile?.currentAddress ?? null,
      country: user.profile?.country ?? 'Bangladesh',
      facebookUrl: user.profile?.facebookUrl ?? null,
      linkedinUrl: user.profile?.linkedinUrl ?? null,
      isLifeMember: user.profile?.isLifeMember ?? false,
      verificationStatus: user.verificationStatus,
      memberSince: user.createdAt,
    }));

    return NextResponse.json({
      data: alumni,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
        hasNextPage: params.page * params.limit < total,
        hasPrevPage: params.page > 1,
      },
    });
  } catch (error) {
    console.error('Alumni GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}
