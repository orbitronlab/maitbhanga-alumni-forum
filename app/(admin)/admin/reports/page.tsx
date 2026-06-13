import type { Metadata } from 'next';
import { BarChart3, TrendingUp, Users, Heart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = { title: 'Reports & Analytics — Admin' };

export default async function AdminReportsPage() {
  const [userStats, donationStats, batchStats, eventStats] = await Promise.all([
    prisma.user.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.donation.aggregate({ _sum: { amount: true }, _count: { id: true }, _avg: { amount: true } }),
    prisma.alumniBatch.findMany({
      include: { _count: { select: { profiles: true } } },
      orderBy: { year: 'desc' },
      take: 10,
    }),
    prisma.event.groupBy({ by: ['type'], _count: { id: true } }),
  ]);

  const totalUsers = userStats.reduce((s, u) => s + u._count.id, 0);
  const activeUsers = userStats.find(u => u.status === 'ACTIVE')?._count.id ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Overview of all alumni forum activity</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Alumni', value: totalUsers.toLocaleString(), sub: `${activeUsers} active`, icon: Users, color: 'text-primary bg-primary/10' },
          { label: 'Total Raised', value: formatCurrency(Number(donationStats._sum.amount ?? 0)), sub: `${donationStats._count.id} donations`, icon: Heart, color: 'text-accent bg-accent/10' },
          { label: 'Avg Donation', value: formatCurrency(Number(donationStats._avg.amount ?? 0)), sub: 'Per transaction', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Event Types', value: eventStats.length.toString(), sub: 'Different categories', icon: BarChart3, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
        ].map((m) => (
          <div key={m.label} className="card-base p-5">
            <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">{m.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alumni by batch */}
        <div className="card-base p-6">
          <h2 className="font-heading font-bold text-foreground text-lg mb-5 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Top Batches by Alumni Count
          </h2>
          <div className="space-y-3">
            {batchStats.map((batch) => {
              const pct = totalUsers > 0 ? Math.round((batch._count.profiles / totalUsers) * 100) : 0;
              return (
                <div key={batch.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{batch.name}</span>
                    <span className="text-muted-foreground">{batch._count.profiles} alumni</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events by type */}
        <div className="card-base p-6">
          <h2 className="font-heading font-bold text-foreground text-lg mb-5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Events by Type
          </h2>
          <div className="space-y-3">
            {eventStats.map((e) => (
              <div key={e.type} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm font-medium text-foreground">{e.type}</span>
                <span className="badge-primary text-xs">{e._count.id} events</span>
              </div>
            ))}
            {eventStats.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No events yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
