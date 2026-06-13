'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, UserPlus, CheckCircle } from 'lucide-react';

const benefits = [
  'Reconnect with batch-mates and classmates',
  'Access the full alumni directory',
  'Register for exclusive events and reunions',
  'Contribute to school development campaigns',
  'Receive news and announcements directly',
  'Build your professional network',
];

export function JoinCTA() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-card/30">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Join Our Community</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-heading text-primary dark:text-white leading-tight mb-6">
            Are You an Alumni?{' '}
            <span className="text-accent">Register Today</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of proud alumni of Maitbhanga High School. Registration is free
            and takes less than 2 minutes. Membership fee: just ৳500/year.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10 text-left">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2"
              >
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-primary text-base px-10 py-4 animate-pulse-gold">
              <UserPlus className="w-5 h-5" />
              Register as Alumni
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-outline text-base px-10 py-4">
              Already a member? Sign In
            </Link>
          </div>

          <p className="text-muted-foreground text-sm mt-6">
            ✅ Free registration · ✅ Quick approval · ✅ No spam
          </p>
        </motion.div>
      </div>
    </section>
  );
}
