<script setup lang="ts">
import ImagePreview from '~/components/image/ImagePreview.vue'
import SelectableItemCheckbox from '~/components/ui/primitives/SelectableItemCheckbox.vue'
import { useSelectionStore } from '~/composables/useSelection'
import type { Image } from '~/models/Image'

const props = withDefaults(
  defineProps<{
    images: Image[]
    isLoadingInitial?: boolean
    isLoadingMore?: boolean
    hasMore?: boolean
  }>(),
  {
    isLoadingInitial: false,
    isLoadingMore: false,
    hasMore: false,
  },
)

const { selectedImagesData, selectionMode, toggleSelection } = useSelectionStore()

function handleCardClick(image: Image) {
  if (!selectionMode.value) return
  toggleSelection(image)
}

const emit = defineEmits<{
  loadMore: []
}>()
</script>

<template>
  <USkeleton v-if="props.isLoadingInitial" class="h-6 w-full" />

  <div v-else-if="!props.images.length" class="text-center">
    No images yet
  </div>

  <div v-else>
    <div class="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
      <div
        v-for="image in props.images"
        :key="image.id"
        class="group relative"
        :class="selectedImagesData[image.id] ? 'ring-2 ring-primary/40' : ''"
        @click="handleCardClick(image)"
      >
        <ImagePreview :image="image" />
        <div
          class="absolute bottom-2 left-2 z-10"
          :class="selectionMode ? 'opacity-100' : 'hidden sm:block sm:opacity-0 sm:group-hover:opacity-100'"
        >
          <SelectableItemCheckbox
            :checked="Boolean(selectedImagesData[image.id])"
            :aria-label="`Select ${image.name}`"
            @toggle="toggleSelection(image)"
          />
        </div>
      </div>
    </div>

    <div v-if="props.hasMore" class="mt-4 text-center">
      <UButton label="Load more" :loading="props.isLoadingMore" :disabled="props.isLoadingMore"
        @click="emit('loadMore')" />
    </div>
  </div>
</template>
