import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useOpenModalContent } from '~/shared/modal'
import { useImageUpdateRequest } from '../api/useImageUpdateRequest'
import type { ImageUpdateFormResult } from '../contract/image-update.contract'
import ImageUpdateForm from '../ui/ImageUpdateForm.vue'

export function useImageUpdate() {
  const openImageUpdateForm = useOpenModalContent<typeof ImageUpdateForm, ImageUpdateFormResult>({
    component: ImageUpdateForm,
    title: 'Edit image info',
  })
  const { getImageUpdateTargetRequest } = useImageUpdateRequest()

  const {
    execute: getImageUpdateTarget,
  } = useApiOperation(getImageUpdateTargetRequest)

  async function updateImage(imageId: number) {
    const imageResult = await getImageUpdateTarget(imageId)
    if (imageResult.status !== ApiResultStatus.Success) return

    const modalResult = await openImageUpdateForm({ image: imageResult.data })
    return modalResult
  }

  return {
    updateImage,
  }
}
