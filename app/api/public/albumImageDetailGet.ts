import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImageDetailContext } from '~/types/image-detail-context.model'

export function publicAlbumImageDetailGet(
  client: SanctumClient,
  token: string,
  imageId: number,
): Promise<ImageDetailContext> {
  return client<ImageDetailContext>(`/api/albums/${token}/images/${imageId}/detail`)
}
