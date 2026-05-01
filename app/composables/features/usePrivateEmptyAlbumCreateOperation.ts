import { ref } from '#imports'
import { privateEmptyAlbumCreate } from '~/api/account/privateEmptyAlbumCreate'

export function usePrivateEmptyAlbumCreateOperation() {
  const isCreating = ref(false)
  const client = useSanctumClient()

  async function createEmptyPrivateAlbum() {
    isCreating.value = true
    try {
      return await privateEmptyAlbumCreate(client)
    } catch (error: unknown) {
      console.error('[Albums] Failed to create empty private album', error)
    } finally {
      isCreating.value = false
    }
  }

  return {
    createEmptyPrivateAlbum,
    isCreatingEmptyPrivateAlbum: isCreating,
  }
}
