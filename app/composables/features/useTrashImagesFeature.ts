import ImageTrashModal from '~/components/account/ImageTrashModal.vue'
import { useImagesTrashOperation } from '~/composables/features/useImagesTrashOperation'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { TrashImagesModalResult } from '~/types/image-trash.contract'

export function useTrashImagesFeature() {
  const openTrashModal = useOpenModal<typeof ImageTrashModal, TrashImagesModalResult>(ImageTrashModal)
  const { trashImages: trashImagesRequest, isTrashing } = useImagesTrashOperation()

  async function trashImages(ids: number[]) {
    const modalResult = await openTrashModal({ ids })
    if (modalResult.action === 'cancel') return

    return (await trashImagesRequest(ids))?.trashedIds
  }

  return {
    isTrashingImages: isTrashing,
    trashImages,
  }
}
