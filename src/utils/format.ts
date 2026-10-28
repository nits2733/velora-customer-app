export function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

export function formatCountdown(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return { h: pad2(Math.floor(s / 3600)), m: pad2(Math.floor((s % 3600) / 60)), s: pad2(s % 60) };
}
