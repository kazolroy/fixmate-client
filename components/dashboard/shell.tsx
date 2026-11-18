'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  ReceiptText,
  Users,
  Wrench,
  X,
  UserCog,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/badge';

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const MENUS: Record<string, Item[]> = {
  customer: [
    { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/customer/bookings', label: 'My Bookings', icon: CalendarCheck },
    { href: '/dashboard/customer/payments', label: 'Payment History', icon: CreditCard },
  ],
  technician: [
    { href: '/dashboard/technician', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/technician/add-service', label: 'Add Service', icon: PackagePlus },
    { href: '/dashboard/technician/my-services', label: 'My Services', icon: Wrench },
    { href: '/dashboard/technician/requests', label: 'Manage Requests', icon: ClipboardList },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    { href: '/dashboard/admin/services', label: 'Service Approval', icon: ShieldCheck },
    { href: '/dashboard/admin/bookings', label: 'All Bookings', icon: ClipboardList },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: ReceiptText },
  ],
};

export function DashboardShell({
  role,
  initialUser,
  children,
}: {
  role: 'customer' | 'technician' | 'admin';
  initialUser: { name: string; image: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // live session: name / photo changes in Update Profile show up here immediately
  const { data: session } = authClient.useSession();
  const user = (session?.user as { name: string; image?: string | null } | undefined) ?? initialUser;
  const items = [...MENUS[role], { href: '/dashboard/profile', label: 'Update Profile', icon: UserCog } as Item];

  const active = (i: Item) => (i.exact ? pathname === i.href : pathname.startsWith(i.href));

  async function signOut() {
    await authClient.signOut();
    clearToken();
    toast.success('Signed out. See you soon!');
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {open && <div className="fixed inset-0 z-40 bg-brand-950/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-900 text-brand-100 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Logo light />
          <button className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
          <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-brand-300/70">{role} menu</p>
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              aria-current={active(i) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active(i) ? 'bg-accent-500 text-white shadow' : 'text-brand-100/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <i.icon className="size-[18px]" /> {i.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-100/80 hover:bg-white/10 hover:text-white">
            <LogOut className="size-[18px]" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-brand-800 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
              <Menu className="size-6" />
            </button>
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-800">
              <Home className="size-4" /> <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold leading-tight text-brand-900">{user.name}</p>
              <StatusBadge status={role} className="mt-0.5" />
            </div>
            <Avatar name={user.name} src={user.image} />
          </div>
        </header>
        <main className="w-full p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
