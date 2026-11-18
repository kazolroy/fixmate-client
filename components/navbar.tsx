'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserCog, X } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Logo } from './ui/logo';
import { Avatar } from './ui/avatar';
import { StatusBadge } from './ui/badge';
import { LinkButton } from './ui/button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'How It Works / About' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as { name: string; image?: string | null; role?: string; email: string } | undefined;
  const role = user?.role || 'customer';

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  async function signOut() {
    await authClient.signOut();
    clearToken();
    toast.success('Signed out. See you soon!');
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition',
                isActive(l.href) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-800'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={menu}
              >
                <Avatar name={user.name} src={user.image} />
                <ChevronDown className="size-4 text-slate-500" />
              </button>
              {menu && (
                <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 bg-slate-50 p-4">
                    <p className="truncate font-semibold text-brand-900">{user.name}</p>
                    <p className="mb-2 truncate text-xs text-slate-500">{user.email}</p>
                    <StatusBadge status={role} />
                  </div>
                  <div className="p-1.5 text-sm">
                    <Link role="menuitem" href={`/dashboard/${role}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-brand-50">
                      <LayoutDashboard className="size-4 text-brand-600" /> Dashboard
                    </Link>
                    <Link role="menuitem" href="/dashboard/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-brand-50">
                      <UserCog className="size-4 text-brand-600" /> Update Profile
                    </Link>
                    <button role="menuitem" onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <LinkButton href="/sign-in" variant="outline" size="sm">
                Sign In
              </LinkButton>
              <LinkButton href="/sign-up" size="sm">
                Sign Up
              </LinkButton>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-brand-800 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn('rounded-lg px-3 py-3 text-sm font-medium', isActive(l.href) ? 'bg-brand-50 text-brand-700' : 'text-slate-700')}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-3 px-3 pb-2">
                <Avatar name={user.name} src={user.image} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-900">{user.name}</p>
                  <StatusBadge status={role} />
                </div>
              </div>
              <Link href={`/dashboard/${role}`} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-brand-50">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-brand-50">
                Update Profile
              </Link>
              <button onClick={signOut} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <LinkButton href="/sign-in" variant="outline">
                Sign In
              </LinkButton>
              <LinkButton href="/sign-up">Sign Up</LinkButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
