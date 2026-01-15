import type { FormError } from '#ui/types'
import { imageUpdate } from '~/api/account/imageUpdate'
import { mapFormError } from '~/http/handle-form-error'
import type { ImageUpdateDto } from '~/types/image-update.contract'
import type { Image } from '~/types/image.model'

export function useImageUpdate() {
  const isUpdating = ref(false)
  const client = useSanctumClient()

  async function updateImage(imageId: number, data: ImageUpdateDto): Promise<FormError[] | Image | undefined> {
    isUpdating.value = true
    try {
      const image = await imageUpdate(client, imageId, data)
      return image
    } catch (error: unknown) {
      const parsed = mapFormError(error)
      if (parsed.isValidationError) return parsed.bag
      console.error('[Images] Failed to update image', error)
    } finally {
      isUpdating.value = false
    }
  }

  return {
    updateImage,
    isUpdating,
  }
}
