import { api } from './client'
import type { UserProfileResponse, UpdateProfileRequest } from './types'

export const userApi = {
  getProfile: () =>
    api.get<UserProfileResponse>('/api/users/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<UserProfileResponse>('/api/users/profile', data),
}
