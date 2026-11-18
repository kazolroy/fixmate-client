import { cn, initials } from '@/lib/utils';

export function Avatar({ name, src, className }: { name?: string; src?: string | null; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name || 'avatar'} className={cn('size-9 rounded-full object-cover ring-2 ring-white', className)} />;
  }
  return (
    <span
      aria-label={name}
      className={cn('grid size-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white ring-2 ring-white', className)}
    >
      {initials(name)}
    </span>
  );
}
