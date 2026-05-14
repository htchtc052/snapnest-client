import { useOpenModal } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumDeleteRequest } from '../api/useAlbumDeleteRequest'
import type { AlbumDeleteModalResult } from '../contract/delete-album.contract'
import AlbumDeleteModal from '../ui/AlbumDeleteModal.vue'

type UseDeleteAlbumOptions = {
  onDeleted?: (albumId: AccountAlbum['id']) => void
}

export function useDeleteAlbum(options: UseDeleteAlbumOptions = {}) {
  const toast = useToast()
  const openDeleteAlbumModal = useOpenModal<typeof AlbumDeleteModal, AlbumDeleteModalResult>(AlbumDeleteModal)
  const { deleteAlbumRequest } = useAlbumDeleteRequest()

  const {
    execute: executeDeleteAlbum,
    isLoading: isDeletingAlbum,
  } = useApiOperation(deleteAlbumRequest)

  async function deleteAlbum(album: AccountAlbum) {
    const modalResult = await openDeleteAlbumModal({ album })
    if (modalResult.action === 'cancel') return

    const result = await executeDeleteAlbum(album.id)
    if (result.status !== ApiResultStatus.Success) return

    toast.add({
      title: 'Album deleted.',
      color: 'success',
    })

    options.onDeleted?.(album.id)

    return album.id
  }

  return {
    deleteAlbum,
    isDeletingAlbum,
  }
}
