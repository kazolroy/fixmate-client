import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { buttonClass } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <svg viewBox="0 0 220 160" className="mb-6 w-56" role="img" aria-label="A broken wrench">
          <rect x="10" y="130" width="200" height="8" rx="4" fill="#d3eef2" />
          <g transform="rotate(-35 80 80)">
            <rect x="30" y="72" width="100" height="16" rx="8" fill="#0f6a7e" />
            <path d="M130 64a18 18 0 1 1 0 32 10 10 0 0 0 0-32z" fill="#0f6a7e" />
          </g>
          <g transform="rotate(30 150 90)">
            <rect x="120" y="82" width="70" height="16" rx="8" fill="#f26b21" />
            <circle cx="190" cy="90" r="14" fill="none" stroke="#f26b21" strokeWidth="9" />
          </g>
          <path d="M104 38l8 14-10 8 10 12" fill="none" stroke="#08303b" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="font-display text-7xl font-extrabold text-accent-500">404</p>
        <h1 className="mt-2 text-3xl font-bold">This page needs repairing</h1>
        <p className="mt-2 max-w-md text-slate-500">
          The page you are looking for doesn’t exist, was moved, or the service is no longer available.
        </p>
        <Link href="/" className={buttonClass('primary', 'lg', 'mt-8')}>
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
