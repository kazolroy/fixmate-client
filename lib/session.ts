import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

export type Role = 'customer' | 'technician' | 'admin';

export const homeFor = (role: Role | string | undefined) => `/dashboard/${role || 'customer'}`;

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function roleOf(user: unknown): Role {
  const r = (user as { role?: string })?.role;
  return r === 'admin' || r === 'technician' ? r : 'customer';
}

/** Server-side guard: logged-out -> /sign-in, wrong role -> their own dashboard. */
export async function requireRole(role: Role, from = '/dashboard') {
  const session = await getSession();
  if (!session) redirect(`/sign-in?redirect=${encodeURIComponent(from)}`);
  const actual = roleOf(session.user);
  if (actual !== role) redirect(homeFor(actual));
  return session;
}
