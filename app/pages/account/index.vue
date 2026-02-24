<script setup lang="ts">
import { computed, onBeforeRouteLeave, ref, watch } from '#imports'
import { useEventListener } from '@vueuse/core'
import AlbumSelectForImages from '~/components/account/AlbumSelectForImages.vue'
import ImageTrashModal from '~/components/account/ImageTrashModal.vue'
import ImageShareModal from '~/components/account/ImageShareModal.vue'
import ImageUpdateModal from '~/components/account/ImageUpdateModal.vue'
import { useImagesGet } from '~/composables/account/useImagesGet'
import { useOpenModal } from '~/composables/useOpenModal'
import { provideSelectionStore } from '~/composables/useSelection'
import { useVirtualGridLanes } from '~/composables/useVirtualGridLanes'
import { useUploadsStore } from '~/stores/uploadsStore'
import { formatImageDate } from '~/utils/formatImageDate'
import type { AttachImagesModalResult } from '~/types/image-attach.contract'
import type { ImageShareModalResult } from '~/types/image-share.contract'
import type { TrashImagesModalResult } from '~/types/image-trash.contract'
import type { ImageUpdateModalResult } from '~/types/image-update.contract'
import type { Image } from '~/types/image.model'

definePageMeta({
  layout: 'media',
})

const {
  images,
  isLoading,
  isLoadingMore,
  resetAndReload,
  removeImages,
  updateImage,
  scrollArea,
} = useImagesGet()
const uploadsStore = useUploadsStore()
const hasUploadRefresh = ref(false)

const {
  selectedImagesData,
  selectedIds,
  selectionMode,
  hasSelection,
  selectionLabel,
  showClearToggle,
  canRename,
  toggleSelection,
  clearSelection,
  selectImages,
  deselectImages,
} = provideSelectionStore()

const openAttachModal = useOpenModal<typeof AlbumSelectForImages, AttachImagesModalResult>(AlbumSelectForImages)
const openTrashModal = useOpenModal<typeof ImageTrashModal, TrashImagesModalResult>(ImageTrashModal)
const openShareModal = useOpenModal<typeof ImageShareModal, ImageShareModalResult>(ImageShareModal)
const openUpdateModal = useOpenModal<typeof ImageUpdateModal, ImageUpdateModalResult>(ImageUpdateModal)
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

watch(() => uploadsStore.isDone, (done) => {
  if (!done) {
    hasUploadRefresh.value = false
    return
  }
  if (hasUploadRefresh.value) return
  hasUploadRefresh.value = true
  resetAndReload()
})

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

async function confirmDelete() {
  const ids = selectedIds.value
  const modalResult = await openTrashModal({ ids })
  if (modalResult.action === 'cancel') return
  if (modalResult.trashedIds?.length) {
    clearSelection()
    removeImages(modalResult.trashedIds)
  }
}

async function renameImage() {
  const modalResult = await openUpdateModal({
    image: selectedImagesData.value[selectedIds.value[0]!] as Image,
  })
  if (modalResult.action === 'cancel') return
  clearSelection()
  updateImage(modalResult.image)

}

async function addToAlbum() {
  const ids = selectedIds.value
  const modalResult = await openAttachModal({ imageIds: ids })
  if (modalResult.action === 'cancel') return
  clearSelection()
}

async function shareImages() {
  const ids = selectedIds.value
  if (!ids.length) return
  const modalResult = await openShareModal({ imageIds: ids })
  if (modalResult.action === 'cancel') return
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
          icon="i-heroicons-folder-plus-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Add to album"
          @click="addToAlbum"
        >
          <span class="hidden sm:inline">Add to album</span>
        </UButton>
        <UButton
          icon="i-heroicons-link-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Share"
          @click="shareImages"
        >
          <span class="hidden sm:inline">Share</span>
        </UButton>
        <UButton
          v-if="canRename"
          icon="i-heroicons-pencil-square-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Rename"
          @click="renameImage"
        >
          <span class="hidden sm:inline">Rename</span>
        </UButton>
        <UButton
          icon="i-heroicons-trash-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Move to trash"
          @click="confirmDelete"
        >
          <span class="hidden sm:inline">Move to trash</span>
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

    <UPageHeader title="Photos" class="pt-5 pb-4" />
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
      <UEmpty v-if="images.length === 0" description="No images yet" size="md" variant="naked" class="py-8" />

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

      <UProgress v-if="isLoadingMore" indeterminate size="xs" class="py-2" />
    </template>
  </div>
</template>
