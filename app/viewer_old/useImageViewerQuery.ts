import { computed, navigateTo, onMounted, ref } from '#imports'

export function useImageViewerQuery() {
  const route = useRoute()
  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  const viewerImageId = computed<number | null>(() => {
    const value = route.query.image

    if (typeof value !== 'string') return null

    const parsedImageId = Number(value)

    return Number.isInteger(parsedImageId) ? parsedImageId : null
  })
  const activeViewerImageId = computed<number | null>(() => isHydrated.value ? viewerImageId.value : null)
  const isViewerOpen = computed(() => activeViewerImageId.value !== null)

  async function openImageViewer(imageId: number) {
    await navigateTo({
      path: route.path,
      query: {
        ...route.query,
        image: String(imageId),
      },
    })
  }

  async function closeImageViewer() {
    const nextQuery = { ...route.query }
    delete nextQuery.image

    await navigateTo({
      path: route.path,
      query: nextQuery,
    }, { replace: true })
  }

  return {
    activeViewerImageId,
    isViewerOpen,
    openImageViewer,
    closeImageViewer,
  }
}
