import type { ApiClient } from '~/shared/api'
import type { PublicAlbum } from '~/types/public-album.model'

export function albumGet(
  client: ApiClient,
  token: string,
): Promise<PublicAlbum> {
  return client<PublicAlbum>(`/api/albums/${token}`)
}
