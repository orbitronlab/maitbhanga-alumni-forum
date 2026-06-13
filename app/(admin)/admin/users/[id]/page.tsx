import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Heart, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatDateRelative } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'User Detail — Admin' };

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: { include: { batch: true } },
      donations: { take: 5, orderBy: { createdAt: 'desc' }, include: { payment: true } },
      eventRegistrations: { take: 5, orderBy: { createdAt: 'desc' }, include: { event: true } },
    },
  });

  if (!user) notFound();

  const statusColors: Record<string, string> = {
    ACTIVE: 'badge-success', PENDING: 'badge-warning', SUSPENDED: 'badge-danger', INACTIVE: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <h1 className="text-2xl font-bold font-heading text-foreground">User Profile</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card-base p-6">
          <div className="text-center mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 shadow-primary">
              {(user.profile?.fullName ?? user.email)[0].toUpperCase()}
            </div>
            <h2 className="font-heading font-bold text-foreground text-xl">{user.profile?.fullName ?? 'No name'}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <span className={`badge ${statusColors[user.status]} text-xs`}>{user.status}</span>
              <span className="badge-primary text-xs">{user.role}</span>
              {user.profile?.isLifeMember && <span className="badge bg-accent/20 text-accent text-xs">⭐ Life Member</span>}
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            {[
              { label: 'Batch', value: user.profile?.batch?.name ?? '—' },
              { label: 'Passing Year', value: user.profile?.passingYear?.toString() ?? '—' },
              { label: 'Roll Number', value: user.profile?.rollNumber ?? '—' },
              { label: 'Phone', value: user.profile?.phone ?? '—' },
              { label: 'Country', value: user.profile?.country ?? 'Bangladesh' },
              { label: 'Profession', value: user.profile?.profession ?? '—' },
              { label: 'Joined', value: formatDateRelative(user.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground text-right max-w-[140px] truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-5 pt-4 border-t border-border space-y-2">
            {user.status === 'PENDING' && (
              <form action={`/api/admin/users/${user.id}`} method="PATCH">
                <input type="hidden" name="action" value="approve" />
                <button type="submit" className="btn-primary w-full justify-center text-sm py-2">
                  <CheckCircle className="w-4 h-4" /> Approve Account
                </button>
              </form>
            )}
            {user.status === 'ACTIVE' && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-all">
                <XCircle className="w-4 h-4" /> Suspend Account
              </button>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent donations */}
          <div className="card-base p-6">
            <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> Recent Donations
            </h3>
            {user.donations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No donations yet.</p>
            ) : (
              <div className="space-y-2">
                {user.donations.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)} · {d.payment?.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{formatCurrency(Number(d.amount))}</p>
                      <p className="text-xs text-muted-foreground">{d.payment?.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event registrations */}
          <div className="card-base p-6">
            <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Event Registrations
            </h3>
            {user.eventRegistrations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No event registrations.</p>
            ) : (
              <div className="space-y-2">
                {user.eventRegistrations.map(reg => (
                  <div key={reg.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{reg.event.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(reg.event.startDate)}</p>
                    </div>
                    <span className="badge-primary text-xs">{reg.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
