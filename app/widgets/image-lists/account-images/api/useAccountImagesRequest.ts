import type { Image } from '~/entities/image'

export type AccountImagesApiResponse = {
  images: Image[]
  nextPage: number | null
}

export function useAccountImagesRequest() {
  const client = useSanctumClient()

  async function getAccountImages(page?: number | null): Promise<AccountImagesApiResponse> {
    return client<AccountImagesApiResponse>('/api/account/images', {
      query: page != null ? { page } : undefined,
    })
  }

  return {
    getAccountImages,
  }
}
