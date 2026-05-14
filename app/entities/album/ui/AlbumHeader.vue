<script setup lang="ts">
import { computed } from '#imports'
import type { Album } from '../model'
import { mapAlbumToAlbumHeader } from './mapAlbumToAlbumHeader'

const props = withDefaults(defineProps<{
  album: Album
  canEditAlbum?: boolean
  canDownloadAlbum?: boolean
  isUpdatingAlbumVisibility?: boolean
  copiedPublicLink?: boolean
  onCopyPublicLink?: () => void | Promise<void>
  onHideAlbum?: () => void | Promise<void>
  onPublishAlbum?: () => void | Promise<void>
}>(), {
  canEditAlbum: false,
  canDownloadAlbum: false,
  isUpdatingAlbumVisibility: false,
  copiedPublicLink: false,
  onCopyPublicLink: undefined,
  onHideAlbum: undefined,
  onPublishAlbum: undefined,
})

const header = computed(() => mapAlbumToAlbumHeader(props.album))
const hasHeaderActions = computed(() => props.canDownloadAlbum || props.canEditAlbum)
</script>

<template>
  <div class="flex items-start justify-between gap-3 pt-5 pb-4">
    <div class="flex min-w-0 items-start gap-4">
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

    <div v-if="hasHeaderActions" class="flex min-w-0 items-center gap-2">
      <UButton
        v-if="canDownloadAlbum"
        icon="i-lucide-download"
        color="neutral"
        variant="ghost"
        disabled
      >
        Download
      </UButton>

      <template v-if="canEditAlbum">
        <template v-if="album.isPublic">
          <UButton icon="i-lucide-copy" color="neutral" variant="outline" @click="onCopyPublicLink?.()">
            {{ copiedPublicLink ? 'Link copied' : 'Copy link' }}
          </UButton>

          <UButton
            icon="i-lucide-eye-off"
            color="neutral"
            variant="ghost"
            :loading="isUpdatingAlbumVisibility"
            @click="onHideAlbum?.()"
          >
            Make private
          </UButton>
        </template>

        <UButton
          v-else
          icon="i-lucide-link"
          color="primary"
          :loading="isUpdatingAlbumVisibility"
          @click="onPublishAlbum?.()"
        >
          Create link
        </UButton>
      </template>
    </div>
  </div>
</template>
