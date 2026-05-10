import { ref } from '#imports'
import type { Ref } from 'vue'

export type SelectionId = string | number

export type SelectionState<TId extends SelectionId = number> = {
  selectedIds: Ref<TId[]>
  toggleSelection: (id: TId) => void
  clearSelection: () => void
}

export function useSelection<TId extends SelectionId = number>(): SelectionState<TId> {
  const selectedIds = ref<TId[]>([]) as Ref<TId[]>

  function toggleSelection(id: TId) {
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter(selectedId => selectedId !== id)
      : [...selectedIds.value, id]
  }

  function clearSelection() {
    selectedIds.value = []
  }

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
  }
}
