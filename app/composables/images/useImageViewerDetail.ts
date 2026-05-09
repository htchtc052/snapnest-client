import { ref, watch } from '#imports'
import type { Ref } from 'vue'
import type { ImageDetailContext } from '~/types/image-detail-context.model'

type Options = {
  imageId: Ref<number | null>
  fetchDetail: (imageId: number) => Promise<ImageDetailContext>
}

export function useImageViewerDetail(options: Options) {
  const detail = ref<ImageDetailContext | null>(null)
  const isLoading = ref(false)
  const loadError = ref<unknown | null>(null)
  let currentRequestId = 0

  watch(options.imageId, async currentImageId => {
    currentRequestId += 1
    const requestId = currentRequestId

    loadError.value = null

    if (import.meta.server) {
      detail.value = null
      isLoading.value = false
      return
    }

    if (currentImageId === null) {
      detail.value = null
      isLoading.value = false
      return
    }

    detail.value = null
    isLoading.value = true

    try {
      const nextDetail = await options.fetchDetail(currentImageId)

      if (requestId !== currentRequestId) return

      detail.value = nextDetail
    } catch (error: unknown) {
      if (requestId !== currentRequestId) return

      detail.value = null
      loadError.value = error
      console.error('Image viewer detail load error', error)
    } finally {
      if (requestId === currentRequestId) {
        isLoading.value = false
      }
    }
  }, { immediate: true })

  return {
    detail,
    isLoading,
    loadError,
  }
}
