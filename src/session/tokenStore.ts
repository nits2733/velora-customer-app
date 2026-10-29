import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface SessionUser {
  id: number;
  email: string;
  fullName: string;
}

export interface StoredSession {
  refreshToken: string;
  user: SessionUser;
}

const KEY = 'velora.session.v1';

/**
 * Only the refresh token and who is signed in are kept on the device, in the system keychain
 * (iOS Keychain, Android Keystore). The short-lived access token lives in memory and is fetched again
 * from the refresh token at launch.
 *
 * Web has no secure storage: the browser build keeps the session in sessionStorage, which ends with
 * the tab. That is for development only; the shipped apps are the native ones.
 */
export const tokenStore = {
  async load(): Promise<StoredSession | null> {
    try {
      const raw = Platform.OS === 'web' ? globalThis.sessionStorage?.getItem(KEY) ?? null : await SecureStore.getItemAsync(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredSession>;
      return parsed.refreshToken && parsed.user?.id ? (parsed as StoredSession) : null;
    } catch {
      return null;
    }
  },

  async save(session: StoredSession): Promise<void> {
    const raw = JSON.stringify(session);
    if (Platform.OS === 'web') globalThis.sessionStorage?.setItem(KEY, raw);
    else await SecureStore.setItemAsync(KEY, raw);
  },

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') globalThis.sessionStorage?.removeItem(KEY);
      else await SecureStore.deleteItemAsync(KEY);
    } catch {
      // Nothing useful to do: the in-memory session is already gone.
    }
  },
};
