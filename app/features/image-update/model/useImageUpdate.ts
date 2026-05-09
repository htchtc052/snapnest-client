import { useOpenModal } from '~/shared/modal'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useImageUpdateRequest } from '../api/useImageUpdateRequest'
import type { ImageUpdateModalResult } from '../contract/image-update.contract'
import ImageUpdateModal from '../ui/ImageUpdateModal.vue'

export function useImageUpdate() {
  const openImageUpdateModal = useOpenModal<typeof ImageUpdateModal, ImageUpdateModalResult>(ImageUpdateModal)
  const { getImageUpdateTargetRequest } = useImageUpdateRequest()

  const {
    execute: getImageUpdateTarget,
  } = useApiOperation(getImageUpdateTargetRequest)

  async function updateImage(imageId: number) {
    const imageResult = await getImageUpdateTarget(imageId)
    if (imageResult.status !== ApiResultStatus.Success) return

    const modalResult = await openImageUpdateModal({ image: imageResult.data })
    if (modalResult.action === 'cancel') return

    return modalResult.image
  }

  return {
    updateImage,
  }
}
