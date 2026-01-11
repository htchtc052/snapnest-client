<script setup lang="ts">
import type { Album } from '~/models/Album'

const props = defineProps<{ album: Album }>()
</script>

<template>
  <NuxtLink :to="`/account/albums/${props.album.id}`" class="block">
    <div class="relative aspect-square overflow-hidden rounded-xl bg-muted/60 ring-1 ring-muted/60">
      <img
        v-if="props.album.coverPreviewUrl"
        :src="props.album.coverPreviewUrl"
        :alt="props.album.name"
        class="h-full w-full object-cover"
      >
      <div v-else class="h-full w-full" />

      <div class="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-white">
        <div class="truncate text-sm font-medium">
          {{ props.album.name }}
        </div>
        <div class="text-xs text-white/80">
          {{ props.album.imagesCount }} images
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
