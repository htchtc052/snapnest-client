import { albumDetachImages } from '~/api/account/albumDetachImages'
import { mapGroupActionError } from '~/http/handle-group-action-error'
import type { DetachImagesResult } from '~/types/image-detach.contract'

export function useAlbumDetachImages() {
  const client = useSanctumClient()
  const toast = useToast()
  const isDetaching = ref(false)

  async function detachImages(albumId: number, imageIds: number[]): Promise<DetachImagesResult> {
    isDetaching.value = true
    try {
      await albumDetachImages(client, albumId, imageIds)
      toast.add({ title: 'Removed from album', color: 'success' })
      return true
    } catch (error: unknown) {
      console.error('[Albums] Failed to detach images', error)
      const parsed = mapGroupActionError(error)
      const title =
        parsed.isGroupActionError && parsed.message
          ? parsed.message
          : 'Failed to remove from album.'
      toast.add({ title, color: 'error' })
    } finally {
      isDetaching.value = false
    }
  }

  return {
    detachImages,
    isDetaching,
  }
}
