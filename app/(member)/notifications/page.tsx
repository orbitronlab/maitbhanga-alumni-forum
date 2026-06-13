import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Notifications' };

const typeIcon: Record<string, string> = {
  SYSTEM: '⚙️', PAYMENT: '💳', EVENT: '🎉', MESSAGE: '✉️', ANNOUNCEMENT: '📢', MEMBERSHIP: '🏆',
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="pt-16 lg:pt-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">{notifications.filter(n => !n.isRead).length} unread</p>
        </div>
        <button className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
          <CheckCheck className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="card-base p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">No notifications</h2>
          <p className="text-muted-foreground">You're all caught up! Check back later.</p>
        </div>
      ) : (
        <div className="card-base divide-y divide-border/50 overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className={cn('flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer', !n.isRead && 'bg-primary/3 dark:bg-primary/5')}>
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0', !n.isRead ? 'bg-primary/10' : 'bg-muted')}>
                {typeIcon[n.type] ?? '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm font-medium text-foreground', !n.isRead && 'font-semibold')}>{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDateRelative(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
