import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type ImagesTrashResponse = {
  images: Image[]
}

export function imagesTrashGet(client: SanctumClient): Promise<ImagesTrashResponse> {
  return client<ImagesTrashResponse>('/api/account/images/trash')
}
