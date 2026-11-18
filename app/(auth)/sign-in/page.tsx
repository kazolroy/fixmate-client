import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession, homeFor, roleOf } from '@/lib/session';
import { SignInForm } from './form';

export const metadata: Metadata = { title: 'Sign In' };
export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect(homeFor(roleOf(session.user)));
  return (
    <Suspense>
      <SignInForm googleEnabled={!!process.env.GOOGLE_CLIENT_ID} />
    </Suspense>
  );
}
