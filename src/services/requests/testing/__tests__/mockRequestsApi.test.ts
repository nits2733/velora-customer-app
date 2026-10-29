import { ApiError } from '../../../apiClient';
import { mockControl, mockRequestsApi as api } from '../mockRequestsApi';

beforeEach(() => {
  mockControl.reset();
  mockControl.latencyMs = 0;
});

const ids = (page: { content: { id: number }[] }) => page.content.map((b) => b.id);

describe('mock list follows the server rules', () => {
  it('returns every request, newest first', async () => {
    // Created 1, 2, 4, 6, 9, 12, 26, 36 and 52 days ago.
    expect(ids(await api.list())).toEqual([2048, 2044, 2047, 2045, 2046, 2043, 2040, 2035, 2038]);
  });

  it('filters by status, repeated', async () => {
    expect(ids(await api.list({ status: ['COMPLETED', 'CANCELLED'] }))).toEqual([2040, 2035, 2038]);
  });

  it('actionNeeded returns active requests with a sent quotation', async () => {
    expect(ids(await api.list({ actionNeeded: true }))).toEqual([2047, 2043]);
  });

  it('actionNeeded is narrowed by status, never widened, and finished statuses give nothing', async () => {
    expect(ids(await api.list({ actionNeeded: true, status: ['PENDING'] }))).toEqual([2047]);
    expect(ids(await api.list({ actionNeeded: true, status: ['COMPLETED'] }))).toEqual([]);
  });

  it('pages, and says when it is the last page', async () => {
    const first = await api.list({ page: 0, size: 4 });
    const last = await api.list({ page: 2, size: 4 });
    expect(first.content).toHaveLength(4);
    expect(first.last).toBe(false);
    expect(first.totalElements).toBe(9);
    expect(last.content).toHaveLength(1);
    expect(last.last).toBe(true);
  });

  it('every demo request parses through the real contract parser', async () => {
    const all = await api.list({ size: 50 });
    expect(all.content).toHaveLength(9);
    expect(new Set(all.content.map((b) => b.status))).toEqual(new Set(['PENDING_ASSIGNMENT', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']));
  });
});

describe('mock counts', () => {
  it('counts every status and the quotations awaiting an answer', async () => {
    const counts = await api.counts();
    expect(counts.byStatus).toEqual({ PENDING_ASSIGNMENT: 1, PENDING: 3, CONFIRMED: 2, COMPLETED: 2, CANCELLED: 1 });
    expect(counts.awaitingQuotationResponse).toBe(2);
  });

  it('is all zeros in the empty scenario, with every status still present', async () => {
    mockControl.set('empty');
    const counts = await api.counts();
    expect(Object.values(counts.byStatus)).toEqual([0, 0, 0, 0, 0]);
    expect((await api.list()).content).toEqual([]);
  });
});

describe('mock actions', () => {
  it('reports a missing request as 404, the same as one that is not yours', async () => {
    await expect(api.get(999)).rejects.toMatchObject({ status: 404 });
    await expect(api.timeline(999)).rejects.toBeInstanceOf(ApiError);
  });

  it('returns null for a request that has no quotation yet', async () => {
    expect(await api.quotation(2048)).toBeNull();
    expect((await api.quotation(2047))?.status).toBe('SENT');
  });

  it('accepting moves the quotation to accepted, drops it from action needed, and answers 409 the second time', async () => {
    await api.acceptQuotation(2047);
    expect((await api.get(2047)).quotationStatus).toBe('ACCEPTED');
    expect(ids(await api.list({ actionNeeded: true }))).toEqual([2043]);
    expect((await api.counts()).awaitingQuotationResponse).toBe(1);
    await expect(api.acceptQuotation(2047)).rejects.toMatchObject({ status: 409 });
  });

  it('declining stores a trimmed reason, and a blank one as none', async () => {
    await api.rejectQuotation(2047, '  Over my budget ');
    expect((await api.quotation(2047))?.rejectionReason).toBe('Over my budget');
    await api.rejectQuotation(2043, '   ');
    expect((await api.quotation(2043))?.rejectionReason).toBeNull();
  });

  it('cannot answer a quotation that was never sent', async () => {
    await expect(api.acceptQuotation(2044)).rejects.toMatchObject({ status: 409 });
  });

  it('cancelling moves the request to Past, records the reason, and writes a timeline event', async () => {
    const cancelled = await api.cancel(2044, 'Found someone else');
    expect(cancelled).toMatchObject({ status: 'CANCELLED', cancellationReason: 'Found someone else' });
    expect((await api.counts()).byStatus).toMatchObject({ PENDING: 2, CANCELLED: 2 });
    const last = (await api.timeline(2044)).at(-1);
    expect(last).toMatchObject({ eventType: 'CANCELLED', toStatus: 'CANCELLED' });
  });

  it('cannot cancel a finished or already cancelled request', async () => {
    await expect(api.cancel(2040)).rejects.toMatchObject({ status: 409 });
    await expect(api.cancel(2035)).rejects.toMatchObject({ status: 409 });
  });

  it('a review is allowed once, and only on a completed request', async () => {
    await api.submitReview(2040, { rating: 5, comment: 'Neat work' });
    expect((await api.get(2040)).reviewed).toBe(true);
    await expect(api.submitReview(2040, { rating: 4 })).rejects.toMatchObject({ status: 409 });
    await expect(api.submitReview(2044, { rating: 4 })).rejects.toMatchObject({ status: 409 });
  });
});

describe('mock scenarios', () => {
  it('offline fails like an unreachable network (status 0)', async () => {
    mockControl.set('offline');
    await expect(api.list()).rejects.toMatchObject({ status: 0, isNetwork: true });
  });

  it('error fails like a server error', async () => {
    mockControl.set('error');
    await expect(api.counts()).rejects.toMatchObject({ status: 500 });
  });
});
