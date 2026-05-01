import ImageDeleteModal from '~/components/account/ImageDeleteModal.vue'
import { useImagesDeleteOperation } from '~/composables/features/useImagesDeleteOperation'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { DeleteImagesModalResult } from '~/types/image-delete.contract'

export function useDeleteImagesFeature() {
  const openDeleteModal = useOpenModal<typeof ImageDeleteModal, DeleteImagesModalResult>(ImageDeleteModal)
  const { deleteImages: deleteImagesRequest, isDeleting } = useImagesDeleteOperation()

  async function deleteImages(ids: number[]) {
    const modalResult = await openDeleteModal({ ids })
    if (modalResult.action === 'cancel') return

    return (await deleteImagesRequest(ids))?.deletedIds
  }

  return {
    deleteImages,
    isDeletingImages: isDeleting,
  }
}
