import { useSyncExternalStore } from 'react';
import { sessionStore, type SessionStatus } from './sessionStore';
import type { SessionUser } from './tokenStore';

export interface Session {
  status: SessionStatus;
  user: SessionUser | null;
  signOut: () => Promise<void>;
}

export type { SessionUser };

export function useSession(): Session {
  const { status, user } = useSyncExternalStore(sessionStore.subscribe, sessionStore.snapshot, sessionStore.snapshot);
  return { status, user, signOut: sessionStore.signOut };
}
