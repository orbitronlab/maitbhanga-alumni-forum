'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Users, Award, MapPin, Play } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { HomeLangToggle } from '@/components/ui/HomeLangToggle';

export function HeroSection() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Top right language toggle */}
      <div className="absolute top-24 right-4 md:right-8 lg:right-12 z-50">
        <HomeLangToggle />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="page-container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                {h.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight mb-6"
            >
              {h.title}{' '}
              <span className="text-accent">{h.titleHighlight}</span>{' '}
              {h.titleSuffix}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl"
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-gold text-base"
              >
                {h.joinBtn}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/alumni-directory"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 text-base backdrop-blur-sm"
              >
                <Users className="w-5 h-5" />
                {h.findBtn}
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
            >
              {[
                { label: h.statAlumni, value: '5,000+' },
                { label: h.statBatches, value: '35+' },
                { label: h.statEvents, value: '50+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-accent font-heading">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Main card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-gold rounded-3xl blur-2xl opacity-20 scale-110" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: h.cardAlumni, value: '5,000+', color: 'bg-blue-500/20 text-blue-300' },
                    { icon: Award, label: h.cardLife, value: '250+', color: 'bg-amber-500/20 text-amber-300' },
                    { icon: MapPin, label: h.cardCountries, value: '15+', color: 'bg-green-500/20 text-green-300' },
                    { icon: Play, label: h.cardEvents, value: '8', color: 'bg-purple-500/20 text-purple-300' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`${item.color} backdrop-blur-sm rounded-2xl p-5 border border-white/10`}
                    >
                      <item.icon className="w-7 h-7 mb-3" />
                      <p className="text-2xl font-bold font-heading text-white">{item.value}</p>
                      <p className="text-xs text-gray-300 mt-1">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* School info card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-4 bg-white/10 rounded-2xl p-5 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold font-heading">{h.schoolInfo}</p>
                      <p className="text-gray-300 text-sm">{h.schoolSub}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="badge bg-green-500/20 text-green-300 text-xs">{h.active}</span>
                    <span className="badge bg-accent/20 text-accent text-xs">{h.legacy}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -left-6 bg-accent rounded-2xl px-4 py-2 shadow-gold"
            >
              <p className="text-primary-900 font-bold text-sm">{h.joinToday}</p>
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2"
            >
              <p className="text-white font-bold text-sm">{h.legacyBadge}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" className="dark:fill-background" />
        </svg>
      </div>
    </section>
  );
}
