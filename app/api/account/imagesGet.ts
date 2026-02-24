import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type ImagesPagination = {
  page: number
  perPage: number
  total: number
  lastPage: number
  hasMore: boolean
}

export type ImagesFeedResponse = {
  images: Image[]
  pagination: ImagesPagination
}

export function imagesGet(
  client: SanctumClient,
  page = 1
): Promise<ImagesFeedResponse> {
  const suffix = page > 1 ? `?page=${page}` : ''
  return client<ImagesFeedResponse>(`/api/account/images${suffix}`)
}
