'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORY_NAMES, MODES } from '@/lib/constants';
import { controlClass } from './ui/field';

type Params = { q: string; category: string; mode: string; sort: string };

/**
 * Search / filter / sort controls. They only change the URL; the server page
 * reads the URL and asks MongoDB for the matching documents (no client-side .filter()).
 */
export function ServicesFilters({ current }: { current: Params }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(current.q);

  useEffect(() => setQ(current.q), [current.q]);

  function push(next: Partial<Params>) {
    const merged = { ...current, ...next };
    const sp = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => v && sp.set(k, v));
    startTransition(() => router.push(`/services${sp.toString() ? `?${sp}` : ''}`));
  }

  const dirty = current.q || current.category || current.mode || (current.sort && current.sort !== 'newest');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-busy={pending}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: q.trim() });
        }}
        className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]"
      >
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or category"
            aria-label="Search services"
            className={controlClass('pl-10')}
          />
        </div>
        <select aria-label="Category" value={current.category} onChange={(e) => push({ category: e.target.value })} className={controlClass()}>
          <option value="">All categories</option>
          {CATEGORY_NAMES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select aria-label="Service mode" value={current.mode} onChange={(e) => push({ mode: e.target.value })} className={controlClass()}>
          <option value="">Any mode</option>
          {MODES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select aria-label="Sort" value={current.sort || 'newest'} onChange={(e) => push({ sort: e.target.value })} className={controlClass()}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">Search</button>
          {dirty && (
            <button
              type="button"
              onClick={() => startTransition(() => router.push('/services'))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50"
              aria-label="Clear filters"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
