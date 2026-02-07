<script setup lang="ts">
import { computed, onBeforeRouteLeave, onMounted, useTemplateRef } from '#imports'
import { useEventListener } from '@vueuse/core'
import { useAccountAlbumWithImagesGet } from '~/composables/account/useAccountAlbumWithImagesGet'
import { useAlbumDetachImages } from '~/composables/account/useAlbumDetachImages'
import { provideSelectionStore } from '~/composables/useSelection'
import { useVirtualGridLanes } from '~/composables/useVirtualGridLanes'
import type { Image } from '~/types/image.model'
import { isNumericParam } from '~/utils/isNumericParam'

definePageMeta({
  layout: 'media',
  validate: route =>
    isNumericParam(route.params.id),
})

const route = useRoute()
const albumId = computed(() => Number(route.params.id))

const {
  album,
  images,
  isLoading,
  loadAlbum,
  removeImages,
} = useAccountAlbumWithImagesGet(albumId.value)
const { detachImages, isDetaching } = useAlbumDetachImages()

const {
  selectedIds,
  selectedImagesData,
  selectionLabel,
  selectionMode,
  hasSelection,
  toggleSelection,
  clearSelection,
} = provideSelectionStore()

const scrollArea = useTemplateRef('scrollArea')
const { lanes: gridLanes } = useVirtualGridLanes(() => scrollArea.value?.$el, {
  min: 2,
  max: 6,
  targetWidth: 200,
})

function handleImageSelection(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

async function removeSelectedFromAlbum() {
  const ids = selectedIds.value
  if (!ids.length || isDetaching.value) return
  const ok = await detachImages(albumId.value, ids)
  if (!ok) return
  removeImages(ids)
  clearSelection()
}

onMounted(async () => {
  await loadAlbum()
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
      <template #actions>
        <UButton
          icon="i-heroicons-minus-circle-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Remove from album"
          @click="removeSelectedFromAlbum"
        >
          <span class="hidden sm:inline">Remove from album</span>
        </UButton>
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white"
          title="Close"
          @click="clearSelection"
        />
      </template>
    </UAlert>

    <div class="flex items-center gap-3 pt-5 pb-4">
      <UButton to="/account/albums" color="neutral" variant="ghost" icon="i-lucide-arrow-left" square />
      <USkeleton v-if="isLoading" class="h-7 w-48" />
      <h3 v-else class="text-2xl font-semibold text-foreground">
        {{ album?.name }}
      </h3>
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="images.length === 0" description="No images yet" size="md" variant="naked" class="py-8" />

      <UScrollArea
        v-else
        ref="scrollArea"
        v-slot="{ item: image }"
        :items="images"
        :virtualize="{ estimateSize: 220, gap: 12, lanes: gridLanes }"
        class="min-h-0 flex-1"
      >
        <UPageCard
          :key="image.id"
          variant="naked"
          class="relative w-full aspect-square overflow-hidden rounded-lg"
          @click="handleImageSelection(image)"
        >
          <img :src="image.previewUrl" :alt="image.name" class="h-full w-full object-cover">

          <UCheckbox
            :model-value="Boolean(selectedImagesData[image.id])"
            color="primary"
            class="absolute bottom-2 left-2 z-10"
            @click.stop
            @update:model-value="() => toggleSelection(image)"
          />
        </UPageCard>
      </UScrollArea>

    </template>
  </div>
</template>
