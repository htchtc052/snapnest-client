import { computed, inject, provide, ref, type InjectionKey } from 'vue'

export type SelectionId = number
export type SelectionImage = {
  id: SelectionId
  name?: string
}

function createSelectionStore() {
  const selectedImagesData = ref<Record<SelectionId, SelectionImage>>({})
  const selectionMode = computed(() => Object.keys(selectedImagesData.value).length > 0)
  const hasSelection = computed(() => Object.keys(selectedImagesData.value).length > 0)
  const selectedIds = computed(() =>
    Object.keys(selectedImagesData.value).map(id => Number(id)),
  )
  const selectedCount = computed(() => selectedIds.value.length)
  const showClearToggle = computed(() => selectedCount.value > 1)
  const canRename = computed(() => selectedCount.value === 1)
  const selectionLabel = computed(() => {
    if (selectedCount.value === 1) {
      const selectedId = selectedIds.value[0]
      return selectedId ? selectedImagesData.value[selectedId]?.name ?? '1 selected' : '1 selected'
    }
    return `${selectedCount.value} selected`
  })

  function upsertSelectedImage(image: SelectionImage) {
    selectedImagesData.value = {
      ...selectedImagesData.value,
      [image.id]: { id: image.id, name: image.name },
    }
  }

  function removeSelectedImage(id: SelectionId) {
    if (!(id in selectedImagesData.value)) return
    const { [id]: _removed, ...rest } = selectedImagesData.value
    selectedImagesData.value = rest
  }

  function clearSelection() {
    selectedImagesData.value = {}
  }

  function selectImages(images: SelectionImage[]) {
    if (!images.length) return
    const next = { ...selectedImagesData.value }
    for (const image of images) {
      next[image.id] = { id: image.id, name: image.name }
    }
    selectedImagesData.value = next
  }

  function deselectImages(ids: SelectionId[]) {
    if (!ids.length) return
    const idsToRemove = new Set(ids.map(id => String(id)))
    selectedImagesData.value = Object.fromEntries(
      Object.entries(selectedImagesData.value).filter(([id]) => !idsToRemove.has(id)),
    ) as Record<SelectionId, SelectionImage>
  }

  function toggleSelection(image: SelectionImage) {
    const isSelected = image.id in selectedImagesData.value
    if (isSelected) {
      removeSelectedImage(image.id)
      return
    }

    upsertSelectedImage(image)
  }

  return {
    selectedImagesData,
    selectedIds,
    selectedCount,
    selectionLabel,
    showClearToggle,
    canRename,
    selectionMode,
    hasSelection,
    clearSelection,
    selectImages,
    deselectImages,
    toggleSelection,
  }
}

export type SelectionStore = ReturnType<typeof createSelectionStore>

const SelectionKey: InjectionKey<SelectionStore> = Symbol('SelectionStore')

export function provideSelectionStore() {
  const store = createSelectionStore()
  provide(SelectionKey, store)
  return store
}

export function useSelectionStore() {
  const store = inject(SelectionKey, null)
  if (!store) {
    throw new Error('SelectionStore is not provided')
  }
  return store
}
