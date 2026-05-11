import { computed, useLazyAsyncData } from '#imports'
import {
  useAccountTrashImagesRequest,
  type AccountTrashImagesApiResponse,
} from '../api/useAccountTrashImagesRequest'

export function useAccountTrashImages() {
  const { getAccountTrashImages } = useAccountTrashImagesRequest()

  const {
    data: accountTrashImagesResponse,
    status: accountTrashImagesStatus,
    refresh,
  } = useLazyAsyncData<AccountTrashImagesApiResponse>(
    'account-trash-images',
    () => getAccountTrashImages(),
    {
      server: false,
      default: () => ({
        images: [],
      }),
    },
  )

  const images = computed(() => accountTrashImagesResponse.value.images)

  const isLoading = computed(() => accountTrashImagesStatus.value === 'pending')
  const hasLoadError = computed(() => accountTrashImagesStatus.value === 'error')
  const isEmpty = computed(() => {
    return !isLoading.value
      && !hasLoadError.value
      && images.value.length === 0
  })

  function removeImagesById(ids: number[]) {
    const idsSet = new Set(ids)
    const images = accountTrashImagesResponse.value.images

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
