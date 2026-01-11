import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/models/Album'


export function getAlbums(client: SanctumClient): Promise<Album[]> {
  return client<Album[]>(`/api/account/albums`)
}
