'use client';

import { useApi } from '@/lib/use-api';
import type { Payment } from '@/lib/types';
import { fmtDate, money } from '@/lib/utils';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { TableWrap, Td, Th } from '@/components/ui/table';

export default function PaymentHistoryPage() {
  const { data, loading, error } = useApi<{ items: Payment[] }>('/api/payments/my');
  const items = data?.items ?? [];

  return (
    <>
      <PageHeader title="Payment History" subtitle="Every job you have paid for." />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No payments yet" message="Once you pay for a completed job it will be listed here." ctaHref="/dashboard/customer/bookings" ctaLabel="Go to My Bookings" />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Technician</Th>
              <Th>Amount</Th>
              <Th>Transaction ID</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/60">
                <Td className="font-semibold text-brand-900">{p.serviceTitle}</Td>
                <Td>{p.technicianName}</Td>
                <Td className="font-semibold text-accent-600">{money(p.amount)}</Td>
                <Td className="font-mono text-xs">{p.transactionId}</Td>
                <Td className="whitespace-nowrap">{fmtDate(p.paidAt)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
