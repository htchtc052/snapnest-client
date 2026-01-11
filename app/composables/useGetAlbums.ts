
import { ref } from 'vue'
import { getAlbums } from '~/api/albums/getAlbums'
import type { Album } from '~/models/Album'

export function useGetAlbums() {
  const client = useSanctumClient()

  const albums = ref<Album[]>([])
  const isLoading = ref(true)

  async function loadAlbums(): Promise<void> {
    isLoading.value = true
    try {
      albums.value = await getAlbums(client)
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
