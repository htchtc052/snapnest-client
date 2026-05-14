<script setup lang="ts">
import { computed } from '#imports'
import type { User } from '~/types/user.model'
import { useAlbumVisibilityFeature } from '~/features/album/album-visibility'
import {
  AlbumHeader,
  createAlbumPolicy,
  type Album,
  type AlbumHeaderAction,
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

const actions = computed<AlbumHeaderAction[]>(() => {
  const albumActions: AlbumHeaderAction[] = []

  if (albumPolicy.value.canDownloadAlbum) {
    albumActions.push({
      key: 'download',
      label: 'Download',
      icon: 'i-lucide-download',
      color: 'neutral',
      variant: 'ghost',
      disabled: true,
      onClick: () => {},
    })
  }

  if (!albumPolicy.value.canEditAlbum) return albumActions

  if (props.album.isPublic) {
    albumActions.push(
      {
        key: 'copy-link',
        label: copiedPublicLink.value ? 'Link copied' : 'Copy link',
        icon: 'i-lucide-copy',
        color: 'neutral',
        variant: 'outline',
        onClick: copyLink,
      },
      {
        key: 'hide-album',
        label: 'Make private',
        icon: 'i-lucide-eye-off',
        color: 'neutral',
        variant: 'ghost',
        loading: isUpdatingAlbumVisibility.value,
        onClick: hideAlbum,
      },
    )

    return albumActions
  }

  albumActions.push({
    key: 'publish-album',
    label: 'Create link',
    icon: 'i-lucide-link',
    color: 'primary',
    variant: 'solid',
    loading: isUpdatingAlbumVisibility.value,
    onClick: publishAlbum,
  })

  return albumActions
})
</script>

<template>
  <AlbumHeader :album="album" :actions="actions" />
</template>
