import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Tag, Calendar, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Notices | Maitbhanga Alumni Forum',
  description: 'Latest news, announcements and official notices from Maitbhanga High School Alumni Forum.',
};

const newsItems = [
  { id: '1', title: 'Welcome to Maitbhanga High School Alumni Forum', excerpt: 'Announcing the official launch of the alumni portal — your digital home.', category: 'Announcement', isNotice: false, date: 'June 13, 2025', slug: 'welcome-to-alumni-forum' },
  { id: '2', title: 'Registration Open: Grand Reunion 2025', excerpt: 'Register for the grand reunion on October 15, 2025. Fee: ৳500/person.', category: 'Event', isNotice: true, date: 'June 10, 2025', slug: 'registration-open-grand-reunion-2025' },
  { id: '3', title: 'Library Development Fund Reaches 25% Goal', excerpt: 'Thanks to our generous alumni, the library fund has reached ৳1,27,500.', category: 'Donation', isNotice: false, date: 'June 5, 2025', slug: 'library-fund-25-percent' },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="bg-gradient-hero py-16 text-white">
        <div className="page-container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">News & Notices</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Stay updated with the latest from our alumni community and school.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Search bar */}
        <div className="relative max-w-lg mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search news and notices..." className="input-base pl-12 w-full" />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['All', 'Announcement', 'Event', 'Donation', 'Notices'].map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${cat === 'All' ? 'bg-primary text-white' : 'bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article key={item.id} className="card-base overflow-hidden group">
              <div className="h-1 bg-gradient-gold" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {item.isNotice && (
                    <span className="badge-warning flex items-center gap-1 text-xs"><Bell className="w-3 h-3" /> Notice</span>
                  )}
                  <span className="badge-primary flex items-center gap-1 text-xs"><Tag className="w-3 h-3" /> {item.category}</span>
                </div>
                <h2 className="font-heading font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />{item.date}
                  </span>
                  <Link href={`/news/${item.slug}`} className="text-primary text-sm font-semibold hover:text-accent transition-colors">
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
