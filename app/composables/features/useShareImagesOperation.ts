import { ref } from '#imports'
import { albumCreate } from '~/api/account/albumCreate'
import type { AlbumCreateResult } from '~/types/album-create.contract'

export function useShareImagesOperation() {
  const client = useSanctumClient()
  const isSharing = ref(false)

  async function shareImages(imageIds: number[]): Promise<AlbumCreateResult> {
    isSharing.value = true
    try {
      return await albumCreate(client, {
        image_ids: imageIds,
      })
    } catch (error: unknown) {
      console.error('[Albums] Failed to share images', error)
    } finally {
      isSharing.value = false
    }
  }

  return {
    isSharing,
    shareImages,
  }
}
