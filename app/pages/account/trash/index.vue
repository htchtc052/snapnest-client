<script setup lang="ts">
import { imagesTrashGet } from '~/api/account/imagesTrashGet'
import SelectionBar from '~/components/ui/SelectionBar.vue'
import ImageOwnerCollectionGrid from '~/components/widgets/ImageOwnerCollectionGrid.vue'
import { removeImagesFromCollection, useImageCollection } from '~/composables/images/useImageCollection'
import { useImageTrashActions } from '~/features/image-trash-actions'
import { useSelection } from '~/shared/selection'

definePageMeta({
  layout: 'media',
})

const client = useSanctumClient()
const {
  images,
  isLoading,
  loadError,
  loadInitial,
} = useImageCollection(() => imagesTrashGet(client))
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

onMounted(() => {
  void loadInitial()
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
</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <div class="mt-4">
      <SelectionBar v-if="isSelectionMode" @clear="clearSelection">
        <div class="flex min-w-0 flex-1 items-center justify-between gap-3">
          <span class="truncate text-base font-medium sm:text-lg">
            {{ selectedIds.length === 1 ? '1 selected' : `${selectedIds.length} selected` }}
          </span>

          <div class="flex shrink-0 items-center gap-1">
            <UButton
              icon="i-heroicons-arrow-path-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              :loading="isRestoringImages"
              title="Restore"
              @click="restoreSelected"
            >
              <span class="hidden sm:inline">Restore</span>
            </UButton>

            <UButton
              icon="i-heroicons-trash-20-solid"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              title="Delete permanently"
              :loading="isDeletingImages"
              @click="trashSelected"
            >
              <span class="hidden sm:inline">Delete permanently</span>
            </UButton>
          </div>
        </div>
      </SelectionBar>
    </div>

    <div class="flex items-start gap-3 pt-5 pb-4">
      <h1 class="text-4xl font-bold tracking-tight text-highlighted">
        Trash
      </h1>
    </div>


    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="loadError" description="Unable to load trash" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="images.length === 0" description="Trash is empty" size="md" variant="naked" class="py-8" />

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
