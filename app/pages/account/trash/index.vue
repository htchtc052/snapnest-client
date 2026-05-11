<script setup lang="ts">
import ImageOwnerCollectionGrid from '~/components/widgets/ImageOwnerCollectionGrid.vue'
import { removeImagesFromCollection } from '~/composables/images/useImageCollection'
import { useImageTrashActions } from '~/features/image-trash-actions'
import { useSelection, type SelectionAction } from '~/shared/selection'
import SelectionBar from '~/shared/selection/ui/SelectionBar.vue'
import { useAccountTrashImages } from '~/widgets/account-trash-images'

definePageMeta({
  layout: 'media',
})

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
} = useAccountTrashImages()
const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useSelection()

const isSelectionMode = computed(() => selectedIds.value.length > 0)

const {
  deleteImages,
  isDeletingImages,
  isRestoringImages,
  restoreImages,
} = useImageTrashActions()
const selectionActions = computed<SelectionAction[]>(() => [
  {
    key: 'restore',
    label: 'Restore',
    icon: 'i-heroicons-arrow-path-20-solid',
    loading: isRestoringImages.value,
  },
  {
    key: 'delete',
    label: 'Delete permanently',
    icon: 'i-heroicons-trash-20-solid',
    loading: isDeletingImages.value,
  },
])

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

async function restoreSelected() {
  const restoredIds = await restoreImages(selectedIds.value)
  if (!restoredIds) return

  images.value = removeImagesFromCollection(images.value, restoredIds)
  clearSelection()
}

async function trashSelected() {
  const deletedIds = await deleteImages(selectedIds.value)
  if (!deletedIds) return

  images.value = removeImagesFromCollection(images.value, deletedIds)
  clearSelection()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || selectedIds.value.length === 0) return

  clearSelection()
}

function handleSelectionAction(actionKey: string) {
  switch (actionKey) {
    case 'restore':
      void restoreSelected()
      break

    case 'delete':
      void trashSelected()
      break
  }
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <div class="mt-4">
      <SelectionBar
        v-if="isSelectionMode"
        :selected-count="selectedIds.length"
        :actions="selectionActions"
        @clear="clearSelection"
        @action="handleSelectionAction"
      />
    </div>

    <div class="flex items-start gap-3 pt-5 pb-4">
      <h1 class="text-4xl font-bold tracking-tight text-highlighted">
        Trash
      </h1>
    </div>


    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load trash" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="Trash is empty" size="md" variant="naked" class="py-8" />

      <ImageOwnerCollectionGrid
        v-else
        :images="images"
        :selected-ids="selectedIds"
        :selection-mode="isSelectionMode"
        :can-open="false"
        @toggle-selection="toggleSelection"
      />
    </template>
  </div>
</template>
