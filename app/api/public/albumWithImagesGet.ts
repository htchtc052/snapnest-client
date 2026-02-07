import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AlbumWithImagesResponse } from '~/types/album-with-images.contract'

export function publicAlbumWithImagesGet(
  client: SanctumClient,
  token: string
): Promise<AlbumWithImagesResponse> {
  return client<AlbumWithImagesResponse>(`/api/albums/${token}`)
}
