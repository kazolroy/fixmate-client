import { cn } from '@/lib/utils';

/** Scrollable table shell used by every dashboard list. */
export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  );
}

export const Th = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <th className={cn('whitespace-nowrap bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500', className)}>{children}</th>
);

export const Td = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <td className={cn('border-t border-slate-100 px-4 py-3 align-middle', className)}>{children}</td>
);

export function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="size-12 shrink-0 rounded-lg bg-brand-50 object-cover" />
  );
}

export function FilterTabs({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            value === o.value ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
