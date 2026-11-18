'use client';

import { CalendarCheck, CheckCircle2, Hammer, Wallet } from 'lucide-react';
import { useApi } from '@/lib/use-api';
import type { NameValue } from '@/lib/types';
import { money } from '@/lib/utils';
import { StatsCard } from '@/components/ui/stats-card';
import { PageHeader, ErrorNote } from '@/components/ui/states';
import { DonutChart, StatusBarChart } from '@/components/dashboard/charts';
import { LinkButton } from '@/components/ui/button';

type Stats = { total: number; active: number; completed: number; spent: number; byStatus: NameValue[] };

export default function CustomerOverview() {
  const { data, loading, error } = useApi<Stats>('/api/stats/customer');

  return (
    <>
      <PageHeader
        title="Customer Overview"
        subtitle="A quick look at your repair requests."
        action={<LinkButton href="/services">Find a repair</LinkButton>}
      />
      {error && <ErrorNote message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Requests" value={data?.total ?? 0} icon={CalendarCheck} tone="teal" loading={loading} />
        <StatsCard label="Active Jobs" value={data?.active ?? 0} icon={Hammer} tone="amber" loading={loading} />
        <StatsCard label="Completed Jobs" value={data?.completed ?? 0} icon={CheckCircle2} tone="green" loading={loading} />
        <StatsCard label="Total Paid" value={money(data?.spent)} icon={Wallet} tone="orange" loading={loading} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusBarChart title="Requests by status" data={data?.byStatus ?? []} />
        <DonutChart title="Status share" data={data?.byStatus ?? []} />
      </div>
    </>
  );
}
