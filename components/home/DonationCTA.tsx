'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Target, TrendingUp } from 'lucide-react';
import { calculateProgress, formatCurrency } from '@/lib/utils';

const campaigns = [
  {
    id: '1',
    title: 'School Library Development Fund 2025',
    description: 'Build a modern digital library with books, computers, and study spaces for students.',
    goal: 500000,
    raised: 127500,
    donors: 43,
  },
  {
    id: '2',
    title: 'Annual Reunion 2025 — Event Fund',
    description: 'Support organizing the grand reunion for all batches.',
    goal: 200000,
    raised: 45000,
    donors: 18,
  },
];

export function DonationCTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-primary" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-semibold">Support Our School</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-white leading-tight mb-6">
              Give Back to Your{' '}
              <span className="text-accent">Alma Mater</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Your donations directly fund school infrastructure, student scholarships,
              library resources, and events that benefit hundreds of students every year.
              Every taka counts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/donate" className="btn-accent">
                Donate Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/donate" className="inline-flex items-center gap-2 text-white border border-white/30 hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-all">
                View Campaigns
              </Link>
            </div>
            {/* Impact stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
              {[
                { value: '৳12.7L+', label: 'Total Raised' },
                { value: '320+', label: 'Donors' },
                { value: '5', label: 'Active Campaigns' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-accent font-heading">{s.value}</p>
                  <p className="text-gray-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campaign cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {campaigns.map((campaign, i) => {
              const progress = calculateProgress(campaign.raised, campaign.goal);
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-white text-base leading-tight">{campaign.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{campaign.description}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-accent font-bold">{formatCurrency(campaign.raised)}</span>
                      <span className="text-gray-400">of {formatCurrency(campaign.goal)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-gold rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{progress}% funded</span>
                      <span>{campaign.donors} donors</span>
                    </div>
                  </div>
                  <Link
                    href={`/donate?campaign=${campaign.id}`}
                    className="inline-flex items-center gap-1.5 text-accent hover:text-white text-sm font-semibold transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Support this campaign
                  </Link>
                </motion.div>
              );
            })}

            {/* Membership fee CTA */}
            <div className="bg-accent/20 border border-accent/30 rounded-2xl p-5 text-center">
              <p className="text-white font-semibold mb-1">Become a Member</p>
              <p className="text-gray-300 text-sm mb-3">Annual fee: <span className="text-accent font-bold">৳500</span> · Life membership: <span className="text-accent font-bold">৳5,000</span></p>
              <Link href="/register" className="btn-accent text-sm py-2">
                Register & Pay Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
