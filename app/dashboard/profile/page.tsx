'use client';

import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, controlClass } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/states';

type U = { name: string; email: string; image?: string | null; role?: string; phone?: string; area?: string; bio?: string };

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user as U | undefined;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setPreview(user?.image ?? null), [user?.image]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || '').trim();
    const errs: Record<string, string> = {};
    if (v('name').length < 2) errs.name = 'Name must be at least 2 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const image = file ? await uploadToImgBB(file) : undefined;
      await api('/api/users/profile', {
        method: 'PATCH',
        body: { name: v('name'), phone: v('phone'), area: v('area'), bio: v('bio'), ...(image ? { image } : {}) },
      });
      await refetch(); // navbar + dashboard top bar update immediately
      setFile(null);
      toast.success('Profile updated');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !user) return <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />;

  return (
    <>
      <PageHeader title="Update Profile" subtitle="Keep your contact details and photo up to date." />
      <form onSubmit={save} noValidate className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-5">
          <div className="relative">
            <Avatar name={user.name} src={preview} className="size-24 text-3xl" />
            <label
              htmlFor="photo"
              className="absolute -bottom-1 -right-1 grid size-9 cursor-pointer place-items-center rounded-full bg-accent-500 text-white shadow hover:bg-accent-600"
              title="Change photo"
            >
              <Camera className="size-4" />
              <span className="sr-only">Change profile photo</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </div>
          <div>
            <p className="text-xl font-bold text-brand-900">{user.name}</p>
            <div className="mt-1">
              <StatusBadge status={user.role || 'customer'} />
            </div>
            {file && <p className="mt-2 text-xs text-slate-500">New photo selected — save to upload.</p>}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="pf-name" error={errors.name}>
            <input id="pf-name" name="name" defaultValue={user.name} className={controlClass('', !!errors.name)} />
          </Field>
          <Field label="Phone" htmlFor="pf-phone">
            <input id="pf-phone" name="phone" defaultValue={user.phone || ''} placeholder="01XXXXXXXXX" className={controlClass()} />
          </Field>
          <Field label="Email (read-only)" htmlFor="pf-email">
            <input id="pf-email" value={user.email} readOnly disabled className={controlClass()} />
          </Field>
          <Field label="Role (read-only)" htmlFor="pf-role">
            <input id="pf-role" value={user.role || 'customer'} readOnly disabled className={controlClass('capitalize')} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Area" htmlFor="pf-area">
              <input id="pf-area" name="area" defaultValue={user.area || ''} placeholder="Mirpur, Dhaka" className={controlClass()} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Bio" htmlFor="pf-bio" hint={user.role === 'technician' ? 'Tell customers about your skills and experience' : 'A short note about yourself'}>
              <textarea id="pf-bio" name="bio" rows={4} defaultValue={user.bio || ''} className={controlClass()} />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </>
  );
}
