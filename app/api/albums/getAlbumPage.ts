import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AlbumPage } from '~/models/Album'

export function getAlbumPage(client: SanctumClient, albumId: number, page: number): Promise<AlbumPage> {
  return client<AlbumPage>(`/api/account/albums/${albumId}?page=${page}`)
}
