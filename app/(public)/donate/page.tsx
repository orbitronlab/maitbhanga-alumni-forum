'use client';

import { useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Building2, Smartphone, CheckCircle2, Copy, Loader2,
  ChevronRight, ArrowLeft, Receipt, Info, ExternalLink, User
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Configuration ─────────────────────────────────────────────
// Update these with your real bKash and bank details
const PAYMENT_INFO = {
  bkash: {
    number: '01XXXXXXXXX',        // ← Replace with your bKash number
    accountName: 'Maitbhanga Alumni Forum',
    type: 'Personal',
  },
  bank: {
    bankName: 'Sonali Bank Limited',
    branchName: 'Sandwip Branch',
    accountName: 'Maitbhanga High School Alumni Forum',
    accountNumber: '0000000000000',  // ← Replace with real account number
    routingNumber: '000000000',       // ← Replace with real routing number
    swiftCode: 'BSONBDDH',
  },
};

const DONATION_TYPES = [
  { value: 'ANNUAL_MEMBERSHIP', label: 'Annual Membership Fee', amount: 500, icon: '🎓', description: 'Renew your annual membership' },
  { value: 'LIFE_MEMBERSHIP', label: 'Life Membership', amount: 5000, icon: '⭐', description: 'One-time lifetime membership' },
  { value: 'GENERAL_DONATION', label: 'General Donation', amount: null, icon: '💝', description: 'Any amount, any purpose' },
  { value: 'DEVELOPMENT_FUND', label: 'Development Fund', amount: null, icon: '🏫', description: 'School infrastructure & library' },
];

type Step = 'select' | 'amount' | 'method' | 'instructions' | 'submit' | 'success';

interface DonationData {
  type: string;
  label: string;
  amount: number;
  method: 'BKASH' | 'BANK_TRANSFER';
  transactionId: string;
  senderName: string;
  senderPhone: string;
  message: string;
}

export default function DonatePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [donation, setDonation] = useState<Partial<DonationData>>({
    type: '',
    label: '',
    amount: 0,
    method: 'BKASH',
    transactionId: '',
    senderName: session?.user?.name ?? '',
    senderPhone: '',
    message: '',
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleSubmit = async () => {
    if (!donation.transactionId?.trim()) {
      toast.error('Please enter your Transaction ID');
      return;
    }
    if (donation.transactionId.trim().length < 5) {
      toast.error('Transaction ID seems too short');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donation.amount,
          type: donation.type === 'ANNUAL_MEMBERSHIP' || donation.type === 'LIFE_MEMBERSHIP'
            ? 'MEMBERSHIP_FEE'
            : donation.type === 'DEVELOPMENT_FUND' ? 'DEVELOPMENT_FUND' : 'GENERAL_DONATION',
          paymentMethod: donation.method,
          transactionId: donation.transactionId?.trim(),
          senderName: donation.senderName?.trim(),
          senderPhone: donation.senderPhone?.trim(),
          message: donation.message?.trim() || null,
          isAnonymous: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Submission failed. Please try again.');
        return;
      }

      setReceiptNumber(data.donation?.receiptNumber ?? '');
      setStep('success');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step: Select Type ──────────────────────────────────────
  if (step === 'select') {
    return (
      <PageShell title="Make a Donation" subtitle="Choose what you'd like to contribute to">
        <div className="grid sm:grid-cols-2 gap-4">
          {DONATION_TYPES.map((t) => (
            <motion.button
              key={t.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDonation((d) => ({
                  ...d, type: t.value, label: t.label,
                  amount: t.amount ?? 0,
                }));
                setStep(t.amount ? 'method' : 'amount');
              }}
              className="text-left p-5 rounded-2xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <span className="text-3xl mb-3 block">{t.icon}</span>
              <h3 className="font-bold text-foreground font-heading group-hover:text-primary">{t.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              {t.amount && (
                <p className="text-xl font-bold text-accent mt-2">৳{t.amount.toLocaleString()}</p>
              )}
            </motion.button>
          ))}
        </div>
      </PageShell>
    );
  }

  // ── Step: Enter Amount ─────────────────────────────────────
  if (step === 'amount') {
    const quickAmounts = [100, 250, 500, 1000, 2500, 5000];
    return (
      <PageShell title={donation.label!} subtitle="Enter the amount you'd like to donate" onBack={() => setStep('select')}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Donation Amount (BDT)
          </label>
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-accent">৳</span>
            <input
              type="number"
              min="10"
              value={donation.amount || ''}
              onChange={(e) => setDonation((d) => ({ ...d, amount: Number(e.target.value) }))}
              placeholder="0"
              className="input-base pl-10 text-2xl font-bold h-14"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setDonation((d) => ({ ...d, amount: a }))}
                className={`py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                  donation.amount === a
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-primary text-muted-foreground hover:text-primary'
                }`}
              >
                ৳{a.toLocaleString()}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (!donation.amount || donation.amount < 10) {
                toast.error('Minimum donation is ৳10');
                return;
              }
              setStep('method');
            }}
            className="btn-primary w-full py-3.5"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Step: Choose Payment Method ───────────────────────────
  if (step === 'method') {
    return (
      <PageShell title="Choose Payment Method" subtitle={`Donating ৳${donation.amount?.toLocaleString()} via:`} onBack={() => setStep(donation.type === 'GENERAL_DONATION' || donation.type === 'DEVELOPMENT_FUND' ? 'amount' : 'select')}>
        <div className="space-y-4">
          {/* bKash */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { setDonation((d) => ({ ...d, method: 'BKASH' })); setStep('instructions'); }}
            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:border-[#E2136E] hover:bg-[#E2136E]/5 transition-all group text-left"
          >
            <div className="w-14 h-14 bg-[#E2136E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg">bKash</p>
              <p className="text-sm text-muted-foreground">Send Money to our bKash number</p>
              <p className="text-xs text-[#E2136E] font-medium mt-1">✅ Instant · Free · Most popular in BD</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#E2136E]" />
          </motion.button>

          {/* Bank Transfer */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { setDonation((d) => ({ ...d, method: 'BANK_TRANSFER' })); setStep('instructions'); }}
            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group text-left"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg">Bank Transfer</p>
              <p className="text-sm text-muted-foreground">Transfer directly to our bank account</p>
              <p className="text-xs text-primary font-medium mt-1">✅ Secure · Works for large amounts</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </motion.button>
        </div>
      </PageShell>
    );
  }

  // ── Step: Payment Instructions ────────────────────────────
  if (step === 'instructions') {
    const isBkash = donation.method === 'BKASH';

    return (
      <PageShell
        title={isBkash ? 'Send via bKash' : 'Bank Transfer'}
        subtitle={`Send exactly ৳${donation.amount?.toLocaleString()} and then submit the Transaction ID below`}
        onBack={() => setStep('method')}
      >
        <div className="space-y-4">
          {/* Payment Details Card */}
          <div className={`rounded-2xl border-2 p-5 ${isBkash ? 'border-[#E2136E]/30 bg-[#E2136E]/5' : 'border-primary/30 bg-primary/5'}`}>
            {isBkash ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#E2136E] rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#E2136E]">bKash Account</p>
                    <p className="text-xs text-muted-foreground">{PAYMENT_INFO.bkash.type}</p>
                  </div>
                </div>
                <InfoRow label="Account Name" value={PAYMENT_INFO.bkash.accountName} onCopy={() => copyToClipboard(PAYMENT_INFO.bkash.accountName, 'Name')} />
                <InfoRow label="bKash Number" value={PAYMENT_INFO.bkash.number} onCopy={() => copyToClipboard(PAYMENT_INFO.bkash.number, 'Number')} highlight />
                <InfoRow label="Amount" value={`৳${donation.amount?.toLocaleString()}`} onCopy={() => copyToClipboard(String(donation.amount), 'Amount')} highlight />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Bank Account</p>
                    <p className="text-xs text-muted-foreground">{PAYMENT_INFO.bank.bankName}</p>
                  </div>
                </div>
                <InfoRow label="Bank" value={PAYMENT_INFO.bank.bankName} />
                <InfoRow label="Branch" value={PAYMENT_INFO.bank.branchName} />
                <InfoRow label="Account Name" value={PAYMENT_INFO.bank.accountName} onCopy={() => copyToClipboard(PAYMENT_INFO.bank.accountName, 'Name')} />
                <InfoRow label="Account No." value={PAYMENT_INFO.bank.accountNumber} onCopy={() => copyToClipboard(PAYMENT_INFO.bank.accountNumber, 'Account No.')} highlight />
                <InfoRow label="Routing No." value={PAYMENT_INFO.bank.routingNumber} onCopy={() => copyToClipboard(PAYMENT_INFO.bank.routingNumber, 'Routing No.')} />
                <InfoRow label="Amount" value={`৳${donation.amount?.toLocaleString()}`} highlight />
              </>
            )}
          </div>

          {/* Steps */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> How to complete:
            </p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              {isBkash ? (
                <>
                  <li>Open bKash app → <strong>Send Money</strong></li>
                  <li>Enter number: <strong>{PAYMENT_INFO.bkash.number}</strong></li>
                  <li>Enter amount: <strong>৳{donation.amount?.toLocaleString()}</strong></li>
                  <li>Add Reference: <strong>Alumni Donation</strong></li>
                  <li>Complete & copy the <strong>Transaction ID (TrxID)</strong></li>
                  <li>Paste the TrxID in the form below</li>
                </>
              ) : (
                <>
                  <li>Go to your bank app or branch</li>
                  <li>Transfer to account: <strong>{PAYMENT_INFO.bank.accountNumber}</strong></li>
                  <li>Enter amount: <strong>৳{donation.amount?.toLocaleString()}</strong></li>
                  <li>Note the <strong>Transaction/Reference ID</strong></li>
                  <li>Fill in the form below with the Transaction ID</li>
                </>
              )}
            </ol>
          </div>

          <button
            onClick={() => setStep('submit')}
            className="btn-primary w-full py-3.5"
          >
            I've Sent the Money → Submit TrxID
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Step: Submit Transaction ID ───────────────────────────
  if (step === 'submit') {
    const isBkash = donation.method === 'BKASH';
    return (
      <PageShell
        title="Submit Transaction ID"
        subtitle="Fill in your details and transaction ID so we can verify your payment"
        onBack={() => setStep('instructions')}
      >
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-muted/50 rounded-xl p-4 flex justify-between items-center text-sm border border-border">
            <div>
              <p className="text-muted-foreground">Donation Type</p>
              <p className="font-semibold text-foreground">{donation.label}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Amount</p>
              <p className="font-bold text-accent text-xl">৳{donation.amount?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">via</p>
              <p className={`font-bold ${isBkash ? 'text-[#E2136E]' : 'text-primary'}`}>
                {isBkash ? 'bKash' : 'Bank'}
              </p>
            </div>
          </div>

          {/* Sender Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={donation.senderName}
                onChange={(e) => setDonation((d) => ({ ...d, senderName: e.target.value }))}
                placeholder="Md. Rahman Ali"
                className="input-base pl-10"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {isBkash ? 'bKash Sender Number' : 'Your Phone Number'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={donation.senderPhone}
                onChange={(e) => setDonation((d) => ({ ...d, senderPhone: e.target.value }))}
                placeholder="01XXXXXXXXX"
                className="input-base pl-10"
              />
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Transaction ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={donation.transactionId}
              onChange={(e) => setDonation((d) => ({ ...d, transactionId: e.target.value.toUpperCase() }))}
              placeholder={isBkash ? 'e.g. 8H5A3B2C1D' : 'Bank Transaction/Reference No.'}
              className="input-base font-mono tracking-wider"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isBkash
                ? 'Found in bKash app → Transaction History → TrxID'
                : 'Found in your bank receipt or online banking statement'}
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Note / Message <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <textarea
              value={donation.message}
              onChange={(e) => setDonation((d) => ({ ...d, message: e.target.value }))}
              placeholder="Any message for the alumni committee..."
              rows={2}
              className="input-base resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !donation.transactionId?.trim() || !donation.senderName?.trim() || !donation.senderPhone?.trim()}
            className="btn-primary w-full py-3.5"
            id="submit-donation-btn"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              <><Receipt className="w-5 h-5" /> Submit Donation</>
            )}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Your donation will be verified within 24 hours. You'll receive a confirmation email.
          </p>
        </div>
      </PageShell>
    );
  }

  // ── Step: Success ─────────────────────────────────────────
  if (step === 'success') {
    return (
      <PageShell title="" subtitle="">
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-green-700 font-heading mb-2">Thank You! 🙏</h2>
          <p className="text-muted-foreground mb-4">
            Your donation of <strong className="text-accent">৳{donation.amount?.toLocaleString()}</strong> has been submitted successfully.
          </p>
          <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6 text-sm">
            <p className="text-muted-foreground">Receipt Number</p>
            <p className="font-mono font-bold text-primary text-lg">{receiptNumber}</p>
            <p className="text-xs text-muted-foreground mt-1">Save this for your records</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
            <p className="font-semibold mb-1">⏳ What happens next?</p>
            <p>Our team will verify your transaction within <strong>24 hours</strong>. You'll receive a confirmation email once approved.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setStep('select'); setDonation({ type: '', label: '', amount: 0, method: 'BKASH', transactionId: '', senderName: session?.user?.name ?? '', senderPhone: '', message: '' }); }}
              className="flex-1 btn-outline py-3"
            >
              Donate Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 btn-primary py-3"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return null;
}

// ── Reusable Components ────────────────────────────────────

function InfoRow({ label, value, onCopy, highlight }: {
  label: string; value: string; onCopy?: () => void; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-border/50 last:border-0 ${highlight ? 'font-bold' : ''}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${highlight ? 'text-primary text-base' : 'text-foreground'}`}>{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-muted-foreground hover:text-primary transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function PageShell({ title, subtitle, children, onBack }: {
  title: string; subtitle: string; children: React.ReactNode; onBack?: () => void;
}) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-gradient-hero py-14 text-white">
        <div className="page-container text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-3">Support Our School</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm">
            Every contribution helps build a better future for Maitbhanga High School
          </p>
        </div>
      </div>

      <div className="page-container max-w-lg mx-auto -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl shadow-xl p-6"
        >
          {/* Progress steps */}
          <StepIndicator current={['select', 'amount', 'method', 'instructions', 'submit', 'success'].indexOf(title === '' ? 'success' : 'select')} />

          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {title && (
            <div className="mb-6">
              <h2 className="text-xl font-bold font-heading text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Type', 'Amount', 'Method', 'Pay', 'Submit', 'Done'];
  return (
    <div className="flex items-center justify-center gap-1 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition-all ${
            i <= current ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-5 h-0.5 ${i < current ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
