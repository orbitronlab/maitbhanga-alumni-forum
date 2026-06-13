'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { EventSchema, type EventInput } from '@/lib/validators';

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: { requiresPayment: false, isFeatured: false, isPublic: true },
  });

  const onSubmit = async (data: EventInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      toast.success('Event created successfully!');
      router.push('/admin/events');
    } catch { toast.error('Failed to create event'); }
    finally { setIsLoading(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" /> Create New Event
        </h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Event Title *</label>
            <input {...register('title')} className={`input-base ${errors.title ? 'border-red-500' : ''}`} placeholder="e.g. Grand Reunion 2025" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
            <textarea {...register('description')} rows={5} className={`input-base resize-none ${errors.description ? 'border-red-500' : ''}`} placeholder="Detailed description of the event..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Event Type *</label>
              <select {...register('type')} className="input-base">
                {['REUNION', 'SEMINAR', 'FUNDRAISER', 'SPORTS', 'CULTURAL', 'OTHER'].map(t => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input {...register('location')} className="input-base" placeholder="Venue or Online" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Start Date & Time *</label>
              <input {...register('startDate')} type="datetime-local" className="input-base" />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">End Date & Time *</label>
              <input {...register('endDate')} type="datetime-local" className="input-base" />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Max Attendees</label>
              <input {...register('maxAttendees', { valueAsNumber: true })} type="number" className="input-base" placeholder="Leave empty for unlimited" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Registration Fee (৳)</label>
              <input {...register('registrationFee', { valueAsNumber: true })} type="number" min="0" className="input-base" placeholder="0 for free" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { key: 'requiresPayment', label: 'Requires Payment' },
              { key: 'isFeatured', label: 'Featured Event' },
              { key: 'isPublic', label: 'Public (visible to all)' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(item.key as any)} className="h-4 w-4 accent-primary" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Save className="w-4 h-4" /> Create Event</>}
            </button>
            <Link href="/admin/events" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
