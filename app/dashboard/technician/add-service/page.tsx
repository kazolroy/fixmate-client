'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/states';
import { ServiceForm, type ServicePayload } from '@/components/dashboard/service-form';

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [formKey, setFormKey] = useState(0);

  async function create(payload: ServicePayload) {
    await api('/api/services', { method: 'POST', body: payload });
    toast.success('Service submitted — waiting for admin approval');
    setFormKey((k) => k + 1);
    router.push('/dashboard/technician/my-services');
  }

  return (
    <>
      <PageHeader title="Add a Service" subtitle="New services stay pending until an admin approves them." />
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {session ? (
          <ServiceForm
            key={formKey}
            technicianName={session.user.name}
            technicianEmail={session.user.email}
            submitLabel="Submit for approval"
            onSubmit={create}
          />
        ) : (
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        )}
      </div>
    </>
  );
}
