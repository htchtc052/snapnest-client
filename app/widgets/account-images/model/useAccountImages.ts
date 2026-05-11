import { computed, useLazyAsyncData } from '#imports'
import { useApiQuery } from '~/shared/api'
import type { Image } from '~/types/image.model'
import {
  useAccountImagesRequest,
  type AccountImagesApiResponse,
} from '../api/useAccountImagesRequest'
import {
  appendImages as appendFeedImages,
  removeImagesById as removeFeedImagesById,
  replaceImage as replaceFeedImage,
} from './accountImagesFeedMutations'

export function useAccountImages() {
  const { getAccountImages } = useAccountImagesRequest()

  const {
    data: accountImagesFeed,
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

  const images = computed(() => accountImagesFeed.value.images)
  const isLoading = computed(() => accountImagesStatus.value === 'pending')
  const hasLoadError = computed(() => accountImagesStatus.value === 'error')
  const hasMore = computed(() => accountImagesFeed.value.nextPage !== null)
  const isEmpty = computed(() => {
    return !isLoading.value
      && !hasLoadError.value
      && images.value.length === 0
  })

  async function loadMore() {
    if (accountImagesFeed.value.nextPage === null || isLoadingMore.value) return null

    const page = await loadMoreImagesPage(accountImagesFeed.value.nextPage)
    if (!page) return null

    appendFeedImages(accountImagesFeed.value, page.images)
    accountImagesFeed.value.nextPage = page.nextPage

    return page
  }

  function removeImagesById(ids: number[]) {
    removeFeedImagesById(accountImagesFeed.value, ids)
  }

  function replaceImage(image: Image) {
    replaceFeedImage(accountImagesFeed.value, image)
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
    removeImagesById,
    replaceImage,
  }
}
