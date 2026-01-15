import { albumUpdate } from "~/api/account/albumUpdate"
import type { AlbumUpdateDto } from "~/types/album-info.contract"
import type { AlbumUpdateResult } from "~/types/album-update.contract"

export function useAlbumUpdate() {
  const isUpdating = ref(false)
  const client = useSanctumClient()
  const toast = useToast()

  async function updateAlbum(albumId: number, data: AlbumUpdateDto): Promise<AlbumUpdateResult> {
    isUpdating.value = true
    try {
      const album = await albumUpdate(client, albumId, data)
      return album
    } catch (error: unknown) {
      console.error('[Albums] Failed to update album', error)
      toast.add({ title: 'Failed to update album.', color: 'error' })
    } finally {
      isUpdating.value = false
    }
  }

  return {
    updateAlbum,
    isUpdating,
  }
}
