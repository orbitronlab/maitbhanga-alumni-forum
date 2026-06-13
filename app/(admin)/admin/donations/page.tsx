'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, Search, Filter,
  Loader2, Eye, Check, X, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'ALL';

interface Donation {
  id: string;
  receiptNumber: string;
  amount: string;
  type: string;
  isAnonymous: boolean;
  message: string | null;
  createdAt: string;
  user: {
    email: string;
    profile: { fullName: string; phone: string } | null;
  };
  payment: {
    id: string;
    method: string;
    status: string;
    gatewayTransactionId: string | null;
    metadata: any;
    paidAt: string | null;
    failureReason: string | null;
  } | null;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentStatus>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Donation | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const fetchDonations = async (status?: string) => {
    setIsLoading(true);
    try {
      const params = status && status !== 'ALL' ? `?status=${status}` : '';
      const res = await fetch(`/api/admin/donations${params}`);
      const data = await res.json();
      setDonations(data.data ?? []);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDonations(filter); }, [filter]);

  const handleAction = async (donationId: string, action: 'APPROVE' | 'REJECT') => {
    setActionLoading(donationId + action);
    try {
      const res = await fetch('/api/admin/donations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId, action, note: rejectNote }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success(data.message);
      setSelected(null);
      setRejectNote('');
      fetchDonations(filter);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = donations.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      d.receiptNumber.toLowerCase().includes(s) ||
      d.user?.email?.toLowerCase().includes(s) ||
      d.user?.profile?.fullName?.toLowerCase().includes(s) ||
      d.payment?.gatewayTransactionId?.toLowerCase().includes(s)
    );
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      PENDING: { color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
      COMPLETED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Verified' },
      FAILED: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' },
    };
    const s = map[status] ?? { color: 'bg-muted text-muted-foreground', icon: null, label: status };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  const methodBadge = (method: string) => {
    const map: Record<string, string> = {
      BKASH: 'bg-[#E2136E]/10 text-[#E2136E]',
      BANK_TRANSFER: 'bg-blue-100 text-blue-700',
      CASH: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[method] ?? 'bg-muted text-muted-foreground'}`}>
        {method.replace('_', ' ')}
      </span>
    );
  };

  const totalPending = donations.filter((d) => d.payment?.status === 'PENDING').length;
  const totalVerified = donations.filter((d) => d.payment?.status === 'COMPLETED').length;
  const totalAmount = donations
    .filter((d) => d.payment?.status === 'COMPLETED')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Donation Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Verify and manage incoming donations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Verification', value: totalPending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Verified Donations', value: totalVerified, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Verified (৳)', value: `৳${totalAmount.toLocaleString()}`, color: 'text-primary', bg: 'bg-primary/5' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-border`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, TrxID..."
            className="input-base pl-9 text-sm h-9"
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'COMPLETED', 'FAILED'] as PaymentStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {s === 'ALL' ? 'All' : s === 'PENDING' ? '⏳ Pending' : s === 'COMPLETED' ? '✅ Verified' : '❌ Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No donations found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {['Receipt', 'Donor', 'Amount', 'Type', 'Method', 'TrxID', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((d) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.receiptNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{d.user?.profile?.fullName ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{d.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">৳{Number(d.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{d.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">{d.payment && methodBadge(d.payment.method)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      {d.payment?.gatewayTransactionId ?? '—'}
                    </td>
                    <td className="px-4 py-3">{d.payment && statusBadge(d.payment.status)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString('en-BD')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelected(d)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {d.payment?.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(d.id, 'APPROVE')}
                              disabled={!!actionLoading}
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                              title="Approve"
                            >
                              {actionLoading === d.id + 'APPROVE' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => { setSelected(d); }}
                              disabled={!!actionLoading}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                              title="Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl border border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold font-heading text-lg">Donation Details</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: 'Receipt No.', value: selected.receiptNumber },
                { label: 'Donor', value: selected.user?.profile?.fullName ?? selected.user?.email },
                { label: 'Email', value: selected.user?.email },
                { label: 'Amount', value: `৳${Number(selected.amount).toLocaleString()}` },
                { label: 'Type', value: selected.type.replace(/_/g, ' ') },
                { label: 'Method', value: selected.payment?.method.replace('_', ' ') ?? '—' },
                { label: 'Transaction ID', value: selected.payment?.gatewayTransactionId ?? '—' },
                { label: 'Sender Name', value: (selected.payment?.metadata as any)?.senderName ?? '—' },
                { label: 'Sender Phone', value: (selected.payment?.metadata as any)?.senderPhone ?? '—' },
                { label: 'Status', value: selected.payment?.status ?? '—' },
                { label: 'Submitted', value: new Date(selected.createdAt).toLocaleString('en-BD') },
                { label: 'Message', value: selected.message ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-48 break-words">{value}</span>
                </div>
              ))}
            </div>

            {selected.payment?.status === 'PENDING' && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rejection Note (optional)</label>
                  <input
                    type="text"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="input-base text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(selected.id, 'APPROVE')}
                    disabled={!!actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    {actionLoading === selected.id + 'APPROVE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'REJECT')}
                    disabled={!!actionLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    {actionLoading === selected.id + 'REJECT' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
