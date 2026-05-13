import type { ApiClient } from '~/shared/api'
import type { Image } from '~/entities/image'

export function imageStatusGet(client: ApiClient, id: Image['id']): Promise<Image> {
  return client<Image>(`/api/account/images/${id}/status`)
}
