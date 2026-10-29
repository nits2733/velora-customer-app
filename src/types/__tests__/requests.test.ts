import {
  BOOKING_STATUSES,
  ContractError,
  parseBooking,
  parseCounts,
  parsePage,
  parseQuotation,
  parseTimelineEvent,
} from '../requests';

const minimalBooking = {
  id: 7,
  requestType: 'INDIVIDUAL_SERVICE' as const,
  status: 'PENDING' as const,
  scheduledAt: '2026-11-02T05:00:00Z',
  createdAt: '2026-10-28T05:00:00Z',
};

describe('parseBooking', () => {
  it('turns absent optional fields into null and defaults the rest', () => {
    const booking = parseBooking(minimalBooking);
    expect(booking).toMatchObject({
      id: 7, status: 'PENDING', categoryName: null, location: null, professional: null,
      quotationStatus: null, quotationTotal: null, quotationValidUntil: null,
      reviewed: false, cancellationReason: null, inspirationImageUrls: [],
    });
    expect(booking.updatedAt).toBe(minimalBooking.createdAt);
  });

  it.each(['id', 'scheduledAt', 'createdAt'] as const)('rejects a booking with no %s instead of showing it', (field) => {
    const { [field]: _removed, ...rest } = minimalBooking;
    expect(() => parseBooking(rest)).toThrow(ContractError);
  });

  it('maps a status the app does not know to UNKNOWN instead of failing', () => {
    expect(parseBooking({ ...minimalBooking, status: 'ON_HOLD' as never }).status).toBe('UNKNOWN');
    expect(parseBooking({ ...minimalBooking, requestType: 'SOMETHING_NEW' as never }).requestType).toBe('UNKNOWN');
  });

  it('treats an unknown quotation status as no quotation, and drops its total with it', () => {
    const booking = parseBooking({ ...minimalBooking, quotationStatus: 'VOID' as never, quotationTotal: 5000 });
    expect(booking.quotationStatus).toBeNull();
    expect(booking.quotationTotal).toBeNull();
  });

  it('keeps the quotation total and validity when there is a quotation', () => {
    const booking = parseBooking({
      ...minimalBooking, quotationStatus: 'SENT', quotationTotal: 345000, quotationValidUntil: '2026-11-05T00:00:00Z',
    });
    expect(booking).toMatchObject({ quotationStatus: 'SENT', quotationTotal: 345000, quotationValidUntil: '2026-11-05T00:00:00Z' });
  });

  it('parses the assigned professional and requires a name', () => {
    const booking = parseBooking({ ...minimalBooking, professional: { id: 3, fullName: 'Rahul Sharma', ratingCount: 4 } });
    expect(booking.professional).toMatchObject({ id: 3, fullName: 'Rahul Sharma', averageRating: null, avatarUrl: null, ratingCount: 4 });
    expect(() => parseBooking({ ...minimalBooking, professional: { id: 3 } })).toThrow(ContractError);
  });
});

describe('parseQuotation', () => {
  const valid = {
    id: 1, bookingId: 7, status: 'SENT' as const, totalAmount: 1000, updatedAt: '2026-10-28T05:00:00Z',
    lineItems: [{ id: 1, description: 'Paint', amount: 1000 }],
  };

  it('parses line items and nulls what is absent', () => {
    expect(parseQuotation(valid).lineItems[0]).toEqual({
      id: 1, description: 'Paint', quantity: null, unit: null, unitPrice: null, amount: 1000,
    });
    expect(parseQuotation(valid)).toMatchObject({ rejectionReason: null, validUntil: null, notes: null });
  });

  it('rejects a quotation with no total or a line item with no amount', () => {
    expect(() => parseQuotation({ ...valid, totalAmount: undefined })).toThrow(ContractError);
    expect(() => parseQuotation({ ...valid, lineItems: [{ id: 1, description: 'Paint' }] })).toThrow(ContractError);
  });
});

describe('parseCounts', () => {
  it('always includes every known status, using zero for missing ones', () => {
    const counts = parseCounts({ byStatus: { PENDING: 2 }, awaitingQuotationResponse: 1 });
    expect(Object.keys(counts.byStatus).sort()).toEqual([...BOOKING_STATUSES].sort());
    expect(counts.byStatus).toMatchObject({ PENDING: 2, COMPLETED: 0, CANCELLED: 0 });
    expect(counts.awaitingQuotationResponse).toBe(1);
  });

  it('survives an empty response and ignores statuses it does not know', () => {
    expect(parseCounts({}).byStatus.PENDING).toBe(0);
    expect(parseCounts({ byStatus: { ON_HOLD: 9 } }).byStatus).not.toHaveProperty('ON_HOLD');
  });
});

describe('parseTimelineEvent and parsePage', () => {
  it('keeps unknown event types as UNKNOWN', () => {
    const event = parseTimelineEvent({ id: 1, eventType: 'NEW_THING' as never, toStatus: 'PENDING', createdAt: '2026-10-28T05:00:00Z' });
    expect(event).toMatchObject({ eventType: 'UNKNOWN', toStatus: 'PENDING', fromStatus: null });
  });

  it('defaults a missing page to a finished, empty one', () => {
    expect(parsePage({}, (x: number) => x)).toEqual({ content: [], page: 0, totalElements: 0, last: true });
  });
});
