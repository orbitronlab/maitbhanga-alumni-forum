import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Heart, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Donation History' };

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const donations = await prisma.donation.findMany({
    where: { userId: session.user.id },
    include: {
      payment: { select: { status: true, method: true, paidAt: true } },
      campaign: { select: { title: true } },
      event: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalDonated = donations.filter(d => d.payment?.status === 'COMPLETED').reduce((s, d) => s + Number(d.amount), 0);

  const statusIcon: Record<string, any> = {
    COMPLETED: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    PENDING: <Clock className="w-4 h-4 text-amber-500" />,
    FAILED: <XCircle className="w-4 h-4 text-red-500" />,
  };
  const statusBadge: Record<string, string> = {
    COMPLETED: 'badge-success',
    PENDING: 'badge-warning',
    FAILED: 'badge-danger',
    PROCESSING: 'badge-primary',
  };

  return (
    <div className="pt-16 lg:pt-0">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">Donation History</h1>
          <p className="text-muted-foreground mt-1">Total contributed: <span className="text-accent font-bold">{formatCurrency(totalDonated)}</span></p>
        </div>
        <Link href="/donate" className="btn-primary">
          <Heart className="w-4 h-4" /> Make a Donation
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="card-base p-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">No donations yet</h2>
          <p className="text-muted-foreground mb-6">Support your alma mater by making your first donation.</p>
          <Link href="/donate" className="btn-primary">Donate Now</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {['Receipt #', 'Type', 'For', 'Amount', 'Method', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 first:pl-6 text-xs text-muted-foreground font-mono">{d.receiptNumber.slice(-10)}</td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                      {d.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-[180px] truncate">
                      {d.campaign?.title ?? d.event?.title ?? 'General'}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-accent whitespace-nowrap">{formatCurrency(Number(d.amount))}</td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{d.payment?.method ?? '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`badge ${statusBadge[d.payment?.status ?? 'PENDING'] ?? 'badge-warning'} text-xs flex items-center gap-1 w-fit`}>
                        {statusIcon[d.payment?.status ?? 'PENDING']}
                        {d.payment?.status ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    <td className="px-4 py-4 last:pr-6">
                      {d.payment?.status === 'COMPLETED' && (
                        <button className="text-primary hover:text-accent text-xs font-medium flex items-center gap-1 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
