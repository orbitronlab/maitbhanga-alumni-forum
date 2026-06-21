'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, Heart, CalendarDays, Globe, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const statIcons = [Users, GraduationCap, Heart, CalendarDays, Globe, TrendingUp];
const statColors = [
  'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  'text-primary bg-primary/5 dark:bg-primary/10',
  'text-accent-600 bg-accent/10 dark:bg-accent/10',
  'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
];

export function StatsSection() {
  const { t } = useLanguage();
  const s = t.stats;

  const stats = [
    { icon: statIcons[0], value: '5,000+', label: s.registered, color: statColors[0] },
    { icon: statIcons[1], value: '35+', label: s.activeBatches, color: statColors[1] },
    { icon: statIcons[2], value: '৳12.7L+', label: s.raised, color: statColors[2] },
    { icon: statIcons[3], value: '50+', label: s.events, color: statColors[3] },
    { icon: statIcons[4], value: '15+', label: s.countries, color: statColors[4] },
    { icon: statIcons[5], value: '250+', label: s.lifeMem, color: statColors[5] },
  ];

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
          <h2>{s.title}</h2>
          <p>{s.subtitle}</p>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
