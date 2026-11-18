import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const money = (n: number | undefined | null) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);

export const fmtDate = (d: string | Date | undefined) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export const todayISO = () => new Date().toISOString().slice(0, 10);

/** Only allow same-site relative redirects after sign-in. */
export const safeRedirect = (p: string | null | undefined) =>
  p && p.startsWith('/') && !p.startsWith('//') ? p : null;
