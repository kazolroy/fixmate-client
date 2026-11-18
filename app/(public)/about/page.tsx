import type { Metadata } from 'next';
import { CreditCard, Hammer, Search, Send, ShieldCheck, Users, Wrench } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';

export const metadata: Metadata = { title: 'How It Works & About' };

const steps = [
  { icon: Search, title: 'Find a service', text: 'Search approved services by title or category and filter by category, mode and price.' },
  { icon: Send, title: 'Send a request', text: 'Give us your phone, address, preferred date and a short description of the problem.' },
  { icon: Hammer, title: 'Technician fixes it', text: 'The technician accepts, starts work and completes the job with a final amount.' },
  { icon: CreditCard, title: 'Pay after completion', text: 'Pay with Stripe once the job is completed. Never before.' },
];

const roles = [
  { icon: Users, title: 'Customers', text: 'Browse services, send repair requests, cancel while a request is still “requested”, pay for completed jobs and see payment history.' },
  { icon: Wrench, title: 'Technicians', text: 'List services, manage availability, accept or reject requests, update job status and set the final amount.' },
  { icon: ShieldCheck, title: 'Admins', text: 'Approve or reject listings, manage user roles, monitor every job and track Stripe revenue.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="blueprint text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Repairs you can actually follow</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100/90">
            People struggle to find a trustworthy technician, then hand over a device with no idea what happens next and often pay before any work is done.
            FixMate gives every job a clear, trackable status and moves payment to the end.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-brand-100">{i + 1}</span>
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-brand-700 text-white">
                <s.icon className="size-6" />
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mb-8 mt-20 text-center text-3xl font-bold">Built for three roles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-accent-50 text-accent-600">
                <r.icon className="size-6" />
              </div>
              <h3 className="text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <LinkButton href="/services" size="lg">
            Browse services
          </LinkButton>
        </div>
      </section>
    </>
  );
}
