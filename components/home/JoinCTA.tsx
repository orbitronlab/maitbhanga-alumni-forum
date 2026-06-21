'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, UserPlus, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const benefitsEn = [
  'Reconnect with batch-mates and classmates',
  'Access the full alumni directory',
  'Register for exclusive events and reunions',
  'Contribute to school development campaigns',
  'Receive news and announcements directly',
  'Build your professional network',
];

const benefitsBn = [
  'ব্যাচমেট ও সহপাঠীদের সাথে পুনরায় সংযুক্ত হোন',
  'সম্পূর্ণ প্রাক্তনী ডিরেক্টরি অ্যাক্সেস করুন',
  'বিশেষ অনুষ্ঠান ও পুনর্মিলনীতে নিবন্ধন করুন',
  'বিদ্যালয় উন্নয়ন ক্যাম্পেইনে অবদান রাখুন',
  'সরাসরি সংবাদ ও ঘোষণা পান',
  'আপনার পেশাদার নেটওয়ার্ক গড়ে তুলুন',
];

export function JoinCTA() {
  const { t, language } = useLanguage();
  const j = t.joinCta;
  const benefits = language === 'bn' ? benefitsBn : benefitsEn;

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
            <span className="text-primary text-sm font-semibold">{j.registerBtn}</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-heading text-primary dark:text-white leading-tight mb-6">
            {j.title}
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            {j.subtitle}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10 text-left">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
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
              {j.registerBtn}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-outline text-base px-10 py-4">
              {j.loginBtn}
            </Link>
          </div>

          <p className="text-muted-foreground text-sm mt-6">
            ✅ {language === 'bn' ? 'বিনামূল্যে নিবন্ধন · ✅ দ্রুত অনুমোদন · ✅ কোনো স্প্যাম নেই' : 'Free registration · ✅ Quick approval · ✅ No spam'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
