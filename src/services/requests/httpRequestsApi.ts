import type { components } from '@/types/api.generated';
import {
  parseBooking,
  parseCounts,
  parsePage,
  parseQuotation,
  parseTimelineEvent,
} from '@/types/requests';
import { ApiError, request } from '../apiClient';
import type { RequestsApi } from './RequestsApi';

type Schemas = components['schemas'];

const base = (id: number) => `/api/bookings/${id}`;

/** Optional reasons go in the body only when there is one; the server accepts no body at all. */
const reasonBody = (reason?: string) => {
  const trimmed = reason?.trim();
  return trimmed ? ({ reason: trimmed } satisfies Schemas['ReasonRequest']) : undefined;
};

export const httpRequestsApi: RequestsApi = {
  async list({ status, actionNeeded, page = 0, size = 20 } = {}) {
    const dto = await request<Schemas['PageResponseBookingResponse']>('/api/bookings', {
      query: { status, actionNeeded: actionNeeded ? true : undefined, page, size },
    });
    return parsePage(dto, parseBooking);
  },

  async counts() {
    return parseCounts(await request<Schemas['BookingCountsResponse']>('/api/bookings/counts'));
  },

  async get(id) {
    return parseBooking(await request<Schemas['BookingResponse']>(base(id)));
  },

  async timeline(id) {
    const dto = await request<Schemas['BookingTimelineEventResponse'][]>(`${base(id)}/timeline`);
    return dto.map(parseTimelineEvent);
  },

  async quotation(id) {
    try {
      return parseQuotation(await request<Schemas['QuotationResponse']>(`${base(id)}/quotation`));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },

  async acceptQuotation(id) {
    return parseQuotation(await request<Schemas['QuotationResponse']>(`${base(id)}/quotation/accept`, { method: 'PATCH' }));
  },

  async rejectQuotation(id, reason) {
    return parseQuotation(
      await request<Schemas['QuotationResponse']>(`${base(id)}/quotation/reject`, { method: 'PATCH', body: reasonBody(reason) }),
    );
  },

  async cancel(id, reason) {
    return parseBooking(await request<Schemas['BookingResponse']>(`${base(id)}/cancel`, { method: 'PATCH', body: reasonBody(reason) }));
  },

  async submitReview(id, { rating, comment }) {
    const body: Schemas['CreateReviewRequest'] = { rating, comment: comment?.trim() || undefined };
    await request<Schemas['ReviewResponse']>(`${base(id)}/review`, { method: 'POST', body });
  },
};
