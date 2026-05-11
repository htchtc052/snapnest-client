import { computed, ref, useLazyAsyncData, watch } from '#imports'
import type { Ref } from 'vue'
import type { Image } from '~/types/image.model'
import {
  useAccountTrashImagesRequest,
  type AccountTrashImagesApiResponse,
} from '../api/useAccountTrashImagesRequest'

export function useAccountTrashImages() {
  const images = ref<Image[]>([]) as Ref<Image[]>

  const { getAccountTrashImages } = useAccountTrashImagesRequest()

  const {
    data: accountTrashImagesPage,
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

  watch(accountTrashImagesPage, (page) => {
    if (!page) return

    images.value = page.images
  }, {
    immediate: true,
  })

  const isLoading = computed(() => accountTrashImagesStatus.value === 'pending')
  const hasLoadError = computed(() => accountTrashImagesStatus.value === 'error')
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
