import { onMounted, ref, useTemplateRef } from '#imports'
import { imagesTrashGet } from '~/api/account/imagesTrashGet'
import type { Image } from '~/types/image.model'

export function useImagesTrashGet() {
  const client = useSanctumClient()

  const images = ref<Image[]>([])
  const isLoading = ref(true)
  const scrollArea = useTemplateRef<{ $el?: HTMLElement }>('scrollArea')

  async function fetchImages() {
    isLoading.value = true
    try {
      const response = await imagesTrashGet(client)
      images.value = response.images
    } catch (error: unknown) {
      if (import.meta.dev) {
        console.error('Trash images load error', error)
      }
    } finally {
      isLoading.value = false
    }
  }

  function removeImages(ids: number[]) {
    const idsSet = new Set(ids)
    images.value = images.value.filter(image => !idsSet.has(image.id))
  }

  onMounted(() => {
    fetchImages()
  })

  return {
    images,
    isLoading,
    fetchImages,
    removeImages,
    scrollArea,
  }
}
