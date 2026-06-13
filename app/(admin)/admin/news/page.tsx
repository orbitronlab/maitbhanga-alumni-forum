import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Newspaper, Plus, Bell, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'News & Notices — Admin' };

export default async function AdminNewsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;
  const where: any = { deletedAt: null };
  if (status) where.status = status;

  const news = await prisma.news.findMany({
    where,
    include: { createdBy: { include: { profile: { select: { fullName: true } } } } },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  const statusColors: Record<string, string> = {
    PUBLISHED: 'badge-success', DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', ARCHIVED: 'badge-warning',
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" /> News & Notices
          </h1>
          <p className="text-muted-foreground mt-1">{news.length} articles</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Write Article
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {[['', 'All'], ['PUBLISHED', 'Published'], ['DRAFT', 'Drafts'], ['ARCHIVED', 'Archived']].map(([val, label]) => (
          <Link key={val} href={`/admin/news?status=${val}`} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${status === val || (!status && !val) ? 'bg-primary text-white' : 'bg-muted hover:bg-primary/10 text-muted-foreground'}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="card-base divide-y divide-border/50 overflow-hidden">
        {news.map((article) => (
          <div key={article.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {article.isNotice && <span className="badge-warning flex items-center gap-1 text-xs"><Bell className="w-3 h-3" /> Notice</span>}
                {article.isFeatured && <span className="badge bg-accent/20 text-accent text-xs">Featured</span>}
                <span className="badge-primary flex items-center gap-1 text-xs"><Tag className="w-3 h-3" /> {article.category}</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">{article.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {article.createdBy?.profile?.fullName ?? 'Admin'} · {formatDate(article.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`badge ${statusColors[article.status] ?? 'badge-primary'} text-xs`}>{article.status}</span>
              <Link href={`/admin/news/${article.id}`} className="text-primary text-xs hover:text-accent font-medium">Edit</Link>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No articles found.</div>
        )}
      </div>
    </div>
  );
}
