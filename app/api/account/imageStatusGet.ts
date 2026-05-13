import type { ApiClient } from '~/shared/api'
import type { LegacyUploadImage } from '~/types/legacy-upload-image.model'

export function imageStatusGet(client: ApiClient, id: LegacyUploadImage['id']): Promise<LegacyUploadImage> {
  return client<LegacyUploadImage>(`/api/account/images/${id}/status`)
}
