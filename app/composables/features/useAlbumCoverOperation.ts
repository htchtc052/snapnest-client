import { ref } from '#imports'
import { albumCoverUpdate } from '~/api/account/albumCoverUpdate'

export function useAlbumCoverOperation() {
  const client = useSanctumClient()
  const toast = useToast()
  const isUpdatingCover = ref(false)

  async function updateAlbumCover(albumId: number, coverImageId: number) {
    isUpdatingCover.value = true

    try {
      const updatedAlbum = await albumCoverUpdate(client, albumId, coverImageId)
      toast.add({ title: 'Album cover updated.', color: 'success' })
      return updatedAlbum
    } catch (error: unknown) {
      console.error('[Albums] Failed to update album cover', error)
      toast.add({ title: 'Failed to update album cover.', color: 'error' })
    } finally {
      isUpdatingCover.value = false
    }
  }

  return {
    isUpdatingCover,
    updateAlbumCover,
  }
}
