<script setup lang="ts">
import type { ImageCardData } from './imageCardData'

defineProps<ImageCardData>()
</script>

<template>
  <UPageCard variant="naked" class="overflow-hidden rounded-lg p-0">
    <div class="flex flex-col">
      <div class="block w-full text-left">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          :alt="previewAlt"
          class="aspect-square w-full object-cover"
        >
        <div v-else class="flex aspect-square w-full items-center justify-center bg-muted px-3 text-center text-xs text-muted">
          {{ previewPlaceholder }}
        </div>
      </div>

      <div class="bg-default p-2">
        <p class="truncate text-sm font-medium text-highlighted">
          {{ name }}
        </p>
        <p class="text-xs text-muted">
          {{ capturedDateLabel }}
        </p>
      </div>
    </div>
  </UPageCard>
</template>
