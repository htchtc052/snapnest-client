<script setup lang="ts">
import { FetchError } from 'ofetch'
import { computed, onBeforeUnmount, ref } from '#imports'
import { imageStatusGet } from '~/api/account/imageStatusGet'
import { imagesUpload } from '~/api/account/imagesUpload'

import { UPLOAD_STATUS, UPLOAD_STATUS_COLORS, UPLOAD_STATUS_LABELS } from '~/types/upload-status'
import { formatBytes } from '~/utils/format-bytes'
import type { Image } from '~/types/image.model'
import type { UploadStatus } from '~/types/upload-status'
import type { User } from '~/types/user.model'

definePageMeta({
  layout: 'media',
})

type UploadItem = {
  file: File
  image: Image | null
  status: UploadStatus
}

const client = useSanctumClient()
const toast = useToast()
const { user, refreshIdentity } = useSanctumAuth<User>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedItems = ref<UploadItem[]>([])
const currentUploadingItem = ref<UploadItem | null>(null)

let pollingTimer: ReturnType<typeof setInterval> | null = null
let isPolling = false

const isUploadBlocked = computed(() => user.value?.isUploadBlocked === true)
const uploadBlockedMessage = computed(() => user.value?.uploadBlockedReason ?? 'Upload blocked')
const currentUploadingFileName = computed(() => currentUploadingItem.value?.file.name)
const processingCount = computed(() => uploadedItems.value.filter(item => item.status === 'processing').length)
const completedCount = computed(() => uploadedItems.value.filter(item => item.status === 'completed').length)
const failedCount = computed(() => uploadedItems.value.filter(item => item.status === 'failed').length)
const hasFailed = computed(() => uploadedItems.value.some(item => item.status === 'failed'))
const hasFinishedRun = computed(() =>
  uploadedItems.value.length > 0
  && uploadedItems.value.every(item => item.status === 'completed' || item.status === 'failed'),
)
const shouldShowItemsGrid = computed(() => uploadedItems.value.length > 0 && (!hasFinishedRun.value || completedCount.value === 0))
const finishedTitle = computed(() => {
  if (completedCount.value > 0 && failedCount.value > 0) {
    return 'Upload finished with issues'
  }

  if (completedCount.value > 0) {
    return 'Upload finished'
  }

  return 'Upload failed'
})
const finishedDescription = computed(() => {
  if (!hasFailed.value && completedCount.value > 0) {
    return `${completedCount.value} photos uploaded to your library.`
  }

  if (completedCount.value > 0) {
    if (isUploadBlocked.value) {
      return `${completedCount.value} photos uploaded. Upload is now blocked, delete some photos and try again.`
    }

    return `${completedCount.value} photos uploaded. Some files failed.`
  }

  if (isUploadBlocked.value) {
    return 'Upload is blocked. Delete some photos and try again.'
  }

  return 'No photos were uploaded. Fix the failed files and try again.'
})

onBeforeUnmount(() => {
  stopPolling()
})

function openFileDialog() {
  if (isUploadBlocked.value) return

  fileInput.value?.click()
}

async function handleFilesSelect(event: Event) {
  if (isUploadBlocked.value) return

  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  input.value = ''

  if (files.length === 0) return

  uploadedItems.value = [
    ...uploadedItems.value,
    ...files.map(file => ({
      file,
      image: null,
      status: UPLOAD_STATUS.waiting,
    })),
  ]

  await processNext()
}

async function processNext() {
  if (currentUploadingItem.value) return

  const nextItem = uploadedItems.value.find(item => item.status === UPLOAD_STATUS.waiting)
  if (!nextItem) return

  currentUploadingItem.value = nextItem
  nextItem.status = UPLOAD_STATUS.uploading

  try {
    nextItem.image = await imagesUpload(client, nextItem.file)
    syncUploadStatus(nextItem)
    await refreshIdentity()
    ensurePolling()
  } catch (error: unknown) {
    const responseStatus = error instanceof FetchError
      ? error.response?.status
      : undefined

    if (responseStatus === 403) {
      await refreshIdentity()
    } else {
      toast.add({
        title: 'Upload failed',
        color: 'error',
      })
    }

    nextItem.status = UPLOAD_STATUS.failed
  } finally {
    currentUploadingItem.value = null
    await processNext()
  }
}

function syncUploadStatus(item: UploadItem) {
  const derivativesStatus = item.image?.derivativesStatus

  if (derivativesStatus === 'ready') {
    item.status = UPLOAD_STATUS.completed
    return
  }

  if (derivativesStatus === 'failed') {
    item.status = UPLOAD_STATUS.failed
    return
  }

  item.status = UPLOAD_STATUS.processing
}

function ensurePolling() {
  if (pollingTimer !== null || processingCount.value === 0) {
    return
  }

  pollingTimer = setInterval(() => {
    void refreshProcessingItems()
  }, 2000)
}

function stopPolling() {
  if (pollingTimer === null) {
    return
  }

  clearInterval(pollingTimer)
  pollingTimer = null
}

async function refreshProcessingItems() {
  const items = uploadedItems.value.filter(item => item.status === UPLOAD_STATUS.processing && item.image !== null)

  if (items.length === 0) {
    stopPolling()
    return
  }

  if (isPolling) {
    return
  }

  isPolling = true

  try {
    let hasNewCompletedItems = false

    await Promise.all(items.map(async (item) => {
      try {
        item.image = await imageStatusGet(client, item.image!.id)
        const previousStatus = item.status
        syncUploadStatus(item)

        if (previousStatus !== UPLOAD_STATUS.completed && item.status === UPLOAD_STATUS.completed) {
          hasNewCompletedItems = true
        }
      } catch (error: unknown) {
        console.error('Image status refresh failed', error)
      }
    }))

    if (hasNewCompletedItems) {
      await refreshIdentity()
    }
  } finally {
    isPolling = false

    if (processingCount.value === 0) {
      stopPolling()
    }
  }
}

function itemKey(item: UploadItem, index: number): string {
  if (item.image) {
    return `image-${item.image.id}`
  }

  return `file-${item.file.name}-${item.file.size}-${item.file.lastModified}-${index}`
}

function hasServerPreview(item: UploadItem): item is UploadItem & { image: Image } {
  return item.image !== null && item.status === UPLOAD_STATUS.completed && typeof item.image.previewUrl === 'string'
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <UPageHeader
      title="Upload"
      description="Upload photos to your library."
      class="border-0 px-4 pt-5"
    />

    <div class="flex flex-wrap items-center gap-2 px-4 pb-4">
      <template v-if="!isUploadBlocked">
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*,.heic,.heif,.avif"
          class="hidden"
          @change="handleFilesSelect"
        >

        <UButton
          color="primary"
          icon="i-heroicons-arrow-up-tray-20-solid"
          @click="openFileDialog"
        >
          Select Files
        </UButton>
      </template>

      <UBadge v-if="processingCount > 0" color="primary" variant="soft">
        Processing: {{ processingCount }}
      </UBadge>
    </div>

    <div class="space-y-2 px-4 pb-3">
      <UAlert
        v-if="isUploadBlocked"
        color="error"
        variant="soft"
        title="Upload blocked"
        :description="uploadBlockedMessage"
      />

      <p v-if="currentUploadingFileName" class="text-xs text-muted">
        Uploading {{ currentUploadingFileName }}
      </p>

      <UProgress v-if="currentUploadingItem !== null" indeterminate size="xs" />

      <UAlert
        v-if="hasFinishedRun"
        :color="completedCount > 0 ? (hasFailed ? 'warning' : 'success') : 'error'"
        variant="soft"
        :title="finishedTitle"
        :description="finishedDescription"
      >
        <template v-if="completedCount > 0" #actions>
          <NuxtLink
            to="/account/images"
            class="text-sm font-medium text-primary underline underline-offset-4"
          >
            Open photos grid
          </NuxtLink>
        </template>
      </UAlert>
    </div>

    <div v-if="shouldShowItemsGrid" class="min-h-0 flex-1">
      <UScrollArea class="h-full min-h-0 px-4 pb-8">
        <UPageGrid class="grid-cols-2 gap-4 pb-8 md:grid-cols-3 xl:grid-cols-4">
          <UPageCard
            v-for="(item, index) in uploadedItems"
            :key="itemKey(item, index)"
            variant="outline"
          >
            <div class="space-y-3">
              <div class="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  v-if="hasServerPreview(item)"
                  :src="item.image.previewUrl"
                  :alt="item.file.name"
                  class="h-full w-full object-cover"
                >

                <div v-else class="flex h-full w-full items-center justify-center text-muted">
                  <div class="flex flex-col items-center gap-2">
                    <UIcon name="i-heroicons-photo-20-solid" class="h-8 w-8" />
                    <span class="text-xs uppercase tracking-wide">
                      {{ item.file.name.split('.').pop() }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-1">
                <p class="truncate text-sm font-medium">
                  {{ item.file.name }}
                </p>

                <p class="text-xs text-muted">
                  {{ formatBytes(item.image?.size ?? item.file.size) }}
                </p>
              </div>

              <UBadge :color="UPLOAD_STATUS_COLORS[item.status]" variant="soft">
                {{ UPLOAD_STATUS_LABELS[item.status] }}
              </UBadge>
            </div>
          </UPageCard>
        </UPageGrid>
      </UScrollArea>
    </div>
  </div>
</template>
