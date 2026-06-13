import type { Metadata } from 'next';
import { Images } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gallery | Maitbhanga Alumni Forum',
  description: 'Photo and video gallery from Maitbhanga High School alumni events, reunions and celebrations.',
};

const albums = [
  { id: '1', name: 'Grand Reunion 2024', count: 48, color: 'from-blue-600 to-blue-900' },
  { id: '2', name: 'Sports Day 2024', count: 32, color: 'from-emerald-600 to-emerald-900' },
  { id: '3', name: 'Cultural Night 2024', count: 56, color: 'from-purple-600 to-purple-900' },
  { id: '4', name: 'School Renovation', count: 24, color: 'from-amber-600 to-amber-900' },
  { id: '5', name: 'Tech Seminar 2024', count: 18, color: 'from-rose-600 to-rose-900' },
  { id: '6', name: 'Alumni Achievements', count: 12, color: 'from-teal-600 to-teal-900' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="bg-gradient-hero py-16 text-white">
        <div className="page-container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">Photo Gallery</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Memories from our events, reunions and celebrations across the years.</p>
        </div>
      </div>
      <div className="page-container section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="card-base overflow-hidden group cursor-pointer">
              <div className={`h-48 bg-gradient-to-br ${album.color} flex items-center justify-center relative`}>
                <Images className="w-12 h-12 text-white/40 group-hover:text-white/70 transition-colors group-hover:scale-110 transition-transform" />
                <div className="absolute top-3 right-3 bg-black/30 rounded-full px-3 py-1 text-white text-xs">
                  {album.count} photos
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-foreground">{album.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{album.count} photos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
