import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/models/Album'


export function getAlbum(client: SanctumClient, albumId: number): Promise<Album> {
  return client<Album>(`/api/account/albums/${albumId}`)
}
