'use client';

import { useState } from 'react';
import { ImageUp } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORY_NAMES, MODES } from '@/lib/constants';
import { uploadToImgBB } from '@/lib/imgbb';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Field, controlClass } from '@/components/ui/field';

export type ServicePayload = {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

/** Used by both "Add a Service" and the edit modal in "My Services". */
export function ServiceForm({
  initial,
  technicianName,
  technicianEmail,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Service;
  technicianName: string;
  technicianEmail: string;
  submitLabel: string;
  onSubmit: (payload: ServicePayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || '').trim();
    const price = Number(v('basePrice'));

    const errs: Record<string, string> = {};
    if (v('title').length < 3) errs.title = 'Title must be at least 3 characters';
    if (!v('category')) errs.category = 'Choose a category';
    if (v('description').length < 20) errs.description = 'Describe the service in at least 20 characters';
    if (!Number.isFinite(price) || price <= 0) errs.basePrice = 'Enter a positive price';
    if (!v('estimatedDuration')) errs.estimatedDuration = 'Estimated duration is required';
    if (!v('serviceMode')) errs.serviceMode = 'Choose a service mode';
    if (!v('serviceArea')) errs.serviceArea = 'Service area is required';
    if (!file && !initial?.image) errs.image = 'Upload a service image';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const image = file ? await uploadToImgBB(file) : (initial?.image as string);
      await onSubmit({
        title: v('title'),
        category: v('category'),
        description: v('description'),
        image,
        basePrice: price,
        estimatedDuration: v('estimatedDuration'),
        serviceMode: v('serviceMode'),
        serviceArea: v('serviceArea'),
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Technician name" htmlFor="sv-tn">
        <input id="sv-tn" value={technicianName} readOnly className={controlClass()} />
      </Field>
      <Field label="Technician email" htmlFor="sv-te">
        <input id="sv-te" value={technicianEmail} readOnly className={controlClass()} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Title" htmlFor="sv-title" error={errors.title}>
          <input id="sv-title" name="title" defaultValue={initial?.title} placeholder="e.g. iPhone Screen Replacement" className={controlClass('', !!errors.title)} />
        </Field>
      </div>
      <Field label="Category" htmlFor="sv-cat" error={errors.category}>
        <select id="sv-cat" name="category" defaultValue={initial?.category ?? ''} className={controlClass('', !!errors.category)}>
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_NAMES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Service mode" htmlFor="sv-mode" error={errors.serviceMode}>
        <select id="sv-mode" name="serviceMode" defaultValue={initial?.serviceMode ?? ''} className={controlClass('', !!errors.serviceMode)}>
          <option value="" disabled>
            Select a mode
          </option>
          {MODES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Field>
      <Field label="Base price (USD)" htmlFor="sv-price" error={errors.basePrice}>
        <input id="sv-price" name="basePrice" type="number" step="0.01" min="0" defaultValue={initial?.basePrice} placeholder="45" className={controlClass('', !!errors.basePrice)} />
      </Field>
      <Field label="Estimated duration" htmlFor="sv-dur" error={errors.estimatedDuration}>
        <input id="sv-dur" name="estimatedDuration" defaultValue={initial?.estimatedDuration} placeholder="2-3 hours" className={controlClass('', !!errors.estimatedDuration)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Service area" htmlFor="sv-area" error={errors.serviceArea}>
          <input id="sv-area" name="serviceArea" defaultValue={initial?.serviceArea} placeholder="Dhanmondi, Dhaka" className={controlClass('', !!errors.serviceArea)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" htmlFor="sv-desc" error={errors.description} hint="What the service includes (minimum 20 characters)">
          <textarea id="sv-desc" name="description" rows={4} defaultValue={initial?.description} className={controlClass('', !!errors.description)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Service image" htmlFor="sv-img" error={errors.image} hint="Uploaded to ImgBB (max 5 MB)">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="aspect-video w-full rounded-xl border border-slate-200 object-cover sm:w-48" />
            )}
            <label
              htmlFor="sv-img"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-medium text-brand-700 hover:border-brand-500 hover:bg-brand-50"
            >
              <ImageUp className="size-5" /> {file ? file.name : initial ? 'Replace image (optional)' : 'Choose an image'}
            </label>
            <input id="sv-img" type="file" accept="image/*" onChange={pick} className="sr-only" />
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
