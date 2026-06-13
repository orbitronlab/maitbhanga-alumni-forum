'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, UserPlus, GraduationCap, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RegisterSchema, type RegisterInput } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { agreeToTerms: false },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? 'Registration failed');
        return;
      }

      toast.success('Account created! Check your email for the 6-digit OTP.');
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const batchYears = Array.from({ length: 36 }, (_, i) => currentYear - i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-3 mb-6 lg:hidden">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="font-bold text-primary text-sm">Maitbhanga High School</p>
          <p className="text-accent text-xs font-medium">Alumni Forum</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold font-heading text-foreground mb-1">Create your account</h1>
      <p className="text-muted-foreground mb-6 text-sm">Join the official alumni community</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Md. Rahman Ali"
            {...register('fullName')}
            className={`input-base ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && <p className="mt-1 text-red-500 text-xs">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            className={`input-base ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register('phone')}
            className={`input-base ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        {/* Batch & Roll */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="batchYear" className="block text-sm font-medium text-foreground mb-1.5">
              Passing Year
            </label>
            <select
              id="batchYear"
              {...register('batchYear', { valueAsNumber: true })}
              className="input-base"
            >
              <option value="">Select year</option>
              {batchYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-foreground mb-1.5">
              Roll Number
            </label>
            <input
              id="rollNumber"
              type="text"
              placeholder="e.g. 101"
              {...register('rollNumber')}
              className="input-base"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 chars with number & uppercase"
              {...register('password')}
              className={`input-base pr-11 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
            className={`input-base ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5">
          <input
            id="agreeToTerms"
            type="checkbox"
            {...register('agreeToTerms')}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary cursor-pointer accent-primary"
          />
          <label htmlFor="agreeToTerms" className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:text-accent font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:text-accent font-medium">Privacy Policy</Link>
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3.5 text-base"
          id="register-submit-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already a member?{' '}
        <Link href="/login" className="text-primary font-semibold hover:text-accent transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
