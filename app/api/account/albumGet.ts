import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/types/album.model'


export function albumGet(client: SanctumClient, albumId: number): Promise<Album> {
  return client<Album>(`/api/account/albums/${albumId}`)
}
