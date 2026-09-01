import { api } from './client'
import type {
  SavePortfolioItemRequest,
  PortfolioItemResponse,
  PortfolioItemSummaryResponse,
  PageResponse,
} from './types'

type PortfolioSearchParams = {
  category?: number
  search?: string
  style?: string
  page?: number
  size?: number
  sortBy?: string
  direction?: string
}

export const portfolioApi = {
  search: (params: PortfolioSearchParams = {}) =>
    api.get<PageResponse<PortfolioItemSummaryResponse>>('/api/portfolio', params as Record<string, string | number | boolean | undefined>),

  getById: (id: number) =>
    api.get<PortfolioItemResponse>(`/api/portfolio/${id}`),

  create: (data: SavePortfolioItemRequest) =>
    api.post<PortfolioItemResponse>('/api/portfolio', data),

  update: (id: number, data: SavePortfolioItemRequest) =>
    api.put<PortfolioItemResponse>(`/api/portfolio/${id}`, data),

  delete: (id: number) =>
    api.delete<void>(`/api/portfolio/${id}`),
}
