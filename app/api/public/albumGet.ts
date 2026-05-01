import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { PublicAlbum } from '~/types/public-album.model'

export function albumGet(
  client: SanctumClient,
  token: string,
): Promise<PublicAlbum> {
  return client<PublicAlbum>(`/api/albums/${token}`)
}
