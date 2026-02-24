<script setup lang="ts">
import { computed, onBeforeRouteLeave } from '#imports'
import { useEventListener } from '@vueuse/core'
import ImageDeleteModal from '~/components/account/ImageDeleteModal.vue'
import { useImagesDelete } from '~/composables/account/useImagesDelete'
import { useImagesRestore } from '~/composables/account/useImagesRestore'
import { useImagesTrashGet } from '~/composables/account/useImagesTrashGet'
import { useOpenModal } from '~/composables/useOpenModal'
import { provideSelectionStore } from '~/composables/useSelection'
import { useVirtualGridLanes } from '~/composables/useVirtualGridLanes'
import { formatImageDate } from '~/utils/formatImageDate'
import type { DeleteImagesModalResult } from '~/types/image-delete.contract'
import type { Image } from '~/types/image.model'

definePageMeta({
  layout: 'media',
})

const {
  images,
  isLoading,
  removeImages,
  scrollArea,
} = useImagesTrashGet()

const {
  selectedImagesData,
  selectedIds,
  selectionMode,
  hasSelection,
  selectionLabel,
  showClearToggle,
  toggleSelection,
  clearSelection,
  selectImages,
  deselectImages,
} = provideSelectionStore()

const openDeleteModal = useOpenModal<typeof ImageDeleteModal, DeleteImagesModalResult>(ImageDeleteModal)
const { restoreImages, isRestoring } = useImagesRestore()
const { isDeleting } = useImagesDelete()
const { lanes: gridLanes } = useVirtualGridLanes(() => scrollArea.value?.$el, {
  min: 2,
  max: 6,
  targetWidth: 200,
})

const selectableImages = computed(() =>
  images.value.map(image => ({ id: image.id, name: image.name })),
)
const selectedVisibleCount = computed(() =>
  selectableImages.value.reduce(
    (count, image) => count + (selectedImagesData.value[image.id] ? 1 : 0),
    0,
  ),
)
const isAllVisibleSelected = computed(() =>
  selectableImages.value.length > 0
    && selectedVisibleCount.value === selectableImages.value.length,
)
const isVisibleSelectionIndeterminate = computed(() =>
  selectedVisibleCount.value > 0 && !isAllVisibleSelected.value,
)

onBeforeRouteLeave(() => {
  clearSelection()
})

useEventListener(
  () => window,
  'keydown',
  (event) => {
    if (event.key !== 'Escape' || !hasSelection.value) return
    clearSelection()
  },
)

function handleImageSelection(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

function toggleAllVisibleSelection(value: boolean | 'indeterminate') {
  if (value) {
    selectImages(selectableImages.value)
    return
  }

  deselectImages(selectableImages.value.map(image => image.id))
}

async function restoreSelected() {
  const ids = selectedIds.value
  if (!ids.length) return

  const result = await restoreImages(ids)
  if (!result?.restoredIds?.length) return

  removeImages(result.restoredIds)
  clearSelection()
}

async function destroySelected() {
  const ids = selectedIds.value
  const modalResult = await openDeleteModal({ ids })
  if (modalResult.action === 'cancel') return
  if (!modalResult.deletedIds?.length) return

  removeImages(modalResult.deletedIds)
  clearSelection()
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <UAlert
      v-if="hasSelection"
      color="primary"
      variant="solid"
      orientation="horizontal"
      :title="selectionLabel"
      class="my-4"
      :ui="{ title: 'truncate' }"
    >
      <template #leading>
        <UCheckbox
          v-if="showClearToggle"
          :model-value="true"
          color="primary"
          :ui="{ base: 'ring-white/70', indicator: 'bg-white text-primary' }"
          @click.stop
          @update:model-value="clearSelection"
        />
      </template>

      <template #actions>
        <UButton
          icon="i-heroicons-arrow-path-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          :loading="isRestoring"
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
          class="text-white"
          :loading="isDeleting"
          title="Delete permanently"
          @click="destroySelected"
        >
          <span class="hidden sm:inline">Delete permanently</span>
        </UButton>
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          @click="clearSelection"
        />
      </template>
    </UAlert>

    <UPageHeader title="Trash" class="pt-5 pb-4" />
    <UCheckbox
      v-if="!isLoading && images.length > 0"
      :model-value="isAllVisibleSelected"
      :indeterminate="isVisibleSelectionIndeterminate"
      label="Select all"
      class="pb-3"
      @update:model-value="toggleAllVisibleSelection"
    />

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="images.length === 0" description="Trash is empty" size="md" variant="naked" class="py-8" />

      <UScrollArea
        v-else
        ref="scrollArea"
        v-slot="{ item: image }"
        :items="images"
        :virtualize="{ estimateSize: 240, gap: 12, lanes: gridLanes }"
        class="min-h-0 flex-1"
      >
        <UPageCard
          :key="image.id"
          variant="naked"
          class="relative w-full aspect-square overflow-hidden rounded-lg"
          @click="handleImageSelection(image)"
        >
          <img :src="image.previewUrl" :alt="image.name" class="h-full w-full object-cover">

          <div class="absolute inset-x-0 bottom-0 bg-default/85 p-2">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ image.name }}
            </p>
            <p class="text-xs text-muted">
              {{ formatImageDate(image.capturedAt, image.createdAt) }}
            </p>
          </div>

          <UCheckbox
            :model-value="Boolean(selectedImagesData[image.id])"
            color="primary"
            class="absolute top-2 left-2 z-10"
            @click.stop
            @update:model-value="() => toggleSelection(image)"
          />
        </UPageCard>
      </UScrollArea>
    </template>
  </div>
</template>
