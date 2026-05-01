import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type ImagesPageApiResponse = {
  images: Image[]
  nextPage: number | null
}

export type ImagesFeedResponse = {
  images: Image[]
  nextPage: number | null
}

export async function imagesGet(
  client: SanctumClient,
  page?: number | null,
): Promise<ImagesFeedResponse> {
  const response = await client<ImagesPageApiResponse>('/api/account/images', {
    query: page ? { page } : undefined,
  })

  return {
    images: response.images,
    nextPage: response.nextPage,
  }
}
