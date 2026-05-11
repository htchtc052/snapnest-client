import { computed, useLazyAsyncData } from '#imports'
import {
  usePublicAlbumImagesRequest,
  type PublicAlbumImagesApiResponse,
} from '../api/usePublicAlbumImagesRequest'

export function usePublicAlbumImages(token: string) {
  const { getPublicAlbumImages } = usePublicAlbumImagesRequest()

  const {
    data: albumImagesResponse,
    status: albumImagesStatus,
    refresh,
  } = useLazyAsyncData<PublicAlbumImagesApiResponse>(
    `public-album-images:${token}`,
    () => getPublicAlbumImages(token),
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

  return {
    images,

    isLoading,

    hasLoadError,

    isEmpty,

    refresh,
  }
}
