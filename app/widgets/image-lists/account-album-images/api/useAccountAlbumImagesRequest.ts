import type { Image } from '~/entities/image'

export type AccountAlbumImagesApiResponse = {
  images: Image[]
}

export function useAccountAlbumImagesRequest() {
  const client = useSanctumClient()

  async function getAccountAlbumImages(
    albumId: number,
  ): Promise<AccountAlbumImagesApiResponse> {
    return client<AccountAlbumImagesApiResponse>(`/api/account/albums/${albumId}/images`)
  }

  return {
    getAccountAlbumImages,
  }
}
