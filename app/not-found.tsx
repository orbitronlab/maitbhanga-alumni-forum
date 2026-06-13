'use client';
import Link from 'next/link';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-accent/20 border border-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-8xl font-bold font-heading text-accent mb-4">404</h1>
        <h2 className="text-2xl font-bold font-heading text-white mb-2">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-accent">
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <button onClick={() => history.back()} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
