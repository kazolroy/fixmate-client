import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/shell';
import { getSession, roleOf } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side session check: reloading a private route keeps a logged-in user on it.
  const session = await getSession();
  if (!session) redirect('/sign-in?redirect=/dashboard');
  const role = roleOf(session.user);
  return (
    <DashboardShell role={role} initialUser={{ name: session.user.name, image: session.user.image ?? null }}>
      {children}
    </DashboardShell>
  );
}
