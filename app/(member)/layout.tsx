import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MemberSidebar } from '@/components/layout/MemberSidebar';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex">
      <MemberSidebar user={session.user} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
