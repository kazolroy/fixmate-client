import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Timer, Wallet } from 'lucide-react';
import { publicGet } from '@/lib/api';
import type { Service } from '@/lib/types';
import { money } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { RequestPanel } from '@/components/request-panel';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const s = await publicGet<Service>(`/api/services/${id}`);
  return { title: s?.title || 'Service not found' };
}

export default async function ServiceDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const service = await publicGet<Service>(`/api/services/${id}`);
  if (!service) notFound();

  const facts = [
    { icon: Wallet, label: 'Starting price', value: money(service.basePrice) },
    { icon: Timer, label: 'Estimated duration', value: service.estimatedDuration },
    { icon: Clock, label: 'Service mode', value: service.serviceMode },
    { icon: MapPin, label: 'Service area', value: service.serviceArea },
  ];
  const tech = service.technician;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-accent-600">
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-brand-50 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.image} alt={service.title} className="size-full object-cover" />
          </div>
          <div className="mt-6">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{service.category}</span>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{service.title}</h1>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{service.description}</p>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Starting at</p>
            <p className="font-display text-4xl font-extrabold text-accent-600">{money(service.basePrice)}</p>
            <p className="mb-5 mt-1 text-sm text-slate-500">Final amount is set by the technician. You pay only after completion.</p>
            <dl className="mb-6 space-y-3 border-t border-slate-100 pt-5">
              {facts.slice(1).map((f) => (
                <div key={f.label} className="flex items-center gap-3 text-sm">
                  <f.icon className="size-4 shrink-0 text-brand-500" />
                  <dt className="text-slate-500">{f.label}</dt>
                  <dd className="ml-auto text-right font-medium text-brand-900">{f.value}</dd>
                </div>
              ))}
            </dl>
            <RequestPanel service={service} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">Your technician</h2>
            <div className="flex items-center gap-4">
              <Avatar name={tech?.name || service.technicianName} src={tech?.image} className="size-14 text-lg" />
              <div className="min-w-0">
                <p className="truncate font-bold text-brand-900">{tech?.name || service.technicianName}</p>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="size-3.5" /> {tech?.area || service.serviceArea}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {tech?.bio || 'Verified FixMate technician. Approved by our admin team.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
