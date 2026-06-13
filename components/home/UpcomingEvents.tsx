'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, Users, Ticket } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const events = [
  {
    id: '1',
    title: 'Grand Reunion 2025 — All Batches',
    date: 'October 15, 2025',
    time: '9:00 AM – 6:00 PM',
    location: 'Maitbhanga High School Campus, Sandwip',
    attendees: 250,
    maxAttendees: 1000,
    fee: 500,
    type: 'REUNION',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Tech & Career Seminar for Young Alumni',
    date: 'August 20, 2025',
    time: '10:00 AM – 4:00 PM',
    location: 'Chittagong Chamber of Commerce',
    attendees: 45,
    maxAttendees: 200,
    fee: 0,
    type: 'SEMINAR',
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Annual Sports Day 2025',
    date: 'September 5, 2025',
    time: '8:00 AM – 5:00 PM',
    location: 'Maitbhanga High School Ground',
    attendees: 120,
    maxAttendees: 500,
    fee: 200,
    type: 'SPORTS',
    isFeatured: false,
  },
];

const typeColors: Record<string, string> = {
  REUNION: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  SEMINAR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  SPORTS: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  CULTURAL: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  FUNDRAISER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
};

export function UpcomingEvents() {
  return (
    <section className="section-padding bg-white dark:bg-background">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2>Upcoming Events</h2>
          <p>Don't miss out on our exciting events, reunions, and programs.</p>
        </motion.div>

        <div className="space-y-5">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="card-base p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              {/* Date badge */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-2xl flex flex-col items-center justify-center text-white shadow-primary">
                <span className="text-xs font-medium opacity-80">
                  {event.date.split(' ')[0].toUpperCase()}
                </span>
                <span className="text-2xl font-bold font-heading leading-tight">
                  {event.date.split(' ')[1].replace(',', '')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {event.isFeatured && (
                    <span className="badge bg-accent/20 text-accent-700 dark:text-accent">⭐ Featured</span>
                  )}
                  <span className={`badge ${typeColors[event.type] ?? 'badge-primary'}`}>
                    {event.type.charAt(0) + event.type.slice(1).toLowerCase()}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg mb-2 truncate">{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    {event.date} · {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    {event.attendees} / {event.maxAttendees} registered
                  </span>
                </div>
              </div>

              {/* Fee & CTA */}
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <div className="text-right">
                  {event.fee > 0 ? (
                    <>
                      <p className="text-xs text-muted-foreground">Registration Fee</p>
                      <p className="text-xl font-bold text-accent">{formatCurrency(event.fee)}</p>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-emerald-600">FREE</p>
                  )}
                </div>
                <Link
                  href={`/events/${event.id}`}
                  className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap"
                >
                  <Ticket className="w-4 h-4" />
                  Register Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/events" className="btn-outline">
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
