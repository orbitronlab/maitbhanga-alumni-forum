import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Bell } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!news) return { title: 'Not Found' };
  return {
    title: `${news.title} | Maitbhanga Alumni Forum`,
    description: news.excerpt ?? news.title,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await prisma.news.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { createdBy: { include: { profile: { select: { fullName: true } } } } },
  });

  if (!news) notFound();

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-gradient-hero py-12 text-white">
        <div className="page-container">
          <Link href="/news" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {news.isNotice && <span className="badge-warning flex items-center gap-1"><Bell className="w-3 h-3" /> Official Notice</span>}
            <span className="badge bg-white/20 text-white flex items-center gap-1"><Tag className="w-3 h-3" /> {news.category}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold font-heading leading-tight max-w-4xl">{news.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-gray-300 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(news.publishedAt ?? news.createdAt)}</span>
            <span>By {news.createdBy?.profile?.fullName ?? 'Admin'}</span>
          </div>
        </div>
      </div>
      <div className="page-container py-12">
        <div className="max-w-3xl mx-auto">
          <article
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-primary dark:prose-headings:text-white prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </div>
    </div>
  );
}
