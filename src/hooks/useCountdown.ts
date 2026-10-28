import { useEffect, useState } from 'react';

export function useCountdown(initialSeconds: number) {
  const [left, setLeft] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}
