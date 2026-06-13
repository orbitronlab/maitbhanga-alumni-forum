'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';

// Placeholder gallery items with solid colors
const galleryItems = [
  { id: '1', title: 'Reunion 2024', color: 'from-blue-600 to-blue-900', span: 'col-span-2 row-span-2' },
  { id: '2', title: 'Sports Day 2024', color: 'from-emerald-600 to-emerald-900', span: '' },
  { id: '3', title: 'Cultural Event', color: 'from-purple-600 to-purple-900', span: '' },
  { id: '4', title: 'Seminar 2024', color: 'from-amber-600 to-amber-900', span: '' },
  { id: '5', title: 'Award Night', color: 'from-rose-600 to-rose-900', span: '' },
];

export function GalleryPreview() {
  return (
    <section className="section-padding bg-white dark:bg-background">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-primary dark:text-white mb-2">
              Photo Gallery
            </h2>
            <p className="text-muted-foreground">Memories from our events and celebrations</p>
          </div>
          <Link href="/gallery" className="btn-outline whitespace-nowrap">
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 auto-rows-[180px]">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${item.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Images className="w-10 h-10 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
