'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, Heart, CalendarDays, Globe, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Registered Alumni',
    description: 'Members from across Bangladesh and worldwide',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: GraduationCap,
    value: '35+',
    label: 'Alumni Batches',
    description: 'From 1990 to present, all batches represented',
    color: 'text-primary bg-primary/5 dark:bg-primary/10',
  },
  {
    icon: Heart,
    value: '৳12.7L+',
    label: 'Total Donations',
    description: 'Raised for school development and scholarships',
    color: 'text-accent-600 bg-accent/10 dark:bg-accent/10',
  },
  {
    icon: CalendarDays,
    value: '50+',
    label: 'Events Organized',
    description: 'Reunions, seminars, and cultural events',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Globe,
    value: '15+',
    label: 'Countries',
    description: 'Alumni living and working across the globe',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: TrendingUp,
    value: '250+',
    label: 'Life Members',
    description: 'Committed lifelong supporters of our school',
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
  },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-white dark:bg-background">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>Our Growing Community</h2>
          <p>
            A proud network of alumni spanning decades, industries, and continents — all
            united by Maitbhanga High School.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-base p-6 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold font-heading text-foreground mb-1">{stat.value}</p>
              <p className="font-semibold text-foreground mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
