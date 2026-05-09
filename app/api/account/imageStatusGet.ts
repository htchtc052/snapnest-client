import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export function imageStatusGet(client: SanctumClient, id: Image['id']): Promise<Image> {
  return client<Image>(`/api/account/images/${id}/status`)
}
