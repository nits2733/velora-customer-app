import { strings } from '@/content/strings';
import type { TimelineEvent } from '@/types/requests';
import { timelineCopyKey, timelineRows, upNext } from '../timeline';

const event = (id: number, eventType: TimelineEvent['eventType'], toStatus: TimelineEvent['toStatus'], createdAt: string): TimelineEvent => ({
  id, eventType, toStatus, fromStatus: null, createdAt,
});

describe('timelineCopyKey', () => {
  it.each([
    ['SUBMITTED', 'PENDING_ASSIGNMENT', 'submitted'],
    ['ASSIGNED', 'PENDING', 'matched'],
    ['QUOTATION_SENT', 'PENDING', 'quotationReceived'],
    ['QUOTATION_ACCEPTED', 'PENDING', 'quotationAccepted'],
    ['QUOTATION_REJECTED', 'PENDING', 'quotationDeclined'],
    ['COMPLETED', 'COMPLETED', 'completed'],
    ['CANCELLED', 'CANCELLED', 'cancelled'],
    ['STATUS_CHANGED', 'CONFIRMED', 'confirmed'],
    ['STATUS_CHANGED', 'COMPLETED', 'completed'],
    ['STATUS_CHANGED', 'PENDING', 'updated'],
    ['UNKNOWN', 'PENDING', 'updated'],
  ] as const)('%s to %s reads as "%s"', (eventType, toStatus, expected) => {
    expect(timelineCopyKey({ eventType, toStatus })).toBe(expected);
  });

  it('shows a professional cancelling (a status change to CANCELLED) as plain "cancelled", with no actor', () => {
    expect(timelineCopyKey({ eventType: 'STATUS_CHANGED', toStatus: 'CANCELLED' })).toBe('cancelled');
    expect(strings.timeline.cancelled).toBe('Request cancelled');
  });
});

describe('timelineRows', () => {
  it('lists events oldest first with plain-language labels and the time they happened', () => {
    const rows = timelineRows([
      event(3, 'STATUS_CHANGED', 'CONFIRMED', '2026-10-26T10:00:00Z'),
      event(1, 'SUBMITTED', 'PENDING_ASSIGNMENT', '2026-10-20T10:00:00Z'),
      event(2, 'ASSIGNED', 'PENDING', '2026-10-21T10:00:00Z'),
    ]);
    expect(rows.map((r) => r.label)).toEqual(['Request submitted', 'Professional matched', 'Professional confirmed']);
    expect(rows[0].at).toBe('2026-10-20T10:00:00Z');
  });

  it('breaks ties by id so equal timestamps keep a stable order', () => {
    const t = '2026-10-20T10:00:00Z';
    expect(timelineRows([event(2, 'ASSIGNED', 'PENDING', t), event(1, 'SUBMITTED', 'PENDING_ASSIGNMENT', t)]).map((r) => r.id)).toEqual([1, 2]);
  });
});

describe('upNext', () => {
  it('lists what is ahead from the status, with no dates', () => {
    expect(upNext('PENDING_ASSIGNMENT')).toHaveLength(3);
    expect(upNext('PENDING')).toEqual(['Your professional confirms', 'Work completed']);
    expect(upNext('CONFIRMED')).toEqual(['Work completed']);
  });

  it('has nothing ahead for finished or unknown requests', () => {
    expect(upNext('COMPLETED')).toEqual([]);
    expect(upNext('CANCELLED')).toEqual([]);
    expect(upNext('UNKNOWN')).toEqual([]);
  });
});

describe('copy rules', () => {
  const all = JSON.stringify(strings, (_k, v) => (typeof v === 'function' ? v(1, 'x') : v));

  it('never mentions money held for anyone, taxes, or a response time', () => {
    expect(all.toLowerCase()).not.toMatch(/escrow|gst|within \d+|in \d+ minutes|usually/);
  });

  it('never uses the old jargon', () => {
    expect(all).not.toMatch(/Phase|Stage \d|Concierge|Connoisseur|Privilege|Atelier|Audit|Principal Designer/);
  });
});
