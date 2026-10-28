import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/services/apiClient';

interface AsyncState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  refreshing: boolean;
  reload: () => void;
  refresh: () => Promise<void>;
}

/** Runs `fn` on mount; exposes loading / error / refresh for pull-to-refresh screens. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fnRef = useRef(fn);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  });

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await fnRef.current(controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof ApiError ? e : new ApiError('Something went wrong', -1));
    } finally {
      if (!controller.signal.aborted) { setLoading(false); setRefreshing(false); }
    }
  }, []);

  // `loading` starts true, so the first fetch needs no synchronous setState here.
  useEffect(() => {
    run();
    return () => abortRef.current?.abort();
  }, [run]);

  return {
    data,
    error,
    loading,
    refreshing,
    reload: () => {
      setLoading(true);
      run();
    },
    refresh: async () => {
      setRefreshing(true);
      await run();
    },
  };
}
