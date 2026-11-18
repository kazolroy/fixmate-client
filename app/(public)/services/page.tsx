import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { publicGet } from '@/lib/api';
import type { Service } from '@/lib/types';
import { ServiceCard } from '@/components/service-card';
import { ServicesFilters } from '@/components/services-filters';
import { EmptyState } from '@/components/ui/states';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Browse Services' };
export const dynamic = 'force-dynamic';

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

function pageList(page: number, pages: number) {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default async function ServicesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const current = { q: one(sp.q), category: one(sp.category), mode: one(sp.mode), sort: one(sp.sort) || 'newest' };
  const page = Math.max(parseInt(one(sp.page), 10) || 1, 1);

  const qs = new URLSearchParams({ page: String(page), limit: '12' });
  Object.entries(current).forEach(([k, v]) => v && qs.set(k, v));
  const data = await publicGet<{ items: Service[]; total: number; page: number; pages: number }>(`/api/services?${qs}`);

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const hrefFor = (p: number) => {
    const s = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => v && s.set(k, v));
    if (p > 1) s.set('page', String(p));
    return `/services${s.toString() ? `?${s}` : ''}`;
  };

  return (
    <>
      <section className="blueprint text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Browse Repair Services</h1>
          <p className="mt-2 max-w-2xl text-brand-100/90">
            Every listing is reviewed by our admins. Search, filter and sort to find the right technician.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ServicesFilters current={current} />

        <p className="mb-5 mt-6 text-sm text-slate-500">
          {data ? (
            <>
              Showing <strong className="text-brand-900">{items.length}</strong> of <strong className="text-brand-900">{data.total}</strong> services
            </>
          ) : (
            'Services are temporarily unavailable.'
          )}
        </p>

        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={data ? 'No services match your search' : 'Could not load services'}
            message={data ? 'Try a different keyword, or clear the filters to see everything.' : 'Please refresh the page in a moment.'}
            ctaHref="/services"
            ctaLabel="Clear filters"
          />
        )}

        {pages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <Link
              aria-disabled={page <= 1}
              href={hrefFor(Math.max(page - 1, 1))}
              className={cn('inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium', page <= 1 && 'pointer-events-none opacity-40')}
            >
              <ChevronLeft className="size-4" /> Previous
            </Link>
            {pageList(page, pages).map((p, i) =>
              p === '…' ? (
                <span key={`gap-${i}`} className="px-1 text-slate-400">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={hrefFor(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(
                    'grid size-10 place-items-center rounded-xl border text-sm font-semibold',
                    p === page ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-300 bg-white hover:bg-brand-50'
                  )}
                >
                  {p}
                </Link>
              )
            )}
            <Link
              aria-disabled={page >= pages}
              href={hrefFor(Math.min(page + 1, pages))}
              className={cn('inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium', page >= pages && 'pointer-events-none opacity-40')}
            >
              Next <ChevronRight className="size-4" />
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}
