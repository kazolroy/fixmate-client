import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Same size and style everywhere (navbar, footer, auth, dashboard). */
export function Logo({ light, href = '/' }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="FixMate home">
      <span className="grid size-9 place-items-center rounded-xl bg-accent-500 text-white shadow-sm">
        <Wrench className="size-5 -rotate-45" strokeWidth={2.5} />
      </span>
      <span className={cn('font-display text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-brand-900')}>
        Fix<span className="text-accent-500">Mate</span>
      </span>
    </Link>
  );
}
