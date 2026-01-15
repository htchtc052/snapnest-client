import { computed, inject, provide, ref, type InjectionKey } from 'vue'

export type SelectionId = number
export type SelectionImage = {
  id: SelectionId
  name?: string
}

function createSelectionStore() {
  const selectedImagesData = ref<Record<SelectionId, SelectionImage>>({})
  const forceSelectionMode = ref(false)

  const selectionMode = computed(
    () => forceSelectionMode.value || Object.keys(selectedImagesData.value).length > 0,
  )
  const hasSelection = computed(() => Object.keys(selectedImagesData.value).length > 0)
  const selectedIds = computed(() =>
    Object.keys(selectedImagesData.value).map(id => Number(id)),
  )

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

  function enableSelectionMode() {
    forceSelectionMode.value = true
  }

  function cancelSelectionMode() {
    forceSelectionMode.value = false
  }

  function clearSelection() {
    selectedImagesData.value = {}
    forceSelectionMode.value = false
  }

  function toggleSelection(image: SelectionImage) {
    const isSelected = image.id in selectedImagesData.value
    if (isSelected) {
      removeSelectedImage(image.id)
      return
    }

    upsertSelectedImage(image)
  }

  function selectImages(images: SelectionImage[]) {
    if (images.length === 0) return
    const updated = { ...selectedImagesData.value }
    images.forEach((image) => {
      updated[image.id] = { id: image.id, name: image.name }
    })
    selectedImagesData.value = updated
  }

  function deselectImages(images: SelectionImage[]) {
    deselectIds(images.map(image => image.id))
  }

  function deselectIds(ids: SelectionId[]) {
    if (ids.length === 0) return
    const idsSet = new Set(ids)
    const updated = Object.fromEntries(
      Object.entries(selectedImagesData.value).filter(([id]) => !idsSet.has(Number(id))),
    ) as Record<SelectionId, SelectionImage>
    selectedImagesData.value = updated
  }



  function groupSelectionValue(images: SelectionImage[]): boolean | 'indeterminate' {
    const total = images.length
    if (total === 0) return false
    const selectedCount = images.reduce(
      (count, image) => count + (selectedImagesData.value[image.id] ? 1 : 0),
      0,
    )
    if (selectedCount === 0) return false
    if (selectedCount === total) return true
    return 'indeterminate'
  }

  function toggleGroupSelection(images: SelectionImage[]) {
    const state = groupSelectionValue(images)
    if (state === true) {
      deselectImages(images)
      return
    }
    selectImages(images)
  }

  return {
    selectedImagesData,
    selectedIds,
    selectionMode,
    hasSelection,
    enableSelectionMode,
    cancelSelectionMode,
    clearSelection,
    toggleSelection,
    selectImages,
    deselectImages,
    deselectIds,
    groupSelectionValue,
    toggleGroupSelection,
  }
}

export type SelectionStore = ReturnType<typeof createSelectionStore>

const SelectionKey: InjectionKey<SelectionStore> = Symbol('SelectionStore')
let fallbackStore: SelectionStore | null = null

function getSelectionStore(): SelectionStore {
  if (!fallbackStore) {
    fallbackStore = createSelectionStore()
  }
  return fallbackStore
}

export function provideSelectionStore() {
  const store = getSelectionStore()
  provide(SelectionKey, store)
  return store
}

export function useSelectionStore() {
  return inject(SelectionKey, null) ?? getSelectionStore()
}
