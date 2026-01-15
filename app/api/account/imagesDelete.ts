
import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export type ImagesDeleteResponse = {
  deletedIds: number[]
  failedIds: number[]
}

export function imagesDelete(client: SanctumClient, ids: number[]): Promise<ImagesDeleteResponse> {
  return client<ImagesDeleteResponse>('/api/account/images', {
    method: 'DELETE',
    body: { ids },
  })
}
