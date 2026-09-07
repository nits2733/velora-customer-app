import { api } from './client'
import type {
  BookingRequest,
  BookingResponse,
  BookingStatusUpdateRequest,
  AssignProfessionalRequest,
  ProfessionalMatchResponse,
  PageResponse,
} from './types'

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

  assign: (id: number, data: AssignProfessionalRequest) =>
    api.patch<BookingResponse>(`/api/bookings/${id}/assign`, data),

  awaitingAssignment: (page = 0, size = 20) =>
    api.get<PageResponse<BookingResponse>>('/api/bookings/awaiting-assignment', { page, size }),

  recommendations: (id: number) =>
    api.get<ProfessionalMatchResponse[]>(`/api/bookings/${id}/recommendations`),
}
