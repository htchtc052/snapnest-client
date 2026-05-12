import { useOpenModal } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumImagesAddRequest } from '../api/useAlbumImagesAddRequest'
import type { AlbumSelectModalResult } from '../contract/add-images-to-album.contract'
import AlbumSelectModal from '../ui/AlbumSelectModal.vue'

type AlbumToastTarget = Pick<AccountAlbum, 'id' | 'name'>

export function useAddImagesToAlbumFeature() {
  const toast = useToast()
  const openSelectModal = useOpenModal<typeof AlbumSelectModal, AlbumSelectModalResult>(AlbumSelectModal)
  const { addImagesToAlbumRequest } = useAlbumImagesAddRequest()

  const {
    execute: executeAddImagesToAlbum,
    isLoading: isAddingImagesToAlbum,
  } = useApiOperation(addImagesToAlbumRequest)

  async function addImagesToAlbum(album: AlbumToastTarget, imageIds: number[]) {
    const result = await executeAddImagesToAlbum(album.id, imageIds)
    if (result.status !== ApiResultStatus.Success) return

    const addedIds = result.data.addedIds
    const label = addedIds.length === 1 ? 'image' : 'images'

    toast.add({
      title: `Added ${addedIds.length} ${label} to album.`,
      color: 'success',
      actions: [
        {
          label: album.name ?? 'Open album',
          variant: 'link',
          color: 'neutral',
          to: `/account/albums/${album.id}`,
        },
      ],
    })

    return addedIds
  }

  async function addImages(ids: number[]) {
    const modalResult = await openSelectModal()
    if (modalResult.action === 'cancel') return

    return await addImagesToAlbum(modalResult.album, ids)
  }

  return {
    addImages,
    addImagesToAlbum,
    isAddingImages: isAddingImagesToAlbum,
  }
}
