import type { ApiClient } from '~/shared/api'
import type { Image } from '~/types/image.model'

export function imageStatusGet(client: ApiClient, id: Image['id']): Promise<Image> {
  return client<Image>(`/api/account/images/${id}/status`)
}
