import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/types/album.model'

export function albumPublishUpdate(
  client: SanctumClient,
  id: Album['id'],
  is_public: boolean
): Promise<Album> {
  return client<Album>(`/api/account/albums/${id}/publish`, {
    method: 'PUT',
    body: { is_public },
  })
}
