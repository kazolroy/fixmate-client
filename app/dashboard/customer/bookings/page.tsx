'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { Booking } from '@/lib/types';
import { fmtDate, money } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmModal } from '@/components/ui/modal';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { TableWrap, Td, Th, Thumb } from '@/components/ui/table';
import { JobTracker } from '@/components/dashboard/job-tracker';

export default function MyBookingsPage() {
  const { data, loading, error, reload } = useApi<{ items: Booking[] }>('/api/bookings/my');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const items = data?.items ?? [];

  async function cancel() {
    if (!cancelId) return;
    setBusy(true);
    try {
      await api(`/api/bookings/${cancelId}/cancel`, { method: 'PATCH' });
      toast.success('Request cancelled');
      setCancelId(null);
      await reload();
    } catch (e) {
      toast.error((e as Error).message);
      setCancelId(null);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function payNow(id: string) {
    setPayingId(id);
    try {
      const { url } = await api<{ url: string }>('/api/payments/create-checkout-session', { method: 'POST', body: { bookingId: id } });
      window.location.href = url; // Stripe Checkout
    } catch (e) {
      toast.error((e as Error).message);
      setPayingId(null);
    }
  }

  const Actions = ({ b }: { b: Booking }) => (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === 'requested' && (
        <Button size="sm" variant="outline" onClick={() => setCancelId(b._id)}>
          Cancel
        </Button>
      )}
      {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
        <Button size="sm" onClick={() => payNow(b._id)} disabled={payingId === b._id}>
          <CreditCard className="size-4" /> {payingId === b._id ? 'Redirecting…' : 'Pay Now'}
        </Button>
      )}
      {b.paymentStatus === 'paid' && <StatusBadge status="paid" />}
    </div>
  );

  const amount = (b: Booking) => (b.status === 'completed' ? money(b.finalAmount) : money(b.basePrice));

  return (
    <>
      <PageHeader title="My Bookings" subtitle="Track every repair request from request to payment." />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No bookings yet" message="When you send a repair request it will show up here with live status." ctaHref="/services" ctaLabel="Browse services" />
      ) : (
        <>
          {/* desktop / tablet: table */}
          <div className="hidden md:block">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Service</Th>
                  <Th>Technician</Th>
                  <Th>Preferred date</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60">
                    <Td>
                      <div className="flex items-center gap-3">
                        <Thumb src={b.serviceImage} alt={b.serviceTitle} />
                        <span className="max-w-48 font-semibold text-brand-900">{b.serviceTitle}</span>
                      </div>
                    </Td>
                    <Td>{b.technicianName}</Td>
                    <Td className="whitespace-nowrap">{fmtDate(b.preferredDate)}</Td>
                    <Td className="whitespace-nowrap font-medium">{amount(b)}</Td>
                    <Td>
                      <StatusBadge status={b.status} />
                    </Td>
                    <Td>
                      <StatusBadge status={b.paymentStatus} />
                    </Td>
                    <Td>
                      <Actions b={b} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          {/* mobile: cards */}
          <div className="space-y-4 md:hidden">
            {items.map((b) => (
              <article key={b._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Thumb src={b.serviceImage} alt={b.serviceTitle} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-tight">{b.serviceTitle}</h3>
                    <p className="text-xs text-slate-500">
                      {b.technicianName} · {fmtDate(b.preferredDate)}
                    </p>
                  </div>
                  <p className="font-semibold text-accent-600">{amount(b)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={b.status} />
                  <StatusBadge status={b.paymentStatus} />
                </div>
                <div className="mt-4 overflow-x-auto pb-1">
                  <JobTracker booking={b} />
                </div>
                <div className="mt-4">
                  <Actions b={b} />
                </div>
              </article>
            ))}
          </div>

          {/* timeline tracker for the most recent active job (desktop) */}
          <div className="mt-6 hidden space-y-3 md:block">
            <h2 className="text-lg font-semibold">Job timeline</h2>
            {items.slice(0, 4).map((b) => (
              <div key={b._id} className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <p className="w-48 shrink-0 truncate text-sm font-semibold text-brand-900">{b.serviceTitle}</p>
                <div className="min-w-0 flex-1">
                  <JobTracker booking={b} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={cancel}
        busy={busy}
        title="Cancel this request?"
        message="The technician will no longer see this request. This cannot be undone."
        confirmLabel="Yes, cancel request"
      />
    </>
  );
}
