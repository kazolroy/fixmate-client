'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
          <TriangleAlert className="size-8" />
        </div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-slate-500">An unexpected error occurred. You can try again, or head back home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <LinkButton href="/" variant="outline">
            Back to Home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
