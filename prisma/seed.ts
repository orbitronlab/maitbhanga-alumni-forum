import { PrismaClient, UserRole, UserStatus, VerificationStatus, ContentStatus, CampaignStatus, EventStatus, EventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─────────────────────────────────────────────
  // ALUMNI BATCHES
  // ─────────────────────────────────────────────
  const batchYears = [1990, 1995, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  
  const batches = await Promise.all(
    batchYears.map((year) =>
      prisma.alumniBatch.upsert({
        where: { year },
        update: {},
        create: {
          name: `SSC ${year}`,
          year,
          description: `Maitbhanga High School SSC Batch of ${year}`,
          isActive: true,
        },
      })
    )
  );
  console.log(`✅ Created ${batches.length} alumni batches`);

  // ─────────────────────────────────────────────
  // SUPER ADMIN
  // ─────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@maitbhangaalumni.org' },
    update: {},
    create: {
      email: 'admin@maitbhangaalumni.org',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      emailVerified: new Date(),
      profile: {
        create: {
          fullName: 'Super Administrator',
          phone: '+8801700000000',
          profession: 'Administrator',
          country: 'Bangladesh',
        },
      },
    },
  });
  console.log(`✅ Super admin created: ${superAdmin.email}`);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'moderator@maitbhangaalumni.org' },
    update: {},
    create: {
      email: 'moderator@maitbhangaalumni.org',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      emailVerified: new Date(),
      profile: {
        create: {
          fullName: 'Forum Moderator',
          phone: '+8801700000001',
          profession: 'Teacher',
          country: 'Bangladesh',
        },
      },
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Sample alumni member
  const batch2005 = batches.find(b => b.year === 2005);
  const alumni1 = await prisma.user.upsert({
    where: { email: 'demo.alumni@maitbhangaalumni.org' },
    update: {},
    create: {
      email: 'demo.alumni@maitbhangaalumni.org',
      password: hashedPassword,
      role: UserRole.ALUMNI,
      status: UserStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      emailVerified: new Date(),
      profile: {
        create: {
          fullName: 'Demo Alumni Member',
          nameInBangla: 'ডেমো অ্যালামনাই সদস্য',
          phone: '+8801800000001',
          batchId: batch2005?.id,
          rollNumber: '101',
          passingYear: 2005,
          profession: 'Software Engineer',
          company: 'Tech Solutions Ltd',
          designation: 'Senior Developer',
          currentAddress: 'Dhaka, Bangladesh',
          country: 'Bangladesh',
          bio: 'A proud alumni of Maitbhanga High School.',
        },
      },
    },
  });
  console.log(`✅ Demo alumni created: ${alumni1.email}`);

  // ─────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'Maitbhanga High School Alumni Forum', group: 'general', label: 'Site Name', isPublic: true },
    { key: 'site_tagline', value: 'Connecting Alumni Since 1950', group: 'general', label: 'Site Tagline', isPublic: true },
    { key: 'site_email', value: 'info@maitbhangaalumni.org', group: 'general', label: 'Contact Email', isPublic: true },
    { key: 'site_phone', value: '+880 1700-000000', group: 'general', label: 'Contact Phone', isPublic: true },
    { key: 'site_address', value: 'Maitbhanga, Sandwip, Chattogram, Bangladesh', group: 'general', label: 'Address', isPublic: true },
    { key: 'membership_fee', value: '500', type: 'number', group: 'payment', label: 'Annual Membership Fee (BDT)', isPublic: true },
    { key: 'life_membership_fee', value: '5000', type: 'number', group: 'payment', label: 'Life Membership Fee (BDT)', isPublic: true },
    { key: 'founded_year', value: '1950', group: 'general', label: 'School Founded Year', isPublic: true },
    { key: 'facebook_url', value: 'https://facebook.com/maitbhangaalumni', group: 'social', label: 'Facebook URL', isPublic: true },
    { key: 'youtube_url', value: 'https://youtube.com/@maitbhangaalumni', group: 'social', label: 'YouTube URL', isPublic: true },
    { key: 'bkash_enabled', value: 'true', type: 'boolean', group: 'payment', label: 'bKash Payment Enabled', isPublic: false },
    { key: 'nagad_enabled', value: 'true', type: 'boolean', group: 'payment', label: 'Nagad Payment Enabled', isPublic: false },
    { key: 'sslcommerz_enabled', value: 'true', type: 'boolean', group: 'payment', label: 'SSLCommerz Enabled', isPublic: false },
    { key: 'email_notifications', value: 'true', type: 'boolean', group: 'notifications', label: 'Email Notifications', isPublic: false },
    { key: 'auto_approve_members', value: 'false', type: 'boolean', group: 'general', label: 'Auto Approve New Members', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
        type: setting.type ?? 'string',
        group: setting.group,
        label: setting.label,
        isPublic: setting.isPublic,
      },
    });
  }
  console.log(`✅ Created ${settings.length} site settings`);

  // ─────────────────────────────────────────────
  // SAMPLE CAMPAIGN
  // ─────────────────────────────────────────────
  await prisma.campaign.upsert({
    where: { slug: 'library-development-fund-2025' },
    update: {},
    create: {
      title: 'School Library Development Fund 2025',
      slug: 'library-development-fund-2025',
      description: 'Help us build a modern library for Maitbhanga High School with digital resources, books, and study spaces for students.',
      goal: 500000,
      raised: 127500,
      currency: 'BDT',
      status: CampaignStatus.ACTIVE,
      isFeatured: true,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      createdById: superAdmin.id,
    },
  });

  await prisma.campaign.upsert({
    where: { slug: 'annual-reunion-2025-fund' },
    update: {},
    create: {
      title: 'Annual Reunion 2025 - Event Fund',
      slug: 'annual-reunion-2025-fund',
      description: 'Support the organization of our grand annual reunion for all batches.',
      goal: 200000,
      raised: 45000,
      currency: 'BDT',
      status: CampaignStatus.ACTIVE,
      isFeatured: false,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-10-31'),
      createdById: superAdmin.id,
    },
  });
  console.log('✅ Sample campaigns created');

  // ─────────────────────────────────────────────
  // SAMPLE EVENT
  // ─────────────────────────────────────────────
  await prisma.event.upsert({
    where: { slug: 'grand-reunion-2025' },
    update: {},
    create: {
      title: 'Grand Reunion 2025 — All Batches',
      slug: 'grand-reunion-2025',
      description: 'Join us for the most anticipated event of the year — the Grand Annual Reunion of Maitbhanga High School alumni. Reconnect with old friends, celebrate achievements, and strengthen our community bond.',
      shortDescription: 'Annual grand reunion for all alumni batches. A celebration of shared memories and achievements.',
      type: EventType.REUNION,
      status: EventStatus.PUBLISHED,
      startDate: new Date('2025-10-15T09:00:00Z'),
      endDate: new Date('2025-10-15T18:00:00Z'),
      location: 'Maitbhanga High School Campus, Sandwip, Chattogram',
      maxAttendees: 1000,
      registrationFee: 500,
      currency: 'BDT',
      isFeatured: true,
      isPublic: true,
      requiresPayment: true,
      createdById: superAdmin.id,
    },
  });
  console.log('✅ Sample event created');

  // ─────────────────────────────────────────────
  // SAMPLE NEWS
  // ─────────────────────────────────────────────
  await prisma.news.upsert({
    where: { slug: 'welcome-to-alumni-forum' },
    update: {},
    create: {
      title: 'Welcome to Maitbhanga High School Alumni Forum',
      slug: 'welcome-to-alumni-forum',
      content: `<p>We are thrilled to announce the launch of the official <strong>Maitbhanga High School Alumni Forum</strong> — a digital home for all proud graduates of our beloved school.</p>
      <p>This platform has been built with love and dedication to serve our growing community of thousands of alumni spread across Bangladesh and the world.</p>
      <h2>What You Can Do Here</h2>
      <ul>
        <li>Register and create your alumni profile</li>
        <li>Connect with batch-mates and fellow alumni</li>
        <li>Stay updated with school news and announcements</li>
        <li>Participate in events and reunions</li>
        <li>Contribute to school development through donations</li>
      </ul>
      <p>Together, we can give back to the institution that shaped who we are today. Welcome home!</p>`,
      excerpt: 'Announcing the launch of the official Maitbhanga High School Alumni Forum — your digital home.',
      category: 'announcement',
      tags: ['launch', 'welcome', 'forum'],
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      isNotice: false,
      publishedAt: new Date(),
      createdById: superAdmin.id,
    },
  });

  await prisma.news.upsert({
    where: { slug: 'registration-open-grand-reunion-2025' },
    update: {},
    create: {
      title: 'Registration Open: Grand Reunion 2025',
      slug: 'registration-open-grand-reunion-2025',
      content: `<p>Registration is now open for the <strong>Grand Reunion 2025</strong>. This year's reunion promises to be the biggest celebration in our alumni history.</p>
      <p><strong>Date:</strong> October 15, 2025</p>
      <p><strong>Venue:</strong> Maitbhanga High School Campus, Sandwip</p>
      <p><strong>Registration Fee:</strong> ৳500 per person</p>
      <p>Register early to secure your spot!</p>`,
      excerpt: 'Registration is now open for Grand Reunion 2025. October 15, 2025 at the school campus.',
      category: 'event',
      tags: ['reunion', 'event', 'registration'],
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      isNotice: true,
      publishedAt: new Date(),
      createdById: superAdmin.id,
    },
  });
  console.log('✅ Sample news/notices created');

  // ─────────────────────────────────────────────
  // GALLERY ALBUMS
  // ─────────────────────────────────────────────
  await prisma.galleryAlbum.upsert({
    where: { id: 'album-reunion-2024' },
    update: {},
    create: {
      id: 'album-reunion-2024',
      name: 'Reunion 2024 Highlights',
      description: 'Photo memories from our amazing Reunion 2024',
      isPublic: true,
      sortOrder: 1,
    },
  });
  console.log('✅ Sample gallery album created');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Default Credentials:');
  console.log('Super Admin: admin@maitbhangaalumni.org / Admin@123456');
  console.log('Admin:       moderator@maitbhangaalumni.org / Admin@123456');
  console.log('Demo Alumni: demo.alumni@maitbhangaalumni.org / Admin@123456');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
