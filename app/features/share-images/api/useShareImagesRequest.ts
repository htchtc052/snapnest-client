import type { AccountAlbum } from '~/entities/album/model'
import type { ShareImagesDto } from '../contract/share-images.contract'

export function useShareImagesRequest() {
  const client = useSanctumClient()

  async function shareImagesRequest(imageIds: number[]) {
    const body: ShareImagesDto = {
      image_ids: imageIds,
    }

    return await client<AccountAlbum>('/api/account/albums', {
      method: 'POST',
      body,
    })
  }

  return {
    shareImagesRequest,
  }
}
