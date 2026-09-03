import { request } from './client'
import type { UploadResponse, UploadPurpose } from './types'

export const uploadsApi = {
  upload: (file: File, purpose: UploadPurpose) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<UploadResponse>('/api/uploads', { method: 'POST', body: formData, params: { purpose } })
  },
}
