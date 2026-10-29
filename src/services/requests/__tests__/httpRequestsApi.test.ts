import { ApiError } from '../../apiClient';
import { httpRequestsApi as api } from '../httpRequestsApi';

const json = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(JSON.stringify(body)) } as Response);

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

const lastCall = () => {
  const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  return { url, init, path: url.replace(/^https?:\/\/[^/]+/, '') };
};

describe('httpRequestsApi', () => {
  it('sends repeated status params, actionNeeded, and paging', async () => {
    fetchMock.mockReturnValue(json({ content: [], page: 1, totalElements: 0, last: true }));
    await api.list({ status: ['PENDING', 'CONFIRMED'], actionNeeded: true, page: 1, size: 10 });
    expect(lastCall().path).toBe('/api/bookings?status=PENDING&status=CONFIRMED&actionNeeded=true&page=1&size=10');
  });

  it('leaves actionNeeded off the URL when it is false', async () => {
    fetchMock.mockReturnValue(json({ content: [] }));
    await api.list({ actionNeeded: false });
    expect(lastCall().path).toBe('/api/bookings?page=0&size=20');
  });

  it('turns a 404 on the quotation into null, but not other failures', async () => {
    fetchMock.mockReturnValueOnce(json({ message: 'No quotation found for booking: 5' }, 404));
    expect(await api.quotation(5)).toBeNull();
    fetchMock.mockReturnValueOnce(json({ message: 'boom' }, 500));
    await expect(api.quotation(5)).rejects.toMatchObject({ status: 500 });
  });

  it('cancels with no body when there is no reason, and a trimmed reason when there is', async () => {
    const booking = { id: 5, status: 'CANCELLED', scheduledAt: '2026-11-01T00:00:00Z', createdAt: '2026-10-01T00:00:00Z' };
    fetchMock.mockReturnValue(json(booking));
    await api.cancel(5);
    expect(lastCall().init.body).toBeUndefined();
    expect(lastCall().init.method).toBe('PATCH');
    await api.cancel(5, '  Changed plans ');
    expect(JSON.parse(lastCall().init.body as string)).toEqual({ reason: 'Changed plans' });
    await api.cancel(5, '   ');
    expect(lastCall().init.body).toBeUndefined();
  });

  it('declines with the same optional-reason rule', async () => {
    const quotation = { id: 1, bookingId: 5, status: 'REJECTED', totalAmount: 10, updatedAt: '2026-10-01T00:00:00Z', lineItems: [] };
    fetchMock.mockReturnValue(json(quotation));
    await api.rejectQuotation(5, 'Too expensive');
    expect(lastCall().path).toBe('/api/bookings/5/quotation/reject');
    expect(JSON.parse(lastCall().init.body as string)).toEqual({ reason: 'Too expensive' });
  });

  it('accepts with a PATCH and no body', async () => {
    fetchMock.mockReturnValue(json({ id: 1, bookingId: 5, status: 'ACCEPTED', totalAmount: 10, updatedAt: '2026-10-01T00:00:00Z' }));
    await api.acceptQuotation(5);
    expect(lastCall()).toMatchObject({ path: '/api/bookings/5/quotation/accept', init: { method: 'PATCH' } });
    expect(lastCall().init.body).toBeUndefined();
  });

  it('posts a review with the rating and an optional comment', async () => {
    fetchMock.mockReturnValue(json({ id: 1 }));
    await api.submitReview(5, { rating: 5, comment: ' Lovely ' });
    expect(lastCall().path).toBe('/api/bookings/5/review');
    expect(JSON.parse(lastCall().init.body as string)).toEqual({ rating: 5, comment: 'Lovely' });
  });

  it('surfaces a network failure as ApiError with status 0', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await expect(api.counts()).rejects.toMatchObject({ status: 0, isNetwork: true });
    await expect(api.counts()).rejects.toBeInstanceOf(ApiError);
  });

  it('refuses an answer it cannot use instead of showing it', async () => {
    fetchMock.mockReturnValue(json({ status: 'PENDING' }));
    await expect(api.get(5)).rejects.toMatchObject({ name: 'ContractError' });
  });
});
