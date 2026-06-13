import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Maitbhanga High School Alumni Forum',
    template: '%s | Maitbhanga Alumni Forum',
  },
  description:
    'Official alumni portal for Maitbhanga High School, Sandwip, Chattogram, Bangladesh. Connect with fellow alumni, participate in events, and support school development.',
  keywords: [
    'Maitbhanga High School',
    'Alumni Forum',
    'Sandwip',
    'Chattogram',
    'Bangladesh',
    'School Alumni',
    'Reunion',
    'Donation',
  ],
  authors: [{ name: 'Maitbhanga High School Alumni Forum' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Maitbhanga High School Alumni Forum',
    title: 'Maitbhanga High School Alumni Forum',
    description:
      'Official alumni portal for Maitbhanga High School, Sandwip, Chattogram, Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0F2D52',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 20px',
              },
              success: {
                style: { background: '#1a5c39' },
                iconTheme: { primary: '#D4AF37', secondary: '#fff' },
              },
              error: {
                style: { background: '#7f1d1d' },
                iconTheme: { primary: '#fca5a5', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
