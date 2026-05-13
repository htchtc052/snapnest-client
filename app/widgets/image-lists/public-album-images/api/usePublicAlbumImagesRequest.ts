import type { Image } from '~/entities/image'

export type PublicAlbumImagesApiResponse = {
  images: Image[]
}

export function usePublicAlbumImagesRequest() {
  const client = useSanctumClient()

  async function getPublicAlbumImages(
    token: string,
  ): Promise<PublicAlbumImagesApiResponse> {
    return client<PublicAlbumImagesApiResponse>(`/api/albums/${token}/images`)
  }

  return {
    getPublicAlbumImages,
  }
}
