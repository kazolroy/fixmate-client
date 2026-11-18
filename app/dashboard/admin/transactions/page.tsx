'use client';

import { Wallet } from 'lucide-react';
import { useApi } from '@/lib/use-api';
import type { Payment } from '@/lib/types';
import { fmtDate, money } from '@/lib/utils';
import { StatsCard } from '@/components/ui/stats-card';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { TableWrap, Td, Th } from '@/components/ui/table';

export default function AdminTransactionsPage() {
  const { data, loading, error } = useApi<{ items: Payment[]; totalRevenue: number }>('/api/admin/payments');
  const items = data?.items ?? [];

  return (
    <>
      <PageHeader title="Transactions" subtitle="Every payment recorded from Stripe." />
      <div className="mb-6 max-w-sm">
        <StatsCard label="Total Revenue" value={money(data?.totalRevenue)} icon={Wallet} tone="orange" loading={loading} />
      </div>
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No transactions yet" message="Payments appear here after customers pay for completed jobs." />
      ) : (
        <TableWrap className="[&_table]:min-w-[860px]">
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Technician</Th>
              <Th>Service</Th>
              <Th>Amount</Th>
              <Th>Transaction ID</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/60">
                <Td>{p.customerName}</Td>
                <Td>{p.technicianName}</Td>
                <Td className="font-semibold text-brand-900">{p.serviceTitle}</Td>
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
