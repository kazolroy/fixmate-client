import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'FixMate — Verified Device & Appliance Repair', template: '%s | FixMate' },
  description:
    'Book verified technicians for smartphone, laptop, AC, fridge, TV, washing machine and electrical repairs. Track every job and pay only after it is done.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Loaded at runtime (not at build time) so builds never depend on network access */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;700;800&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
