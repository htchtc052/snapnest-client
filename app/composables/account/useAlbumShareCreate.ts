import { ref } from '#imports'
import { albumShareCreate } from '~/api/account/albumShareCreate'
import type { AlbumShareCreateResult } from '~/types/album-share-create.contract'
import type { Album } from '~/types/album.model'

export function useAlbumShareCreate() {
  const client = useSanctumClient()

  const album = ref<Album | null>(null)
  const isCreating = ref(false)

  async function createShare(imageIds: number[]): Promise<AlbumShareCreateResult> {
    isCreating.value = true
    try {
      const created = await albumShareCreate(client, {
        image_ids: imageIds,
        is_public: true,
      })
      album.value = created
      return created
    } catch (error: unknown) {
      console.error('[AlbumShare] Failed to create shared album', error)
    } finally {
      isCreating.value = false
    }
  }

  return {
    album,
    isCreating,
    createShare,
  }
}
