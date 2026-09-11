import { api } from './client'
import type {
  BookingRequest,
  BookingResponse,
  BookingStatusUpdateRequest,
  PageResponse,
} from './types'

// Admin-only endpoints (awaiting-assignment queue, recommendations, assign)
// are deliberately not here - this is the customer app, and a customer
// account can never hold the ADMIN role that those require. Professional
// assignment happens only through Velora's admin.
export const bookingsApi = {
  create: (data: BookingRequest) =>
    api.post<BookingResponse>('/api/bookings', data),

  list: (page = 0, size = 20) =>
    api.get<PageResponse<BookingResponse>>('/api/bookings', { page, size }),

  getById: (id: number) =>
    api.get<BookingResponse>(`/api/bookings/${id}`),

  updateStatus: (id: number, data: BookingStatusUpdateRequest) =>
    api.patch<BookingResponse>(`/api/bookings/${id}/status`, data),

  cancel: (id: number) =>
    api.patch<BookingResponse>(`/api/bookings/${id}/cancel`),
}
