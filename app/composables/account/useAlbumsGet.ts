
import { ref } from 'vue'
import { albumsGet } from '~/api/account/albumsGet'
import type { Album } from '~/types/album.model'

export function useAlbumsGet() {
  const client = useSanctumClient()

  const albums = ref<Album[]>([])
  const isLoading = ref(true)

  async function loadAlbums(): Promise<void> {
    isLoading.value = true
    try {
      albums.value = await albumsGet(client)
    } catch (error: unknown) {
      if (import.meta.dev) {
        console.error('[Albums] Fetch albums failed', error)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    albums,
    isLoading,
    loadAlbums,
  }
}
