import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturedAlumni } from '@/components/home/FeaturedAlumni';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { DonationCTA } from '@/components/home/DonationCTA';
import { NewsSection } from '@/components/home/NewsSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { JoinCTA } from '@/components/home/JoinCTA';

export const metadata: Metadata = {
  title: 'Maitbhanga High School Alumni Forum — Home',
  description:
    'Welcome to the official alumni portal of Maitbhanga High School, Sandwip, Chattogram. Connect, donate, and stay engaged with your alma mater.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedAlumni />
      <UpcomingEvents />
      <DonationCTA />
      <NewsSection />
      <GalleryPreview />
      <JoinCTA />
    </>
  );
}
