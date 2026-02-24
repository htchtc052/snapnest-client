<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from '#imports'
import { usePublicAlbumWithImagesGet } from '~/composables/public/usePublicAlbumWithImagesGet'
import { useVirtualGridLanes } from '~/composables/useVirtualGridLanes'

definePageMeta({
  layout: 'public',
})

const route = useRoute()
const token = computed(() => String(route.params.token))

const {
  album,
  images,
  loadError,
  isLoading,
  loadAlbum,
} = usePublicAlbumWithImagesGet(token.value)

const scrollArea = useTemplateRef('scrollArea')
const { lanes: gridLanes } = useVirtualGridLanes(() => scrollArea.value?.$el, {
  min: 2,
  max: 6,
  targetWidth: 200,
})

onMounted(async () => {
  await loadAlbum()
})
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="pt-5 pb-4">
      <USkeleton v-if="isLoading" class="h-7 w-48" />
      <h3 v-else class="text-2xl font-semibold text-foreground">
        {{ album?.name }}
      </h3>
    </div>

    <USkeleton v-if="isLoading" class="h-40" />

    <template v-else>
      <UEmpty v-if="loadError" :description="loadError" size="md" variant="naked" class="py-8" />

      <UEmpty v-else-if="images.length === 0" description="No images" size="md" variant="naked" class="py-8" />

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
        >
          <img :src="image.previewUrl" :alt="image.name" class="h-full w-full object-cover">
        </UPageCard>
      </UScrollArea>
    </template>
  </div>
</template>
