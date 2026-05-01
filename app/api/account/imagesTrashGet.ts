import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImagesFeedResponse, ImagesPageApiResponse } from '~/api/account/imagesGet'

export async function imagesTrashGet(
  client: SanctumClient,
): Promise<ImagesFeedResponse> {
  const response = await client<ImagesPageApiResponse>('/api/account/images/trash')

  return {
    images: response.images,
    nextPage: response.nextPage,
  }
}
