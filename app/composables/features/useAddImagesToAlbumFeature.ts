import AlbumSelectModal from '~/components/account/AlbumSelectModal.vue'
import { useAlbumImagesAddOperation } from '~/composables/features/useAlbumImagesAddOperation'
import { usePrivateEmptyAlbumCreateOperation } from '~/composables/features/usePrivateEmptyAlbumCreateOperation'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { AlbumSelectModalResult } from '~/types/album-select.contract'

export function useAddImagesToAlbumFeature() {
  const openSelectModal = useOpenModal<typeof AlbumSelectModal, AlbumSelectModalResult>(AlbumSelectModal)
  const { addImagesToAlbum, isAddingImages } = useAlbumImagesAddOperation()
  const { createEmptyPrivateAlbum, isCreatingEmptyPrivateAlbum } = usePrivateEmptyAlbumCreateOperation()

  async function addImages(ids: number[]) {
    const modalResult = await openSelectModal()
    if (modalResult.action === 'cancel') return

    if (modalResult.action === 'create') {
      const album = await createEmptyPrivateAlbum()
      if (!album) return

      const addedIds = await addImagesToAlbum(album, ids)
      if (!addedIds) return

      await navigateTo(`/account/albums/${album.id}`)

      return addedIds
    }

    return addImagesToAlbum(modalResult.album, ids)
  }

  return {
    addImages,
    isAddingImages: computed(() => isAddingImages.value || isCreatingEmptyPrivateAlbum.value),
  }
}
