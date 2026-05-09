import type { ImagesFeedResponse, ImagesPageApiResponse } from '~/api/account/imagesGet'
import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'

export async function albumImagesGet(
  client: SanctumClient,
  token: string,
  page?: number | null,
): Promise<ImagesFeedResponse> {
  const response = await client<ImagesPageApiResponse>(`/api/albums/${token}/images`, {
    query: page ? { page } : undefined,
  })

  return {
    images: response.images,
    nextPage: response.nextPage,
  }
}
