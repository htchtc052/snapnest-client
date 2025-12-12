<script setup lang="ts">
import type { Album } from '~/models/Album'

const props = defineProps<{ album: Album }>()
</script>

<template>
  <div class="space-y-2">
    <div class="aspect-square overflow-hidden rounded bg-gray-50 flex items-center justify-center">
      <img
          v-if="props.album.coverPreviewUrl"
          :src="props.album.coverPreviewUrl"
          :alt="props.album.name"
          class="h-full w-full object-cover"
      >
      <span v-else class="text-xs text-gray-400">No cover</span>
    </div>

    <div class="text-sm font-medium text-gray-800 line-clamp-1">
      {{ props.album.name }}
    </div>
    <div class="text-xs text-gray-500">
      {{ props.album.imagesCount }} images
    </div>
  </div>
</template>
