'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { STATUS_HEX, STATUS_LABEL } from '@/lib/constants';
import type { NameValue } from '@/lib/types';

const FALLBACK = ['#0f6a7e', '#f26b21', '#6366f1', '#10b981', '#f59e0b', '#a855f7', '#ef4444'];
const colorFor = (name: string, i: number) => STATUS_HEX[name] || FALLBACK[i % FALLBACK.length];
const label = (n: string) => STATUS_LABEL[n] || n.charAt(0).toUpperCase() + n.slice(1);

export function ChartCard({ title, children, empty }: { title: string; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="h-64">
        {empty ? (
          <div className="grid h-full place-items-center text-sm text-slate-400">No data yet</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function StatusBarChart({ title, data }: { title: string; data: NameValue[] }) {
  const rows = data.map((d) => ({ ...d, label: label(d.name) }));
  return (
    <ChartCard title={title} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
            {rows.map((r, i) => (
              <Cell key={r.name} fill={colorFor(r.name, i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DonutChart({ title, data }: { title: string; data: NameValue[] }) {
  const rows = data.map((d) => ({ ...d, label: label(d.name) }));
  return (
    <ChartCard title={title} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {rows.map((r, i) => (
              <Cell key={r.name} fill={colorFor(r.name, i)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueLineChart({ title, data }: { title: string; data: { date: string; amount: number }[] }) {
  return (
    <ChartCard title={title} empty={!data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
          <Line type="monotone" dataKey="amount" stroke="#f26b21" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
