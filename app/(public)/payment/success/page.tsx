import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SuccessView } from './view';
import { Spinner } from '@/components/ui/states';

export const metadata: Metadata = { title: 'Payment Successful' };

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Suspense fallback={<Spinner label="Confirming your payment…" />}>
        <SuccessView />
      </Suspense>
    </div>
  );
}
