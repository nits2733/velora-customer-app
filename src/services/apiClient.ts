import { env } from '@/config/env';
import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiError';
  }
  get isNetwork() { return this.status === 0; }
  get isAuth() { return this.status === 401 || this.status === 403; }
}

let accessTokenProvider: () => string | null = () => null;
export function setAccessTokenProvider(fn: () => string | null) {
  accessTokenProvider = fn;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal, timeoutMs = 15000 } = opts;
  const qs = query
    ? '?' + Object.entries(query)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = accessTokenProvider();
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener('abort', () => controller.abort());

  let res: Response;
  try {
    res = await fetch(`${env.apiBaseUrl}${path}${qs}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Cannot reach Velora right now. Check your connection.', 0);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  const json = text ? safeParse(text) : undefined;
  if (!res.ok) {
    const err = json as ApiErrorBody | undefined;
    throw new ApiError(err?.message ?? `Request failed (${res.status})`, res.status, err);
  }
  return json as T;
}

function safeParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return undefined; }
}
