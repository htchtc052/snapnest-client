import AlbumUpdateModal from '~/components/account/AlbumUpdateModal.vue'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { AlbumUpdateModalResult } from '~/types/album-info.contract'
import type { AccountAlbum } from '~/types/account-album.model'

export function useRenameAlbumFeature() {
  const openUpdateModal = useOpenModal<typeof AlbumUpdateModal, AlbumUpdateModalResult>(AlbumUpdateModal)

  async function renameAlbum(album: AccountAlbum) {
    const modalResult = await openUpdateModal({ album })
    if (modalResult.action === 'cancel') return

    return modalResult.album
  }

  return {
    renameAlbum,
  }
}
