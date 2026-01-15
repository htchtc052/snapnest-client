import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImageUploadResponse } from '~/types/image-upload.contract'

export function imagesUpload(client: SanctumClient, data: FormData): Promise<ImageUploadResponse> {
  return client<ImageUploadResponse>('/api/account/images', {
    method: 'POST',
    body: data,
  })
}
