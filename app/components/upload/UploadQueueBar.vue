<script setup lang="ts">
import { computed } from '#imports'
import { useUploadsStore } from '~/stores/uploadsStore'
import { UPLOAD_ERROR_CODE } from '~/types/upload-error-code'
import { UPLOAD_STATUS, UPLOAD_STATUS_COLORS, UPLOAD_STATUS_LABELS } from '~/types/upload-status'
import type { User } from '~/types/user.model'

const uploadsStore = useUploadsStore()
const { user } = useSanctumAuth<User>()

const hasItems = computed(() => uploadsStore.items.length > 0)
const isDone = computed(() => uploadsStore.isDone)

const title = computed(() => {
  return isDone.value ? 'Upload completed' : 'Uploading'
})

const remainingCount = computed(() =>
  uploadsStore.items.filter(
    item => item.status === UPLOAD_STATUS.waiting || item.status === UPLOAD_STATUS.uploading,
  ).length,
)
const remainingLabel = computed(() => {
  if (isDone.value || remainingCount.value === 0) return ''
  return remainingCount.value === 1 ? '1 image left' : `${remainingCount.value} images left`
})

const uploadedCount = computed(() =>
  uploadsStore.items.filter(item => item.status === UPLOAD_STATUS.uploaded).length,
)
const uploadedLabel = computed(() => {
  if (!isDone.value || uploadedCount.value === 0) return ''
  return uploadedCount.value === 1 ? '1 image uploaded' : `${uploadedCount.value} images uploaded`
})

const statusLabels = computed(() => UPLOAD_STATUS_LABELS)
const statusColors = computed(() => UPLOAD_STATUS_COLORS)
const blockedMessage = computed(() => {
  if (user.value?.uploadBlockedReason === UPLOAD_ERROR_CODE.quotaImagesReached) {
    return 'Upload stopped: Image limit reached'
  }
  if (user.value?.uploadBlockedReason === UPLOAD_ERROR_CODE.quotaBytesReached) {
    return 'Upload stopped: Storage limit reached'
  }
  return ''
})
</script>

<template>
  <UCard
    v-if="hasItems"
    variant="outline"
    class="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-4 sm:max-w-lg"
  >
    <template #header>
      <div class="space-y-1">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-semibold text-foreground">{{ title }}</p>
          <span v-if="remainingLabel" class="text-xs text-muted-500">{{ remainingLabel }}</span>
          <span v-else-if="uploadedLabel" class="text-xs text-muted-500">{{ uploadedLabel }}</span>
          <UButton
            icon="i-heroicons-x-mark-20-solid"
            color="neutral"
            variant="ghost"
            size="xs"
            class="shrink-0"
            aria-label="Close uploads"
            @click="uploadsStore.clear"
          />
        </div>
        <p v-if="blockedMessage" class="text-xs text-error">
          {{ blockedMessage }}
        </p>
      </div>
    </template>

    <UScrollArea
      v-slot="{ item }"
      :items="uploadsStore.items"
      :virtualize="{ estimateSize: 64, overscan: 8 }"
      class="h-80"
      :ui="{ viewport: 'overflow-x-hidden' }"
    >
      <UPageCard
        :key="item.id"
        variant="ghost"
      >
        <template #body>
          <div class="flex items-center gap-3">
            <UUser
              :name="item.file.name"
              :avatar="{ src: item.image?.previewUrl, alt: item.file.name }"
              size="lg"
              class="flex-1"
            />
            <p
              v-if="item.status === UPLOAD_STATUS.failed"
              class="truncate text-xs text-muted"
            >
              {{ item.errorMessage }}
            </p>
            <UBadge :color="statusColors[item.status]" variant="soft" size="xs" class="ml-auto">
              {{ statusLabels[item.status] }}
            </UBadge>
            <UButton
              v-if="item.status === UPLOAD_STATUS.waiting"
              icon="i-heroicons-x-mark-20-solid"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Remove from queue"
              @click="uploadsStore.removeWaiting(item.id)"
            />
          </div>
        </template>
      </UPageCard>
    </UScrollArea>

  </UCard>
</template>
