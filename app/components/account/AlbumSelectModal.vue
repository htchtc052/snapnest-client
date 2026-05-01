<script setup lang="ts">
import { onMounted } from '#imports'
import { useAlbumsListOperation } from '~/composables/features/useAlbumsListOperation'
import type { AlbumSelectModalResult } from '~/types/album-select.contract'
import type { AccountAlbum } from '~/types/account-album.model'

const emit = defineEmits<{ (e: 'close', value: AlbumSelectModalResult): void }>()

const { albums, isLoading, loadError, loadAlbums } = useAlbumsListOperation()

function closeModal() {
  emit('close', { action: 'cancel' })
}

function selectAlbum(album: AccountAlbum) {
  emit('close', { action: 'confirm', album })
}

function createAlbum() {
  emit('close', { action: 'create' })
}

onMounted(() => {
  void loadAlbums()
})
</script>

<template>
  <UModal
    :close="{ onClick: closeModal }"
    :ui="{ content: 'bg-default rounded-lg divide-none px-6 py-4 sm:max-w-xl' }"
  >
    <template #title>Add to album</template>

    <template #body>
      <div class="space-y-4">
        <USkeleton v-if="isLoading" class="h-16" />

        <div v-else class="space-y-3">
          <div v-if="loadError" class="text-sm text-muted">
            {{ loadError }}
          </div>

          <UScrollArea v-else class="max-h-80">
            <div class="space-y-2 pr-1">
              <UButton
                color="neutral"
                variant="soft"
                class="w-full justify-start px-3 py-3"
                @click="createAlbum"
              >
                <div class="flex w-full items-center gap-3">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <UIcon name="i-heroicons-plus-20-solid" class="h-5 w-5" />
                  </div>

                  <span class="min-w-0 flex-1 truncate text-left font-medium">New album</span>

                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0 text-muted" />
                </div>
              </UButton>

              <div v-if="albums.length === 0" class="px-1 py-2 text-sm text-muted">
                No albums yet
              </div>

              <UButton
                v-for="album in albums"
                :key="album.id"
                color="neutral"
                variant="soft"
                class="w-full justify-start px-3 py-3"
                @click="selectAlbum(album)"
              >
                <div class="flex min-w-0 w-full items-center gap-3">
                  <div class="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      v-if="album.coverPreviewUrl"
                      :src="album.coverPreviewUrl"
                      :alt="album.name || ''"
                      class="h-full w-full object-cover"
                    >

                    <div v-else class="flex h-full w-full items-center justify-center">
                      <UIcon name="i-heroicons-photo-20-solid" class="h-5 w-5 text-muted" />
                    </div>
                  </div>

                  <div class="min-w-0 flex-1 text-left">
                    <div class="truncate font-medium">
                      {{ album.name }}
                    </div>
                  </div>

                  <UBadge v-if="album.isPublic" color="primary" variant="soft" size="xs">
                    Shared
                  </UBadge>

                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0 text-muted" />
                </div>
              </UButton>
            </div>
          </UScrollArea>
        </div>
      </div>
    </template>
  </UModal>
</template>
