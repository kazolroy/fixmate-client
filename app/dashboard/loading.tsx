import { Spinner } from '@/components/ui/states';

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <Spinner />
    </div>
  );
}
