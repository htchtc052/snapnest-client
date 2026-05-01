import { ref } from 'vue'
import { albumsGet } from '~/api/account/albumsGet'
import type { AccountAlbum } from '~/types/account-album.model'

export function useAlbumsListOperation() {
  const client = useSanctumClient()

  const albums = ref<AccountAlbum[]>([])
  const isLoading = ref(true)
  const loadError = ref<string | null>(null)

  async function loadAlbums(): Promise<void> {
    loadError.value = null
    isLoading.value = true

    try {
      albums.value = await albumsGet(client)
    } catch (error: unknown) {
      console.error('[Albums] Fetch albums failed', error)
      loadError.value = 'Failed to load albums.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    albums,
    isLoading,
    loadError,
    loadAlbums,
  }
}
