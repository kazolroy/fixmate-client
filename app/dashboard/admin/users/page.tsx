'use client';

import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { AppUser } from '@/lib/types';
import { fmtDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { controlClass } from '@/components/ui/field';
import { EmptyState, ErrorNote, PageHeader, Spinner } from '@/components/ui/states';
import { TableWrap, Td, Th } from '@/components/ui/table';

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useApi<{ items: AppUser[] }>('/api/admin/users');
  const items = data?.items ?? [];

  async function changeRole(u: AppUser, role: string) {
    try {
      await api(`/api/admin/users/${u._id}/role`, { method: 'PATCH', body: { role } });
      toast.success(`${u.name} is now a ${role}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      await reload();
    }
  }

  return (
    <>
      <PageHeader title="Manage Users" subtitle="Change roles. You cannot change your own role." />
      {error && <ErrorNote message={error} />}
      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="No users" message="Users appear here after they sign up." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => {
              const isSelf = u.email === session?.user.email;
              return (
                <tr key={u._id} className="hover:bg-slate-50/60">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} src={u.image} />
                      <span className="font-semibold text-brand-900">
                        {u.name} {isSelf && <span className="text-xs font-normal text-slate-400">(you)</span>}
                      </span>
                    </div>
                  </Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <select
                      aria-label={`Role for ${u.name}`}
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className={controlClass('w-40 py-1.5')}
                      title={isSelf ? 'You cannot change your own role' : undefined}
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Td>
                  <Td className="whitespace-nowrap">{fmtDate(u.createdAt)}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
