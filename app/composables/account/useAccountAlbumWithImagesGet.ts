import { ref } from 'vue'
import { FetchError } from 'ofetch'
import { accountAlbumWithImagesGet } from '~/api/account/albumWithImagesGet'
import type { Album } from '~/types/album.model'
import type { AlbumWithImagesResponse } from '~/types/album-with-images.contract'
import type { Image } from '~/types/image.model'

export function useAccountAlbumWithImagesGet(albumId: number) {
  const client = useSanctumClient()

  const album = ref<Album | null>(null)
  const images = ref<Image[]>([])
  const isLoading = ref(true)

  const router = useRouter()

  async function loadAlbum(): Promise<AlbumWithImagesResponse | undefined> {
    isLoading.value = true
    try {
      const data = await accountAlbumWithImagesGet(client, albumId)
      album.value = data.album
      images.value = data.images
      return data
    } catch (error: unknown) {
      const statusCode = error instanceof FetchError ? error.response?.status : undefined
      if (statusCode === 404) {
        await router.push('/account/albums')
        return
      }
      console.error('Album load error', error)
      showError({ statusCode: statusCode ?? 500, statusMessage: 'Album load failed' })
    } finally {
      isLoading.value = false
    }
  }

  function removeImages(ids: number[]) {
    if (!ids.length) return
    const idsSet = new Set(ids)
    images.value = images.value.filter((image) => !idsSet.has(image.id))
  }

  return {
    album,
    images,
    isLoading,
    loadAlbum,
    removeImages,
  }
}
