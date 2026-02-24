import { ref } from '#imports'
import { albumPublishUpdate } from '~/api/account/albumPublishUpdate'
import type { Album } from '~/types/album.model'

export function useAlbumPublish() {
  const client = useSanctumClient()

  const isUpdating = ref(false)

  async function updatePublish(albumId: Album['id'], is_public: boolean): Promise<Album | undefined> {
    isUpdating.value = true
    try {
      const updated = await albumPublishUpdate(client, albumId, is_public)
      return updated
    } catch (error: unknown) {
      console.error('[AlbumPublish] Failed to update publish status', error)
    } finally {
      isUpdating.value = false
    }
  }

  return {
    isUpdating,
    updatePublish,
  }
}
