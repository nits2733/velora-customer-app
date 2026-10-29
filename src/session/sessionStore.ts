import { authService, type AuthTokens } from '@/services/authService';
import { ApiError, setAccessTokenProvider, setUnauthorizedHandler } from '@/services/apiClient';
import { tokenStore, type SessionUser } from './tokenStore';

export type SessionStatus = 'loading' | 'signedOut' | 'signedIn';

export interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
}

/**
 * The signed-in customer, shared by every screen. Tokens: the access token stays in memory; the refresh
 * token is kept in secure storage and rotated every time it is used. A request that finds the access
 * token expired triggers one refresh (shared by everything that failed at the same moment) and is then
 * repeated. If the refresh token is refused, the customer is signed out.
 */
let state: SessionState = { status: 'loading', user: null };
let accessToken: string | null = null;
let refreshToken: string | null = null;
let started = false;
let inFlightRefresh: Promise<boolean> | null = null;

const listeners = new Set<() => void>();
const signOutListeners = new Set<() => void>();

function set(next: SessionState) {
  state = next;
  listeners.forEach((l) => l());
}

async function adopt(tokens: AuthTokens) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  await tokenStore.save({ refreshToken: tokens.refreshToken, user: tokens.user });
  set({ status: 'signedIn', user: tokens.user });
}

async function clear() {
  accessToken = null;
  refreshToken = null;
  await tokenStore.clear();
  set({ status: 'signedOut', user: null });
  signOutListeners.forEach((l) => l());
}

async function doRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    await adopt(await authService.refresh(refreshToken));
    return true;
  } catch (error) {
    // The server answered and said no (expired, revoked, or not a customer): the session is over.
    // A network failure says nothing about the token, so keep it and try again later.
    if (error instanceof ApiError ? error.status >= 400 && error.status < 500 : error instanceof Error && error.name === 'WrongAccountTypeError') {
      await clear();
    }
    return false;
  }
}

export const sessionStore = {
  /** Restores a saved session at launch. Until it settles the status is "loading". */
  async init() {
    if (started) return;
    started = true;
    const saved = await tokenStore.load();
    if (!saved) return set({ status: 'signedOut', user: null });
    refreshToken = saved.refreshToken;
    if (await sessionStore.refresh()) return;
    // Offline at launch: stay signed in as the saved customer; the first request will refresh.
    if (refreshToken) set({ status: 'signedIn', user: saved.user });
  },

  /** Completes a sign-in or sign-up with the tokens the server issued. */
  signIn: adopt,

  /** Gets a new access token. Callers that fail together share one request. */
  refresh(): Promise<boolean> {
    inFlightRefresh ??= doRefresh().finally(() => {
      inFlightRefresh = null;
    });
    return inFlightRefresh;
  },

  async signOut() {
    const token = refreshToken;
    // End it on the server too, but never leave the customer signed in because that call failed.
    if (token) await authService.logout(token).catch(() => {});
    await clear();
  },

  /** For clearing cached data when the customer leaves. */
  onSignOut(listener: () => void) {
    signOutListeners.add(listener);
    return () => {
      signOutListeners.delete(listener);
    };
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  snapshot: () => state,

  /** Test seam: forget everything, as a fresh launch would. */
  reset() {
    accessToken = null;
    refreshToken = null;
    started = false;
    inFlightRefresh = null;
    state = { status: 'loading', user: null };
  },
};

setAccessTokenProvider(() => accessToken);
setUnauthorizedHandler(() => sessionStore.refresh());
