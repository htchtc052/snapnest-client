import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { ConfirmForm, type ConfirmFormProps, type ConfirmResult } from '~/shared/confirm'
import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import { useImageTrashActionRequest } from '../api/useImageTrashActionRequest'
import { ImageTrashActionType } from '../contract/image-trash-actions.contract'

type CreateConfirmProps = (ids: number[]) => ConfirmFormProps

const successTitleByAction: Record<ImageTrashActionType, (count: number) => string> = {
  [ImageTrashActionType.Trash]: count => `Moved ${count} images to trash.`,
  [ImageTrashActionType.Restore]: count => `Restored ${count} images.`,
  [ImageTrashActionType.Delete]: count => `Permanently deleted ${count} images.`,
}

export function useImageTrashActions() {
  const toast = useToast()
  const { refreshIdentity } = useSanctumAuth<User>()
  const openConfirm = useOpenModalContent<typeof ConfirmForm, ConfirmResult>({
    component: ConfirmForm,
  })
  const { executeImageTrashActionRequest } = useImageTrashActionRequest()

  function useActionOperation(actionType: ImageTrashActionType) {
    return useApiOperation((ids: number[]) => executeImageTrashActionRequest(actionType, ids))
  }

  const actionOperations = {
    [ImageTrashActionType.Trash]: useActionOperation(ImageTrashActionType.Trash),
    [ImageTrashActionType.Restore]: useActionOperation(ImageTrashActionType.Restore),
    [ImageTrashActionType.Delete]: useActionOperation(ImageTrashActionType.Delete),
  }

  async function confirmAction(ids: number[], createConfirmProps?: CreateConfirmProps) {
    if (!createConfirmProps) return true

    const modalResult = await openConfirm(createConfirmProps(ids))
    return modalResult?.action === 'confirm'
  }

  async function executeAction(actionType: ImageTrashActionType, ids: number[], createConfirmProps?: CreateConfirmProps) {
    const isConfirmed = await confirmAction(ids, createConfirmProps)
    if (!isConfirmed) return

    const result = await actionOperations[actionType].execute(ids)
    if (result.status !== ApiResultStatus.Success) return

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

  function createAction(actionType: ImageTrashActionType, createConfirmProps?: CreateConfirmProps) {
    return (ids: number[]) => executeAction(actionType, ids, createConfirmProps)
  }

  const trashImages = createAction(ImageTrashActionType.Trash, (ids) => {
    const count = ids.length

    return {
      title: `Move ${count} image${count === 1 ? '' : 's'} to trash?`,
      description: `This will move ${count} image${count === 1 ? '' : 's'} to trash.`,
      confirmLabel: 'Move to trash',
      confirmIcon: 'i-heroicons-trash-20-solid',
      confirmColor: 'error',
    }
  })
  const restoreImages = createAction(ImageTrashActionType.Restore)
  const deleteImages = createAction(ImageTrashActionType.Delete, (ids) => {
    const count = ids.length

    return {
      title: `Delete ${count} image${count === 1 ? '' : 's'} permanently?`,
      description: `This will permanently delete ${count} image${count === 1 ? '' : 's'}.`,
      confirmLabel: 'Delete permanently',
      confirmIcon: 'i-heroicons-trash-20-solid',
      confirmColor: 'error',
    }
  })

  return {
    deleteImages,
    isDeletingImages: actionOperations[ImageTrashActionType.Delete].isLoading,
    isRestoringImages: actionOperations[ImageTrashActionType.Restore].isLoading,
    isTrashingImages: actionOperations[ImageTrashActionType.Trash].isLoading,
    restoreImages,
    trashImages,
  }
}
