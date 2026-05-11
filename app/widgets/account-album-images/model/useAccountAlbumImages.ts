import { computed, useLazyAsyncData } from '#imports'
import {
  useAccountAlbumImagesRequest,
  type AccountAlbumImagesApiResponse,
} from '../api/useAccountAlbumImagesRequest'

export function useAccountAlbumImages(albumId: number) {
  const { getAccountAlbumImages } = useAccountAlbumImagesRequest()

  const {
    data: albumImagesResponse,
    status: albumImagesStatus,
    refresh,
  } = useLazyAsyncData<AccountAlbumImagesApiResponse>(
    `account-album-images:${albumId}`,
    () => getAccountAlbumImages(albumId),
    {
      server: false,
      default: () => ({
        images: [],
      }),
    },
  )

  const images = computed(() => albumImagesResponse.value.images)
  const isLoading = computed(() => albumImagesStatus.value === 'pending')
  const hasLoadError = computed(() => albumImagesStatus.value === 'error')
  const isEmpty = computed(() => {
    return !isLoading.value
      && !hasLoadError.value
      && images.value.length === 0
  })

  function removeImagesById(ids: number[]) {
    const idsSet = new Set(ids)
    const images = albumImagesResponse.value.images

    for (let index = images.length - 1; index >= 0; index--) {
      const image = images[index]

      if (image && idsSet.has(image.id)) {
        images.splice(index, 1)
      }
    }
  }

  return {
    images,

    isLoading,

    hasLoadError,

    isEmpty,

    refresh,
    removeImagesById,
  }
}
