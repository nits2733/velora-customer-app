/** The words on a request card, built from real fields. Nothing here invents or prints an absent value. */
import { strings } from '@/content/strings';
import type { Booking } from '@/types/requests';
import { formatBudgetCompact, formatShortDate } from './format';

const clean = (value: string | null | undefined) => (value ?? '').trim() || null;

/** A whole-home project is "Full home renovation"; a single service is named by its category. */
export function requestTitle(booking: Pick<Booking, 'requestType' | 'categoryName'>): string {
  const t = strings.requests.titles;
  if (booking.requestType === 'FULL_HOME_PROJECT') return t.fullHome;
  if (booking.requestType === 'INDIVIDUAL_SERVICE') return clean(booking.categoryName) ?? t.service;
  return clean(booking.categoryName) ?? t.unknown;
}

/** "Pune · 11 Sep". Either part is left out when missing; null when both are. */
export function requestMeta(booking: Pick<Booking, 'location' | 'createdAt'>, now?: Date): string | null {
  const parts = [clean(booking.location), clean(formatShortDate(booking.createdAt, now))].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

/** "₹5L–₹8L" from the budget range; null when the request has none. The old single budget is ignored. */
export function requestBudget(booking: Pick<Booking, 'budgetMin' | 'budgetMax'>): string | null {
  return formatBudgetCompact(booking.budgetMin, booking.budgetMax);
}
