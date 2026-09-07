import { request, type RNUploadFile } from './client'
import type { UploadResponse, UploadPurpose } from './types'

export const uploadsApi = {
  upload: (file: RNUploadFile, purpose: UploadPurpose) => {
    const formData = new FormData()
    formData.append('file', file as unknown as Blob)
    return request<UploadResponse>('/api/uploads', { method: 'POST', body: formData, params: { purpose } })
  },
}
