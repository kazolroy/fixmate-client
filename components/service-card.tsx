import Link from 'next/link';
import { Clock, MapPin, UserRound } from 'lucide-react';
import type { Service } from '@/lib/types';
import { money } from '@/lib/utils';
import { buttonClass } from './ui/button';

/** Equal-height card: fixed image ratio, flex column, button pinned to the bottom. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-brand-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt={service.title} loading="lazy" className="size-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow">
          {service.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{service.title}</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-brand-500" /> {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-brand-500" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-brand-500" />
            <span className="line-clamp-1">{service.technicianName}</span>
          </li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Starting at</p>
            <p className="font-display text-xl font-extrabold text-accent-600">{money(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service._id}`} className={buttonClass('secondary', 'sm')}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
