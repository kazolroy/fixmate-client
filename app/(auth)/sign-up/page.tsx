import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession, homeFor, roleOf } from '@/lib/session';
import { SignUpForm } from './form';

export const metadata: Metadata = { title: 'Sign Up' };
export const dynamic = 'force-dynamic';

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect(homeFor(roleOf(session.user)));
  return <SignUpForm />;
}
