import { ApiOperationResult, useApiOperation } from '~/shared/api'
import { useAlbumImagesRemoveRequest } from '../api/useAlbumImagesRemoveRequest'

export function useRemoveImagesFromAlbumFeature() {
  const toast = useToast()
  const { removeImagesFromAlbumRequest } = useAlbumImagesRemoveRequest()

  const {
    execute: executeRemoveImagesFromAlbum,
    isLoading: isRemovingImages,
  } = useApiOperation(removeImagesFromAlbumRequest)

  async function removeImagesFromAlbum(albumId: number, imageIds: number[]) {
    const result = await executeRemoveImagesFromAlbum(albumId, imageIds)
    if (result.status !== ApiOperationResult.Success) return

    const removedIds = result.data.removedIds

    toast.add({
      title: `Removed ${removedIds.length} images from album.`,
      color: 'success',
    })

    return removedIds
  }

  return {
    isRemovingImages,
    removeImagesFromAlbum,
  }
}
