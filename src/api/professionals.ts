import { api } from './client'
import type {
  ProfessionalSummaryResponse,
  ProfessionalPublicProfileResponse,
  PublicReviewResponse,
  PageResponse,
} from './types'

type ProfessionalSearchParams = {
  search?: string
  specialization?: string
  city?: string
  availability?: 'AVAILABLE' | 'UNAVAILABLE'
  minExperience?: number
  minRating?: number
  page?: number
  size?: number
  sortBy?: string
  direction?: string
}

export const professionalsApi = {
  search: (params: ProfessionalSearchParams = {}) =>
    api.get<PageResponse<ProfessionalSummaryResponse>>('/api/professionals', params as Record<string, string | number | boolean | undefined>),

  getProfile: (id: number) =>
    api.get<ProfessionalPublicProfileResponse>(`/api/professionals/${id}`),

  getReviews: (id: number, page = 0, size = 20) =>
    api.get<PageResponse<PublicReviewResponse>>(`/api/professionals/${id}/reviews`, { page, size }),
}
