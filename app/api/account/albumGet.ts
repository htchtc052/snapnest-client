import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AlbumView } from '~/types/album-view.model'

export function albumGet(
  client: SanctumClient,
  albumId: number,
): Promise<AlbumView> {
  return client<AlbumView>(`/api/account/albums/${albumId}`)
}
