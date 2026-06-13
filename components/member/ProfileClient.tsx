'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { User, Save, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProfileUpdateSchema, type ProfileUpdateInput } from '@/lib/validators';

interface Props { profile: any; batches: any[]; userId: string; userEmail: string; }

export function ProfileClient({ profile, batches, userId, userEmail }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'social'>('personal');

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      fullName: profile?.fullName ?? '',
      nameInBangla: profile?.nameInBangla ?? '',
      gender: profile?.gender ?? undefined,
      phone: profile?.phone ?? '',
      altPhone: profile?.altPhone ?? '',
      bio: profile?.bio ?? '',
      rollNumber: profile?.rollNumber ?? '',
      currentAddress: profile?.currentAddress ?? '',
      permanentAddress: profile?.permanentAddress ?? '',
      city: profile?.city ?? '',
      country: profile?.country ?? 'Bangladesh',
      profession: profile?.profession ?? '',
      company: profile?.company ?? '',
      designation: profile?.designation ?? '',
      facebookUrl: profile?.facebookUrl ?? '',
      linkedinUrl: profile?.linkedinUrl ?? '',
      twitterUrl: profile?.twitterUrl ?? '',
      websiteUrl: profile?.websiteUrl ?? '',
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'professional', label: 'Professional' },
    { key: 'social', label: 'Social Links' },
  ] as const;

  return (
    <div className="pt-16 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your alumni profile information</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-base p-6 text-center h-fit">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-primary flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-primary">
              {profile?.fullName?.charAt(0) ?? 'A'}
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-accent hover:bg-accent-600 rounded-full flex items-center justify-center shadow-gold transition-colors">
              <Camera className="w-4 h-4 text-primary-900" />
            </button>
          </div>
          <h2 className="font-heading font-bold text-foreground text-xl">{profile?.fullName ?? 'Your Name'}</h2>
          <p className="text-accent text-sm font-medium mt-1">{profile?.batch?.name ?? 'Batch not set'}</p>
          <p className="text-muted-foreground text-sm mt-1">{userEmail}</p>
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Roll Number</span>
              <span className="font-medium text-foreground">{profile?.rollNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passing Year</span>
              <span className="font-medium text-foreground">{profile?.passingYear ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Membership</span>
              <span className={`font-medium ${profile?.isLifeMember ? 'text-accent' : 'text-foreground'}`}>
                {profile?.isLifeMember ? '⭐ Life Member' : 'Annual'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-base p-6 lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white dark:bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {activeTab === 'personal' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                    <input {...register('fullName')} className={`input-base ${errors.fullName ? 'border-red-500' : ''}`} placeholder="Your full name" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Name in Bangla</label>
                    <input {...register('nameInBangla')} className="input-base" placeholder="আপনার নাম" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
                    <select {...register('gender')} className="input-base">
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                    <input {...register('phone')} className="input-base" placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Roll Number</label>
                    <input {...register('rollNumber')} className="input-base" placeholder="e.g. 101" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <input {...register('country')} className="input-base" placeholder="Bangladesh" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Address</label>
                  <textarea {...register('currentAddress')} rows={2} className="input-base resize-none" placeholder="Your current address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                  <textarea {...register('bio')} rows={3} className="input-base resize-none" placeholder="Tell us about yourself..." />
                </div>
              </>
            )}
            {activeTab === 'professional' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Profession</label>
                    <input {...register('profession')} className="input-base" placeholder="e.g. Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Company / Organization</label>
                    <input {...register('company')} className="input-base" placeholder="Company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Designation</label>
                    <input {...register('designation')} className="input-base" placeholder="Your job title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                    <input {...register('city')} className="input-base" placeholder="City" />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'social' && (
              <div className="space-y-4">
                {[
                  { key: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://facebook.com/yourname' },
                  { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourname' },
                  { key: 'twitterUrl', label: 'Twitter/X URL', placeholder: 'https://twitter.com/yourname' },
                  { key: 'websiteUrl', label: 'Personal Website', placeholder: 'https://yourwebsite.com' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                    <input {...register(field.key as keyof ProfileUpdateInput)} className="input-base" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
