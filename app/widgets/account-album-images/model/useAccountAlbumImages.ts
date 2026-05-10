import { computed, ref, useLazyAsyncData, watch } from '#imports'
import type { Ref } from 'vue'
import { useApiQuery } from '~/shared/api'
import type { Image } from '~/types/image.model'
import {
  useAccountAlbumImagesRequest,
  type AccountAlbumImagesApiResponse,
} from '../api/useAccountAlbumImagesRequest'

export function useAccountAlbumImages(albumId: number) {
  const images = ref<Image[]>([]) as Ref<Image[]>
  const nextPage = ref<number | null>(null)

  const { getAccountAlbumImages } = useAccountAlbumImagesRequest()

  const {
    data: albumImagesPage,
    status: albumImagesStatus,
    error: albumImagesLoadError,
    refresh,
  } = useLazyAsyncData<AccountAlbumImagesApiResponse>(
    `account-album-images:${albumId}`,
    () => getAccountAlbumImages(albumId),
    {
      server: false,
      default: () => ({
        images: [],
        nextPage: null,
      }),
    },
  )

  const {
    execute: loadMoreImagesPage,
    isLoading: isLoadingMore,
    error: loadMoreError,
  } = useApiQuery((page: number) => getAccountAlbumImages(albumId, page))

  watch(albumImagesPage, (page) => {
    if (!page) return

    images.value = page.images
    nextPage.value = page.nextPage
  }, {
    immediate: true,
  })

  const isLoading = computed(() => albumImagesStatus.value === 'pending')
  const hasLoadError = computed(() => albumImagesLoadError.value !== null)
  const hasMore = computed(() => nextPage.value !== null)
  const isEmpty = computed(() => {
    return !isLoading.value
      && !hasLoadError.value
      && images.value.length === 0
  })

  async function loadMore() {
    if (nextPage.value === null || isLoadingMore.value) return null

    const page = await loadMoreImagesPage(nextPage.value)
    if (!page) return null

    images.value = [
      ...images.value,
      ...page.images,
    ]
    nextPage.value = page.nextPage

    return page
  }

  return {
    images,

    isLoading,
    isLoadingMore,

    loadError: albumImagesLoadError,
    loadMoreError,
    hasLoadError,

    isEmpty,
    hasMore,

    refresh,
    loadMore,
  }
}
