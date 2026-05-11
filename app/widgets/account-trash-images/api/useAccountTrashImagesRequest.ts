import type { Image } from '~/types/image.model'

export type AccountTrashImagesApiResponse = {
  images: Image[]
}

export function useAccountTrashImagesRequest() {
  const client = useSanctumClient()

  async function getAccountTrashImages(): Promise<AccountTrashImagesApiResponse> {
    return client<AccountTrashImagesApiResponse>('/api/account/images/trash')
  }

  return {
    getAccountTrashImages,
  }
}
