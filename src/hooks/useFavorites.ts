import { useSyncExternalStore } from 'react';

/**
 * Local favorites store shared by every card on every screen.
 * BACKEND GAP: no favorites endpoint exists yet, so saves live in memory for the session.
 * When one ships, swap `toggle` to call it (optimistic) and hydrate `saved` on sign-in.
 */
let saved: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

function emit(next: ReadonlySet<string>) {
  saved = next;
  listeners.forEach((l) => l());
}

export const favorites = {
  toggle(id: string) {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    emit(next);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  snapshot: () => saved,
};

export function useFavorites() {
  const set = useSyncExternalStore(favorites.subscribe, favorites.snapshot, favorites.snapshot);
  return { isSaved: (id: string) => set.has(id), toggle: favorites.toggle };
}
