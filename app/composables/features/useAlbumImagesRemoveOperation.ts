import { ref } from 'vue'
import { albumImagesRemove } from '~/api/account/albumImagesRemove'

export function useAlbumImagesRemoveOperation() {
  const client = useSanctumClient()
  const toast = useToast()
  const isRemoving = ref(false)

  async function removeImagesFromAlbum(albumId: number, imageIds: number[]): Promise<number[] | undefined> {
    isRemoving.value = true

    try {
      const result = await albumImagesRemove(client, albumId, imageIds)
      toast.add({ title: `Removed ${result.removedIds.length} images from album.`, color: 'success' })
      return result.removedIds
    } catch (error: unknown) {
      console.error('[Albums] Failed to remove images from album', error)
      toast.add({ title: 'Failed to remove images from album.', color: 'error' })
    } finally {
      isRemoving.value = false
    }
  }

  return {
    isRemovingImages: isRemoving,
    removeImagesFromAlbum,
  }
}
