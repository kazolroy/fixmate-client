'use client';

import { useState } from 'react';
import { useApi } from '@/lib/use-api';
import type { Booking } from '@/lib/types';
import { fmtDate, money } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/badge';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { FilterTabs, TableWrap, Td, Th } from '@/components/ui/table';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState('');
  const { data, loading, error } = useApi<{ items: Booking[] }>(`/api/admin/bookings${filter ? `?status=${filter}` : ''}`);
  const items = data?.items ?? [];

  return (
    <>
      <PageHeader title="All Bookings" subtitle="Read-only view of every repair job on the platform." />
      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No bookings" message="No bookings match this filter." />
      ) : (
        <TableWrap className="[&_table]:min-w-[900px]">
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Customer</Th>
              <Th>Technician</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/60">
                <Td className="max-w-52 font-semibold text-brand-900">{b.serviceTitle}</Td>
                <Td>{b.customerName}</Td>
                <Td>{b.technicianName}</Td>
                <Td className="whitespace-nowrap">{fmtDate(b.preferredDate)}</Td>
                <Td>
                  <StatusBadge status={b.status} />
                </Td>
                <Td>
                  <StatusBadge status={b.paymentStatus} />
                </Td>
                <Td className="whitespace-nowrap font-medium">{money(b.status === 'completed' ? b.finalAmount : b.basePrice)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
