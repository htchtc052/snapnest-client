import { computed, ref, useLazyAsyncData, watch } from '#imports'
import type { Ref } from 'vue'
import { useApiQuery } from '~/shared/api'
import type { Image } from '~/types/image.model'
import {
  useAccountImagesRequest,
  type AccountImagesApiResponse,
} from '../api/useAccountImagesRequest'

export function useAccountImages() {
  const images = ref<Image[]>([]) as Ref<Image[]>
  const nextPage = ref<number | null>(null)

  const { getAccountImages } = useAccountImagesRequest()

  const {
    data: accountImagesPage,
    status: accountImagesStatus,
    refresh,
  } = useLazyAsyncData<AccountImagesApiResponse>(
    'account-images',
    () => getAccountImages(),
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
    hasError: hasLoadMoreError,
  } = useApiQuery((page: number) => getAccountImages(page))

  watch(accountImagesPage, (page) => {
    if (!page) return

    images.value = page.images
    nextPage.value = page.nextPage
  }, {
    immediate: true,
  })

  const isLoading = computed(() => accountImagesStatus.value === 'pending')
  const hasLoadError = computed(() => accountImagesStatus.value === 'error')
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

    hasLoadError,
    hasLoadMoreError,

    isEmpty,
    hasMore,

    refresh,
    loadMore,
  }
}
