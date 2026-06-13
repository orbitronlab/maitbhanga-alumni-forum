import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CalendarDays, MapPin, Ticket, Clock } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export const metadata: Metadata = { title: 'My Events' };

export default async function MyEventsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.user.id },
    include: { event: true, payment: { select: { status: true, method: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const statusColor: Record<string, string> = {
    REGISTERED: 'badge-primary', CONFIRMED: 'badge-success',
    CANCELLED: 'badge-danger', ATTENDED: 'badge-success',
  };

  return (
    <div className="pt-16 lg:pt-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">My Events</h1>
          <p className="text-muted-foreground mt-1">{registrations.length} event registrations</p>
        </div>
        <Link href="/events" className="btn-primary text-sm py-2 px-4">Browse Events</Link>
      </div>

      {registrations.length === 0 ? (
        <div className="card-base p-12 text-center">
          <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">No event registrations</h2>
          <p className="text-muted-foreground mb-6">Browse and register for upcoming events.</p>
          <Link href="/events" className="btn-primary">View Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="card-base p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-primary rounded-xl flex flex-col items-center justify-center text-white shadow-primary">
                <span className="text-xs opacity-80">{formatDate(reg.event.startDate, 'MMM').toUpperCase()}</span>
                <span className="text-xl font-bold font-heading">{formatDate(reg.event.startDate, 'd')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className={`badge ${statusColor[reg.status]} text-xs`}>{reg.status}</span>
                  {reg.event.requiresPayment && <span className={`badge ${reg.payment?.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'} text-xs`}>
                    {reg.payment?.status === 'COMPLETED' ? '✓ Paid' : '⚠ Payment Pending'}
                  </span>}
                </div>
                <h3 className="font-heading font-bold text-foreground">{reg.event.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(reg.event.startDate, 'dd MMM yyyy')}</span>
                  {reg.event.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{reg.event.location}</span>}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground">Ticket #</p>
                <p className="text-xs font-mono font-bold text-primary">{reg.ticketNumber.slice(-8).toUpperCase()}</p>
                {reg.event.registrationFee && <p className="text-accent font-bold mt-1">{formatCurrency(Number(reg.event.registrationFee))}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
