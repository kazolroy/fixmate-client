'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { Payment } from '@/lib/types';
import { money } from '@/lib/utils';
import { LinkButton } from '@/components/ui/button';
import { Spinner } from '@/components/ui/states';

export function SuccessView() {
  const sessionId = useSearchParams().get('session_id');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(sessionId ? null : 'Missing payment session.');
  const ran = useRef(false);

  useEffect(() => {
    if (!sessionId || ran.current) return;
    ran.current = true; // avoid a double call in React strict mode (the server is idempotent anyway)
    api<{ payment: Payment }>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => {
        setPayment(r.payment);
        toast.success('Payment received. Thank you!');
      })
      .catch((e: Error) => {
        setError(e.message);
        toast.error(e.message);
      });
  }, [sessionId]);

  if (error)
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto size-14 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">We couldn’t confirm the payment</h1>
        <p className="mt-2 text-slate-500">{error}</p>
        <LinkButton href="/dashboard/customer/bookings" className="mt-6">
          Back to My Bookings
        </LinkButton>
      </div>
    );

  if (!payment) return <Spinner label="Confirming your payment…" />;

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
      <CheckCircle2 className="mx-auto size-16 text-emerald-500" />
      <h1 className="mt-4 text-3xl font-extrabold">Payment successful</h1>
      <p className="mt-1 text-slate-500">Your job is now marked as paid.</p>
      <dl className="mt-6 divide-y divide-slate-100 rounded-2xl bg-slate-50 text-left text-sm">
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-slate-500">Service</dt>
          <dd className="text-right font-medium text-brand-900">{payment.serviceTitle}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-slate-500">Amount</dt>
          <dd className="font-display text-lg font-extrabold text-accent-600">{money(payment.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-slate-500">Transaction ID</dt>
          <dd className="break-all text-right font-mono text-xs text-brand-900">{payment.transactionId}</dd>
        </div>
      </dl>
      <LinkButton href="/dashboard/customer/bookings" size="lg" className="mt-6 w-full">
        Back to My Bookings
      </LinkButton>
    </div>
  );
}
