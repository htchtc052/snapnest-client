import { useOpenModal } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumInfoUpdateModalResult } from '../contract/album-info-update.contract'
import AlbumInfoUpdateModal from '../ui/AlbumInfoUpdateModal.vue'

export function useAlbumInfoUpdate() {
  const openUpdateModal = useOpenModal<typeof AlbumInfoUpdateModal, AlbumInfoUpdateModalResult>(AlbumInfoUpdateModal)

  async function updateAlbumInfo(album: AccountAlbum) {
    const modalResult = await openUpdateModal({ album })

    if (modalResult.action === 'cancel') return

    return modalResult.album
  }

  return {
    updateAlbumInfo,
  }
}
