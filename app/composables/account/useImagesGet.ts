import { computed, onMounted, ref, useTemplateRef } from '#imports'
import { useInfiniteScroll } from '@vueuse/core'
import { imagesGet } from '~/api/account/imagesGet'
import type { Image } from '~/types/image.model'

type GroupBy = 'day' | 'month' | 'year'
type ImageGroup = {
  key: string
  label: string
  items: Image[]
}

export function useImagesGet() {
  const client = useSanctumClient()

  const images = ref<Image[]>([])
  const nextCursor = ref<string | null>(null)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const grouping = ref<GroupBy>('day')

  const scrollArea = useTemplateRef('scrollArea')

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  })
  const yearFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  })
  const groups = computed<ImageGroup[]>(() => {
    const result: ImageGroup[] = []
    images.value.forEach((image) => {
      const [datePart] = image.capturedAt.split(' ')
      const [year, month, day] = datePart.split('-')
      const mode = grouping.value
      const key =
        mode === 'day'
          ? `${year}-${month}-${day}`
          : mode === 'month'
            ? `${year}-${month}`
            : year
      const last = result[result.length - 1]
      if (last && last.key === key) {
        last.items.push(image)
        return
      }
      const label =
        mode === 'day'
          ? dayFormatter.format(new Date(`${key}T00:00:00`))
          : mode === 'month'
            ? monthFormatter.format(new Date(`${key}-01T00:00:00`))
            : yearFormatter.format(new Date(`${key}-01-01T00:00:00`))
      result.push({
        key,
        label,
        items: [image],
      })
    })
    return result
  })

  async function loadImages(cursor?: string, replace = false) {
    if (replace) {
      isLoading.value = true
    } else {
      isLoadingMore.value = true
    }

    try {
      const res = await imagesGet(client, cursor)
      const entries = res.entries ?? []
      images.value = replace ? entries : [...images.value, ...entries]
      nextCursor.value = res.nextCursor ?? null
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
    nextCursor.value = null
    return loadImages(undefined, true)
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
    loadImages(undefined, true)

    useInfiniteScroll(
      () => scrollArea.value?.$el as HTMLElement | undefined,
      () => {
        if (!nextCursor.value || isLoadingMore.value || isLoading.value) return
        return loadImages(nextCursor.value)
      },
      { distance: 200 }
    )
  })

  return {
    images,
    groups,
    grouping,
    nextCursor,
    isLoading,
    isLoadingMore,
    loadImages,
    resetAndReload,
    removeImages,
    updateImage,
    scrollArea,
  }
}
