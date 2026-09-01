import { api } from './client'
import type { MediaUploadResponse } from './types'

export const mediaApi = {
  upload: (file: File, folder = 'uploads') =>
    api.upload<MediaUploadResponse>('/api/media/upload', file, folder),
}
