
import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export type DeleteImagesResponse = {
  deletedIds: number[]
  failedIds: number[]
}

export function deleteImages(client: SanctumClient, ids: number[]): Promise<DeleteImagesResponse> {
  const idsParam = ids.join(',')
  return client<DeleteImagesResponse>(`/api/account/images/${idsParam}`, { method: 'DELETE' })
}
