'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Search, CheckCircle, XCircle, Shield, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, formatDateRelative } from '@/lib/utils';
import Link from 'next/link';

interface Props { users: any[]; total: number; page: number; limit: number; status: string; search: string; }

const statusColors: Record<string, string> = {
  ACTIVE: 'badge-success', PENDING: 'badge-warning', SUSPENDED: 'badge-danger', INACTIVE: 'bg-gray-100 text-gray-600',
};
const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'badge-danger', ADMIN: 'badge-primary', ALUMNI: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', GUEST: 'bg-gray-100 text-gray-600',
};

export function AdminUsersClient({ users, total, page, limit, status, search }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(search);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (status) params.set('status', status);
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleAction = async (userId: string, action: 'approve' | 'suspend' | 'activate') => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(`User ${action}d successfully!`);
      router.refresh();
    } catch { toast.error('Action failed. Please try again.'); }
    finally { setLoadingId(null); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> User Management</h1>
          <p className="text-muted-foreground mt-1">{total} total users</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="card-base p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={localSearch} onChange={e => setLocalSearch(e.target.value)} placeholder="Search by name or email..." className="input-base pl-9 py-2 text-sm" />
          </div>
          <button type="submit" className="btn-primary text-sm py-2 px-4">Search</button>
        </form>
        <div className="flex gap-2">
          {['', 'PENDING', 'ACTIVE', 'SUSPENDED'].map((s) => (
            <Link key={s} href={`/admin/users?status=${s}`} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${status === s ? 'bg-primary text-white' : 'bg-muted hover:bg-primary/10 text-muted-foreground'}`}>
              {s || 'All'}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['User', 'Batch', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(user.profile?.fullName ?? user.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.profile?.fullName ?? 'No profile'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{user.profile?.batch?.name ?? '—'}</td>
                  <td className="px-4 py-4"><span className={`badge ${roleColors[user.role] ?? 'badge-primary'} text-xs`}>{user.role}</span></td>
                  <td className="px-4 py-4"><span className={`badge ${statusColors[user.status] ?? 'badge-warning'} text-xs`}>{user.status}</span></td>
                  <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{formatDateRelative(user.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {loadingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <>
                          <Link href={`/admin/users/${user.id}`} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {user.status === 'PENDING' && (
                            <button onClick={() => handleAction(user.id, 'approve')} className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-600" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {user.status === 'ACTIVE' && (
                            <button onClick={() => handleAction(user.id, 'suspend')} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500" title="Suspend">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {user.status === 'SUSPENDED' && (
                            <button onClick={() => handleAction(user.id, 'activate')} className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-600" title="Activate">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</p>
          <div className="flex gap-2">
            <Link href={`/admin/users?page=${page - 1}&status=${status}&search=${search}`} className={`p-2 rounded-lg hover:bg-muted transition-colors ${page <= 1 ? 'opacity-40 pointer-events-none' : ''}`}>
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link href={`/admin/users?page=${page + 1}&status=${status}&search=${search}`} className={`p-2 rounded-lg hover:bg-muted transition-colors ${page >= totalPages ? 'opacity-40 pointer-events-none' : ''}`}>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
