import type { Image } from '~/entities/image'
import type { ImageUpdateDto } from '../contract/image-update.contract'

export function useImageUpdateRequest() {
  const client = useSanctumClient()

  async function getImageUpdateTargetRequest(imageId: Image['id']) {
    return await client<Image>(`/api/account/images/${imageId}/status`)
  }

  async function updateImageRequest(imageId: Image['id'], data: ImageUpdateDto) {
    return await client<Image>(`/api/account/images/${imageId}`, {
      method: 'PUT',
      body: data,
    })
  }

  return {
    getImageUpdateTargetRequest,
    updateImageRequest,
  }
}
