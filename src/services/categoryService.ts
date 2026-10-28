import type { Category } from '@/types/api';
import { request } from './apiClient';

export const categoryService = {
  list: (signal?: AbortSignal) => request<Category[]>('/api/categories', { signal }),
};
