import { useOpenModal } from '~/shared/modal'
import { ApiOperationResult, useApiOperation } from '~/shared/api'
import type { User } from '~/types/user.model'
import { useImageTrashActionRequest } from '../api/useImageTrashActionRequest'
import { ImageTrashActionType, type ImageTrashActionModalResult } from '../contract/image-trash-actions.contract'
import ImageDeleteModal from '../ui/ImageDeleteModal.vue'
import ImageTrashModal from '../ui/ImageTrashModal.vue'

type OpenConfirmModal = (ids: number[]) => Promise<ImageTrashActionModalResult>

const successTitleByAction: Record<ImageTrashActionType, (count: number) => string> = {
  [ImageTrashActionType.Trash]: count => `Moved ${count} images to trash.`,
  [ImageTrashActionType.Restore]: count => `Restored ${count} images.`,
  [ImageTrashActionType.Delete]: count => `Permanently deleted ${count} images.`,
}

export function useImageTrashActions() {
  const toast = useToast()
  const { refreshIdentity } = useSanctumAuth<User>()
  const openTrashModal = useOpenModal<typeof ImageTrashModal, ImageTrashActionModalResult>(ImageTrashModal)
  const openDeleteModal = useOpenModal<typeof ImageDeleteModal, ImageTrashActionModalResult>(ImageDeleteModal)
  const { executeImageTrashActionRequest } = useImageTrashActionRequest()

  function useActionOperation(actionType: ImageTrashActionType) {
    return useApiOperation((ids: number[]) => executeImageTrashActionRequest(actionType, ids))
  }

  const actionOperations = {
    [ImageTrashActionType.Trash]: useActionOperation(ImageTrashActionType.Trash),
    [ImageTrashActionType.Restore]: useActionOperation(ImageTrashActionType.Restore),
    [ImageTrashActionType.Delete]: useActionOperation(ImageTrashActionType.Delete),
  }

  async function confirmAction(ids: number[], openConfirmModal?: OpenConfirmModal) {
    if (!openConfirmModal) return true

    const modalResult = await openConfirmModal(ids)
    return modalResult.action === 'confirm'
  }

  async function executeAction(actionType: ImageTrashActionType, ids: number[], openConfirmModal?: OpenConfirmModal) {
    const isConfirmed = await confirmAction(ids, openConfirmModal)
    if (!isConfirmed) return

    const result = await actionOperations[actionType].execute(ids)
    if (result.status !== ApiOperationResult.Success) return

    const imageIds = result.data.imageIds

    if (actionType !== ImageTrashActionType.Trash) {
      await refreshIdentity()
    }

    toast.add({
      title: successTitleByAction[actionType](imageIds.length),
      color: 'success',
    })

    return imageIds
  }

  function createAction(actionType: ImageTrashActionType, openConfirmModal?: OpenConfirmModal) {
    return (ids: number[]) => executeAction(actionType, ids, openConfirmModal)
  }

  const trashImages = createAction(ImageTrashActionType.Trash, ids => openTrashModal({ ids }))
  const restoreImages = createAction(ImageTrashActionType.Restore)
  const deleteImages = createAction(ImageTrashActionType.Delete, ids => openDeleteModal({ ids }))

  return {
    deleteImages,
    isDeletingImages: actionOperations[ImageTrashActionType.Delete].isLoading,
    isRestoringImages: actionOperations[ImageTrashActionType.Restore].isLoading,
    isTrashingImages: actionOperations[ImageTrashActionType.Trash].isLoading,
    restoreImages,
    trashImages,
  }
}
