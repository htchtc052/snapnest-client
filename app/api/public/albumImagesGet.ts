import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type AlbumImagesResponse = {
  images: Image[]
}

export async function albumImagesGet(
  client: SanctumClient,
  token: string,
): Promise<AlbumImagesResponse> {
  return client<AlbumImagesResponse>(`/api/albums/${token}/images`)
}
