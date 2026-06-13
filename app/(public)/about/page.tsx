import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Users, Heart, Trophy, MapPin, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Maitbhanga High School Alumni Forum',
  description: 'Learn about Maitbhanga High School Alumni Forum — our history, mission, and committee members.',
};

const committeeMembers = [
  { name: 'Md. Abdul Karim', role: 'President', batch: 'SSC 1990', photo: null },
  { name: 'Nasrin Begum', role: 'Vice President', batch: 'SSC 1995', photo: null },
  { name: 'Md. Rakibul Islam', role: 'General Secretary', batch: 'SSC 2000', photo: null },
  { name: 'Fatema Akter', role: 'Treasurer', batch: 'SSC 2002', photo: null },
  { name: 'Md. Shahidul Haque', role: 'Joint Secretary', batch: 'SSC 1998', photo: null },
  { name: 'Roksana Parvin', role: 'Cultural Secretary', batch: 'SSC 2005', photo: null },
];

const milestones = [
  { year: '1950', event: 'Maitbhanga High School established' },
  { year: '1975', event: 'First formal alumni gathering organized' },
  { year: '2000', event: 'Alumni Association officially registered' },
  { year: '2010', event: 'First grand reunion with 500+ attendees' },
  { year: '2020', event: 'Digital presence established on social media' },
  { year: '2025', event: 'Official Alumni Portal launched' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="bg-gradient-hero py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-semibold">Est. 1950 · Sandwip, Chattogram</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-4">About Our Forum</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Maitbhanga High School Alumni Forum is the official platform uniting thousands of proud graduates.
            We celebrate a shared legacy of 75+ years of education, friendship, and community service.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section-padding bg-white dark:bg-background">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-heading text-primary dark:text-white mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Maitbhanga High School Alumni Forum exists to foster lasting connections among all graduates of
                Maitbhanga High School. We believe in the power of community, shared memories, and giving back.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our mission is to connect alumni across generations and geographies, support the school's development
                through donations and volunteering, and preserve the rich legacy of our alma mater.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: 'Connect Alumni', desc: 'Build lasting bonds' },
                  { icon: Heart, label: 'Give Back', desc: 'Fund school development' },
                  { icon: Trophy, label: 'Celebrate Success', desc: 'Honor achievements' },
                  { icon: GraduationCap, label: 'Preserve Legacy', desc: '75+ year heritage' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                    <item.icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.label}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-hero rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl text-accent mb-6">Our School</h3>
                {[
                  { icon: MapPin, label: 'Location', value: 'Sandwip, Chattogram, Bangladesh' },
                  { icon: Calendar, label: 'Established', value: '1950' },
                  { icon: GraduationCap, label: 'Total Graduates', value: '10,000+' },
                  { icon: Users, label: 'Active Alumni', value: '5,000+' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 mb-4">
                    <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">{item.label}</p>
                      <p className="text-white font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50 dark:bg-card/30">
        <div className="page-container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>Key milestones in the history of Maitbhanga High School and its alumni community</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-30" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-primary z-10">
                      {m.year}
                    </div>
                    <div className="card-base p-5 flex-1 mt-2">
                      <p className="text-foreground font-medium">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee */}
      <section className="section-padding bg-white dark:bg-background">
        <div className="page-container">
          <div className="section-header">
            <h2>Executive Committee</h2>
            <p>Dedicated volunteers leading the Alumni Forum</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {committeeMembers.map((m, i) => (
              <div key={m.name} className="card-base p-5 text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform shadow-primary">
                  {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <p className="font-semibold text-foreground text-sm leading-tight">{m.name}</p>
                <p className="text-accent text-xs font-medium mt-1">{m.role}</p>
                <p className="text-muted-foreground text-xs mt-1">{m.batch}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-hero text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Become Part of Our Story</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of proud alumni and help us build an even brighter future for Maitbhanga High School.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-accent">Join the Forum</Link>
            <Link href="/donate" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all">Support the School</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
