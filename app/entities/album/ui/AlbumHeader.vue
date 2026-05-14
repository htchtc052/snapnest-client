<script setup lang="ts">
import { computed } from '#imports'
import { formatDate } from '@vueuse/core'
import { getAlbumHeaderPolicy, type Album } from '../model'

const props = withDefaults(defineProps<{
  album: Album
  isOwner?: boolean
}>(), {
  isOwner: false,
})

const policy = computed(() => getAlbumHeaderPolicy({
  isOwner: props.isOwner,
}))
const hasMeta = computed(() => {
  return policy.value.canViewOwnerName
    || policy.value.canViewCreatedAt
    || policy.value.canViewImagesCount
})
const createdAtLabel = computed(() => formatDate(new Date(props.album.createdAt), 'YYYY.MM.DD'))
const imagesCountLabel = computed(() => {
  return `${props.album.imagesCount} ${props.album.imagesCount === 1 ? 'photo' : 'photos'}`
})
</script>

<template>
  <div class="flex items-start justify-between gap-3 pt-5 pb-4">
    <div class="flex min-w-0 items-start gap-4">
      <img
        v-if="album.coverPreviewUrl"
        :src="album.coverPreviewUrl"
        alt="Album cover"
        class="h-16 w-16 shrink-0 rounded-lg object-cover"
      >

      <div class="min-w-0">
        <h3 v-if="album.name" class="truncate text-2xl font-semibold text-foreground">
          {{ album.name }}
        </h3>

        <div v-if="hasMeta" class="mt-1 min-w-0 space-y-1">
          <p v-if="policy.canViewOwnerName" class="text-sm text-muted">
            By {{ album.ownerName }}
          </p>

          <p class="text-sm text-muted">
            <template v-if="policy.canViewImagesCount">
              {{ imagesCountLabel }}
            </template>

            <template v-if="policy.canViewImagesCount && policy.canViewCreatedAt">
              <span class="px-1">•</span>
            </template>

            <template v-if="policy.canViewCreatedAt">
              {{ createdAtLabel }}
            </template>
          </p>
        </div>
      </div>
    </div>

    <div v-if="$slots.actions" class="flex min-w-0 flex-col items-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
