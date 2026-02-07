import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Album } from '~/types/album.model'
import type { AlbumWithImagesResponse } from '~/types/album-with-images.contract'

export function accountAlbumWithImagesGet(
  client: SanctumClient,
  id: Album['id']
): Promise<AlbumWithImagesResponse> {
  return client<AlbumWithImagesResponse>(`/api/account/albums/${id}`)
}
