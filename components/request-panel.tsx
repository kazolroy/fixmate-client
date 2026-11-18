'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Info, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api';
import { todayISO } from '@/lib/utils';
import type { Service } from '@/lib/types';
import { Button, LinkButton } from './ui/button';
import { Field, controlClass } from './ui/field';
import { Modal } from './ui/modal';

/** Role-restricted "Request Repair" flow for the service details page. */
export function RequestPanel({ service }: { service: Service }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { name: string; email: string; role?: string; phone?: string } | undefined;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isPending) return <div className="h-12 animate-pulse rounded-xl bg-slate-100" />;

  if (!user) {
    return (
      <LinkButton href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`} size="lg" className="w-full">
        <Wrench className="size-5" /> Request Repair
      </LinkButton>
    );
  }

  if ((user.role || 'customer') !== 'customer') {
    return (
      <div>
        <Button size="lg" className="w-full" disabled>
          <Wrench className="size-5" /> Request Repair
        </Button>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      serviceId: service._id,
      customerPhone: String(f.get('phone') || '').trim(),
      address: String(f.get('address') || '').trim(),
      preferredDate: String(f.get('date') || ''),
      problemDescription: String(f.get('problem') || '').trim(),
    };
    const errs: Record<string, string> = {};
    if (body.customerPhone.length < 6) errs.phone = 'Enter a valid phone number';
    if (body.address.length < 5) errs.address = 'Address is required';
    if (!body.preferredDate || body.preferredDate < todayISO()) errs.date = 'Pick today or a future date';
    if (body.problemDescription.length < 20) errs.problem = 'Please describe the problem in at least 20 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await api('/api/bookings', { method: 'POST', body });
      setOpen(false);
      setDone(true);
      toast.success('Repair request sent!', {
        description: 'Track it in My Bookings.',
        action: { label: 'My Bookings', onClick: () => (window.location.href = '/dashboard/customer/bookings') },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) toast.error('You already have an active request for this service');
      else toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {done ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-5" /> Request sent successfully
          </p>
          <Link href="/dashboard/customer/bookings" className="mt-2 inline-block font-semibold underline">
            Go to My Bookings →
          </Link>
        </div>
      ) : (
        <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
          <Wrench className="size-5" /> Request Repair
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={`Request: ${service.title}`} wide>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Name" htmlFor="rq-name">
            <input id="rq-name" value={user.name} readOnly className={controlClass()} />
          </Field>
          <Field label="Email" htmlFor="rq-email">
            <input id="rq-email" value={user.email} readOnly className={controlClass()} />
          </Field>
          <Field label="Phone" htmlFor="rq-phone" error={errors.phone}>
            <input id="rq-phone" name="phone" defaultValue={user.phone || ''} placeholder="01XXXXXXXXX" className={controlClass('', !!errors.phone)} />
          </Field>
          <Field label="Preferred Date" htmlFor="rq-date" error={errors.date}>
            <input id="rq-date" name="date" type="date" min={todayISO()} className={controlClass('', !!errors.date)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" htmlFor="rq-address" error={errors.address} hint="Service address or pickup address">
              <input id="rq-address" name="address" placeholder="House, road, area" className={controlClass('', !!errors.address)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Problem Description" htmlFor="rq-problem" error={errors.problem} hint="Minimum 20 characters">
              <textarea id="rq-problem" name="problem" rows={4} placeholder="What is wrong with the device?" className={controlClass('', !!errors.problem)} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
