'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { Service } from '@/lib/types';
import { cn, money } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmModal, Modal } from '@/components/ui/modal';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { TableWrap, Td, Th, Thumb } from '@/components/ui/table';
import { ServiceForm, type ServicePayload } from '@/components/dashboard/service-form';

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn('relative h-6 w-11 rounded-full transition', on ? 'bg-emerald-500' : 'bg-slate-300')}
    >
      <span className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition', on && 'translate-x-5')} />
    </button>
  );
}

export default function MyServicesPage() {
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useApi<{ items: Service[] }>('/api/services/mine');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const items = data?.items ?? [];

  async function toggle(s: Service, value: boolean) {
    try {
      await api(`/api/services/${s._id}`, { method: 'PATCH', body: { isAvailable: value } });
      toast.success(value ? 'Service is now available' : 'Service hidden from public pages');
      await reload();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function save(payload: ServicePayload) {
    if (!editing) return;
    await api(`/api/services/${editing._id}`, { method: 'PATCH', body: payload });
    toast.success('Service updated — it is pending approval again');
    setEditing(null);
    await reload();
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/services/${deleting._id}`, { method: 'DELETE' });
      toast.success('Service deleted');
      setDeleting(null);
      await reload();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="My Services" subtitle="Edit, hide or delete the services you offer." />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="You haven’t added any services" message="Add your first service to start receiving repair requests." ctaHref="/dashboard/technician/add-service" ctaLabel="Add a service" />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Approval</Th>
              <Th>Available</Th>
              <Th className="text-right">Actions</Th>
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
                <Td>{s.category}</Td>
                <Td className="font-medium">{money(s.basePrice)}</Td>
                <Td>
                  <StatusBadge status={s.approvalStatus} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Switch on={s.isAvailable} onChange={(v) => toggle(s, v)} label={`Toggle availability for ${s.title}`} />
                    <span className="text-xs text-slate-500">{s.isAvailable ? 'On' : 'Off'}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50">
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => setDeleting(s)} aria-label={`Delete ${s.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" wide>
        {editing && session && (
          <>
            <p className="mb-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">Saving changes sends this service back to “pending” for admin approval.</p>
            <ServiceForm
              initial={editing}
              technicianName={session.user.name}
              technicianEmail={session.user.email}
              submitLabel="Save changes"
              onSubmit={save}
              onCancel={() => setEditing(null)}
            />
          </>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        busy={busy}
        title="Delete this service?"
        message={`“${deleting?.title ?? ''}” will be permanently removed. Existing bookings keep their copied details.`}
        confirmLabel="Delete service"
      />
    </>
  );
}
