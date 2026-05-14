<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import {
  AlbumDetailsCard,
  createAlbumPolicy,
  type Album,
} from '~/entities/album'

const props = defineProps<{
  album: Album
  actor: User | null | undefined
}>()

const emit = defineEmits<{
  'update:album': [album: Album]
}>()

const albumPolicy = computed(() => createAlbumPolicy(props.actor, props.album))

const {
  isUpdatingAlbumVisibility,
  copiedPublicLink,
  publishAlbum: publishAlbumFeature,
  hideAlbum: hideAlbumFeature,
  copyPublicLink,
} = useAlbumVisibilityFeature({
  onUpdated: updatedAlbum => emit('update:album', {
    ...props.album,
    ...updatedAlbum,
  }),
})

async function publishAlbum() {
  if (!albumPolicy.value.canEditAlbum) return

  await publishAlbumFeature(props.album)
}

async function hideAlbum() {
  if (!albumPolicy.value.canEditAlbum) return

  await hideAlbumFeature(props.album)
}

async function copyLink() {
  if (!albumPolicy.value.canEditAlbum) return

  await copyPublicLink(props.album)
}
</script>

<template>
  <div class="flex items-start justify-between gap-3 pt-5 pb-4">
    <AlbumDetailsCard :album="album" />

    <div
      v-if="albumPolicy.canDownloadAlbum || albumPolicy.canEditAlbum"
      class="flex min-w-0 items-center gap-2"
    >
      <UButton
        v-if="albumPolicy.canDownloadAlbum"
        icon="i-lucide-download"
        color="neutral"
        variant="ghost"
        disabled
      >
        Download
      </UButton>

      <template v-if="albumPolicy.canEditAlbum">
        <template v-if="album.isPublic">
          <UButton icon="i-lucide-copy" color="neutral" variant="outline" @click="copyLink">
            {{ copiedPublicLink ? 'Link copied' : 'Copy link' }}
          </UButton>

          <UButton
            icon="i-lucide-eye-off"
            color="neutral"
            variant="ghost"
            :loading="isUpdatingAlbumVisibility"
            @click="hideAlbum"
          >
            Make private
          </UButton>
        </template>

        <UButton
          v-else
          icon="i-lucide-link"
          color="primary"
          :loading="isUpdatingAlbumVisibility"
          @click="publishAlbum"
        >
          Create link
        </UButton>
      </template>
    </div>
  </div>
</template>
