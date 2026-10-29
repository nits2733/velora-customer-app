export function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

export function formatCountdown(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return { h: pad2(Math.floor(s / 3600)), m: pad2(Math.floor((s % 3600) / 60)), s: pad2(s % 60) };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** The one date format used across Requests: "24 Oct, 10:30 AM", in the device's time zone. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const hours = d.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hour12}:${pad2(d.getMinutes())} ${hours < 12 ? 'AM' : 'PM'}`;
}

/** "11 Sep" for this year, "11 Sep 2025" for any other. For lists, where the time of day is noise. */
export function formatShortDate(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return d.getFullYear() === now.getFullYear() ? base : `${base} ${d.getFullYear()}`;
}

/** "₹75,000", "₹5L", "₹7.5L", "₹1.2Cr": the short form used where room is tight. Null for no usable amount. */
export function formatRupeesCompact(amount: number | null): string | null {
  if (amount === null || !Number.isFinite(amount) || amount <= 0) return null;
  const trim = (n: number) => String(Math.round(n * 10) / 10);
  if (amount >= 10_000_000) return `₹${trim(amount / 10_000_000)}Cr`;
  if (amount >= 100_000) return `₹${trim(amount / 100_000)}L`;
  return formatRupees(amount);
}

/** "₹5L–₹8L", "Up to ₹8L", "From ₹5L", "₹5L", or null when there is no usable budget. Never "₹0" or "null". */
export function formatBudgetCompact(min: number | null, max: number | null): string | null {
  const lo = formatRupeesCompact(min);
  const hi = formatRupeesCompact(max);
  if (lo && hi) return lo === hi ? lo : `${lo}–${hi}`;
  if (hi) return `Up to ${hi}`;
  if (lo) return `From ${lo}`;
  return null;
}

/** Indian digit grouping: 345000 becomes "₹3,45,000". Whole rupees unless there are paise. */
export function formatRupees(amount: number): string {
  const negative = amount < 0;
  const [whole, paise] = Math.abs(amount).toFixed(2).split('.');
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}` : lastThree;
  return `${negative ? '-' : ''}₹${grouped}${paise === '00' ? '' : `.${paise}`}`;
}

/** "₹12,00,000 to ₹18,00,000", "Up to ₹4,50,000", "From ₹3,00,000", or null when no budget was given. */
export function formatBudgetRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${formatRupees(min)} to ${formatRupees(max)}`;
  if (max !== null) return `Up to ${formatRupees(max)}`;
  if (min !== null) return `From ${formatRupees(min)}`;
  return null;
}
