'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { Service } from '@/lib/types';
import { money } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { FilterTabs, TableWrap, Td, Th, Thumb } from '@/components/ui/table';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminServicesPage() {
  const [filter, setFilter] = useState('pending'); // pending first by default
  const { data, loading, error, reload } = useApi<{ items: Service[] }>(`/api/admin/services${filter ? `?status=${filter}` : ''}`);
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items ?? [];

  async function decide(s: Service, approvalStatus: 'approved' | 'rejected') {
    setBusyId(s._id);
    try {
      await api(`/api/admin/services/${s._id}/approval`, { method: 'PATCH', body: { approvalStatus } });
      toast.success(approvalStatus === 'approved' ? 'Service approved and now public' : 'Service rejected');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
      await reload();
    }
  }

  return (
    <>
      <PageHeader title="Service Approval" subtitle="Only approved and available services appear on public pages." />
      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="Nothing to review" message={filter === 'pending' ? 'No services are waiting for approval. 🎉' : 'No services match this filter.'} />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Technician</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Approval</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/60">
                <Td>
                  <div className="flex items-center gap-3">
                    <Thumb src={s.image} alt={s.title} />
                    <span className="max-w-56 font-semibold text-brand-900">{s.title}</span>
                  </div>
                </Td>
                <Td>
                  {s.technicianName}
                  <span className="block text-xs text-slate-400">{s.technicianEmail}</span>
                </Td>
                <Td>{s.category}</Td>
                <Td className="font-medium">{money(s.basePrice)}</Td>
                <Td>
                  <StatusBadge status={s.approvalStatus} />
                </Td>
                <Td>
                  <div className="flex gap-2">
                    {s.approvalStatus !== 'approved' && (
                      <Button size="sm" onClick={() => decide(s, 'approved')} disabled={busyId === s._id}>
                        Approve
                      </Button>
                    )}
                    {s.approvalStatus !== 'rejected' && (
                      <Button size="sm" variant="outline" onClick={() => decide(s, 'rejected')} disabled={busyId === s._id}>
                        Reject
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
