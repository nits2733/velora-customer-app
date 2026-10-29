import { onlineManager, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { requestsApi } from '@/services/requests';
import { ApiError } from '@/services/apiClient';
import { ACTIVE_STATUSES, PAST_STATUSES, type RequestTab } from '@/utils/requestState';
import { strings } from '@/content/strings';

export const requestKeys = {
  all: ['requests'] as const,
  counts: ['requests', 'counts'] as const,
  list: (tab: RequestTab) => ['requests', 'list', tab] as const,
  pinned: ['requests', 'pinned'] as const,
  detail: (id: number) => ['requests', 'detail', id] as const,
  timeline: (id: number) => ['requests', 'timeline', id] as const,
  quotation: (id: number) => ['requests', 'quotation', id] as const,
};

const PAGE_SIZE = 10;

/** Every request hook takes `enabled`: nothing may be fetched until a customer is signed in. */
export function useRequestCounts(enabled = true) {
  return useQuery({ queryKey: requestKeys.counts, queryFn: () => requestsApi.counts(), enabled });
}

export function useRequestList(tab: RequestTab, enabled = true) {
  return useInfiniteQuery({
    enabled,
    queryKey: requestKeys.list(tab),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      requestsApi.list({ status: tab === 'active' ? ACTIVE_STATUSES : PAST_STATUSES, page: pageParam, size: PAGE_SIZE }),
    getNextPageParam: (last) => (last.last ? undefined : last.page + 1),
  });
}

/** Requests with a quotation waiting for an answer. Filtered by the server, so it never depends on which page is loaded. */
export function usePinnedRequests(enabled = true) {
  return useQuery({
    queryKey: requestKeys.pinned,
    queryFn: () => requestsApi.list({ actionNeeded: true, size: 50 }),
    enabled,
  });
}

export function useRequest(id: number) {
  return useQuery({ queryKey: requestKeys.detail(id), queryFn: () => requestsApi.get(id) });
}

export function useTimeline(id: number) {
  return useQuery({ queryKey: requestKeys.timeline(id), queryFn: () => requestsApi.timeline(id) });
}

export function useQuotation(id: number, enabled: boolean) {
  return useQuery({ queryKey: requestKeys.quotation(id), queryFn: () => requestsApi.quotation(id), enabled });
}

/** True while the device has no network. Queries pause rather than fail, so screens need this to say so. */
export function useIsOffline(): boolean {
  return useSyncExternalStore(
    (listener) => onlineManager.subscribe(listener),
    () => !onlineManager.isOnline(),
    () => false,
  );
}

/** A message a customer can act on, for any failure. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetwork) return strings.requests.error.offlineBody;
    if (error.status === 409) return strings.detail.conflict;
  }
  return strings.detail.genericError;
}

export function isConflict(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}

/**
 * Actions on one request. Every one refreshes everything that shows requests (list, pinned section,
 * counts, detail), so the Active/Past split and the badges can never disagree with the detail screen.
 * A 409 means it changed under the customer; the refresh shows them what it is now.
 */
export function useRequestActions(id: number) {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: requestKeys.all });
  const options = { onSettled: refresh };

  return {
    accept: useMutation({ mutationFn: () => requestsApi.acceptQuotation(id), ...options }),
    decline: useMutation({ mutationFn: (reason?: string) => requestsApi.rejectQuotation(id, reason), ...options }),
    cancel: useMutation({ mutationFn: (reason?: string) => requestsApi.cancel(id, reason), ...options }),
    review: useMutation({
      mutationFn: (input: { rating: number; comment?: string }) => requestsApi.submitReview(id, input),
      ...options,
    }),
  };
}
