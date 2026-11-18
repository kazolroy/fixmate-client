import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Hammer,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Wallet,
  Wrench,
  Send,
} from 'lucide-react';
import { publicGet } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import type { Service } from '@/lib/types';
import { ServiceCard } from '@/components/service-card';
import { EmptyState } from '@/components/ui/states';
import { LinkButton } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const steps = [
  { icon: Search, title: 'Find a Service', text: 'Browse approved repair services and compare technicians, prices and service areas.' },
  { icon: Send, title: 'Send a Request', text: 'Describe the problem, pick a date and send your repair request in under a minute.' },
  { icon: Hammer, title: 'Technician Fixes It', text: 'Follow every step live: Requested, Accepted, In Progress and Completed.' },
  { icon: CreditCard, title: 'Pay After Completion', text: 'Pay securely online only when the job is done and the final amount is set.' },
];

const trust = [
  { icon: BadgeCheck, title: 'Verified technicians', text: 'Every service listing is reviewed and approved by our admin team before it goes live.' },
  { icon: Wallet, title: 'Pay after service', text: 'No advance payments. You pay per job, only after it is marked completed.' },
  { icon: ShieldCheck, title: 'Transparent tracking', text: 'See exactly what is happening to your device at every stage of the job.' },
];

const stats = [
  ['120+', 'Verified technicians'],
  ['4,800+', 'Jobs completed'],
  ['100%', 'Pay after service'],
  ['4.8★', 'Average rating'],
];

const reviews = [
  { name: 'Tanvir H.', text: 'My laptop was back in two days and I only paid after checking it. Simple and honest.', tag: 'Laptop repair' },
  { name: 'Mehnaz A.', text: 'Being able to see the job go from accepted to completed removed all the stress.', tag: 'AC servicing' },
  { name: 'Imran K.', text: 'Screen replaced the same afternoon. The technician set a fair final price.', tag: 'Smartphone' },
];

export default async function HomePage() {
  const data = await publicGet<{ items: Service[] }>('/api/services?limit=6&sort=newest');
  const featured = data?.items ?? [];

  return (
    <>
      {/* HERO */}
      <section className="blueprint relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400 ring-1 ring-white/15">
              <Wrench className="size-3.5" /> Device & appliance repair
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Broken Device? Get It Fixed by <span className="text-accent-400">Verified Technicians</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100/90">
              Book a repair, follow the job step by step and pay only after the work is delivered. No guessing, no advance payment.
            </p>

            <form action="/services" className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="size-5 shrink-0 text-slate-400" />
                <input
                  name="q"
                  placeholder="Try “iPhone screen” or “AC”"
                  aria-label="Search services"
                  className="w-full bg-transparent py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-semibold text-white transition hover:bg-accent-600">
                Find a Repair <ArrowRight className="size-4" />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100/80">
              {['Approved listings only', 'Live job tracking', 'Secure Stripe checkout'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-accent-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration: job card on a workbench blueprint */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
            <div className="fm-float rounded-3xl bg-white p-6 text-slate-700 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Smartphone className="size-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-brand-900">iPhone Screen Replacement</p>
                  <p className="text-xs text-slate-500">Job #FM-2041 · Mirpur, Dhaka</p>
                </div>
              </div>
              <ol className="mt-6 space-y-4">
                {[
                  ['Requested', true],
                  ['Accepted', true],
                  ['In Progress', true],
                  ['Completed', false],
                ].map(([label, done], i) => (
                  <li key={String(label)} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                        done ? 'bg-emerald-500 text-white' : 'border-2 border-dashed border-slate-300 text-slate-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={done ? 'font-medium text-brand-900' : 'text-slate-400'}>{String(label)}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3">
                <span className="text-sm text-slate-600">Pay after completion</span>
                <span className="font-display text-lg font-extrabold text-accent-600">$45.00</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-8 flex items-center gap-2 rounded-2xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-xl">
              <Star className="size-4 fill-white" /> 4.8 average rating
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">Fresh on FixMate</p>
            <h2 className="text-3xl font-bold">Featured Services</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-accent-600">
            View all services <ArrowRight className="size-4" />
          </Link>
        </div>
        {featured.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        ) : (
          <EmptyState title="No services yet" message="Approved services will appear here as soon as technicians list them." ctaHref="/services" ctaLabel="Browse services" />
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">Simple by design</p>
            <h2 className="text-3xl font-bold">How FixMate Works</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-brand-100">{i + 1}</span>
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-brand-700 text-white">
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CATEGORIES + WHY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">What needs fixing?</p>
          <h2 className="text-3xl font-bold">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/services?category=${encodeURIComponent(c.name)}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-accent-400 hover:shadow-lg"
            >
              <span className="mb-3 grid size-12 place-items-center rounded-xl bg-brand-50 text-2xl">{c.emoji}</span>
              <h3 className="font-bold group-hover:text-accent-600">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.blurb}</p>
            </Link>
          ))}
          <Link
            href="/services"
            className="flex h-full flex-col items-start justify-center rounded-2xl bg-brand-700 p-5 text-white transition hover:bg-brand-800"
          >
            <h3 className="text-lg font-bold text-white">See everything</h3>
            <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-100">
              All services <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-600">
                <t.icon className="size-6" />
              </div>
              <div>
                <h3 className="font-bold">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="blueprint mt-10 grid grid-cols-2 gap-6 rounded-3xl p-8 text-center sm:grid-cols-4">
          {stats.map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-extrabold text-accent-400 sm:text-4xl">{v}</p>
              <p className="mt-1 text-sm text-brand-100">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-3 flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-600">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-brand-900">{r.name}</span> · <span className="text-slate-500">{r.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-accent-50 p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold">Are you a skilled technician?</h2>
            <p className="mt-1 text-slate-600">List your services, receive requests and get paid per job.</p>
          </div>
          <LinkButton href="/sign-up" size="lg">
            Join as a Technician
          </LinkButton>
        </div>
      </section>
    </>
  );
}
