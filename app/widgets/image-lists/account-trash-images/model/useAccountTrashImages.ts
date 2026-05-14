import { computed, useLazyAsyncData } from '#imports'
import { removeImagesById as removeImagesByIdFromCollection } from '~/entities/image'
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
    removeImagesByIdFromCollection(accountTrashImagesResponse.value.images, ids)
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
