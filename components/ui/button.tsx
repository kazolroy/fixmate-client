import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const variants: Record<Variant, string> = {
  primary: 'bg-accent-500 text-white shadow-sm hover:bg-accent-600',
  secondary: 'bg-brand-700 text-white hover:bg-brand-800',
  outline: 'border border-slate-300 bg-white text-brand-800 hover:bg-brand-50',
  ghost: 'text-brand-800 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cn(base, variants[variant], sizes[size], extra);

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, ...rest }: BtnProps) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
