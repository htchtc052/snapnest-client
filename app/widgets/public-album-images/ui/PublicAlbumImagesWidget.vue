<script setup lang="ts">
import { computed } from '#imports'
import { formatDate, useWindowSize } from '@vueuse/core'
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
          <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
            <div class="flex flex-col">
              <div class="block w-full text-left">
                <img :src="image.previewUrl" :alt="image.name" class="aspect-square w-full object-cover">
              </div>

              <div class="bg-default p-2">
                <p class="truncate text-sm font-medium text-highlighted">
                  {{ image.name }}
                </p>
                <p class="text-xs text-muted">
                  {{ formatDate(new Date(image.capturedAt), 'YYYY.MM.DD') }}
                </p>
              </div>
            </div>
          </UPageCard>
        </UScrollArea>
      </div>
    </template>

  </div>
</template>
