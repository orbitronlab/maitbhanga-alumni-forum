import { GraduationCap } from 'lucide-react';

// Auth layout is kept simple — session redirect is handled by middleware
// to avoid the "Event handlers cannot be passed to Client Component" SSR error
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Maitbhanga High School</p>
              <p className="text-accent text-sm">Alumni Forum · Est. 1952</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold font-heading text-white leading-tight mb-6">
            Welcome to Your<br />
            <span className="text-accent">Alumni Home</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Connect with thousands of proud alumni of Maitbhanga High School.
            Reconnect, contribute, and build lasting bonds.
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-3">
            {[
              '🎓 Access alumni directory',
              '💰 Donate to development funds',
              '📅 Register for events & reunions',
              '📰 Stay updated with news',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '5,000+', label: 'Alumni' },
              { value: '35+', label: 'Batches' },
              { value: '৳12.7L+', label: 'Donated' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/10 text-center">
                <p className="text-accent text-xl font-bold font-heading">{s.value}</p>
                <p className="text-gray-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
