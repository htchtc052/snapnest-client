import { albumDelete } from "~/api/account/albumDelete"
import type { AlbumDeleteResult } from "~/types/album-delete.contract"
import type { Album } from "~/types/album.model"

export function useAlbumDelete() {
  const isDeleting = ref(false)
  const client = useSanctumClient()
  const toast = useToast()

  async function deleteAlbum(album: Album): Promise<AlbumDeleteResult> {
    isDeleting.value = true
    try {
      await albumDelete(client, album.id)
      toast.add({ title: `Album ${album.name} deleted.`, color: 'success' })
      return true
    } catch (error: unknown) {
      console.error('[Albums] Failed to delete album', error)
      toast.add({ title: 'Failed to delete album.', color: 'error' })
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteAlbum,
    isDeleting,
  }
}
