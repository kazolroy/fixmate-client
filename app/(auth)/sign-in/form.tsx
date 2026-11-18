'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { safeRedirect } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, controlClass } from '@/components/ui/field';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get('redirect'));
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const password = String(f.get('password') || '');
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!EMAIL_RX.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message || 'Invalid email or password');
      return;
    }
    toast.success('Welcome back!');
    // /dashboard sends each role to its own dashboard
    router.push(redirectTo || '/dashboard');
    router.refresh();
  }

  async function google() {
    await authClient.signIn.social({ provider: 'google', callbackURL: redirectTo || '/dashboard' });
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-2 text-slate-500">Sign in to track your repairs or manage your services.</p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={controlClass('', !!errors.email)} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              className={controlClass('pr-11', !!errors.password)}
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
          </div>
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={google}>
            Continue with Google
          </Button>
        </>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        New to FixMate?{' '}
        <Link href="/sign-up" className="font-semibold text-accent-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
