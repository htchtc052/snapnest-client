<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
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
  <AlbumHeader
    :album="album"
    :can-edit-album="albumPolicy.canEditAlbum"
    :can-download-album="albumPolicy.canDownloadAlbum"
    :is-updating-album-visibility="isUpdatingAlbumVisibility"
    :copied-public-link="copiedPublicLink"
    :on-copy-public-link="copyLink"
    :on-hide-album="hideAlbum"
    :on-publish-album="publishAlbum"
  />
</template>
