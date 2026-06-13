import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CalendarDays, Plus, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Events — Admin' };

export default async function AdminEventsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;
  const where: any = { deletedAt: null };
  if (status) where.status = status;

  const events = await prisma.event.findMany({
    where,
    include: { _count: { select: { registrations: true } } },
    orderBy: { startDate: 'desc' },
    take: 30,
  });

  const statusColors: Record<string, string> = {
    PUBLISHED: 'badge-success', DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    CANCELLED: 'badge-danger', COMPLETED: 'badge-primary', POSTPONED: 'badge-warning',
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" /> Event Management
          </h1>
          <p className="text-muted-foreground mt-1">{events.length} events</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[['', 'All'], ['PUBLISHED', 'Published'], ['DRAFT', 'Drafts'], ['COMPLETED', 'Completed'], ['CANCELLED', 'Cancelled']].map(([val, label]) => (
          <Link key={val} href={`/admin/events?status=${val}`} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${status === val || (!status && !val) ? 'bg-primary text-white' : 'bg-muted hover:bg-primary/10 text-muted-foreground'}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['Event', 'Type', 'Date', 'Location', 'Registrations', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      {event.isFeatured && <span className="badge bg-accent/20 text-accent text-xs mt-1">Featured</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{event.type}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(event.startDate)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{event.location ?? 'Online'}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-foreground">
                      <Users className="w-3.5 h-3.5" /> {event._count.registrations}
                      {event.maxAttendees && <span className="text-muted-foreground">/{event.maxAttendees}</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3"><span className={`badge ${statusColors[event.status] ?? 'badge-primary'} text-xs`}>{event.status}</span></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/events/${event.id}`} className="text-primary text-xs hover:text-accent font-medium">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
