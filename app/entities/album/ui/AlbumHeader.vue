<script setup lang="ts">
import { computed } from '#imports'
import type { Album } from '../model'
import { mapAlbumToAlbumHeader } from './mapAlbumToAlbumHeader'

const props = defineProps<{
  album: Album
}>()

const header = computed(() => mapAlbumToAlbumHeader(props.album))
</script>

<template>
  <div class="flex min-w-0 items-start gap-4 pt-5 pb-4">
    <img
      v-if="header.coverPreviewUrl"
      :src="header.coverPreviewUrl"
      :alt="header.coverAlt"
      class="h-16 w-16 shrink-0 rounded-lg object-cover"
    >

    <div class="min-w-0">
      <h3 v-if="header.name" class="truncate text-2xl font-semibold text-foreground">
        {{ header.name }}
      </h3>

      <div class="mt-1 min-w-0 space-y-1">
        <p class="text-sm text-muted">
          {{ header.ownerNameLabel }}
        </p>

        <p class="text-sm text-muted">
          {{ header.metaLabel }}
        </p>
      </div>
    </div>
  </div>
</template>
