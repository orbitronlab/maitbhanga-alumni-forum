import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Messages' };

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const received = await prisma.messageRecipient.findMany({
    where: { userId: session.user.id },
    include: { message: { include: { sender: { include: { profile: { select: { fullName: true } } } } } } },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return (
    <div className="pt-16 lg:pt-0">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">{received.filter(r => r.status === 'SENT').length} unread messages</p>
      </div>

      {received.length === 0 ? (
        <div className="card-base p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">No messages yet</h2>
          <p className="text-muted-foreground">Messages from admins and other alumni will appear here.</p>
        </div>
      ) : (
        <div className="card-base divide-y divide-border/50 overflow-hidden">
          {received.map((r) => (
            <div key={r.id} className={cn('flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer', r.status === 'SENT' && 'bg-primary/3 dark:bg-primary/5')}>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {(r.message.sender?.profile?.fullName ?? 'A')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm text-foreground', r.status === 'SENT' ? 'font-semibold' : 'font-medium')}>
                    {r.message.sender?.profile?.fullName ?? 'Admin'}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.status === 'SENT' && <span className="w-2 h-2 rounded-full bg-primary" />}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDateRelative(r.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mt-0.5">{r.message.subject}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{r.message.body.replace(/<[^>]+>/g, '')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
