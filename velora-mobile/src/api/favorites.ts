import { api } from './client'
import type { ProfessionalSummaryResponse, PortfolioItemSummaryResponse, PageResponse } from './types'

export const favoritesApi = {
  listProfessionals: (page = 0, size = 20) =>
    api.get<PageResponse<ProfessionalSummaryResponse>>('/api/favorites/professionals', { page, size }),

  listPortfolioItems: (page = 0, size = 20) =>
    api.get<PageResponse<PortfolioItemSummaryResponse>>('/api/favorites/portfolio-items', { page, size }),

  saveProfessional: (professionalId: number) =>
    api.post<void>(`/api/favorites/professionals/${professionalId}`),

  removeProfessional: (professionalId: number) =>
    api.delete<void>(`/api/favorites/professionals/${professionalId}`),

  savePortfolioItem: (portfolioItemId: number) =>
    api.post<void>(`/api/favorites/portfolio-items/${portfolioItemId}`),

  removePortfolioItem: (portfolioItemId: number) =>
    api.delete<void>(`/api/favorites/portfolio-items/${portfolioItemId}`),
}
