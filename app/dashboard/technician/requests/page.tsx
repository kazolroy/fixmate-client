'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { Booking } from '@/lib/types';
import { fmtDate, money } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Field, controlClass } from '@/components/ui/field';
import { ConfirmModal, Modal } from '@/components/ui/modal';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { FilterTabs, TableWrap, Td, Th } from '@/components/ui/table';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TechnicianRequestsPage() {
  const [filter, setFilter] = useState('');
  const { data, loading, error, reload } = useApi<{ items: Booking[] }>(`/api/bookings/technician${filter ? `?status=${filter}` : ''}`);
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState('');
  const [amountErr, setAmountErr] = useState('');
  const [busy, setBusy] = useState(false);
  const items = data?.items ?? [];

  async function update(b: Booking, status: string, extra?: Record<string, unknown>, msg?: string) {
    setBusy(true);
    try {
      await api(`/api/bookings/${b._id}/status`, { method: 'PATCH', body: { status, ...extra } });
      toast.success(msg || 'Status updated');
      setRejecting(null);
      setCompleting(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      await reload();
    }
  }

  function openComplete(b: Booking) {
    setAmount(String(b.basePrice));
    setAmountErr('');
    setCompleting(b);
  }

  function confirmComplete() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return setAmountErr('Final amount must be greater than 0');
    if (completing) update(completing, 'completed', { finalAmount: n }, 'Job marked as completed');
  }

  return (
    <>
      <PageHeader title="Manage Requests" subtitle="Move each job forward one step at a time." />
      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No requests here" message={filter ? 'No jobs with this status right now.' : 'When customers request your services, the jobs appear here.'} />
      ) : (
        <TableWrap className="[&_table]:min-w-[980px]">
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Phone</Th>
              <Th>Address</Th>
              <Th>Date</Th>
              <Th>Problem</Th>
              <Th>Service</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/60">
                <Td className="font-semibold text-brand-900">{b.customerName}</Td>
                <Td className="whitespace-nowrap">{b.customerPhone}</Td>
                <Td className="max-w-44">{b.address}</Td>
                <Td className="whitespace-nowrap">{fmtDate(b.preferredDate)}</Td>
                <Td className="max-w-56">
                  <p className="line-clamp-3" title={b.problemDescription}>
                    {b.problemDescription}
                  </p>
                </Td>
                <Td className="max-w-40 font-medium">{b.serviceTitle}</Td>
                <Td>
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={b.status} />
                    {b.status === 'completed' && <StatusBadge status={b.paymentStatus} />}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    {b.status === 'requested' && (
                      <>
                        <Button size="sm" onClick={() => update(b, 'accepted', undefined, 'Request accepted')} disabled={busy}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRejecting(b)} disabled={busy}>
                          Reject
                        </Button>
                      </>
                    )}
                    {b.status === 'accepted' && (
                      <Button size="sm" variant="secondary" onClick={() => update(b, 'in-progress', undefined, 'Work started')} disabled={busy}>
                        Start Work
                      </Button>
                    )}
                    {b.status === 'in-progress' && (
                      <Button size="sm" onClick={() => openComplete(b)} disabled={busy}>
                        Mark Completed
                      </Button>
                    )}
                    {b.status === 'completed' && <span className="text-xs text-slate-500">Final: {money(b.finalAmount)}</span>}
                    {['rejected', 'cancelled'].includes(b.status) && <span className="text-xs text-slate-400">—</span>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={() => rejecting && update(rejecting, 'rejected', undefined, 'Request rejected')}
        busy={busy}
        title="Reject this request?"
        message="The customer will see the job as rejected. This is final."
        confirmLabel="Reject request"
      />

      <Modal open={!!completing} onClose={() => setCompleting(null)} title="Mark job as completed">
        <Field label="Final amount (USD)" htmlFor="final-amount" error={amountErr} hint={`Base price was ${money(completing?.basePrice)}. The customer will be charged this amount.`}>
          <input
            id="final-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={controlClass('', !!amountErr)}
          />
        </Field>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCompleting(null)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={confirmComplete} disabled={busy}>
            {busy ? 'Saving…' : 'Complete job'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
