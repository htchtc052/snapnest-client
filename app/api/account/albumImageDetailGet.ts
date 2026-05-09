import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImageDetailContext } from '~/types/image-detail-context.model'

export function accountAlbumImageDetailGet(
  client: SanctumClient,
  albumId: number,
  imageId: number,
): Promise<ImageDetailContext> {
  return client<ImageDetailContext>(`/api/account/albums/${albumId}/images/${imageId}/detail`)
}
