import type { Image } from '~/types/image.model'

export type AccountAlbumImagesApiResponse = {
  images: Image[]
  nextPage: number | null
}

export function useAccountAlbumImagesRequest() {
  const client = useSanctumClient()

  async function getAccountAlbumImages(
    albumId: number,
    page?: number | null,
  ): Promise<AccountAlbumImagesApiResponse> {
    return client<AccountAlbumImagesApiResponse>(
      `/api/account/albums/${albumId}/images`,
      {
        query: page != null ? { page } : undefined,
      },
    )
  }

  return {
    getAccountAlbumImages,
  }
}
