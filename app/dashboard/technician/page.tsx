'use client';

import { BadgeCheck, ClipboardList, Wallet, Wrench } from 'lucide-react';
import { useApi } from '@/lib/use-api';
import type { NameValue } from '@/lib/types';
import { money } from '@/lib/utils';
import { StatsCard } from '@/components/ui/stats-card';
import { ErrorNote, PageHeader } from '@/components/ui/states';
import { DonutChart, StatusBarChart } from '@/components/dashboard/charts';
import { LinkButton } from '@/components/ui/button';

type Stats = {
  totalServices: number;
  approvedServices: number;
  pendingRequests: number;
  earnings: number;
  byStatus: NameValue[];
  byCategory: NameValue[];
};

export default function TechnicianOverview() {
  const { data, loading, error } = useApi<Stats>('/api/stats/technician');
  return (
    <>
      <PageHeader title="Technician Overview" subtitle="Your services and incoming jobs at a glance." action={<LinkButton href="/dashboard/technician/add-service">Add a service</LinkButton>} />
      {error && <ErrorNote message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Services" value={data?.totalServices ?? 0} icon={Wrench} tone="teal" loading={loading} />
        <StatsCard label="Approved Services" value={data?.approvedServices ?? 0} icon={BadgeCheck} tone="green" loading={loading} />
        <StatsCard label="Pending Requests" value={data?.pendingRequests ?? 0} icon={ClipboardList} tone="amber" loading={loading} />
        <StatsCard label="Earnings" value={money(data?.earnings)} icon={Wallet} tone="orange" loading={loading} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusBarChart title="Jobs by status" data={data?.byStatus ?? []} />
        <DonutChart title="My services by category" data={data?.byCategory ?? []} />
      </div>
    </>
  );
}
