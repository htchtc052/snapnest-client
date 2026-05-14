<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import { AlbumDownloadButton } from '~/features/album/download-album'
import {
  AlbumHeader,
  createAlbumPolicy,
  type Album,
  type AlbumView,
} from '~/entities/album'

const props = defineProps<{
  album: AlbumView
  actor: User | null | undefined
}>()

const emit = defineEmits<{
  'update:album': [album: AlbumView]
}>()

const albumPolicy = computed(() => createAlbumPolicy(props.actor, props.album))

const {
  isUpdatingAlbumVisibility,
  copiedPublicLink,
  publishAlbum: publishAlbumFeature,
  hideAlbum: hideAlbumFeature,
  copyPublicLink,
} = useAlbumVisibilityFeature()

function applyUpdatedAlbum(updatedAlbum: Album) {
  emit('update:album', {
    ...props.album,
    ...updatedAlbum,
  })
}

async function publishAlbum() {
  if (!albumPolicy.value.canEditAlbum) return

  const updatedAlbum = await publishAlbumFeature(props.album)
  if (!updatedAlbum) return

  applyUpdatedAlbum(updatedAlbum)
}

async function hideAlbum() {
  if (!albumPolicy.value.canEditAlbum) return

  const updatedAlbum = await hideAlbumFeature(props.album)
  if (!updatedAlbum) return

  applyUpdatedAlbum(updatedAlbum)
}

async function copyLink() {
  if (!albumPolicy.value.canEditAlbum) return

  await copyPublicLink(props.album)
}
</script>

<template>
  <AlbumHeader :album="album">
    <template #actions>
      <template v-if="album.isPublic">
        <div class="flex items-center gap-2">
          <AlbumDownloadButton v-if="albumPolicy.canDownloadAlbum" />

          <template v-if="albumPolicy.canEditAlbum">
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
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-2">
          <AlbumDownloadButton v-if="albumPolicy.canDownloadAlbum" />

          <UButton
            v-if="albumPolicy.canEditAlbum"
            icon="i-lucide-link"
            color="primary"
            :loading="isUpdatingAlbumVisibility"
            @click="publishAlbum"
          >
            Create link
          </UButton>
        </div>
      </template>
    </template>
  </AlbumHeader>
</template>
