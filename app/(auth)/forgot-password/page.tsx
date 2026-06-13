'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="font-bold text-primary text-sm">Maitbhanga High School</p>
          <p className="text-accent text-xs font-medium">Alumni Forum</p>
        </div>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">We've sent a password reset link to your email address. It expires in 1 hour.</p>
          <Link href="/login" className="btn-primary w-full justify-center">Back to Sign In</Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Forgot password?</h1>
          <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input id="fp-email" type="email" placeholder="your@email.com" {...register('email')} className={`input-base pl-10 ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-primary font-semibold hover:text-accent inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </p>
        </>
      )}
    </motion.div>
  );
}
