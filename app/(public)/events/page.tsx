import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Maitbhanga Alumni Forum',
  description: 'Browse upcoming and past events organized by Maitbhanga High School Alumni Forum.',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="bg-gradient-hero py-16 text-white">
        <div className="page-container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">Events & Reunions</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join our events — annual reunions, seminars, sports days, and cultural programs.
          </p>
        </div>
      </div>
      <div className="page-container section-padding">
        <div className="bg-white dark:bg-card rounded-2xl shadow-card p-8 text-center">
          <p className="text-muted-foreground">Events list with registration functionality loads from /api/events.</p>
        </div>
      </div>
    </div>
  );
}
