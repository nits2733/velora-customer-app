import { useEffect, useState } from 'react';

/** Cycles through `items` every `intervalMs` while `active`; returns the current one. */
export function useRotatingPlaceholder(items: string[], active: boolean, intervalMs = 3200) {
  const [i, setI] = useState(0);
  const count = items.length;
  useEffect(() => {
    if (!active || count < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [active, count, intervalMs]);
  return items[count ? i % count : 0];
}
