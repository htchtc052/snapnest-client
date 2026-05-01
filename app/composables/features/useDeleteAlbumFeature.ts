import AlbumDeleteModal from '~/components/account/AlbumDeleteModal.vue'
import { useAlbumDeleteOperation } from '~/composables/features/useAlbumDeleteOperation'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { AlbumDeleteModalResult } from '~/types/album-delete.contract'
import type { AccountAlbum } from '~/types/account-album.model'

export function useDeleteAlbumFeature() {
  const openDeleteAlbumModal = useOpenModal<typeof AlbumDeleteModal, AlbumDeleteModalResult>(AlbumDeleteModal)
  const { deleteAlbum, isDeleting } = useAlbumDeleteOperation()

  async function confirmDeleteAlbum(album: AccountAlbum) {
    const modalResult = await openDeleteAlbumModal({ album })
    if (modalResult.action === 'cancel') return

    return deleteAlbum(album)
  }

  return {
    deleteAlbum: confirmDeleteAlbum,
    isDeletingAlbum: isDeleting,
  }
}
