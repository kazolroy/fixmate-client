import { Check } from 'lucide-react';
import type { Booking } from '@/lib/types';
import { cn } from '@/lib/utils';

const STEPS = ['requested', 'accepted', 'in-progress', 'completed', 'paid'] as const;
const LABEL: Record<string, string> = { requested: 'Requested', accepted: 'Accepted', 'in-progress': 'In Progress', completed: 'Completed', paid: 'Paid' };

/** Visual step tracker driven by booking.status + paymentStatus (optional requirement #3). */
export function JobTracker({ booking }: { booking: Booking }) {
  if (booking.status === 'rejected' || booking.status === 'cancelled') {
    return <p className="text-xs font-medium text-slate-500">Job {booking.status}. No further steps.</p>;
  }
  const current = booking.paymentStatus === 'paid' ? 4 : STEPS.indexOf(booking.status as (typeof STEPS)[number]);
  return (
    <ol className="flex items-center" aria-label="Job progress">
      {STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span className={cn('grid size-6 place-items-center rounded-full text-[10px] font-bold', done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')}>
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn('whitespace-nowrap text-[10px]', done ? 'font-semibold text-brand-800' : 'text-slate-400')}>{LABEL[s]}</span>
            </span>
            {i < STEPS.length - 1 && <span className={cn('mx-1 mb-4 h-0.5 flex-1', i < current ? 'bg-emerald-500' : 'bg-slate-200')} />}
          </li>
        );
      })}
    </ol>
  );
}
