import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { usePinnedRequests, useRequestCounts, useRequestList } from '../useRequests';

jest.mock('expo-network', () => ({ getNetworkStateAsync: jest.fn(() => Promise.resolve({ isConnected: true })), addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })) }));

const json = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(JSON.stringify(body)) } as Response);

let fetchMock: jest.Mock;
const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  fetchMock = jest.fn((url: string) =>
    url.includes('/counts') ? json({ byStatus: {}, awaitingQuotationResponse: 0 }) : json({ content: [], page: 0, totalElements: 0, last: true }),
  );
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe('request queries for a guest', () => {
  it('make no network call at all while disabled', async () => {
    renderHook(
      () => ({ counts: useRequestCounts(false), list: useRequestList('active', false), pinned: usePinnedRequests(false) }),
      { wrapper },
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetch once enabled, so a signed-in customer still gets their data', async () => {
    const { result } = await renderHook(() => ({ counts: useRequestCounts(true), list: useRequestList('active', true) }), { wrapper });
    await waitFor(() => expect(result.current.counts.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    expect(fetchMock.mock.calls.map(([url]) => String(url).replace(/^https?:\/\/[^/]+/, ''))).toEqual(
      expect.arrayContaining(['/api/bookings/counts']),
    );
  });
});
