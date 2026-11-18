export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/* ---------- browser: authenticated calls (JWT from /api/token) ---------- */
let cached: { token: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && cached.exp > Date.now()) return cached.token;
  const res = await fetch('/api/token', { cache: 'no-store' });
  if (!res.ok) throw new ApiError('Please sign in to continue', 401);
  const { token } = (await res.json()) as { token: string };
  cached = { token, exp: Date.now() + 50 * 60 * 1000 };
  return token;
}

export const clearToken = () => {
  cached = null;
};

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { message?: string }).message || 'Request failed', res.status);
  return data as T;
}

/* ---------- server components: public endpoints ---------- */
export async function publicGet<T = unknown>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
