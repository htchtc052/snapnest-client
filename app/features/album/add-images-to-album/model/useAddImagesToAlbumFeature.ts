import { useOpenModalContent } from '~/shared/modal'
import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumImagesAddRequest } from '../api/useAlbumImagesAddRequest'
import type { AlbumSelectResult } from '../contract/add-images-to-album.contract'
import AlbumSelectContent from '../ui/AlbumSelectContent.vue'

type AlbumToastTarget = Pick<AccountAlbum, 'id' | 'name'>

export function useAddImagesToAlbumFeature() {
  const toast = useToast()
  const openSelectModal = useOpenModalContent<typeof AlbumSelectContent, AlbumSelectResult>({
    component: AlbumSelectContent,
    title: 'Add to album',
  })
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
    const album = await openSelectModal()
    if (!album) return

    return await addImagesToAlbum(album, ids)
  }

  return {
    addImages,
    addImagesToAlbum,
    isAddingImages: isAddingImagesToAlbum,
  }
}
