import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const tones = {
  teal: 'bg-brand-50 text-brand-600',
  orange: 'bg-accent-50 text-accent-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
};

/** Reusable stats card used by every dashboard overview. */
export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = 'teal',
  loading,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={cn('grid size-12 shrink-0 place-items-center rounded-xl', tones[tone])}>
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-16 animate-pulse rounded bg-slate-100" />
        ) : (
          <p className="font-display text-2xl font-bold text-brand-900">{value}</p>
        )}
      </div>
    </div>
  );
}
