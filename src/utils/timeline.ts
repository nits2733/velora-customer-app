/**
 * Turns the server's audit events into the customer's progress list. Copy is chosen from the event
 * type and `toStatus`; the server's free-text note is never read, so a wording change on the backend
 * cannot change or break what the customer sees.
 *
 * Only things that happened carry a date. What is still ahead is listed without one, so a future
 * date can never sit next to a "current" step.
 */
import { strings } from '@/content/strings';
import type { BookingStatus, TimelineEvent, Unknown } from '@/types/requests';

type Copy = keyof typeof strings.timeline;

export function timelineCopyKey(event: Pick<TimelineEvent, 'eventType' | 'toStatus'>): Copy {
  switch (event.eventType) {
    case 'SUBMITTED':
      return 'submitted';
    case 'ASSIGNED':
      return 'matched';
    case 'QUOTATION_SENT':
      return 'quotationReceived';
    case 'QUOTATION_ACCEPTED':
      return 'quotationAccepted';
    case 'QUOTATION_REJECTED':
      return 'quotationDeclined';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      // The record does not say who cancelled, so neither does the copy.
      return 'cancelled';
    case 'STATUS_CHANGED':
      // A professional cancelling arrives here, with the new status CANCELLED.
      if (event.toStatus === 'CONFIRMED') return 'confirmed';
      if (event.toStatus === 'COMPLETED') return 'completed';
      if (event.toStatus === 'CANCELLED') return 'cancelled';
      return 'updated';
    default:
      return 'updated';
  }
}

export interface TimelineRow {
  id: number;
  label: string;
  at: string;
}

/** Events oldest first, as they happened. */
export function timelineRows(events: readonly TimelineEvent[]): TimelineRow[] {
  return [...events]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id)
    .map((event) => ({ id: event.id, label: strings.timeline[timelineCopyKey(event)], at: event.createdAt }));
}

/** What is still to come for an active request, from its status alone. No dates, no promises about when. */
export function upNext(status: BookingStatus | Unknown): string[] {
  switch (status) {
    case 'PENDING_ASSIGNMENT':
      return [strings.timeline.nextMatched, strings.timeline.nextConfirm, strings.timeline.nextCompleted];
    case 'PENDING':
      return [strings.timeline.nextConfirm, strings.timeline.nextCompleted];
    case 'CONFIRMED':
      return [strings.timeline.nextCompleted];
    default:
      return [];
  }
}
