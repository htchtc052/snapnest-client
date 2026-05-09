import { computed, ref } from '#imports'
import type { ComputedRef, Ref } from 'vue'
import type { Image } from '~/types/image.model'

type SelectAllState = boolean | 'indeterminate'

export type ImageSelectionState = {
  selectedIds: Ref<number[]>
  selectAllState: ComputedRef<SelectAllState>
  selectAll: () => void
  updateAllSelection: (value: boolean | string) => void
  toggleSelection: (imageId: number) => void
  clearSelection: () => void
}

export function useImageSelection(images: Ref<Image[]>): ImageSelectionState {
  const selectedIds = ref<number[]>([])
  const selectAllState = computed<SelectAllState>(() => {
    if (selectedIds.value.length === 0) return false
    if (selectedIds.value.length === images.value.length) return true

    return 'indeterminate'
  })

  function selectAll() {
    selectedIds.value = images.value.map(image => image.id)
  }

  function updateAllSelection(value: boolean | string) {
    if (value) {
      selectAll()
      return
    }

    clearSelection()
  }

  function toggleSelection(imageId: number) {
    selectedIds.value = selectedIds.value.includes(imageId)
      ? selectedIds.value.filter(id => id !== imageId)
      : [...selectedIds.value, imageId]
  }

  function clearSelection() {
    selectedIds.value = []
  }

  return {
    selectedIds,
    selectAllState,
    selectAll,
    updateAllSelection,
    toggleSelection,
    clearSelection,
  }
}
