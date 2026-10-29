import {
  ACTIVE_STATUSES,
  actionNeededOnly,
  STATE_CONFIG,
  isEmptyTab,
  presentRequest,
  tabCounts,
  tabOf,
  withoutPinned,
} from '../requestState';
import { BOOKING_STATUSES, type BookingStatus, type QuotationStatus, type Unknown } from '@/types/requests';

type Status = BookingStatus | Unknown;
const present = (status: Status, quotationStatus: QuotationStatus | null = null, reviewed = false) =>
  presentRequest({ status, quotationStatus, reviewed });

describe('presentRequest: the eight states', () => {
  it('PENDING_ASSIGNMENT is "finding", step 1, with cancel as the secondary action', () => {
    expect(present('PENDING_ASSIGNMENT')).toMatchObject({
      key: 'finding', tone: 'grey', progress: 1, pinned: false, primary: 'view', secondary: 'cancel', chip: null, canCancel: true,
    });
  });

  it('a SENT quotation on a PENDING request is "quote ready": amber, pinned, view quotation', () => {
    expect(present('PENDING', 'SENT')).toMatchObject({
      key: 'quote_ready', tone: 'amber', progress: 2, pinned: true, primary: 'viewQuotation', secondary: null,
      // The pill carries it; a chip would only repeat it.
      chip: null,
    });
  });

  it('a SENT quotation on a CONFIRMED request is also "quote ready", at step 3', () => {
    expect(present('CONFIRMED', 'SENT')).toMatchObject({ key: 'quote_ready', progress: 3, pinned: true });
  });

  it('a REJECTED quotation is "declined": grey, support first, cancel only secondary, not pinned', () => {
    const state = present('PENDING', 'REJECTED');
    expect(state).toMatchObject({
      key: 'quote_declined', tone: 'grey', pinned: false, primary: 'support', secondary: 'cancel',
      chip: { key: 'declined', tone: 'grey' },
    });
    expect(state.tone).not.toBe('amber');
  });

  it('PENDING with no quotation is "waiting for professional to confirm", step 2', () => {
    expect(present('PENDING')).toMatchObject({
      key: 'waiting_confirm', tone: 'grey', progress: 2, primary: 'view', secondary: 'cancel', chip: null,
    });
  });

  it('an accepted quotation leaves a trace on a PENDING card through the chip, not the pill', () => {
    expect(present('PENDING', 'ACCEPTED')).toMatchObject({
      key: 'waiting_confirm', chip: { key: 'accepted', tone: 'green' },
    });
  });

  it('CONFIRMED is green at step 3, and an accepted quotation shows on the chip', () => {
    expect(present('CONFIRMED')).toMatchObject({ key: 'confirmed', tone: 'green', progress: 3, chip: null });
    expect(present('CONFIRMED', 'ACCEPTED').chip).toEqual({ key: 'accepted', tone: 'green' });
  });

  it('COMPLETED asks for a rating until reviewed, then just opens the request', () => {
    expect(present('COMPLETED', null, false)).toMatchObject({
      key: 'completed_unreviewed', tone: 'green', progress: 4, primary: 'rate', secondary: null, canCancel: false,
    });
    expect(present('COMPLETED', null, true)).toMatchObject({ key: 'completed', primary: 'view' });
  });

  it('CANCELLED is red, has no progress bar, offers nothing destructive, and hides any quotation chip', () => {
    expect(present('CANCELLED', 'ACCEPTED')).toMatchObject({
      key: 'cancelled', tone: 'red', progress: null, pinned: false, primary: 'view', secondary: null, chip: null, canCancel: false,
    });
  });

  it('an unrecognised status falls back to a neutral "update" that still opens the request', () => {
    expect(present('UNKNOWN', 'SENT')).toMatchObject({
      key: 'unknown', tone: 'grey', progress: null, pinned: false, primary: 'view', secondary: null, chip: null, canCancel: false,
    });
  });
});

describe('presentRequest: quotation chip', () => {
  it('shows nothing for a draft, which a customer is never told about', () => {
    expect(present('PENDING', 'DRAFT').chip).toBeNull();
    expect(present('PENDING', 'DRAFT').key).toBe('waiting_confirm');
  });

  it('does not offer "quotation received" on a finished request', () => {
    expect(present('COMPLETED', 'SENT').chip).toBeNull();
    expect(present('COMPLETED', 'ACCEPTED').chip).toEqual({ key: 'accepted', tone: 'green' });
  });
});

describe('presentRequest: rules that hold for every combination', () => {
  const statuses: Status[] = [...BOOKING_STATUSES, 'UNKNOWN'];
  const quotations: (QuotationStatus | null)[] = [null, 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'];
  const combos = statuses.flatMap((s) => quotations.flatMap((q) => [false, true].map((r) => [s, q, r] as const)));

  it.each(combos)('%s / %s / reviewed=%s', (status, quotation, reviewed) => {
    const state = present(status, quotation, reviewed);

    expect(state.icon).toBeTruthy();
    expect(STATE_CONFIG[state.key].tone).toBe(state.tone);
    // A destructive action is never the main button.
    expect(state.primary).not.toBe('cancel');
    // Red means cancelled; amber means "you need to act", which is the pinned state only.
    expect(state.tone === 'red').toBe(state.key === 'cancelled');
    expect(state.tone === 'amber').toBe(state.pinned);
    expect(state.pinned).toBe(state.key === 'quote_ready');
    // Cancel is offered only where the backend allows it.
    expect(state.secondary === 'cancel' ? state.canCancel : true).toBe(true);
    expect(state.canCancel).toBe((ACTIVE_STATUSES as readonly string[]).includes(status));
    if (state.progress !== null) {
      expect(state.progress).toBeGreaterThanOrEqual(1);
      expect(state.progress).toBeLessThanOrEqual(4);
    }
  });
});

describe('presentRequest: list card button and next line, per state', () => {
  it.each([
    ['PENDING_ASSIGNMENT', null, false, 'finding', null, 'finding'],
    ['PENDING', null, false, 'waiting_confirm', null, 'waiting_confirm'],
    ['CONFIRMED', null, false, 'confirmed', null, 'confirmed'],
    ['PENDING', 'SENT', false, 'quote_ready', 'viewQuotation', 'quote_ready'],
    ['CONFIRMED', 'SENT', false, 'quote_ready', 'viewQuotation', 'quote_ready'],
    ['PENDING', 'REJECTED', false, 'quote_declined', null, 'quote_declined'],
    ['COMPLETED', null, false, 'completed_unreviewed', 'rate', null],
    ['COMPLETED', null, true, 'completed', null, null],
    ['CANCELLED', null, false, 'cancelled', null, null],
    ['UNKNOWN', null, false, 'unknown', null, null],
  ] as const)('%s / %s / reviewed=%s is %s: button %s, next line %s', (status, quotation, reviewed, key, cardAction, next) => {
    const state = present(status, quotation, reviewed);
    expect(state.key).toBe(key);
    // A button only when the customer has something to do.
    expect(state.cardAction).toBe(cardAction);
    expect(state.next).toBe(next);
  });
});

describe('actionNeededOnly', () => {
  const item = (id: number, status: Status, quotationStatus: QuotationStatus | null) => ({ id, status, quotationStatus });

  it('keeps only active requests with a sent quotation', () => {
    const list = [
      item(1, 'PENDING_ASSIGNMENT', null),
      item(2, 'PENDING', 'SENT'),
      item(3, 'CONFIRMED', 'SENT'),
      item(4, 'PENDING', 'REJECTED'),
      item(5, 'PENDING', 'ACCEPTED'),
      item(6, 'CANCELLED', 'SENT'),
      item(7, 'COMPLETED', 'SENT'),
      item(8, 'UNKNOWN', 'SENT'),
    ];
    expect(actionNeededOnly(list).map((i) => i.id)).toEqual([2, 3]);
  });

  it('is empty for a list of requests that need nothing, as when an old server ignores the filter', () => {
    const eight = Array.from({ length: 8 }, (_, i) => item(i + 1, 'PENDING_ASSIGNMENT', null));
    expect(actionNeededOnly(eight)).toEqual([]);
  });

  it('shows each request once', () => {
    expect(actionNeededOnly([item(2, 'PENDING', 'SENT'), item(2, 'PENDING', 'SENT')])).toHaveLength(1);
  });
});

describe('tabs and counts', () => {
  it('sorts statuses into Active and Past, keeping unknown ones visible in Active', () => {
    expect(tabOf('PENDING_ASSIGNMENT')).toBe('active');
    expect(tabOf('PENDING')).toBe('active');
    expect(tabOf('CONFIRMED')).toBe('active');
    expect(tabOf('COMPLETED')).toBe('past');
    expect(tabOf('CANCELLED')).toBe('past');
    expect(tabOf('UNKNOWN')).toBe('active');
  });

  it('counts Active as the three active statuses and Past as completed plus cancelled', () => {
    expect(tabCounts({ PENDING_ASSIGNMENT: 1, PENDING: 2, CONFIRMED: 3, CANCELLED: 4, COMPLETED: 5 }))
      .toEqual({ active: 6, past: 9 });
  });

  it('removes pinned requests from the Active list but not from the Active count', () => {
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(withoutPinned(list, [{ id: 2 }])).toEqual([{ id: 1 }, { id: 3 }]);
    expect(withoutPinned(list, [])).toEqual(list);
    // The count is from the server totals, which include the pinned request.
    expect(tabCounts({ PENDING_ASSIGNMENT: 0, PENDING: 3, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 }).active).toBe(3);
  });

  it('is not empty when the Active list only held pinned requests', () => {
    const afterDedupe = withoutPinned([{ id: 7 }], [{ id: 7 }]);
    expect(afterDedupe).toHaveLength(0);
    expect(isEmptyTab({ listCount: afterDedupe.length, pinnedCount: 1, loading: false })).toBe(false);
  });

  it('is empty only when nothing is listed or pinned, and never while loading', () => {
    expect(isEmptyTab({ listCount: 0, pinnedCount: 0, loading: false })).toBe(true);
    expect(isEmptyTab({ listCount: 0, pinnedCount: 0, loading: true })).toBe(false);
    expect(isEmptyTab({ listCount: 2, pinnedCount: 0, loading: false })).toBe(false);
  });
});
