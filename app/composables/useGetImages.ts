import { useEventListener, useInfiniteScroll } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from '#imports'
import { getImages } from '~/api/images/getImages'
import type { Image } from '~/models/Image'

type GroupBy = 'day' | 'month' | 'year'
type ImageGroup = {
  key: string
  label: string
  timelineLabel: string
  items: Image[]
}
type ScrollToIndex = (
  target: number,
  options?: { align?: 'start' | 'center' | 'end' | 'auto' },
) => void
type VirtualItemLike = { index: number }
type VirtualizerLike = {
  scrollToIndex?: ScrollToIndex
  measure?: () => void
  getVirtualItems?: () => VirtualItemLike[]
  getVirtualItemForOffset?: (offset: number) => VirtualItemLike | undefined
  range?: { startIndex: number }
  scrollOffset?: number | null
}
type ScrollAreaLike = {
  $el?: HTMLElement
  virtualizer?: { value?: VirtualizerLike } | VirtualizerLike
}

export function useGetImages() {
  const client = useSanctumClient()

  const images = ref<Image[]>([])
  const nextCursor = ref<string | null>(null)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const grouping = ref<GroupBy>('day')
  const activeGroupIndex = ref(0)
  let activeUpdateRaf = 0

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
  const timelineDayFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const timelineMonthFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  })
  const timelineYearFormatter = new Intl.DateTimeFormat('en-US', {
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
      const timelineLabel =
        mode === 'day'
          ? timelineDayFormatter.format(new Date(`${key}T00:00:00`))
          : mode === 'month'
            ? timelineMonthFormatter.format(new Date(`${key}-01T00:00:00`))
            : timelineYearFormatter.format(new Date(`${key}-01-01T00:00:00`))
      result.push({
        key,
        label,
        timelineLabel,
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
      const res = await getImages(client, cursor)
      const entries = res.entries ?? []
      images.value = replace ? entries : [...images.value, ...entries]
      nextCursor.value = res.nextCursor ?? null
      await nextTick()
      resolveVirtualizer(scrollArea.value as ScrollAreaLike | HTMLElement | null)?.measure?.()
      scheduleActiveUpdate()
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
    if (!ids.length) return
    const idsSet = new Set(ids)
    images.value = images.value.filter(image => !idsSet.has(image.id))
  }

  function resolveVirtualizer(instance: ScrollAreaLike | HTMLElement | null) {
    if (!instance) return null
    if (typeof HTMLElement !== 'undefined' && instance instanceof HTMLElement) return null
    const virtualizerRef = (instance as ScrollAreaLike).virtualizer
    if (!virtualizerRef) return null
    if (typeof virtualizerRef === 'object' && 'value' in virtualizerRef) {
      return (virtualizerRef as { value?: VirtualizerLike }).value ?? null
    }
    return virtualizerRef as VirtualizerLike
  }

  function resolveScrollEl(instance: ScrollAreaLike | HTMLElement | null) {
    if (!instance) return null
    if (typeof HTMLElement !== 'undefined' && instance instanceof HTMLElement) {
      return instance
    }
    return (instance as ScrollAreaLike).$el ?? null
  }

  function updateActiveIndex() {
    const instance = scrollArea.value as ScrollAreaLike | HTMLElement | null
    const virtualizer = resolveVirtualizer(instance)
    const rootEl = resolveScrollEl(instance)
    const offset = virtualizer?.scrollOffset ?? rootEl?.scrollTop ?? 0
    const target = virtualizer?.getVirtualItemForOffset?.(offset + 1)
    if (target?.index !== undefined) {
      activeGroupIndex.value = target.index
      return
    }
    const virtualItems = virtualizer?.getVirtualItems?.()
    if (virtualItems?.length) {
      activeGroupIndex.value = virtualItems[0].index
      return
    }
    if (virtualizer?.range && Number.isFinite(virtualizer.range.startIndex)) {
      activeGroupIndex.value = virtualizer.range.startIndex
    }
  }

  function scheduleActiveUpdate() {
    if (typeof requestAnimationFrame === 'undefined') {
      updateActiveIndex()
      return
    }
    if (activeUpdateRaf) return
    activeUpdateRaf = requestAnimationFrame(() => {
      activeUpdateRaf = 0
      updateActiveIndex()
    })
  }

  function scrollToGroup(index: number) {
    const instance = scrollArea.value as ScrollAreaLike | HTMLElement | null
    if (!instance) return

    const virtualizer = resolveVirtualizer(instance)
    if (virtualizer?.scrollToIndex) {
      virtualizer.scrollToIndex(index, { align: 'start' })
      return
    }

    const rootEl = resolveScrollEl(instance)
    if (!rootEl) return
    const target = rootEl.querySelector(
      `[data-group-index="${index}"]`,
    ) as HTMLElement | null
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  useEventListener(
    () => resolveScrollEl(scrollArea.value as ScrollAreaLike | HTMLElement | null),
    'scroll',
    () => scheduleActiveUpdate(),
  )

  watch(
    () => groups.value.length,
    async (length) => {
      if (length === 0) {
        activeGroupIndex.value = 0
        return
      }
      await nextTick()
      resolveVirtualizer(scrollArea.value as ScrollAreaLike | HTMLElement | null)?.measure?.()
      scheduleActiveUpdate()
    },
  )

  watch(grouping, async () => {
    if (groups.value.length === 0) return
    await nextTick()
    scheduleActiveUpdate()
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
    scrollToGroup,
    activeGroupIndex,
    scrollArea,
  }
}
