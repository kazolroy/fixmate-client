'use client';

import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
      <TriangleAlert className="mx-auto size-10 text-red-500" />
      <h1 className="mt-3 text-xl font-bold">This page hit a problem</h1>
      <p className="mt-1 text-sm text-slate-500">{error.message || 'Please try again.'}</p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
