import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImageDetailContext } from '~/types/image-detail-context.model'

export function accountImageDetailGet(
  client: SanctumClient,
  imageId: number,
): Promise<ImageDetailContext> {
  return client<ImageDetailContext>(`/api/account/images/${imageId}/detail`)
}
