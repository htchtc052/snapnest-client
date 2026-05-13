import type { ApiClient } from '~/shared/api'
import type { LegacyUploadImage } from '~/types/legacy-upload-image.model'

export function imagesUpload(client: ApiClient, file: File): Promise<LegacyUploadImage> {
  const data = new FormData()
  data.append('image', file)

  return client<LegacyUploadImage>('/api/account/images', {
    method: 'POST',
    body: data,
  })
}
