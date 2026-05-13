import type { Image } from '~/entities/image'

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
