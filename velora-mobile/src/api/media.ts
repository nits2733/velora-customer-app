import { api, type RNUploadFile } from './client'
import type { MediaUploadResponse } from './types'

export const mediaApi = {
  upload: (file: RNUploadFile, folder = 'uploads') =>
    api.upload<MediaUploadResponse>('/api/media/upload', file, folder),
}
