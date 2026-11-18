import type { Metadata } from 'next';
import { CircleSlash } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Payment Cancelled' };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CircleSlash className="mx-auto size-16 text-amber-500" />
        <h1 className="mt-4 text-3xl font-extrabold">Payment cancelled</h1>
        <p className="mt-2 text-slate-500">No problem — nothing was charged and your booking is unchanged. You can pay whenever you’re ready.</p>
        <LinkButton href="/dashboard/customer/bookings" size="lg" className="mt-6 w-full">
          Try Again
        </LinkButton>
      </div>
    </div>
  );
}
