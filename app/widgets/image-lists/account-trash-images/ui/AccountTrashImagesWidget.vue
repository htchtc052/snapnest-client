<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from '#imports'
import { useWindowSize } from '@vueuse/core'
import { ImageCard } from '~/entities/image'
import { useImageTrashActions } from '~/features/image/image-trash-actions'
import { useSelection, type SelectionAction } from '~/shared/selection'
import SelectionBar from '~/shared/selection/ui/SelectionBar.vue'
import { useAccountTrashImages } from '../model/useAccountTrashImages'

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
  removeImagesById,
} = useAccountTrashImages()

const {
  selectedIds,
  toggleSelection,
  clearSelection,
} = useSelection()

const {
  deleteImages,
  isDeletingImages,
  isRestoringImages,
  restoreImages,
} = useImageTrashActions()

const isSelectionMode = computed(() => selectedIds.value.length > 0)
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

const { width } = useWindowSize()
const lanes = computed(() => {
  return width.value < 640 ? 3 : 4
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleCardClick(imageId: number) {
  if (!isSelectionMode.value) return

  toggleSelection(imageId)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || selectedIds.value.length === 0) return

  clearSelection()
}

async function restoreSelected() {
  const restoredIds = await restoreImages(selectedIds.value)
  if (!restoredIds) return

  removeImagesById(restoredIds)
  clearSelection()
}

async function deleteSelected() {
  const deletedIds = await deleteImages(selectedIds.value)
  if (!deletedIds) return

  removeImagesById(deletedIds)
  clearSelection()
}

function handleSelectionAction(actionKey: string) {
  switch (actionKey) {
    case 'restore':
      void restoreSelected()
      break

    case 'delete':
      void deleteSelected()
      break
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="isSelectionMode" class="mb-4">
      <SelectionBar
        :selected-count="selectedIds.length"
        :actions="selectionActions"
        @clear="clearSelection"
        @action="handleSelectionAction"
      />
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load trash" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="Trash is empty" size="md" variant="naked" class="py-8" />

      <div v-else class="relative flex min-h-0 flex-1 flex-col">
        <UScrollArea
          v-slot="{ item: image }"
          :items="images"
          :virtualize="{ estimateSize: 240, gap: 12, lanes }"
          class="min-h-0 flex-1"
        >
          <div class="relative">
            <ImageCard :image="image" />

            <button
              type="button"
              class="absolute inset-0 z-0 block w-full rounded-lg text-left disabled:cursor-default"
              :disabled="!isSelectionMode"
              :aria-label="isSelectionMode ? `Select ${image.name}` : image.name"
              @click="handleCardClick(image.id)"
            />

            <UCheckbox
              :model-value="selectedIds.includes(image.id)"
              color="primary"
              class="absolute top-2 left-2 z-10"
              @click.stop
              @update:model-value="toggleSelection(image.id)"
            />
          </div>
        </UScrollArea>
      </div>
    </template>
  </div>
</template>
