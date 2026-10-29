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

/**
 * Called once when a request that carried a token comes back 401 (the access token expired). Returns
 * true if a new token was obtained, in which case the request is repeated one time.
 */
let unauthorizedHandler: () => Promise<boolean> = async () => false;
export function setUnauthorizedHandler(fn: () => Promise<boolean>) {
  unauthorizedHandler = fn;
}

type QueryValue = string | number | boolean | undefined | readonly (string | number)[];

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  /** JSON-serialised, or sent as is when it is FormData (an upload). */
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** False for the sign-in endpoints: no token is sent and a 401 is a real answer, not an expired session. */
  auth?: boolean;
}

/** "?a=1&b=x&b=y". Arrays repeat the key; undefined values and empty arrays are left out. */
export function buildQuery(query: Record<string, QueryValue> | undefined): string {
  if (!query) return '';
  const pairs = Object.entries(query).flatMap(([k, v]) => {
    if (v === undefined) return [];
    const values = Array.isArray(v) ? v : [v];
    return values.map((item) => `${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`);
  });
  return pairs.length ? '?' + pairs.join('&') : '';
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal, timeoutMs = 15000, auth = true } = opts;
  const qs = buildQuery(query);
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const send = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    signal?.addEventListener('abort', () => controller.abort());
    try {
      return await fetch(`${env.apiBaseUrl}${path}${qs}`, {
        method,
        headers,
        body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      throw new ApiError('Cannot reach Velora right now. Check your connection.', 0);
    } finally {
      clearTimeout(timer);
    }
  };

  const token = auth ? accessTokenProvider() : null;
  let res = await send(token);
  if (res.status === 401 && auth && (await unauthorizedHandler())) {
    res = await send(accessTokenProvider());
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
