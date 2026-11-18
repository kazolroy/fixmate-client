import { STATUS_LABEL, STATUS_STYLE } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** Single badge used for booking status, payment status, approval status and roles. */
export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const text = label || STATUS_LABEL[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STATUS_STYLE[status] || 'bg-slate-100 text-slate-600 ring-slate-200',
        className
      )}
    >
      {text}
    </span>
  );
}
