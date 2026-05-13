<script setup lang="ts">
import { computed } from '#imports'
import { mapImageToView, type Image } from '../model'

const props = defineProps<{
  image: Image
}>()

const imageView = computed(() => mapImageToView(props.image))
</script>

<template>
  <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
    <div class="flex flex-col">
      <div class="block w-full text-left">
        <img
          v-if="imageView.previewUrl"
          :src="imageView.previewUrl"
          :alt="imageView.previewAlt"
          class="aspect-square w-full object-cover"
        >
        <div v-else class="flex aspect-square w-full items-center justify-center bg-muted px-3 text-center text-xs text-muted">
          {{ imageView.previewPlaceholder }}
        </div>
      </div>

      <div class="bg-default p-2">
        <p class="truncate text-sm font-medium text-highlighted">
          {{ imageView.name }}
        </p>
        <p class="text-xs text-muted">
          {{ imageView.capturedDateLabel }}
        </p>
      </div>
    </div>
  </UPageCard>
</template>
