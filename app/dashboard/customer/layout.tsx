import { requireRole } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await requireRole('customer');
  return <>{children}</>;
}
