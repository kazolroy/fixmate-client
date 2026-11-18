import { Spinner } from '@/components/ui/states';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Spinner label="Loading FixMate…" />
    </div>
  );
}
