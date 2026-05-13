<script setup lang="ts">
import { computed } from '#imports'
import { useWindowSize } from '@vueuse/core'
import { ImageCard, mapImageToImageCard } from '~/entities/image'
import { usePublicAlbumImages } from '../model/usePublicAlbumImages'

const props = defineProps<{
  token: string
}>()

const {
  images,
  isLoading,
  hasLoadError,
  isEmpty,
} = usePublicAlbumImages(props.token)

const { width } = useWindowSize()
const lanes = computed(() => {
  return width.value < 640 ? 2 : 4
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="hasLoadError" description="Unable to load images" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="isEmpty" description="No images" size="md" variant="naked" class="py-8" />

      <div v-else class="flex min-h-0 flex-1 flex-col">
        <UScrollArea
          v-slot="{ item: image }"
          :items="images"
          :virtualize="{ estimateSize: 240, gap: 12, lanes }"
          class="min-h-0 flex-1"
        >
          <ImageCard v-bind="mapImageToImageCard(image)" />
        </UScrollArea>
      </div>
    </template>

  </div>
</template>
