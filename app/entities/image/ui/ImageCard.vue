<script setup lang="ts">
import { computed } from '#imports'
import type { Image } from '../model'
import { mapImageToImageCard } from './mapImageToImageCard'

const props = defineProps<{
  image: Image
}>()

const card = computed(() => mapImageToImageCard(props.image))
</script>

<template>
  <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
    <div class="flex flex-col">
      <div class="block w-full text-left">
        <img
          v-if="card.previewUrl"
          :src="card.previewUrl"
          :alt="card.previewAlt"
          class="aspect-square w-full object-cover"
        >
        <div v-else class="flex aspect-square w-full items-center justify-center bg-muted px-3 text-center text-xs text-muted">
          {{ card.previewPlaceholder }}
        </div>
      </div>

      <div class="bg-default p-2">
        <p class="truncate text-sm font-medium text-highlighted">
          {{ card.name }}
        </p>
        <p class="text-xs text-muted">
          {{ card.capturedDateLabel }}
        </p>
      </div>
    </div>
  </UPageCard>
</template>
