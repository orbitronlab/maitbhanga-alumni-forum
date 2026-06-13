'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bell, Calendar, Tag } from 'lucide-react';

const news = [
  {
    id: '1',
    title: 'Welcome to Maitbhanga High School Alumni Forum',
    excerpt: 'Announcing the launch of the official Maitbhanga High School Alumni Forum — your digital home.',
    category: 'Announcement',
    isNotice: false,
    date: 'June 13, 2025',
  },
  {
    id: '2',
    title: 'Registration Open: Grand Reunion 2025',
    excerpt: 'Registration is now open for Grand Reunion 2025. October 15, 2025 at the school campus. Fee: ৳500.',
    category: 'Event',
    isNotice: true,
    date: 'June 10, 2025',
  },
  {
    id: '3',
    title: 'Library Development Fund Reaches 25% of Goal',
    excerpt: 'Thanks to the generosity of our alumni, the library development fund has reached ৳1,27,500 of our ৳5,00,000 goal.',
    category: 'Donation',
    isNotice: false,
    date: 'June 5, 2025',
  },
];

const categoryColors: Record<string, string> = {
  Announcement: 'badge-primary',
  Event: 'badge-accent',
  Donation: 'badge-success',
  Notice: 'badge-warning',
};

export function NewsSection() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-card/30">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-primary dark:text-white mb-2">
              Latest News & Notices
            </h2>
            <p className="text-muted-foreground">Stay updated with the latest from our alumni community</p>
          </div>
          <Link href="/news" className="btn-outline whitespace-nowrap">
            All News
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-base overflow-hidden group"
            >
              {/* Top accent */}
              <div className="h-1 bg-gradient-gold" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {item.isNotice && (
                    <span className="badge-warning flex items-center gap-1 text-xs">
                      <Bell className="w-3 h-3" /> Notice
                    </span>
                  )}
                  <span className={`${categoryColors[item.category] ?? 'badge-primary'} flex items-center gap-1 text-xs`}>
                    <Tag className="w-3 h-3" /> {item.category}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors">
                  <Link href={`/news/${item.id}`}>{item.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <Link
                    href={`/news/${item.id}`}
                    className="text-primary text-sm font-semibold hover:text-accent transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
