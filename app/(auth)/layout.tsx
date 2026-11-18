import { Wrench } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="blueprint relative hidden flex-col justify-between p-12 text-white lg:flex">
        <Logo light />
        <div>
          <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-accent-500">
            <Wrench className="size-7 -rotate-45" />
          </div>
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Fix it fast. <br />
            Pay only when it’s done.
          </h2>
          <p className="mt-4 max-w-md text-brand-100/90">
            Join customers and verified technicians on a platform where every repair job is tracked from request to payment.
          </p>
        </div>
        <p className="text-xs text-brand-200/70">© {new Date().getFullYear()} FixMate</p>
      </aside>
      <main className="flex flex-col justify-center px-4 py-10 sm:px-10">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
