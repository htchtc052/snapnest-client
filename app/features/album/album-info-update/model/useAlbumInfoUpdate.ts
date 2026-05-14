import { useOpenModal } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumInfoUpdateModalResult } from '../contract/album-info-update.contract'
import AlbumInfoUpdateModal from '../ui/AlbumInfoUpdateModal.vue'

type UseAlbumInfoUpdateOptions = {
  onUpdated?: (album: AccountAlbum) => void
}

export function useAlbumInfoUpdate(options: UseAlbumInfoUpdateOptions = {}) {
  const openUpdateModal = useOpenModal<typeof AlbumInfoUpdateModal, AlbumInfoUpdateModalResult>(AlbumInfoUpdateModal)

  async function updateAlbumInfo(album: AccountAlbum) {
    const modalResult = await openUpdateModal({ album })

    if (modalResult.action === 'cancel') return

    options.onUpdated?.(modalResult.album)

    return modalResult.album
  }

  return {
    updateAlbumInfo,
  }
}
