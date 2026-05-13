import { computed, ref } from '#imports'
import type { ComputedRef, Ref } from 'vue'

export type ImageSelectionId = number

export type ImageSelectionState = {
  selectedIds: Ref<ImageSelectionId[]>
  selectedCount: ComputedRef<number>
  selectedImageId: ComputedRef<ImageSelectionId | null>
}

export type ImageSelectionMode = {
  isSelectionMode: ComputedRef<boolean>
  isSingleSelection: ComputedRef<boolean>
}

export type ImageSelection = {
  state: ImageSelectionState
  mode: ImageSelectionMode
  isSelected: (imageId: ImageSelectionId) => boolean
  toggle: (imageId: ImageSelectionId) => void
  clear: () => void
  clearOnEscape: (event: KeyboardEvent) => void
}

export function useImageSelection(): ImageSelection {
  const selectedIds = ref<ImageSelectionId[]>([])

  const selectedCount = computed(() => selectedIds.value.length)
  const selectedImageId = computed(() => {
    return selectedIds.value.length === 1 ? (selectedIds.value[0] ?? null) : null
  })
  const isSelectionMode = computed(() => selectedCount.value > 0)
  const isSingleSelection = computed(() => selectedCount.value === 1)

  function isSelected(imageId: ImageSelectionId) {
    return selectedIds.value.includes(imageId)
  }

  function toggle(imageId: ImageSelectionId) {
    selectedIds.value = isSelected(imageId)
      ? selectedIds.value.filter(selectedId => selectedId !== imageId)
      : [...selectedIds.value, imageId]
  }

  function clear() {
    selectedIds.value = []
  }

  function clearOnEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !isSelectionMode.value) return

    clear()
  }

  return {
    state: {
      selectedIds,
      selectedCount,
      selectedImageId,
    },
    mode: {
      isSelectionMode,
      isSingleSelection,
    },
    isSelected,
    toggle,
    clear,
    clearOnEscape,
  }
}
