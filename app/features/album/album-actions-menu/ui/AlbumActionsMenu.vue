<script setup lang="ts">
import { computed } from '#imports'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { AccountAlbum } from '~/entities/album/model'

const props = defineProps<{
  album: AccountAlbum
}>()

const emit = defineEmits<{
  rename: [album: AccountAlbum]
  delete: [album: AccountAlbum]
  publish: [album: AccountAlbum]
  hide: [album: AccountAlbum]
  'copy-public-link': [album: AccountAlbum]
}>()

const items = computed<DropdownMenuItem[][]>(() => {
  const visibilityItems: DropdownMenuItem[] = props.album.isPublic
    ? [
      {
        label: 'Copy link',
        icon: 'i-lucide-copy',
        onSelect: () => emit('copy-public-link', props.album),
      },
      {
        label: 'Make private',
        icon: 'i-lucide-eye-off',
        onSelect: () => emit('hide', props.album),
      },
    ]
    : [
      {
        label: 'Create link',
        icon: 'i-lucide-link',
        onSelect: () => emit('publish', props.album),
      },
    ]

  return [
    [
      ...visibilityItems,
      {
        label: 'Rename',
        icon: 'i-lucide-pencil',
        onSelect: () => emit('rename', props.album),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => emit('delete', props.album),
      },
    ],
  ]
})
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton
      icon="i-heroicons-ellipsis-vertical-20-solid"
      color="neutral"
      variant="soft"
      size="xs"
      square
      class="shrink-0"
      @click.stop
    />
  </UDropdownMenu>
</template>
