<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useAlbumPublish } from '~/composables/account/useAlbumPublish'
import { useAlbumShareCreate } from '~/composables/account/useAlbumShareCreate'
import type { ImageShareModalResult } from '~/types/image-share.contract'

const props = defineProps<{ imageIds: number[] }>()
const emit = defineEmits<{ (e: 'close', value: ImageShareModalResult): void }>()

const { album, isCreating, createShare } = useAlbumShareCreate()
const { isUpdating, updatePublish } = useAlbumPublish()
const { copy, copied } = useClipboard()

const config = useRuntimeConfig()

const publicPath = computed(() => {
  return `/albums/${album.value?.publicToken}`
})

const publicUrl = computed(() => {
  return config.public?.siteUrl
})

const fullUrl = computed(() => {
  return `${publicUrl.value}${publicPath.value}`
})

const isUnpublished = computed(() => album.value?.isPublic === false)

function closeModal() {
  emit('close', { action: album.value ? 'confirm' : 'cancel' })
}

async function copyLink() {
  await copy(fullUrl.value)
}

async function revokeLink() {
  if (!album.value) return
  const updated = await updatePublish(album.value.id, false)
  if (updated) {
    album.value = updated
  }
}

onMounted(() => {
  createShare(props.imageIds)
})
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Share link</template>

    <template #body>
      <UAlert
        color="neutral"
        variant="soft"
        icon="i-heroicons-eye-20-solid"
        title="View"
        description="Anyone with the link can view this album."
      />

      <UProgress v-if="isCreating" indeterminate size="xs" class="mt-3" />

      <template v-else>
        <template v-if="album && !isUnpublished">
          <div class="grid gap-2 pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <UButton color="primary" @click="copyLink" size="lg" class="w-full">
              <UIcon name="i-heroicons-clipboard-document-20-solid" class="mr-2 h-4 w-4" />
              <span v-if="copied">Copied</span>
              <span v-else>Copy link</span>
            </UButton>

            <UButton
              color="error"
              variant="outline"
              :loading="isUpdating"
              @click="revokeLink"
              size="lg"
              square
              title="Revoke"
              class="w-full sm:w-auto"
            >
              <UIcon name="i-heroicons-link-slash-20-solid" class="h-5 w-5" />
            </UButton>
          </div>
        </template>
      </template>
    </template>
  </UModal>
</template>
