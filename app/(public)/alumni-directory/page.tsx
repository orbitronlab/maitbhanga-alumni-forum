import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumni Directory | Maitbhanga High School Alumni Forum',
  description: 'Search and connect with thousands of Maitbhanga High School alumni across Bangladesh and the world.',
};

export default function AlumniDirectoryPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="bg-gradient-hero py-16 text-white">
        <div className="page-container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">Alumni Directory</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect with thousands of proud alumni from all batches. Search by name, profession, or batch year.
          </p>
        </div>
      </div>
      {/* Content loads from client component with API */}
      <div className="page-container section-padding">
        <div className="bg-white dark:bg-card rounded-2xl shadow-card p-8 text-center">
          <p className="text-muted-foreground">Alumni directory with search & filters loads here. Connect your API to populate alumni cards.</p>
        </div>
      </div>
    </div>
  );
}
