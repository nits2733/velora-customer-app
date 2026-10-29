import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import type { ReactNode } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { ApiError } from '@/services/apiClient';
import { sessionStore } from '@/session/sessionStore';

/**
 * Do not retry a request the server understood and refused (400 to 499): it will refuse again. Retry
 * twice for the network or a server error.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: shouldRetry, refetchOnWindowFocus: true, refetchOnReconnect: true },
    mutations: { retry: false },
  },
});

// One customer's requests must never be shown to the next person who signs in on this device.
sessionStore.onSignOut(() => queryClient.clear());

/** React Native has no window focus: "focused" means the app is in the foreground. */
focusManager.setEventListener((handleFocus) => {
  const onChange = (status: AppStateStatus) => handleFocus(status === 'active');
  const subscription = AppState.addEventListener('change', onChange);
  return () => subscription.remove();
});

/** Online state comes from the device's network, so queries pause offline and refetch on reconnect. */
onlineManager.setEventListener((setOnline) => {
  Network.getNetworkStateAsync()
    .then((state) => setOnline(state.isConnected !== false))
    .catch(() => {});
  const subscription = Network.addNetworkStateListener((state) => setOnline(state.isConnected !== false));
  return () => subscription.remove();
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
