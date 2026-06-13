'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Mail, CheckCircle2, Loader2, RefreshCw, ArrowLeft, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

function OtpVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === 5 && newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move back if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const code = otpValue ?? otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    if (!email) {
      toast.error('Email not found. Please register again.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Verification failed.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      setIsSuccess(true);
      toast.success('Email verified successfully!');
      setTimeout(() => router.push('/login?verified=true'), 2500);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) { toast.error('Email not found.'); return; }
    setIsResending(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to resend OTP.');
        return;
      }
      toast.success('New OTP sent! Check your email.');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend. Try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Mask email for display: or****b@gmail.com
  const maskEmail = (e: string) => {
    const [local, domain] = e.split('@');
    if (!domain) return e;
    const masked = local.slice(0, 2) + '****' + local.slice(-1);
    return `${masked}@${domain}`;
  };

  if (isSuccess) {
    return (
      <div className="text-center">
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
        <h2 className="text-2xl font-bold text-green-600 mb-2">Verified! 🎉</h2>
        <p className="text-muted-foreground">Your email has been verified. Redirecting to login...</p>
        <div className="mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
        Check your email
      </h1>
      <p className="text-muted-foreground text-sm mb-1">
        We sent a 6-digit OTP to
      </p>
      <p className="text-primary font-semibold text-sm mb-8">
        {email ? maskEmail(email) : 'your email address'}
      </p>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            disabled={isVerifying}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`
              w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all
              ${digit
                ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/20'
                : 'border-border bg-muted/50 text-foreground'
              }
              focus:border-accent focus:ring-2 focus:ring-accent/30 focus:bg-white
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || otp.some((d) => d === '')}
        className="btn-primary w-full py-3.5 text-base mb-4"
        id="verify-otp-btn"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            Verify OTP
          </>
        )}
      </button>

      {/* Resend */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Didn't receive it?</span>
        {countdown > 0 ? (
          <span className="text-primary font-medium">
            Resend in {countdown}s
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-semibold hover:text-accent transition-colors flex items-center gap-1"
          >
            {isResending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Resend OTP
          </button>
        )}
      </div>

      {/* Expiry note */}
      <p className="text-xs text-muted-foreground mt-4">
        ⏳ OTP expires in 10 minutes
      </p>

      {/* Back link */}
      <div className="mt-6 pt-6 border-t border-border">
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Register
        </Link>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <span className="text-sm font-bold text-primary hidden sm:block">Maitbhanga Alumni Forum</span>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <OtpVerifyForm />
        </Suspense>
      </div>
    </div>
  );
}
