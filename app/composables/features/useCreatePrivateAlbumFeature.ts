import AlbumCreateModal from '~/components/account/AlbumCreateModal.vue'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { AlbumCreateModalResult } from '~/types/album-info.contract'

export function useCreatePrivateAlbumFeature() {
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
