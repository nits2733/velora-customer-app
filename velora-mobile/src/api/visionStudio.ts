import { Platform } from 'react-native'
import { request, type RNUploadFile } from './client'
import type { VisionTransformRequest, VisionTransformResponse } from './types'

// React Native's FormData accepts { uri, name, type } as a file part, but a browser's
// FormData does not: it stringifies the object to "[object Object]" and the server sees
// no file part at all. On web the picked image (a blob:/data: URI) must be fetched and
// appended as a real Blob.
async function appendImage(formData: FormData, field: string, file: RNUploadFile) {
  if (Platform.OS === 'web') {
    const blob = await (await fetch(file.uri)).blob()
    formData.append(field, blob, file.name)
  } else {
    formData.append(field, file as unknown as Blob)
  }
}

export const visionStudioApi = {
  transform: async (file: RNUploadFile, preferences: VisionTransformRequest) => {
    const formData = new FormData()
    await appendImage(formData, 'image', file)
    formData.append('roomType', preferences.roomType)
    formData.append('style', preferences.style)
    formData.append('colorPalette', preferences.colorPalette)
    if (preferences.customColorDescription) formData.append('customColorDescription', preferences.customColorDescription)
    formData.append('budgetTier', preferences.budgetTier)
    preferences.features.forEach(feature => formData.append('features', feature))
    formData.append('preservation', preferences.preservation)
    if (preferences.additionalInstructions) formData.append('additionalInstructions', preferences.additionalInstructions)
    return request<VisionTransformResponse>('/api/vision/transform', { method: 'POST', body: formData })
  },
  getTransform: (id: string) =>
    request<VisionTransformResponse>(`/api/vision/transform/${id}`),
}
