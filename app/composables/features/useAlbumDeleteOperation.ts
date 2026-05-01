import { ref } from '#imports'
import { albumDelete } from '~/api/account/albumDelete'
import type { AccountAlbum } from '~/types/account-album.model'
import type { AlbumDeleteResult } from '~/types/album-delete.contract'

export function useAlbumDeleteOperation() {
  const isDeleting = ref(false)
  const client = useSanctumClient()
  const toast = useToast()

  async function deleteAlbum(album: AccountAlbum): Promise<AlbumDeleteResult> {
    isDeleting.value = true
    try {
      await albumDelete(client, album.id)
      toast.add({ title: 'Album deleted.', color: 'success' })
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
