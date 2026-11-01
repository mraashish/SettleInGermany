import { getSession } from './auth';

/**
 * Our backend. ALL AI calls go through it (auth, rate limits, free-scan counting,
 * scan deletion). The client never holds model keys (HANDOFF §7.4).
 * TODO(product owner): backend hosting choice (HANDOFF §12).
 */
const BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(public status: number, public code: 'offline' | 'limit' | 'server' | 'auth' | 'not_configured') {
    super(code);
  }
}

async function request<T>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: unknown, form?: FormData): Promise<T> {
  if (!BASE) throw new ApiError(0, 'not_configured');
  const session = await getSession();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(form ? {} : { 'Content-Type': 'application/json' }),
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        'X-Device-Id': deviceId(),
      },
      body: form ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError(0, 'offline');
  }
  if (res.status === 402 || res.status === 429) throw new ApiError(res.status, 'limit');
  if (res.status === 401) throw new ApiError(res.status, 'auth');
  if (!res.ok) throw new ApiError(res.status, 'server');
  return (await res.json()) as T;
}

let _device: string | null = null;
function deviceId() {
  if (_device) return _device;
  // Lazy import keeps this file free of storage details.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { kv } = require('@/lib/kv') as typeof import('@/lib/kv');
  _device = kv.get('device-id') ?? `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  kv.set('device-id', _device);
  return _device;
}

export const api = {
  get: <T>(p: string) => request<T>('GET', p),
  post: <T>(p: string, b?: unknown) => request<T>('POST', p, b),
  upload: <T>(p: string, f: FormData) => request<T>('POST', p, undefined, f),
  del: <T>(p: string) => request<T>('DELETE', p),
};
