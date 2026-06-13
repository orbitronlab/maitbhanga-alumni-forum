import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaginationSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = PaginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 10,
      search: searchParams.get('search') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? 'startDate',
      sortOrder: searchParams.get('sortOrder') ?? 'asc',
    });

    const status = searchParams.get('status') ?? 'PUBLISHED';
    const type = searchParams.get('type');

    const where: any = { status, deletedAt: null };
    if (type) where.type = type;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { _count: { select: { registrations: true } } },
        orderBy: { startDate: params.sortOrder },
      }),
    ]);

    return NextResponse.json({
      data: events,
      meta: { total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) },
    });
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { generateSlug } = await import('@/lib/utils');
    const event = await prisma.event.create({
      data: {
        ...body,
        slug: generateSlug(body.title),
        createdById: session.user.id,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Event POST error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
