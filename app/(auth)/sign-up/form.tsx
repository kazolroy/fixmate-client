'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, UserRound, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, controlClass } from '@/components/ui/field';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roles = [
  { value: 'customer', title: 'Customer', text: 'I need something repaired', icon: UserRound },
  { value: 'technician', title: 'Technician', text: 'I offer repair services', icon: Wrench },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const password = String(f.get('password') || '');

    const errs: Record<string, string> = {};
    if (name.length < 2) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!EMAIL_RX.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(password)) errs.password = 'Password needs at least one uppercase letter';
    else if (!/[a-z]/.test(password)) errs.password = 'Password needs at least one lowercase letter';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    // The server (databaseHooks in lib/auth.ts) re-validates the role: anything but 'technician' becomes 'customer'.
    const { error } = await authClient.signUp.email({ name, email, password, role });
    setBusy(false);
    if (error) {
      toast.error(error.message || 'Could not create your account');
      return;
    }
    toast.success('Account created! Welcome to FixMate.');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Create your account</h1>
      <p className="mt-2 text-slate-500">Join FixMate as a customer or a technician.</p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" placeholder="Your full name" className={controlClass('', !!errors.name)} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={controlClass('', !!errors.email)} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} hint="At least 6 characters with one uppercase and one lowercase letter">
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              className={controlClass('pr-11', !!errors.password)}
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-brand-900">I want to join as</legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <label
                key={r.value}
                className={cn(
                  'flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3.5 transition',
                  role === r.value ? 'border-accent-500 bg-accent-50' : 'border-slate-200 bg-white hover:border-brand-300'
                )}
              >
                <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="sr-only" />
                <r.icon className={cn('size-5', role === r.value ? 'text-accent-600' : 'text-brand-600')} />
                <span className="font-semibold text-brand-900">{r.title}</span>
                <span className="text-xs text-slate-500">{r.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-accent-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
