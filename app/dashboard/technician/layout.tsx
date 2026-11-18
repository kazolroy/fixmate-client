import { requireRole } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await requireRole('technician');
  return <>{children}</>;
}
