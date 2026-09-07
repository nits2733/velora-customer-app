import { api } from './client'
import type { CreateReviewRequest, ReviewResponse } from './types'

export const reviewsApi = {
  create: (bookingId: number, data: CreateReviewRequest) =>
    api.post<ReviewResponse>(`/api/bookings/${bookingId}/review`, data),
}
