import type { Image } from '~/types/image.model'
import type { ApiPageResponse } from '~/shared/api'

type AccountAlbumImagesPageApiResponse = {
  images: Image[]
  nextPage: number | null
}

export function useAccountAlbumImagesRequest() {
  const client = useSanctumClient()

  async function getAccountAlbumImages(
    albumId: number,
    page?: number | null,
  ): Promise<ApiPageResponse<Image>> {
    const response = await client<AccountAlbumImagesPageApiResponse>(
      `/api/account/albums/${albumId}/images`,
      {
        query: page ? { page } : undefined,
      },
    )

    return {
      items: response.images,
      nextPage: response.nextPage,
    }
  }

  return {
    getAccountAlbumImages,
  }
}