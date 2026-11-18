import { redirect } from 'next/navigation';
import { getSession, homeFor, roleOf } from '@/lib/session';

export const dynamic = 'force-dynamic';

// /dashboard -> the right dashboard for the logged-in role
export default async function DashboardIndex() {
  const session = await getSession();
  if (!session) redirect('/sign-in?redirect=/dashboard');
  redirect(homeFor(roleOf(session.user)));
}
