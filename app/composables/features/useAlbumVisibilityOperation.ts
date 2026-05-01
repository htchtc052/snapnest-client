import { ref } from '#imports'
import { albumVisibilityUpdate } from '~/api/account/albumVisibilityUpdate'

export function useAlbumVisibilityOperation() {
  const client = useSanctumClient()
  const isUpdatingVisibility = ref(false)

  async function updateAlbumVisibility(albumId: number, isPublic: boolean) {
    isUpdatingVisibility.value = true
    try {
      return await albumVisibilityUpdate(client, albumId, isPublic)
    } catch (error: unknown) {
      console.error('[Albums] Failed to update album visibility', error)
    } finally {
      isUpdatingVisibility.value = false
    }
  }

  return {
    isUpdatingVisibility,
    updateAlbumVisibility,
  }
}