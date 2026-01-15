import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/types/album.model'

export function albumDetachImages(client: SanctumClient, albumId: Album['id'], ids: number[]) {
  return client<unknown>(`/api/account/albums/${albumId}/detach-images`, {
    method: 'POST',
    body: { image_ids: ids },
  })
}
