import { ref } from 'vue'
import { FetchError } from 'ofetch'
import { publicAlbumWithImagesGet } from '~/api/public/albumWithImagesGet'
import type { Album } from '~/types/album.model'
import type { AlbumWithImagesResponse } from '~/types/album-with-images.contract'
import type { Image } from '~/types/image.model'

export function usePublicAlbumWithImagesGet(token: string) {
  const client = useSanctumClient()

  const album = ref<Album | null>(null)
  const images = ref<Image[]>([])
  const loadError = ref<string | null>(null)
  const isLoading = ref(true)

  async function loadAlbum(): Promise<AlbumWithImagesResponse | undefined> {
    isLoading.value = true
    loadError.value = null
    try {
      const data = await publicAlbumWithImagesGet(client, token)
      album.value = data.album
      images.value = data.images
      return data
    } catch (error: unknown) {
      const statusCode = error instanceof FetchError ? error.response?.status : undefined
      if (statusCode === 404) {
        loadError.value = 'Album not found'
        return
      }
      if (statusCode === 403) {
        loadError.value = 'Access denied'
        return
      }
      console.error('Album load error', error)
      showError({ statusCode: statusCode ?? 500, statusMessage: 'Album load failed' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    album,
    images,
    loadError,
    isLoading,
    loadAlbum,
  }
}
