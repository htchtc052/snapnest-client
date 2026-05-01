import { computed, ref } from '#imports'
import type { Image } from '~/types/image.model'

type ImageCollectionResponse = {
  images: Image[]
  nextPage: number | null
}

export function replaceImageInCollection(images: Image[], updatedImage: Image) {
  return images.map(image =>
    image.id === updatedImage.id ? { ...image, ...updatedImage } : image,
  )
}

export function removeImagesFromCollection(images: Image[], ids: number[]) {
  const idsSet = new Set(ids)

  return images.filter(image => !idsSet.has(image.id))
}

export function useImageCollection(
  fetchPage: (page?: number | null) => Promise<ImageCollectionResponse>,
) {
  const images = ref<Image[]>([])
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const loadError = ref<unknown | null>(null)
  const nextPage = ref<number | null>(null)

  const hasMore = computed(() => nextPage.value !== null)

  async function loadPage(page?: number | null) {
    const isLoadMoreRequest = page !== undefined && page !== null

    if (isLoadMoreRequest) {
      if (isLoadingMore.value) return
      isLoadingMore.value = true
    } else {
      isLoading.value = true
      loadError.value = null
    }

    try {
      const data = await fetchPage(page)

      nextPage.value = data.nextPage
      images.value = isLoadMoreRequest
        ? [...images.value, ...data.images]
        : data.images

      return data
    } catch (error) {
      if (!isLoadMoreRequest) {
        loadError.value = error
      }

      console.error('Image collection load error', error)
    } finally {
      if (isLoadMoreRequest) {
        isLoadingMore.value = false
      } else {
        isLoading.value = false
      }
    }
  }

  async function loadInitial() {
    return loadPage()
  }

  async function loadMore() {
    if (nextPage.value == null) return

    return loadPage(nextPage.value)
  }

  return {
    images,
    isLoading,
    isLoadingMore,
    loadError,
    hasMore,
    loadInitial,
    loadMore,
  }
}
