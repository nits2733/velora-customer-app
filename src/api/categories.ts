import { api } from './client'
import type { CategoryResponse } from './types'

export const categoriesApi = {
  getAll: () =>
    api.get<CategoryResponse[]>('/api/categories'),
}
