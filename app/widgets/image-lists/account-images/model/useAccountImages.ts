import { computed, useLazyAsyncData } from '#imports'
import { useApiQuery } from '~/shared/api'
import {
  appendImages,
  removeImagesById as removeImagesByIdFromCollection,
  replaceImageById,
  type Image,
} from '~/entities/image'
import {
  useAccountImagesRequest,
  type AccountImagesApiResponse,
} from '../api/useAccountImagesRequest'

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

    appendImages(accountImagesFeed.value.images, page.images)
    accountImagesFeed.value.nextPage = page.nextPage

    return page
  }

  function removeImagesById(ids: number[]) {
    removeImagesByIdFromCollection(accountImagesFeed.value.images, ids)
  }

  function replaceImage(image: Image) {
    replaceImageById(accountImagesFeed.value.images, image)
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
