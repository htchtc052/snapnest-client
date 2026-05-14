import { useOpenModalContent } from '~/shared/modal'
import type { AlbumCreateFormResult } from '../contract/create-private-album.contract'
import AlbumCreateForm from '../ui/AlbumCreateForm.vue'

export function useCreatePrivateAlbum() {
  const openCreateForm = useOpenModalContent<typeof AlbumCreateForm, AlbumCreateFormResult>({
    component: AlbumCreateForm,
    title: 'Create album',
  })

  async function createPrivateAlbum() {
    const modalResult = await openCreateForm()

    if (modalResult.action === 'cancel') return

    return modalResult.album
  }

  return {
    createPrivateAlbum,
  }
}
