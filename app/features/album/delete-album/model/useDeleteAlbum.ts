import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { ConfirmForm, type ConfirmResult } from '~/shared/confirm'
import { useOpenModalContent } from '~/shared/modal'
import { useAlbumDeleteRequest } from '../api/useAlbumDeleteRequest'

export function useDeleteAlbum() {
  const toast = useToast()
  const openDeleteAlbumConfirm = useOpenModalContent<typeof ConfirmForm, ConfirmResult>({
    component: ConfirmForm,
    title: 'Delete album?',
  })
  const { deleteAlbumRequest } = useAlbumDeleteRequest()

  const {
    execute: executeDeleteAlbum,
    isLoading: isDeletingAlbum,
  } = useApiOperation(deleteAlbumRequest)

  async function deleteAlbum(album: AccountAlbum) {
    const isConfirmed = await openDeleteAlbumConfirm({
      description: album.name
        ? `Are you sure you want to delete ${album.name}?`
        : 'Are you sure you want to delete this album?',
      confirmLabel: 'Delete',
      confirmIcon: 'i-heroicons-trash-20-solid',
      confirmColor: 'error',
    })
    if (!isConfirmed) return

    const result = await executeDeleteAlbum(album.id)
    if (result.status !== ApiResultStatus.Success) return

    toast.add({
      title: 'Album deleted.',
      color: 'success',
    })

    return album.id
  }

  return {
    deleteAlbum,
    isDeletingAlbum,
  }
}
