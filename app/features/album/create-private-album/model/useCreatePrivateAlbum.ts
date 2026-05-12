import { useOpenModal } from '~/shared/modal'
import type { AlbumCreateModalResult } from '../contract/create-private-album.contract'
import AlbumCreateModal from '../ui/AlbumCreateModal.vue'

export function useCreatePrivateAlbum() {
  const openCreateModal = useOpenModal<typeof AlbumCreateModal, AlbumCreateModalResult>(AlbumCreateModal)

  async function createPrivateAlbum() {
    const modalResult = await openCreateModal()

    if (modalResult.action === 'cancel') return

    return modalResult.album
  }

  return {
    createPrivateAlbum,
  }
}
