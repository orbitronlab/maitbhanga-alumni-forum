'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { getInitials } from '@/lib/utils';

// Sample data — in production this comes from the API
const featuredAlumni = [
  {
    id: '1',
    name: 'Dr. Md. Rafiqul Islam',
    batch: 'SSC 2000',
    profession: 'Cardiologist',
    company: 'Chittagong Medical College Hospital',
    location: 'Chattogram, Bangladesh',
    avatar: null,
    initials: 'RI',
  },
  {
    id: '2',
    name: 'Eng. Nasrin Akter',
    batch: 'SSC 2005',
    profession: 'Software Engineer',
    company: 'Samsung R&D Institute',
    location: 'Dhaka, Bangladesh',
    avatar: null,
    initials: 'NA',
  },
  {
    id: '3',
    name: 'Barrister Kamal Hossain',
    batch: 'SSC 1995',
    profession: 'Senior Advocate',
    company: 'Bangladesh Supreme Court',
    location: 'Dhaka, Bangladesh',
    avatar: null,
    initials: 'KH',
  },
  {
    id: '4',
    name: 'Prof. Salma Begum',
    batch: 'SSC 1998',
    profession: 'Professor of Economics',
    company: 'University of Chittagong',
    location: 'Chattogram, Bangladesh',
    avatar: null,
    initials: 'SB',
  },
  {
    id: '5',
    name: 'Md. Jahirul Haque',
    batch: 'SSC 2010',
    profession: 'Entrepreneur',
    company: 'JH Group of Industries',
    location: 'Dhaka, Bangladesh',
    avatar: null,
    initials: 'JH',
  },
  {
    id: '6',
    name: 'Farhana Islam',
    batch: 'SSC 2012',
    profession: 'Civil Engineer',
    company: 'LGED Bangladesh',
    location: 'Sandwip, Chattogram',
    avatar: null,
    initials: 'FI',
  },
];

const avatarColors = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
  'from-teal-600 to-teal-800',
];

export function FeaturedAlumni() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-card/30">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2>Distinguished Alumni</h2>
          <p>
            Our alumni are making a difference across medicine, law, technology,
            education, and business — around Bangladesh and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-base p-6 text-center group"
            >
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {alumni.initials}
              </div>

              <h3 className="font-heading font-bold text-foreground text-lg mb-1">{alumni.name}</h3>

              <div className="flex items-center justify-center gap-1 mb-3">
                <GraduationCap className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium">{alumni.batch}</span>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary/60" />
                  <span>{alumni.profession}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs text-muted-foreground/70">{alumni.company}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" />
                  <span>{alumni.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/alumni-directory" className="btn-primary">
            View All Alumni
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
