import Link from 'next/link';
import {
  GraduationCap, MapPin, Phone, Mail, Facebook,
  Youtube, Heart, ExternalLink
} from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Forum' },
    { href: '/alumni-directory', label: 'Alumni Directory' },
    { href: '/events', label: 'Events' },
    { href: '/news', label: 'News & Notices' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/donate', label: 'Donate' },
    { href: '/contact', label: 'Contact Us' },
  ],
  memberLinks: [
    { href: '/register', label: 'Register as Alumni' },
    { href: '/login', label: 'Member Login' },
    { href: '/dashboard', label: 'My Dashboard' },
    { href: '/profile', label: 'Update Profile' },
    { href: '/donations', label: 'Donation History' },
    { href: '/my-events', label: 'My Events' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 dark:bg-gray-950 text-white">
      {/* Main footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-primary-900" />
              </div>
              <div>
                <p className="font-bold text-white leading-tight font-heading">
                  Maitbhanga High School
                </p>
                <p className="text-accent text-sm font-semibold leading-tight">
                  Alumni Forum
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting generations of proud alumni of Maitbhanga High School.
              Together we celebrate our shared heritage and build a stronger future.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com/maitbhangaalumni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-accent hover:text-primary-900 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@maitbhangaalumni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-accent hover:text-primary-900 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-5 pb-2 border-b border-white/10">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full group-hover:w-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Area */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-5 pb-2 border-b border-white/10">
              Member Area
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.memberLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full group-hover:w-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-5 pb-2 border-b border-white/10">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Maitbhanga High School<br />
                  Sandwip, Chattogram<br />
                  Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="tel:+8801700000000"
                  className="text-gray-400 hover:text-accent text-sm transition-colors"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="mailto:info@maitbhangaalumni.org"
                  className="text-gray-400 hover:text-accent text-sm transition-colors break-all"
                >
                  info@maitbhangaalumni.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {currentYear} Maitbhanga High School Alumni Forum. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for our alumni community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
