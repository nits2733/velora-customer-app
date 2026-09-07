import { api } from './client'
import type { QuotationResponse, SaveQuotationRequest } from './types'

export const quotationsApi = {
  get: (bookingId: number) =>
    api.get<QuotationResponse>(`/api/bookings/${bookingId}/quotation`),

  saveDraft: (bookingId: number, data: SaveQuotationRequest) =>
    api.put<QuotationResponse>(`/api/bookings/${bookingId}/quotation`, data),

  send: (bookingId: number) =>
    api.post<QuotationResponse>(`/api/bookings/${bookingId}/quotation/send`),

  accept: (bookingId: number) =>
    api.patch<QuotationResponse>(`/api/bookings/${bookingId}/quotation/accept`),

  reject: (bookingId: number) =>
    api.patch<QuotationResponse>(`/api/bookings/${bookingId}/quotation/reject`),
}
