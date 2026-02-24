import { onMounted, ref, useTemplateRef } from '#imports'
import { useInfiniteScroll } from '@vueuse/core'
import { imagesGet } from '~/api/account/imagesGet'
import type { Image } from '~/types/image.model'

export function useImagesGet() {
  const client = useSanctumClient()

  const images = ref<Image[]>([])
  const page = ref(1)
  const hasMore = ref(false)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const scrollArea = useTemplateRef<{ $el?: HTMLElement }>('scrollArea')

  async function fetchImages(targetPage = 1, replace = false) {
    if (replace) {
      isLoading.value = true
    } else {
      isLoadingMore.value = true
    }

    try {
      const res = await imagesGet(client, targetPage)
      const pageImages = res.images ?? []
      const pagination = res.pagination
      images.value = replace ? pageImages : [...images.value, ...pageImages]
      page.value = pagination.page
      hasMore.value = pagination.hasMore
    } catch (error: unknown) {
      if (import.meta.dev) {
        console.error('Images load error', error)
      }
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }

  function resetAndReload() {
    images.value = []
    page.value = 1
    hasMore.value = false
    return fetchImages(1, true)
  }

  function removeImages(ids: number[]) {
    const idsSet = new Set(ids)
    images.value = images.value.filter(image => !idsSet.has(image.id))
  }

  function updateImage(updated: Image) {
    images.value = images.value.map((image) =>
      image.id === updated.id ? { ...image, ...updated } : image
    )
  }

  onMounted(() => {
    fetchImages(1, true)

    useInfiniteScroll(
      () => scrollArea.value?.$el,
      () => {
        if (!hasMore.value || isLoadingMore.value || isLoading.value) return
        return fetchImages(page.value + 1)
      },
      { distance: 200 }
    )
  })

  return {
    images,
    hasMore,
    isLoading,
    isLoadingMore,
    fetchImages,
    resetAndReload,
    removeImages,
    updateImage,
    scrollArea,
  }
}
