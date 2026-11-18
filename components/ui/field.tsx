import { cn } from '@/lib/utils';

const control =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-2 focus:outline-offset-0 focus:outline-brand-200 disabled:bg-slate-100 disabled:text-slate-500';

export const controlClass = (extra?: string, invalid?: boolean) =>
  cn(control, invalid && 'border-red-400 focus:border-red-500 focus:outline-red-100', extra);

export function Field({
  label,
  error,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-brand-900">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
