import { requireRole } from '@/lib/session';

export const dynamic = 'force-dynamic';

// Payment result pages are customer-only.
export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireRole('customer', '/dashboard/customer/bookings');
  return <>{children}</>;
}
