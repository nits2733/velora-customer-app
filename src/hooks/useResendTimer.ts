import { useCallback, useEffect, useState } from 'react';

/**
 * Counts down from `seconds` (a code has just been sent when the screen opens) so "send a new code" is
 * offered only once the server's own cooldown is over, instead of letting the customer hit a 429.
 */
export function useResendTimer(seconds = 60) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);
  const restart = useCallback(() => setLeft(seconds), [seconds]);
  return { left, ready: left <= 0, restart };
}
