import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaginationSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = PaginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 9,
      search: searchParams.get('search') ?? undefined,
    });
    const status = searchParams.get('status') ?? 'PUBLISHED';
    const isNotice = searchParams.get('isNotice');
    const category = searchParams.get('category');

    const where: any = { status, deletedAt: null };
    if (isNotice !== null) where.isNotice = isNotice === 'true';
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        select: { id: true, title: true, slug: true, excerpt: true, category: true, isNotice: true, isFeatured: true, publishedAt: true, createdAt: true, coverImage: true },
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      data: news,
      meta: { total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) },
    });
  } catch (error) {
    console.error('News GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
