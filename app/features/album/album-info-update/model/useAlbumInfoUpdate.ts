import { useOpenModalContent } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import type { AlbumInfoUpdateFormResult } from '../contract/album-info-update.contract'
import AlbumInfoUpdateForm from '../ui/AlbumInfoUpdateForm.vue'

export function useAlbumInfoUpdate() {
  const openUpdateForm = useOpenModalContent<typeof AlbumInfoUpdateForm, AlbumInfoUpdateFormResult>({
    component: AlbumInfoUpdateForm,
    title: 'Rename album',
  })

  async function updateAlbumInfo(album: AccountAlbum) {
    const modalResult = await openUpdateForm({ album })

    if (modalResult.action === 'cancel') return

    return modalResult.album
  }

  return {
    updateAlbumInfo,
  }
}
