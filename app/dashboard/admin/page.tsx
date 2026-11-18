'use client';

import { ShieldAlert, Users, Wallet, Wrench } from 'lucide-react';
import { useApi } from '@/lib/use-api';
import type { NameValue } from '@/lib/types';
import { money } from '@/lib/utils';
import { StatsCard } from '@/components/ui/stats-card';
import { ErrorNote, PageHeader } from '@/components/ui/states';
import { DonutChart, RevenueLineChart, StatusBarChart } from '@/components/dashboard/charts';

type Stats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalRevenue: number;
  bookingsByStatus: NameValue[];
  usersByRole: NameValue[];
  revenueByDay: { date: string; amount: number }[];
};

export default function AdminOverview() {
  const { data, loading, error } = useApi<Stats>('/api/stats/admin');
  return (
    <>
      <PageHeader title="Admin Overview" subtitle="Platform health, moderation queue and revenue." />
      {error && <ErrorNote message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Users" value={data?.totalUsers ?? 0} icon={Users} tone="blue" loading={loading} />
        <StatsCard label="Total Technicians" value={data?.totalTechnicians ?? 0} icon={Wrench} tone="teal" loading={loading} />
        <StatsCard label="Pending Services" value={data?.pendingServices ?? 0} icon={ShieldAlert} tone="amber" loading={loading} />
        <StatsCard label="Total Revenue" value={money(data?.totalRevenue)} icon={Wallet} tone="orange" loading={loading} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueLineChart title="Revenue — last 30 days" data={data?.revenueByDay ?? []} />
        </div>
        <DonutChart title="Users by role" data={data?.usersByRole ?? []} />
      </div>
      <div className="mt-6">
        <StatusBarChart title="All bookings by status" data={data?.bookingsByStatus ?? []} />
      </div>
    </>
  );
}
